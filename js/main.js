/* =========================================================
   THE GROOT OOTY — Main JS (Header, Scroll, Init)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initParallax();
  initCardTilt();
  initPhoneLinks();
  initLazyImages();
  setActiveNavLink();
  initDayNightToggle();
});

/* ---------------------------------------------------------
   HEADER SCROLL BEHAVIOR
   --------------------------------------------------------- */

function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    const scroll = window.scrollY;
    if (scroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  
  onScroll(); // init state
}

/* ---------------------------------------------------------
   MOBILE MENU
   --------------------------------------------------------- */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on overlay click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
}

/* ---------------------------------------------------------
   INTERSECTION OBSERVER — REVEAL ANIMATIONS
   --------------------------------------------------------- */

function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   PARALLAX
   --------------------------------------------------------- */

function initParallax() {
  // Skip if reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parallaxEls = document.querySelectorAll('.parallax-img');
  if (!parallaxEls.length) return;

  let ticking = false;

  const onScroll = () => {
    const viewH = window.innerHeight;
    
    parallaxEls.forEach(img => {
      const wrapper = img.closest('.parallax-wrapper') || img.closest('[class*="section"]');
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > viewH) return;

      const scrollFrac = (viewH - rect.top) / (viewH + rect.height);
      const offset = (scrollFrac - 0.5) * 80;

      img.style.transform = `translate3d(0, ${offset}px, 0)`; // Use translate3d for hardware acceleration
    });
    
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  
  onScroll();
}

/* ---------------------------------------------------------
   CARD TILT (Room cards, desktop only)
   --------------------------------------------------------- */

function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1025) return;

  const cards = document.querySelectorAll('.room-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------------------------------------------------------
   PHONE LINKS — ensure tel: links work
   --------------------------------------------------------- */

function initPhoneLinks() {
  if (!window.CONFIG) return;

  document.querySelectorAll('[data-phone="1"]').forEach(el => {
    el.href = `tel:${CONFIG.PHONE_NUMBER_1}`;
    el.setAttribute('aria-label', `Call ${CONFIG.PHONE_NUMBER_1}`);
  });

  document.querySelectorAll('[data-phone="2"]').forEach(el => {
    el.href = `tel:${CONFIG.PHONE_NUMBER_2}`;
    el.setAttribute('aria-label', `Call ${CONFIG.PHONE_NUMBER_2}`);
  });

  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    const msg = el.dataset.whatsapp || 'Hi The Groot! I\'d like to know more about your rooms and availability.';
    el.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });
}

/* ---------------------------------------------------------
   ACTIVE NAV LINK
   --------------------------------------------------------- */

function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------------------------------------------------------
   LAZY IMAGE LOADING
   --------------------------------------------------------- */

function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  // Browser handles native lazy loading, but we can add a fade-in effect

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
        if (img.complete) img.style.opacity = '1';
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';
    observer.observe(img);
  });
}

/* ---------------------------------------------------------
   HERO SCROLL CLICK
   --------------------------------------------------------- */

window.heroScrollClick = function() {
  const intro = document.getElementById('intro') || document.getElementById('highlights');
  if (intro) {
    intro.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ---------------------------------------------------------
   REVIEWS CAROUSEL
   --------------------------------------------------------- */

window.initReviewsCarousel = function() {
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  const dots = document.querySelectorAll('.reviews-dot');
  if (!track) return;

  const cards = track.children;
  let current = 0;
  let cardWidth = 0;

  const getVisible = () => {
    if (window.innerWidth > 1024) return 3;
    if (window.innerWidth > 640) return 2;
    return 1;
  };

  const update = () => {
    const visible = getVisible();
    cardWidth = (track.parentElement.offsetWidth - (visible - 1) * 20) / visible;

    Array.from(cards).forEach(card => {
      card.style.minWidth = cardWidth + 'px';
    });

    const maxIndex = Math.max(0, cards.length - visible);
    current = Math.min(current, maxIndex);

    track.style.transform = `translateX(${-current * (cardWidth + 20)}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => {
    current = Math.max(0, current - 1);
    update();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    const visible = getVisible();
    const maxIndex = Math.max(0, cards.length - visible);
    current = Math.min(maxIndex, current + 1);
    update();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      update();
    });
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextBtn && nextBtn.click();
      else prevBtn && prevBtn.click();
    }
  });

  window.addEventListener('resize', update);
  update();
};

/* ---------------------------------------------------------
   TOAST NOTIFICATION
   --------------------------------------------------------- */

window.showToast = function(msg, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};

/* ---------------------------------------------------------
   SCROLL TO SECTION
   --------------------------------------------------------- */

window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (el) {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 76;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

/* ---------------------------------------------------------
   DAY/NIGHT THEME TOGGLE
   --------------------------------------------------------- */
function initDayNightToggle() {
  const toggle = document.getElementById('theme-toggle-btn');
  if (!toggle) return;

  const THEME_KEY = 'groot-theme';
  const getSavedTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  };

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
  };

  const applyTheme = (theme) => {
    if (theme === 'day') {
      document.documentElement.setAttribute('data-theme', 'day');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Check initial state (should already be applied by inline script, but just in case)
  const currentTheme = getSavedTheme() || getSystemTheme();
  applyTheme(currentTheme);

  // Toggle on click
  toggle.addEventListener('click', () => {
    const isDay = document.documentElement.getAttribute('data-theme') === 'day';
    const newTheme = isDay ? 'night' : 'day';
    
    applyTheme(newTheme);
    saveTheme(newTheme);
  });
  
  // Toggle on keyboard (accessibility)
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });
}


/* =========================================================
   PREMIUM PAGE TRANSITION (JS)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tiny bit to ensure CSS is applied, then fade in
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('page-transitioning');
  });
});

window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    document.documentElement.classList.remove('page-transitioning');
  }
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  
  const href = link.getAttribute('href');
  if (!href) return;
  
  // Ignore external links, anchors, tel, mailto
  if (href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
  
  // Ignore target blank
  if (link.target === '_blank') return;
  
  // Ignore if modifier keys are pressed (new tab/window)
  if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;
  
  // Prevent default and fade out
  e.preventDefault();
  
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('page-transitioning');
    setTimeout(() => {
      window.location.href = href;
    }, 400); // match CSS transition duration
  } else {
    window.location.href = href;
  }
});
