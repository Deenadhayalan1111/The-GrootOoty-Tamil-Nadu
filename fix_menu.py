import os
import re

DIR = r"c:\Users\deena\OneDrive\Desktop\temp"

# Regex to match the entire mobile-menu-header block up to the start of mobile-menu-nav
pattern = re.compile(r'<div class="mobile-menu-header">.*?</div>\s*(<nav class="mobile-menu-nav")', re.DOTALL)

for fname in os.listdir(DIR):
    if fname.endswith(".html"):
        path = os.path.join(DIR, fname)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = pattern.sub(r'\1', content)
        
        if new_content != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {fname}")
