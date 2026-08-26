with open("css/variables.css", "a", encoding="utf-8") as f:
    f.write("""

/* =========================================================
   CONTRAST FIXES FOR LIGHT (DAY) THEME
   ========================================================= */
[data-theme="day"] .ooty-card-name,
[data-theme="day"] .ooty-card-desc {
  color: #000 !important;
}

[data-theme="day"] .ooty-card-desc[style*="color: var(--color-bronze)"] {
  color: #634C2C !important; /* Darker bronze for contrast */
}

/* Fix for A Day At The Groot section which hardcodes white text on light background */
[data-theme="day"] .day-title, 
[data-theme="day"] .day-text {
  color: #000 !important;
}

/* Fix for section headers with .dark class on light background */
[data-theme="day"] .section-title.dark,
[data-theme="day"] .section-subtitle.dark {
  color: #000 !important;
}
""")

