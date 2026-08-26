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

toggle_html = """<div class="header-actions">
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

      <!-- Hamburger -->
"""

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
    # Match the header-cta div and everything inside it, plus any optional whitespace,
    # until the <button class="hamburger"...
    # Some files have comments, some don't.
    pattern_header = re.compile(r"(<!-- Header CTA -->\s*)?<div class=\"header-cta\">.*?</div>\s*(<!-- Hamburger -->\s*)?<button class=\"hamburger\" id=\"hamburger\"[^>]*>.*?<\/button>", re.DOTALL)
    
    def repl_header(m):
        # We need to reconstruct the hamburger button because we matched it
        # Actually, let's just extract the hamburger button from the match and append it
        hamburger_btn = re.search(r"<button class=\"hamburger\".*?<\/button>", m.group(0), re.DOTALL).group(0)
        return toggle_html + "      " + hamburger_btn + "\n    </div>"
        
    content = re.sub(pattern_header, repl_header, content, count=1)
    
    # 2. Inject the script before fonts
    content = content.replace('  <link rel="icon" href="assets/images/IMG-20260821-WA0039.jpg" type="image/png" />', script_html)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
