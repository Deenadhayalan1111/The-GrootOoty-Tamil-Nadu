/* =========================================================
   THE GROOT OOTY — Gallery JS (Masonry, Filters, Lightbox)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initLightbox();
});

/* ---------------------------------------------------------
   GALLERY DATA
   --------------------------------------------------------- */

const GALLERY_IMAGES = [
  { src: 'assets/images/hero-main.png',         alt: 'The Groot property exterior',        category: 'property' },
  { src: 'assets/images/aframe-exterior.png',   alt: 'A-Frame cabin exterior',             category: 'rooms' },
  { src: 'assets/images/aframe-interior.png',   alt: 'A-Frame interior',                   category: 'rooms' },
  { src: 'assets/images/glasshouse-exterior.png',alt: 'Glass House exterior',              category: 'rooms' },
  { src: 'assets/images/glasshouse-interior.png',alt: 'Glass House interior view',         category: 'rooms' },
  { src: 'assets/images/standard-room.png',     alt: 'Standard Room',                      category: 'rooms' },
  { src: 'assets/images/suite-interior.png',    alt: 'Luxurious Suite',                    category: 'rooms' },
  { src: 'assets/images/campfire-night.png',    alt: 'Campfire night at The Groot',        category: 'campfire' },
  { src: 'assets/images/food-homemade.png',     alt: 'Home-cooked food at The Groot',      category: 'food' },
  { src: 'assets/images/property-garden.png',   alt: 'The Groot garden',                   category: 'property' },
  { src: 'assets/images/morning-mist.png',      alt: 'Ooty morning mist',                  category: 'ooty' },
  { src: 'assets/images/ooty-lake.png',         alt: 'Ooty Lake',                          category: 'ooty' },
  { src: 'assets/images/tea-estate.png',        alt: 'Nilgiri tea estates',                category: 'ooty' },
  // Duplicates for richer gallery
  { src: 'assets/images/campfire-night.png',    alt: 'Evening campfire gathering',         category: 'experience' },
  { src: 'assets/images/property-garden.png',   alt: 'Garden pathway at The Groot',        category: 'property' },
  { src: 'assets/images/food-homemade.png',     alt: 'Authentic South Indian breakfast',   category: 'food' },
];

let currentIndex = 0;
let filteredImages = [...GALLERY_IMAGES];

/* ---------------------------------------------------------
   GALLERY FILTERS
   --------------------------------------------------------- */

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const masonry = document.getElementById('gallery-masonry');
  if (!masonry) return;

  // Build initial gallery
  renderGallery(GALLERY_IMAGES);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      filteredImages = cat === 'all'
        ? [...GALLERY_IMAGES]
        : GALLERY_IMAGES.filter(img => img.category === cat);

      renderGallery(filteredImages);
    });
  });
}

function renderGallery(images) {
  const masonry = document.getElementById('gallery-masonry');
  if (!masonry) return;

  masonry.innerHTML = '';

  images.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = i;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View image: ${img.alt}`);

    item.innerHTML = `
      <img
        src="${img.src}"
        alt="${img.alt}"
        loading="lazy"
      />
      <div class="gallery-item-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
        </svg>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
    });

    masonry.appendChild(item);
  });

  // Re-init lazy loading
  if (typeof initLazyImages === 'function') initLazyImages();
}

/* ---------------------------------------------------------
   LIGHTBOX
   --------------------------------------------------------- */

function initLightbox() {
  // Create lightbox DOM if not exists
  if (!document.getElementById('lightbox')) {
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox-overlay';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');

    lb.innerHTML = `
      <div class="lightbox-inner">
        <img id="lightbox-img" src="" alt="" />
      </div>
      <button class="lightbox-close" id="lightbox-close" aria-label="Close image viewer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="lightbox-prev" id="lightbox-prev" aria-label="Previous image">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button class="lightbox-next" id="lightbox-next" aria-label="Next image">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <div class="lightbox-caption" id="lightbox-caption"></div>
    `;

    document.body.appendChild(lb);

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', lightboxPrev);
    document.getElementById('lightbox-next').addEventListener('click', lightboxNext);

    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;

    if (e.key === 'ArrowLeft')  lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'Escape')     closeLightbox();
  });

  // Touch swipe
  let swipeStart = 0;
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('touchstart', e => { swipeStart = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const diff = swipeStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) lightboxNext();
        else lightboxPrev();
      }
    });
  }
}

function openLightbox(index) {
  currentIndex = index;
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  updateLightboxImage();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus management
  document.getElementById('lightbox-close').focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  if (!img) return;

  const data = filteredImages[currentIndex];
  if (!data) return;

  img.style.opacity = '0';
  img.src = data.src;
  img.alt = data.alt;

  img.onload = () => {
    img.style.transition = 'opacity 0.3s ease';
    img.style.opacity = '1';
  };

  if (caption) {
    caption.textContent = `${currentIndex + 1} / ${filteredImages.length}`;
  }
}

function lightboxPrev() {
  currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
  updateLightboxImage();
}

function lightboxNext() {
  currentIndex = (currentIndex + 1) % filteredImages.length;
  updateLightboxImage();
}

// Expose for use by room detail page
window.openGalleryLightbox = function(images, startIndex) {
  filteredImages = images;
  initLightbox();
  openLightbox(startIndex || 0);
};
