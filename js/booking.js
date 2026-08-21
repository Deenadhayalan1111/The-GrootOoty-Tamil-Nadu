/* =========================================================
   THE GROOT OOTY — Booking Wizard JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

/* ---------------------------------------------------------
   STATE
   --------------------------------------------------------- */

const bookingState = {
  step: 1,
  totalSteps: 5,
  checkin: null,
  checkout: null,
  adults: 1,
  children: 0,
  room: null,
  name: '',
  mobile: '',
  whatsappNum: '',
  whatsappSameAsMobile: false,
  email: '',
  campfire: null,
  meals: null,
  specialRequest: '',
  enquiryId: null,
};

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */

function initBookingWizard() {
  if (!document.getElementById('booking-wizard')) return;

  // Pre-fill room from URL param
  const params = new URLSearchParams(window.location.search);
  const preRoom = params.get('room');
  if (preRoom) {
    bookingState.room = preRoom;
  }

  // Init calendar
  initCalendar();

  // Init guest counters
  initGuestCounters();

  // Init room selection
  initRoomSelection();

  // Init guest details form
  initGuestDetailsForm();

  // Init preferences
  initPreferences();

  // Init nav buttons
  initNavButtons();

  // Render progress
  renderProgress();

  // Update sidebar
  updateSidebar();

  // If room pre-selected, show it
  if (bookingState.room) {
    document.querySelectorAll('.room-option').forEach(opt => {
      if (opt.dataset.room === bookingState.room) {
        opt.classList.add('selected');
      }
    });
  }
}

/* ---------------------------------------------------------
   CALENDAR
   --------------------------------------------------------- */

let calViewYear, calViewMonth;

function initCalendar() {
  const now = new Date();
  calViewYear = now.getFullYear();
  calViewMonth = now.getMonth();

  renderCalendar();

  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');

  if (prevBtn) prevBtn.addEventListener('click', () => {
    calViewMonth--;
    if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
    renderCalendar();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    calViewMonth++;
    if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
    renderCalendar();
  });
}

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const monthLabel = document.getElementById('cal-month');
  if (!grid) return;

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  monthLabel.textContent = `${MONTHS[calViewMonth]} ${calViewYear}`;

  const today = new Date();
  today.setHours(0,0,0,0);

  const firstDay = new Date(calViewYear, calViewMonth, 1).getDay();
  const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();

  let html = DAYS.map(d => `<span class="calendar-day-label">${d}</span>`).join('');

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    html += `<button class="calendar-day empty" disabled></button>`;
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calViewYear, calViewMonth, d);
    date.setHours(0,0,0,0);

    const dateStr = `${calViewYear}-${String(calViewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();

    const checkin  = bookingState.checkin  ? new Date(bookingState.checkin)  : null;
    const checkout = bookingState.checkout ? new Date(bookingState.checkout) : null;

    let cls = 'calendar-day';
    if (isPast) cls += ' disabled';
    if (isToday) cls += ' today';
    if (checkin  && date.getTime() === checkin.getTime())  cls += ' selected';
    if (checkout && date.getTime() === checkout.getTime()) cls += ' selected';
    if (checkin && checkout && date > checkin && date < checkout) cls += ' in-range';

    html += `<button class="${cls}" data-date="${dateStr}" ${isPast ? 'disabled' : ''} aria-label="${dateStr}">${d}</button>`;
  }

  grid.innerHTML = html;

  // Add click handlers
  grid.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(btn => {
    btn.addEventListener('click', () => onCalendarDayClick(btn.dataset.date));
  });

  updateDateSummary();
}

function onCalendarDayClick(dateStr) {
  const clicked = new Date(dateStr);

  if (!bookingState.checkin || (bookingState.checkin && bookingState.checkout)) {
    // Start new selection
    bookingState.checkin = dateStr;
    bookingState.checkout = null;
  } else {
    const checkin = new Date(bookingState.checkin);
    if (clicked <= checkin) {
      bookingState.checkin = dateStr;
      bookingState.checkout = null;
    } else {
      bookingState.checkout = dateStr;
    }
  }

  renderCalendar();
  updateSidebar();
}

function updateDateSummary() {
  const checkinEl  = document.getElementById('summary-checkin');
  const checkoutEl = document.getElementById('summary-checkout');
  const nightsEl   = document.getElementById('summary-nights');

  if (checkinEl)  checkinEl.textContent = bookingState.checkin  ? formatDateShort(bookingState.checkin)  : '—';
  if (checkoutEl) checkoutEl.textContent = bookingState.checkout ? formatDateShort(bookingState.checkout) : '—';

  if (nightsEl && bookingState.checkin && bookingState.checkout) {
    const nights = Math.round((new Date(bookingState.checkout) - new Date(bookingState.checkin)) / 86400000);
    nightsEl.textContent = `${nights} night${nights !== 1 ? 's' : ''}`;
  } else if (nightsEl) {
    nightsEl.textContent = '';
  }
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ---------------------------------------------------------
   GUEST COUNTERS
   --------------------------------------------------------- */

function initGuestCounters() {
  setupCounter('adults-count',   'adults-minus',   'adults-plus',   'adults',   1, 20);
  setupCounter('children-count', 'children-minus', 'children-plus', 'children', 0, 15);
}

function setupCounter(countId, minusId, plusId, field, min, max) {
  const countEl = document.getElementById(countId);
  const minusEl = document.getElementById(minusId);
  const plusEl  = document.getElementById(plusId);
  if (!countEl) return;

  const update = () => {
    countEl.textContent = bookingState[field];
    if (minusEl) minusEl.disabled = bookingState[field] <= min;
    if (plusEl)  plusEl.disabled  = bookingState[field] >= max;
    updateSidebar();
  };

  if (minusEl) minusEl.addEventListener('click', () => {
    if (bookingState[field] > min) { bookingState[field]--; update(); }
  });

  if (plusEl) plusEl.addEventListener('click', () => {
    if (bookingState[field] < max) { bookingState[field]++; update(); }
  });

  update();
}

/* ---------------------------------------------------------
   ROOM SELECTION
   --------------------------------------------------------- */

function initRoomSelection() {
  const options = document.querySelectorAll('.room-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      bookingState.room = opt.dataset.room;
      updateSidebar();
    });
  });
}

/* ---------------------------------------------------------
   GUEST DETAILS FORM
   --------------------------------------------------------- */

function initGuestDetailsForm() {
  const nameEl    = document.getElementById('guest-name');
  const mobileEl  = document.getElementById('guest-mobile');
  const waEl      = document.getElementById('guest-whatsapp');
  const emailEl   = document.getElementById('guest-email');
  const waSameEl  = document.getElementById('wa-same-as-mobile');

  if (nameEl)   nameEl.addEventListener('input',   () => { bookingState.name   = nameEl.value;   updateSidebar(); });
  if (mobileEl) mobileEl.addEventListener('input', () => {
    bookingState.mobile = mobileEl.value;
    if (bookingState.whatsappSameAsMobile && waEl) {
      waEl.value = mobileEl.value;
      bookingState.whatsappNum = mobileEl.value;
    }
    updateSidebar();
  });
  if (waEl)     waEl.addEventListener('input',     () => { bookingState.whatsappNum = waEl.value; });
  if (emailEl)  emailEl.addEventListener('input',  () => { bookingState.email  = emailEl.value; });

  if (waSameEl) {
    waSameEl.addEventListener('change', () => {
      bookingState.whatsappSameAsMobile = waSameEl.checked;
      if (waEl) {
        if (waSameEl.checked) {
          waEl.value = bookingState.mobile;
          bookingState.whatsappNum = bookingState.mobile;
          waEl.disabled = true;
        } else {
          waEl.disabled = false;
        }
      }
    });
  }
}

/* ---------------------------------------------------------
   PREFERENCES
   --------------------------------------------------------- */

function initPreferences() {
  document.querySelectorAll('[data-pref-group]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.prefGroup;
      const val   = btn.dataset.prefVal;

      document.querySelectorAll(`[data-pref-group="${group}"]`).forEach(b => {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');

      bookingState[group] = val;
      updateSidebar();
    });
  });

  const srEl = document.getElementById('special-request');
  if (srEl) srEl.addEventListener('input', () => { bookingState.specialRequest = srEl.value; });
}

/* ---------------------------------------------------------
   NAVIGATION
   --------------------------------------------------------- */

function initNavButtons() {
  const nextBtns = document.querySelectorAll('[data-booking-next]');
  const prevBtns = document.querySelectorAll('[data-booking-prev]');
  const submitBtn = document.getElementById('booking-submit');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(bookingState.step)) {
        goToStep(bookingState.step + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(bookingState.step - 1);
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', submitBooking);
  }
}

function goToStep(step) {
  if (step < 1 || step > bookingState.totalSteps) return;

  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`step-${step}`);
  if (target) {
    target.classList.add('active');
    // Scroll to top of panel
    target.closest('.booking-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  bookingState.step = step;
  renderProgress();

  // Populate review step
  if (step === 5) populateReview();
}

/* ---------------------------------------------------------
   VALIDATION
   --------------------------------------------------------- */

function validateStep(step) {
  clearErrors();

  if (step === 1) {
    if (!bookingState.checkin) {
      showError('Please select a check-in date.', 'cal-error');
      return false;
    }
    if (!bookingState.checkout) {
      showError('Please select a check-out date.', 'cal-error');
      return false;
    }
  }

  if (step === 2) {
    if (bookingState.adults < 1) {
      showError('At least 1 adult is required.', 'guests-error');
      return false;
    }
  }

  if (step === 4) {
    if (!bookingState.name.trim()) {
      showFieldError('guest-name', 'Name is required.');
      return false;
    }
    if (!bookingState.mobile.trim()) {
      showFieldError('guest-mobile', 'Mobile number is required.');
      return false;
    }
    if (bookingState.email && !isValidEmail(bookingState.email)) {
      showFieldError('guest-email', 'Please enter a valid email address.');
      return false;
    }
  }

  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(msg, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (field) field.classList.add('error');

  const errId = fieldId + '-error';
  let errEl = document.getElementById(errId);
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.id = errId;
    errEl.className = 'form-error';
    field?.parentNode?.appendChild(errEl);
  }
  errEl.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error').forEach(el => {
    el.classList.remove('error');
  });
  const calErr = document.getElementById('cal-error');
  if (calErr) calErr.textContent = '';
}

/* ---------------------------------------------------------
   REVIEW STEP
   --------------------------------------------------------- */

function populateReview() {
  bookingState.enquiryId = generateEnquiryId();

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };

  set('review-enquiry-id', bookingState.enquiryId);
  set('review-id-display', bookingState.enquiryId);
  set('review-checkin',  formatDateShort(bookingState.checkin));
  set('review-checkout', formatDateShort(bookingState.checkout));

  const nights = bookingState.checkin && bookingState.checkout
    ? Math.round((new Date(bookingState.checkout) - new Date(bookingState.checkin)) / 86400000) : 0;

  set('review-nights', `${nights} night${nights !== 1 ? 's' : ''}`);

  const guests = [
    bookingState.adults > 0   ? `${bookingState.adults} Adult${bookingState.adults !== 1 ? 's' : ''}` : null,
    bookingState.children > 0 ? `${bookingState.children} Child${bookingState.children !== 1 ? 'ren' : ''}` : null,
  ].filter(Boolean).join(', ');

  set('review-guests', guests || '1 Adult');

  const roomNames = {
    standard:   'Standard Room',
    aframe:     'A-Frame Room',
    suite:      'Luxurious Suite',
    glasshouse: 'Glass House',
    'not-sure': 'Open to recommendation',
  };
  set('review-room', bookingState.room ? (roomNames[bookingState.room] || bookingState.room) : 'Not selected');
  set('review-name',   bookingState.name   || '—');
  set('review-mobile', bookingState.mobile || '—');
  set('review-email',  bookingState.email  || '—');

  const campfireMap = { yes: 'Interested', no: 'Not interested', more: 'Would like more info' };
  const mealMap     = { yes: 'Interested', no: 'Not interested', more: 'Would like more info' };

  set('review-campfire', bookingState.campfire ? (campfireMap[bookingState.campfire] || bookingState.campfire) : '—');
  set('review-meals',    bookingState.meals    ? (mealMap[bookingState.meals]       || bookingState.meals)    : '—');
  set('review-request',  bookingState.specialRequest || 'None');
}

/* ---------------------------------------------------------
   SUBMIT — OPEN WHATSAPP
   --------------------------------------------------------- */

function submitBooking() {
  openWhatsApp({
    enquiryId: bookingState.enquiryId || generateEnquiryId(),
    name:          bookingState.name,
    mobile:        bookingState.mobile,
    whatsappNum:   bookingState.whatsappSameAsMobile ? bookingState.mobile : bookingState.whatsappNum,
    email:         bookingState.email,
    checkin:       bookingState.checkin,
    checkout:      bookingState.checkout,
    adults:        bookingState.adults,
    children:      bookingState.children,
    room:          bookingState.room,
    campfire:      bookingState.campfire,
    meals:         bookingState.meals,
    specialRequest: bookingState.specialRequest,
  });

  // Show success state
  const panel = document.querySelector('.booking-panel');
  const success = document.getElementById('booking-success');

  if (panel && success) {
    panel.style.opacity = '0';
    panel.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      panel.style.display = 'none';
      success.classList.add('show');
      const progressEl = document.querySelector('.booking-progress');
      if (progressEl) progressEl.style.display = 'none';
    }, 300);
  }
}

/* ---------------------------------------------------------
   PROGRESS INDICATOR
   --------------------------------------------------------- */

function renderProgress() {
  document.querySelectorAll('.progress-step').forEach((step, i) => {
    const n = i + 1;
    step.classList.remove('active', 'done');
    if (n < bookingState.step)  step.classList.add('done');
    if (n === bookingState.step) step.classList.add('active');
  });

  document.querySelectorAll('.progress-line').forEach((line, i) => {
    line.classList.toggle('done', i + 1 < bookingState.step);
  });
}

/* ---------------------------------------------------------
   SIDEBAR SUMMARY
   --------------------------------------------------------- */

function updateSidebar() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  };

  set('sb-checkin',  bookingState.checkin  ? formatDateShort(bookingState.checkin)  : null);
  set('sb-checkout', bookingState.checkout ? formatDateShort(bookingState.checkout) : null);

  const nights = bookingState.checkin && bookingState.checkout
    ? Math.round((new Date(bookingState.checkout) - new Date(bookingState.checkin)) / 86400000) : 0;
  set('sb-nights', nights > 0 ? `${nights} night${nights !== 1 ? 's' : ''}` : null);

  const guests = [
    bookingState.adults > 0   ? `${bookingState.adults} Adult${bookingState.adults !== 1 ? 's' : ''}` : null,
    bookingState.children > 0 ? `${bookingState.children} Child${bookingState.children !== 1 ? 'ren' : ''}` : null,
  ].filter(Boolean).join(', ');
  set('sb-guests', guests || '1 Adult');

  const roomNames = {
    standard:   'Standard Room',
    aframe:     'A-Frame Room',
    suite:      'Luxurious Suite',
    glasshouse: 'Glass House',
    'not-sure': 'Open recommendation',
  };
  set('sb-room', bookingState.room ? (roomNames[bookingState.room] || bookingState.room) : null);
  set('sb-name', bookingState.name || null);
}
