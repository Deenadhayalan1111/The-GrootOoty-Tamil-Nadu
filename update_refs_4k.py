import os
import re

DIR = r"C:\Users\deena\OneDrive\Desktop\temp"
ASSETS_DIR = os.path.join(DIR, "assets", "images")

# Find all _4k.webp files
fourk_files = [f for f in os.listdir(ASSETS_DIR) if f.endswith("_4k.webp")]

replacements = {}
for f in fourk_files:
    # Safely get the base name by removing '_4k.webp'
    base = f[:-8] 
    replacements[base] = f

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        orig_content = content
        
        for base, new_f in replacements.items():
            # Pattern matches the base name followed exactly by a valid extension
            pattern = re.escape(base) + r'\.(jpg|jpeg|png|webp)'
            
            def repl(match):
                # Don't replace if it's somehow already correct
                if match.group(0).endswith('_4k.webp'):
                    return match.group(0)
                return new_f
                
            content = re.sub(pattern, repl, content)
            
        if content != orig_content:
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated references in {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, dirs, files in os.walk(DIR):
    # Exclude node_modules or similar if any (though none exist here)
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    if 'originals_backup' in dirs:
        dirs.remove('originals_backup')
        
    for fname in files:
        if fname.endswith(('.html', '.js', '.css')):
            replace_in_file(os.path.join(root, fname))

print("All references updated.")
