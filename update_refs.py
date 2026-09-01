import os

files_to_check = [
    "index.html",
    "rooms.html",
    "js/config.js",
    "js/gallery.js"
]

replacements = {
    "1000032836_professional.webp": "1000032836_professional_4k.webp",
    "1000032837_professional.webp": "1000032837_professional_4k.webp",
    "1000032838_professional.webp": "1000032838_professional_4k.webp",
    "1000032839_professional.webp": "1000032839_professional_4k.webp"
}

base_dir = r"C:\Users\deena\OneDrive\Desktop\temp"

for filepath in files_to_check:
    full_path = os.path.join(base_dir, filepath)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    modified = False
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed in {filepath}")
