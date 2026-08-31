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
  // Property & Exterior
  { src: 'assets/images/1000032834_professional.webp', alt: 'Real 4K property exterior at The Groot Ooty', category: 'property' },
  { src: 'assets/images/1000032835_professional.webp', alt: 'Real 4K misty Nilgiri property landscape', category: 'property' },
  { src: 'assets/images/1000032841_professional.webp', alt: 'Real 4K illuminated property at night', category: 'property' },
  { src: 'assets/images/IMG-20260821-WA0037.jpg', alt: 'Glass House outdoor view deck', category: 'property' },
  // Rooms & Interiors
  { src: 'assets/images/1000032836_professional.webp', alt: 'Real 4K A-Frame cabin exterior and wooden interior', category: 'rooms' },
  { src: 'assets/images/1000032837_professional.webp', alt: 'Real 4K Glass House panoramic room experience', category: 'rooms' },
  { src: 'assets/images/1000032838_professional.webp', alt: 'Real 4K Luxurious Suite bedroom interior', category: 'rooms' },
  { src: 'assets/images/1000032839_professional.webp', alt: 'Real 4K Standard Room cozy bedroom interior', category: 'rooms' },
  { src: 'assets/images/IMG-20260821-WA0035.jpg', alt: 'Cozy wooden reading nook inside the cabin', category: 'rooms' },
  // Campfire & Night
  { src: 'assets/images/IMG-20260821-WA0036.jpg', alt: 'Real 4K campfire evening under Nilgiri stars', category: 'campfire' },
  // Food & Dining
  { src: 'assets/images/IMG-20260821-WA0041.jpg', alt: 'Authentic South Indian home-cooked meal at The Groot', category: 'food' },
  // Experience & Nature
  { src: 'assets/images/1000032840_professional.webp', alt: 'Real 4K lush Nilgiri greenery and tea gardens', category: 'experience' },
  { src: 'assets/images/IMG-20260821-WA0034.jpg', alt: 'Guided tea estate walk and mountain views', category: 'experience' },
  // Ooty Attractions & Views
  { src: 'assets/images/IMG-20260821-WA0039.jpg', alt: 'Ooty Lake and misty Nilgiri mountain panorama', category: 'ooty' },
  { src: 'assets/images/1000032835_professional.webp', alt: 'Real 4K scenic Nilgiri mountain viewpoint', category: 'ooty' },
  // New WhatsApp Imports
  { src: 'assets/images/gallery-new-img-1.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-2.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-3.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-4.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-5.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-6.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-7.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-8.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-9.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-10.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-11.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' },
  { src: 'assets/images/gallery-new-img-12.jpeg', alt: 'The Groot Ooty property highlight', category: 'property' }
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
        decoding="async"
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
