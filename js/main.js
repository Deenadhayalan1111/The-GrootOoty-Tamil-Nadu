/* =========================================================
   THE GROOT OOTY — Main JS (Header, Scroll Reveal, Mobile Drawer)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initParallax();
  initPhoneLinks();
  setActiveNavLink();
});

/* ---------------------------------------------------------
   HEADER SCROLL BEHAVIOR
   --------------------------------------------------------- */

function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;

  const onScroll = () => {
    if (window.scrollY > 30) {
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

  onScroll();
}

/* ---------------------------------------------------------
   MOBILE MENU DRAWER
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
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
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

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
}

/* ---------------------------------------------------------
   FAST INTERSECTION OBSERVER — SCROLL REVEAL
   --------------------------------------------------------- */

function initScrollReveal() {
  // If reduced motion is requested, immediately reveal everything
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

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
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   SUBTLE PARALLAX
   --------------------------------------------------------- */

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parallaxImgs = document.querySelectorAll('.parallax-img');
  if (!parallaxImgs.length) return;

  let ticking = false;

  const updateParallax = () => {
    const viewH = window.innerHeight;

    parallaxImgs.forEach(img => {
      const parent = img.closest('.spotlight-section') || img.closest('.hero') || img.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const yOffset = (progress - 0.5) * 35;
        img.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ---------------------------------------------------------
   PHONE & ACTIVE NAV LINK
   --------------------------------------------------------- */

function initPhoneLinks() {
  if (typeof CONFIG === 'undefined') return;

  document.querySelectorAll('[data-phone="1"]').forEach(el => {
    if (el.tagName === 'A') el.href = `tel:${CONFIG.PHONE_NUMBER_1}`;
  });

  document.querySelectorAll('[data-phone="2"]').forEach(el => {
    if (el.tagName === 'A') el.href = `tel:${CONFIG.PHONE_NUMBER_2}`;
  });
}

function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* Smooth scroll helper */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
