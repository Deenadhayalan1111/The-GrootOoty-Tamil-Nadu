import re

with open('css/variables.css', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"/\* =========================================================\s*ISOLATED THEME SELECTOR COMPONENT \(PHASE 1\).*$", re.DOTALL)
new_content = """/* =========================================================
   DAY THEME OVERRIDES
   ========================================================= */

[data-theme="day"] {
  /* --- Semantic Colors --- */
  --bg-dark:            #FAF7F2;
  --bg-section:         #F2EDE4;
  --bg-card:            #FFFFFF;
  --bg-glass:           rgba(255, 255, 255, 0.85);
  --bg-light:           #FFFFFF;
  --text-primary:       #1C2B1E;
  --text-secondary:     #4A5E4C;
  --text-muted:         #7A8B7C;
  --text-dark:          #1C2B1E;
  --text-dark-secondary:#4A5E4C;
  --accent-primary:     #B8835A;
  --accent-hover:       #9E6B43;
  --border-dark:        rgba(0, 0, 0, 0.10);
  --border-light:       rgba(0, 0, 0, 0.05);

  /* --- Mapped Brand Colors for consistent Day Mode UI --- */
  --color-forest:       #FAF7F2;
  --color-forest-deep:  #F2EDE4;
  --color-moss:         #E6DFD3;
  --color-sage:         #7A8B7C;
  --color-sage-light:   #92A394;
  --color-cream:        #1C2B1E;
  --color-cream-warm:   #FFFFFF;
  --color-warm-white:   #F5F0E8;
  --color-beige:        #D8CFC0;
  --color-beige-dark:   #B8AD9C;
  --color-brown:        #9E6B43;
  --color-brown-light:  #B8835A;
  --color-bronze:       #B8835A;
  --color-bronze-dark:  #9E6B43;
  --color-amber:        #9E6B43;
  --color-charcoal:     #1C2B1E;
  --color-charcoal-soft:#2A3F2C;
  --color-stone:        #4A5E4C;
  --color-mist:         rgba(0,0,0,0.04);
  
  /* Fallbacks for mapped components */
  --card-bg:            #FFFFFF;
  --card-border:        rgba(0, 0, 0, 0.10);
  --card-text:          #1C2B1E;
  --card-text-muted:    #4A5E4C;
  --groot-accent:       #B8835A;
  --groot-accent-dark:  #9E6B43;
  --groot-primary:      #FAF7F2;
}

/* =========================================================
   TARGETED COMPONENT OVERRIDES FOR DAY MODE
   ========================================================= */

[data-theme="day"] .btn-primary {
  background: var(--accent-primary) !important;
  color: var(--color-forest) !important;
  border-color: transparent !important;
}
[data-theme="day"] .btn-primary:hover {
  background: var(--accent-hover) !important;
}

[data-theme="day"] .btn-ghost {
  color: var(--accent-primary) !important;
  border-color: var(--accent-primary) !important;
}
[data-theme="day"] .btn-ghost:hover {
  background: var(--accent-primary) !important;
  color: var(--color-forest) !important;
}

[data-theme="day"] .room-card-cta {
  color: var(--accent-primary) !important;
}

[data-theme="day"] .section-badge {
  color: var(--accent-primary) !important;
  border-color: var(--border-dark) !important;
}

[data-theme="day"] .card,
[data-theme="day"] .ooty-card,
[data-theme="day"] .exp-card,
[data-theme="day"] .review-card,
[data-theme="day"] .room-listing-card,
[data-theme="day"] .booking-card,
[data-theme="day"] .contact-card,
[data-theme="day"] .feature-card,
[data-theme="day"] .glass-card {
  background: var(--card-bg, var(--bg-card)) !important;
  border-color: var(--card-border, var(--border-dark)) !important;
}

[data-theme="day"] .card h1, [data-theme="day"] .card h2, [data-theme="day"] .card h3, [data-theme="day"] .card h4,
[data-theme="day"] .ooty-card h1, [data-theme="day"] .ooty-card h2, [data-theme="day"] .ooty-card h3, [data-theme="day"] .ooty-card h4,
[data-theme="day"] .exp-card h1, [data-theme="day"] .exp-card h2, [data-theme="day"] .exp-card h3, [data-theme="day"] .exp-card h4,
[data-theme="day"] .exp-card-title,
[data-theme="day"] .ooty-card-name,
[data-theme="day"] .review-author-name,
[data-theme="day"] .room-listing-name {
  color: var(--card-text, var(--text-primary)) !important;
}

[data-theme="day"] .card p,
[data-theme="day"] .ooty-card p,
[data-theme="day"] .exp-card p,
[data-theme="day"] .review-card p,
[data-theme="day"] .room-listing-card p,
[data-theme="day"] .exp-card-desc,
[data-theme="day"] .exp-card-text,
[data-theme="day"] .ooty-card-desc,
[data-theme="day"] .review-text,
[data-theme="day"] .room-listing-desc {
  color: var(--card-text-muted, var(--text-secondary)) !important;
}

/* =========================================================
   THEME TOGGLE COMPONENT
   ========================================================= */

.theme-toggle {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-full);
  padding: 2px;
  position: relative;
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-out);
  width: 64px;
  height: 32px;
  margin-left: var(--space-4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.12);
}

.theme-toggle-indicator {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  background: var(--color-bronze);
  border-radius: var(--radius-full);
  transition: transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 1;
}

[data-theme="day"] .theme-toggle-indicator {
  transform: translateX(32px);
  background: var(--color-bronze);
}

.theme-toggle-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-size: 14px;
  position: relative;
}

.theme-toggle-icon.sun {
  opacity: 0.6;
  transition: opacity var(--dur-base) var(--ease-out);
}

.theme-toggle-icon.moon {
  opacity: 1;
  transition: opacity var(--dur-base) var(--ease-out);
}

[data-theme="day"] .theme-toggle-icon.sun {
  opacity: 1;
}

[data-theme="day"] .theme-toggle-icon.moon {
  opacity: 0.6;
}
"""

content = re.sub(pattern, new_content, content)
with open('css/variables.css', 'w', encoding='utf-8') as f:
    f.write(content)
