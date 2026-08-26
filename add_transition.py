import os, glob

# 1. Update HTML files (add page-transitioning class in head)
html_injection = """
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          document.documentElement.classList.add('page-transitioning');
        }
      } catch(e) {}
"""
for f in glob.glob('*.html'):
    c = open(f, 'r', encoding='utf-8').read()
    if 'page-transitioning' not in c:
        c = c.replace('      } catch(e) {}', html_injection)
        open(f, 'w', encoding='utf-8').write(c)
        print(f"Injected head script to {f}")

# 2. Update base.css (add transition styles)
css_path = 'css/base.css'
css = open(css_path, 'r', encoding='utf-8').read()
if 'page-transitioning' not in css:
    css_addition = """

/* =========================================================
   PREMIUM PAGE TRANSITION
   ========================================================= */
html.page-transitioning body {
  opacity: 0;
}
body {
  opacity: 1;
  transition: opacity 0.4s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  html.page-transitioning body {
    opacity: 1;
  }
  body {
    transition: none !important;
  }
}
"""
    open(css_path, 'w', encoding='utf-8').write(css + css_addition)
    print("Added transition to base.css")

# 3. Update main.js (remove class on load, intercept links)
js_path = 'js/main.js'
js = open(js_path, 'r', encoding='utf-8').read()
if 'page-transitioning' not in js:
    js_addition = """

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
"""
    open(js_path, 'w', encoding='utf-8').write(js + js_addition)
    print("Added transition logic to main.js")

