import re
import glob

# First, update css/header.css
with open('css/header.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .header-cta
css = css.replace('.header-cta {\n  flex-shrink: 0;\n}', """.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.header-cta {
  flex-shrink: 0;
}""")

with open('css/header.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Now, update all HTML files
html_files = glob.glob('*.html')

toggle_html = """    <div class="header-actions">
      <!-- Header CTA -->
      <div class="header-cta">
        <a href="booking.html" class="btn btn-primary btn-sm" id="header-book-btn">Book Now</a>
      </div>
      
      <!-- Theme Toggle -->
      <button id="theme-toggle-btn" class="theme-toggle" aria-label="Toggle Day/Night Mode">
        <div class="theme-toggle-indicator"></div>
        <span class="theme-toggle-icon sun">☀️</span>
        <span class="theme-toggle-icon moon">🌙</span>
      </button>

      <!-- Hamburger -->"""

script_html = """  <link rel="icon" href="assets/images/IMG-20260821-WA0039.jpg" type="image/png" />

  <!-- Theme Initialization (Prevents flash) -->
  <script>
    (function(){
      try {
        var t = localStorage.getItem('groot-theme');
        if (!t) {
          t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
        }
        if (t === 'day') {
          document.documentElement.setAttribute('data-theme', 'day');
        }
      } catch(e) {}
    })();
  </script>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace the header section
    pattern_header = re.compile(r"<!-- Header CTA -->\s*<div class=\"header-cta\">\s*<a href=\"booking\.html\" class=\"btn btn-primary btn-sm\" id=\"header-book-btn\">Book Now</a>\s*</div>\s*<!-- Hamburger -->", re.DOTALL)
    content = re.sub(pattern_header, toggle_html, content)
    
    # Also need to close the header-actions div AFTER the hamburger
    pattern_hamburger_end = re.compile(r"(<button class=\"hamburger\" id=\"hamburger\" .*?</button>)", re.DOTALL)
    
    # We only want to close it inside the #site-header, not the mobile menu one.
    # We can be safe by matching the exact hamburger structure in the header.
    # Actually, the header hamburger has aria-controls="mobile-menu"
    pattern_hamburger_replace = r"\1\n    </div>"
    
    # We have to be careful. Let's do a more specific replacement.
    def repl_hamburger(m):
        return m.group(1) + '\n    </div>'
        
    content = re.sub(r"(<button class=\"hamburger\" id=\"hamburger\"[^>]*>.*?<\/button>)", repl_hamburger, content, count=1, flags=re.DOTALL)
    
    # 2. Inject the script before fonts
    content = content.replace('  <link rel="icon" href="assets/images/IMG-20260821-WA0039.jpg" type="image/png" />', script_html)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
