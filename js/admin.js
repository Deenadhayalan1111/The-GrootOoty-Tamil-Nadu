/* =========================================================
   THE GROOT OOTY — Admin Panel Controller
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminTabs();
});

/* ---------------------------------------------------------
   1. AUTHENTICATION
   --------------------------------------------------------- */

function initAdminAuth() {
  const authScreen = document.getElementById('admin-auth-screen');
  const dashScreen = document.getElementById('admin-dashboard-screen');

  if (window.GrootStore && window.GrootStore.isAuthenticated()) {
    if (authScreen) authScreen.style.display = 'none';
    if (dashScreen) dashScreen.classList.add('active');
    loadDashboardData();
  } else {
    if (authScreen) authScreen.style.display = 'flex';
    if (dashScreen) dashScreen.classList.remove('active');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('admin-username').value.trim();
  const passcode = document.getElementById('admin-passcode').value.trim();
  const errorEl = document.getElementById('admin-login-error');

  if (window.GrootStore && window.GrootStore.login(username, passcode)) {
    if (errorEl) errorEl.style.display = 'none';
    initAdminAuth();
    showToast('Admin access granted.');
  } else {
    if (errorEl) errorEl.style.display = 'block';
  }
}

function handleAdminLogout() {
  if (window.GrootStore) {
    window.GrootStore.logout();
    initAdminAuth();
    showToast('Logged out successfully.');
  }
}

/* ---------------------------------------------------------
   2. TABS NAVIGATION
   --------------------------------------------------------- */

function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  document.querySelectorAll('.admin-tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tab-${tabId}`);
  });

  if (tabId === 'dashboard') renderDashboardOverview();
  if (tabId === 'rooms') renderRoomsManagement();
  if (tabId === 'gallery') renderGalleryManagement();
  if (tabId === 'settings') renderSettingsForm();
}

/* ---------------------------------------------------------
   3. DATA LOADING & RENDERING
   --------------------------------------------------------- */

function loadDashboardData() {
  renderDashboardOverview();
  renderRoomsManagement();
  renderGalleryManagement();
  renderSettingsForm();

  if (window.GrootStore) {
    window.GrootStore.subscribe(() => {
      renderDashboardOverview();
      renderRoomsManagement();
      renderGalleryManagement();
    });
  }
}

/* --- TAB 1: OVERVIEW DASHBOARD --- */
function renderDashboardOverview() {
  if (!window.GrootStore) return;

  const rooms = window.GrootStore.getRooms();
  const gallery = window.GrootStore.getGallery(true);
  const availCount = rooms.filter(r => r.status !== 'unavailable').length;
  const unavailCount = rooms.length - availCount;

  const totalEl = document.getElementById('stat-total-rooms');
  const availEl = document.getElementById('stat-avail-rooms');
  const unavailEl = document.getElementById('stat-unavail-rooms');
  const galEl = document.getElementById('stat-gallery-count');

  if (totalEl) totalEl.textContent = rooms.length;
  if (availEl) availEl.textContent = availCount;
  if (unavailEl) unavailEl.textContent = unavailCount;
  if (galEl) galEl.textContent = gallery.filter(g => g.enabled !== false).length;

  // Render Table in Dashboard
  const tableWrap = document.getElementById('dashboard-rooms-table-wrap');
  if (!tableWrap) return;

  let html = `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.12); color:var(--admin-text-muted); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em;">
            <th style="padding:12px 14px;">Room</th>
            <th style="padding:12px 14px;">Price / Night</th>
            <th style="padding:12px 14px;">Status</th>
            <th style="padding:12px 14px; text-align:right;">Quick Actions</th>
          </tr>
        </thead>
        <tbody>
  `;

  rooms.forEach(r => {
    const isAvail = r.status !== 'unavailable';
    html += `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.9rem;">
        <td style="padding:14px; display:flex; align-items:center; gap:12px;">
          <img src="${r.image}" alt="${r.name}" style="width:48px; height:36px; border-radius:6px; object-fit:cover;" />
          <div>
            <div style="font-weight:700; color:#FFFFFF;">${r.name}</div>
            <div style="font-size:0.75rem; color:var(--admin-text-muted);">${r.tagline || ''}</div>
          </div>
        </td>
        <td style="padding:14px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:var(--admin-accent-glow); font-weight:700;">₹</span>
            <input
              type="number"
              id="dash-price-${r.id}"
              value="${r.price}"
              style="width:90px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#FFFFFF; padding:6px 8px; font-weight:700;"
            />
            <button onclick="saveQuickPrice('${r.id}')" class="admin-btn admin-btn-primary" style="padding:5px 10px; font-size:0.75rem;">Save</button>
          </div>
        </td>
        <td style="padding:14px;">
          <button onclick="toggleRoomStatus('${r.id}')" class="status-pill ${isAvail ? 'available' : 'unavailable'}" style="cursor:pointer; border:none;">
            ${isAvail ? '● Available' : '● Sold Out'}
          </button>
        </td>
        <td style="padding:14px; text-align:right;">
          <button onclick="openRoomModal('${r.id}')" class="admin-btn admin-btn-outline" style="padding:6px 12px; font-size:0.8rem;">
            Edit Details
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  tableWrap.innerHTML = html;
}

/* --- TAB 2: ROOMS MANAGEMENT --- */
function renderRoomsManagement() {
  if (!window.GrootStore) return;

  const container = document.getElementById('admin-rooms-list');
  if (!container) return;

  const rooms = window.GrootStore.getRooms();
  container.innerHTML = '';

  rooms.forEach(r => {
    const isAvail = r.status !== 'unavailable';
    const card = document.createElement('div');
    card.className = 'admin-room-card';

    card.innerHTML = `
      <div class="admin-room-img-wrap">
        <img src="${r.image}" alt="${r.name}" />
      </div>
      <div class="admin-room-body">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; flex-wrap:wrap; gap:6px;">
          <h3 class="admin-room-name">${r.name}</h3>
          <button onclick="toggleRoomStatus('${r.id}')" class="status-pill ${isAvail ? 'available' : 'unavailable'}" style="cursor:pointer; border:none;">
            ${isAvail ? '● Available' : '● Sold Out'}
          </button>
        </div>
        <p class="admin-room-desc">${r.shortDescription || r.description}</p>
        
        <div class="admin-price-row">
          <span style="font-size:0.85rem; color:var(--admin-text-muted);">Price / Night:</span>
          <span style="font-weight:700; color:var(--admin-accent-glow);">₹</span>
          <input type="number" id="room-card-price-${r.id}" class="admin-price-input" value="${r.price}" />
          <button onclick="saveCardPrice('${r.id}')" class="admin-btn admin-btn-primary" style="padding:6px 12px; font-size:0.8rem;">Save</button>
        </div>

        <div class="admin-room-actions" style="margin-top:auto; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.08);">
          <button onclick="openRoomModal('${r.id}')" class="admin-btn admin-btn-outline" style="flex:1;">
            Edit Full Info
          </button>
          <a href="room-detail.html?room=${r.id}" target="_blank" class="admin-btn admin-btn-outline" style="font-size:0.8rem;" title="View public page">
            ↗ Preview
          </a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function saveQuickPrice(roomId) {
  const input = document.getElementById(`dash-price-${roomId}`);
  if (!input) return;
  const newPrice = parseInt(input.value, 10);
  if (isNaN(newPrice) || newPrice < 0) {
    alert('Please enter a valid price amount.');
    return;
  }
  window.GrootStore.updateRoomPrice(roomId, newPrice);
  showToast(`Updated price for ${roomId.toUpperCase()} to ₹${newPrice.toLocaleString()}`);
}

function saveCardPrice(roomId) {
  const input = document.getElementById(`room-card-price-${roomId}`);
  if (!input) return;
  const newPrice = parseInt(input.value, 10);
  if (isNaN(newPrice) || newPrice < 0) {
    alert('Please enter a valid price amount.');
    return;
  }
  window.GrootStore.updateRoomPrice(roomId, newPrice);
  showToast(`Updated price to ₹${newPrice.toLocaleString()}`);
}

function toggleRoomStatus(roomId) {
  const updated = window.GrootStore.toggleRoomStatus(roomId);
  if (updated) {
    showToast(`${updated.name} is now marked as ${updated.status === 'available' ? 'Available' : 'Unavailable'}.`);
  }
}

/* --- ROOM EDIT MODAL --- */
function openRoomModal(roomId) {
  const room = window.GrootStore.getRoom(roomId);
  if (!room) return;

  document.getElementById('modal-room-id').value = room.id;
  document.getElementById('modal-room-name').value = room.name;
  document.getElementById('modal-room-price').value = room.price;
  document.getElementById('modal-room-status').value = room.status;
  document.getElementById('modal-room-tagline').value = room.tagline || '';
  document.getElementById('modal-room-desc').value = room.shortDescription || room.description || '';
  document.getElementById('modal-room-longdesc').value = room.longDescription || '';

  document.getElementById('admin-room-modal').classList.add('active');
}

function closeRoomModal() {
  document.getElementById('admin-room-modal').classList.remove('active');
}

function handleSaveRoomModal(e) {
  e.preventDefault();
  const id = document.getElementById('modal-room-id').value;
  const price = parseInt(document.getElementById('modal-room-price').value, 10);
  const status = document.getElementById('modal-room-status').value;
  const tagline = document.getElementById('modal-room-tagline').value.trim();
  const shortDescription = document.getElementById('modal-room-desc').value.trim();
  const longDescription = document.getElementById('modal-room-longdesc').value.trim();

  window.GrootStore.updateRoom(id, {
    price,
    status,
    tagline,
    shortDescription,
    longDescription
  });

  closeRoomModal();
  showToast('Room information saved successfully.');
}

/* --- TAB 3: GALLERY MANAGEMENT --- */
function renderGalleryManagement() {
  if (!window.GrootStore) return;

  const container = document.getElementById('admin-gallery-list');
  if (!container) return;

  const gallery = window.GrootStore.getGallery(true);
  const rooms = window.GrootStore.getRooms();
  container.innerHTML = '';

  gallery.forEach(item => {
    const isEnabled = item.enabled !== false;
    const card = document.createElement('div');
    card.className = 'admin-gallery-card';

    let roomOptions = `<option value="property" ${item.assignedRoom === 'property' ? 'selected' : ''}>General Property / Nature</option>`;
    rooms.forEach(r => {
      roomOptions += `<option value="${r.id}" ${item.assignedRoom === r.id ? 'selected' : ''}>${r.name}</option>`;
    });

    card.innerHTML = `
      <img src="${item.url}" alt="${item.title}" class="admin-gallery-thumb" />
      <div class="admin-gallery-info">
        <div class="admin-gallery-title" title="${item.title}">${item.title}</div>
        
        <div>
          <label class="admin-label" style="font-size:0.7rem; margin-bottom:2px;">Assigned Accommodation</label>
          <select onchange="handleGalleryRoomChange('${item.id}', this.value)" class="admin-select" style="font-size:0.825rem; padding:6px 8px;">
            ${roomOptions}
          </select>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:0.75rem; color:${isEnabled ? '#25D366' : '#FF5252'}; font-weight:700;">
            ${isEnabled ? '● Visible' : '● Hidden'}
          </span>
          <button onclick="toggleGalleryVisibility('${item.id}')" class="admin-btn admin-btn-outline" style="padding:4px 10px; font-size:0.75rem;">
            ${isEnabled ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function handleGalleryRoomChange(photoId, roomId) {
  window.GrootStore.assignPhotoToRoom(photoId, roomId);
  showToast(`Photo assignment updated.`);
}

function toggleGalleryVisibility(photoId) {
  window.GrootStore.toggleGalleryVisibility(photoId);
  renderGalleryManagement();
  renderDashboardOverview();
  showToast(`Gallery visibility updated.`);
}

/* --- TAB 4: SETTINGS --- */
function renderSettingsForm() {
  if (!window.GrootStore) return;

  const settings = window.GrootStore.getSettings();
  document.getElementById('set-whatsapp').value = settings.whatsapp || '';
  document.getElementById('set-phone1').value = settings.phone1 || '';
  document.getElementById('set-phone2').value = settings.phone2 || '';
  document.getElementById('set-checkin').value = settings.checkInTime || '';
  document.getElementById('set-checkout').value = settings.checkOutTime || '';
  document.getElementById('set-note').value = settings.bookingNote || '';
}

function handleSaveSettings(e) {
  e.preventDefault();
  const whatsapp = document.getElementById('set-whatsapp').value.trim();
  const phone1 = document.getElementById('set-phone1').value.trim();
  const phone2 = document.getElementById('set-phone2').value.trim();
  const checkInTime = document.getElementById('set-checkin').value.trim();
  const checkOutTime = document.getElementById('set-checkout').value.trim();
  const bookingNote = document.getElementById('set-note').value.trim();

  window.GrootStore.updateSettings({
    whatsapp,
    phone1,
    phone2,
    checkInTime,
    checkOutTime,
    bookingNote
  });

  showToast('Property settings saved successfully.');
}

function handleResetDefaults() {
  if (confirm('Are you sure you want to reset all rooms, prices, gallery assignments, and settings back to initial defaults?')) {
    window.GrootStore.resetToDefaults();
    loadDashboardData();
    showToast('Reset all data to default configuration.');
  }
}

/* ---------------------------------------------------------
   TOAST NOTIFICATION
   --------------------------------------------------------- */

function showToast(msg) {
  const toast = document.getElementById('admin-toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
