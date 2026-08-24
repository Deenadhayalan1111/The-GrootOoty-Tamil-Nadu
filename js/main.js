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
  initGrootThemeSelector();
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
   ISOLATED THEME SELECTOR COMPONENT (PHASE 1 ONLY)
   Strictly scoped under .groot-theme-* classes.
   Operates only on its own floating button UI.
   Zero impact on existing website CSS/HTML.
   --------------------------------------------------------- */
function initGrootThemeSelector() {
  const themes = [
    { id: "royal-emerald", name: "Royal Emerald", colors: ["#176B4D", "#082F24", "#E2C275"] },
    { id: "midnight-sapphire", name: "Midnight Sapphire", colors: ["#2456A6", "#07162F", "#C9D4E5"] },
    { id: "burgundy-royale", name: "Burgundy Royale", colors: ["#7A2035", "#350D19", "#D39A8A"] },
    { id: "imperial-plum", name: "Imperial Plum", colors: ["#6A3D86", "#24112F", "#C8A9D9"] },
    { id: "obsidian-gold", name: "Obsidian Gold", colors: ["#181818", "#292929", "#D4AF37"] },
    { id: "sage-champagne", name: "Sage Champagne", colors: ["#84977E", "#3D4A38", "#C9825B"] }
  ];

  let savedThemeId = null;
  try {
    savedThemeId = localStorage.getItem("groot-ooty-theme");
  } catch (e) {
    // Fail safe if localStorage disabled
  }

  const container = document.createElement("div");
  container.className = "groot-theme-container";
  container.setAttribute("aria-label", "Theme Selector");

  // Floating Theme Button
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "groot-theme-btn";
  toggleBtn.setAttribute("type", "button");
  toggleBtn.setAttribute("aria-label", "Open Theme Selector");
  toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`;
  container.appendChild(toggleBtn);

  const swatches = [];

  const updateButtonThemeAccent = (themeObj) => {
    if (themeObj) {
      toggleBtn.style.background = `linear-gradient(135deg, ${themeObj.colors[0]} 0%, ${themeObj.colors[1]} 100%)`;
      toggleBtn.style.color = themeObj.colors[2];
      toggleBtn.style.borderColor = themeObj.colors[2];
    }
  };

  // If a theme was previously saved, update the button UI accent & apply data-theme attribute
  if (savedThemeId) {
    const match = themes.find(t => t.id === savedThemeId);
    if (match) {
      updateButtonThemeAccent(match);
      document.documentElement.setAttribute("data-theme", savedThemeId);
    }
  }

  themes.forEach((t) => {
    const swatch = document.createElement("div");
    swatch.className = "groot-theme-swatch";
    if (t.id === savedThemeId) swatch.classList.add("groot-theme-selected");
    swatch.setAttribute("data-label", t.name);
    swatch.setAttribute("role", "button");
    swatch.setAttribute("tabindex", "0");
    swatch.setAttribute("aria-label", `Select theme ${t.name}`);
    
    // Scoped swatch styling
    swatch.style.background = `linear-gradient(135deg, ${t.colors[0]} 0%, ${t.colors[1]} 50%, ${t.colors[2]} 100%)`;
    
    container.appendChild(swatch);
    swatches.push({ element: swatch, theme: t });

    const handleSelect = () => {
      // Phase 2: Apply targeted theme accent attribute to html
      document.documentElement.setAttribute("data-theme", t.id);
      try {
        localStorage.setItem("groot-ooty-theme", t.id);
      } catch (e) {}

      swatches.forEach(s => s.element.classList.remove("groot-theme-selected"));
      swatch.classList.add("groot-theme-selected");

      updateButtonThemeAccent(t);

      // Close popup
      container.classList.remove("groot-theme-open");
      toggleBtn.classList.remove("groot-theme-active");
    };

    swatch.addEventListener("click", handleSelect);
    swatch.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    });
  });

  document.body.appendChild(container);

  // Position calculation for an adaptive 90-degree quadrant arc (Right to Top)
  const updateRadialPositions = () => {
    const radius = window.innerWidth <= 430 ? 110 : 130; 
    const count = swatches.length;
    swatches.forEach((item, i) => {
      const angleDeg = (i / (count - 1)) * 90;
      const angleRad = angleDeg * (Math.PI / 180);
      const x = Math.cos(angleRad) * radius;
      const y = -Math.sin(angleRad) * radius; // Negative Y moves UP in CSS translate
      
      item.element.style.setProperty('--tx', `${x}px`);
      item.element.style.setProperty('--ty', `${y}px`);
    });
  };

  updateRadialPositions();
  window.addEventListener('resize', updateRadialPositions);

  // Toggle Popup
  toggleBtn.addEventListener("click", () => {
    const isOpen = container.classList.toggle("groot-theme-open");
    toggleBtn.classList.toggle("groot-theme-active", isOpen);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target) && container.classList.contains("groot-theme-open")) {
      container.classList.remove("groot-theme-open");
      toggleBtn.classList.remove("groot-theme-active");
    }
  });
}
