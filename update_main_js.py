import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the call
content = content.replace('initGrootThemeSelector();', 'initDayNightToggle();')

# Replace the function definition
pattern = re.compile(r"/\* ---------------------------------------------------------\s*ISOLATED THEME SELECTOR COMPONENT.*$", re.DOTALL)
new_func = """/* ---------------------------------------------------------
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
"""

content = re.sub(pattern, new_func, content)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
