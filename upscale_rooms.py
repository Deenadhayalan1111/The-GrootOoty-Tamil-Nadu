import os
from PIL import Image, ImageFilter
from math import gcd
import shutil

# Target images
targets = [
    "1000032836_professional.webp",
    "1000032837_professional.webp",
    "1000032838_professional.webp",
    "1000032839_professional.webp"
]

SOURCE_DIR = r"C:\Users\deena\OneDrive\Desktop\photos"
OUT_DIR = r"C:\Users\deena\OneDrive\Desktop\photos\4k\rooms"
WEBSITE_ASSETS_DIR = r"C:\Users\deena\OneDrive\Desktop\temp\assets\images"

TARGET_LONG_SIDE = 3840

os.makedirs(OUT_DIR, exist_ok=True)

for fname in targets:
    src_path = os.path.join(SOURCE_DIR, fname)
    if not os.path.exists(src_path):
        # Maybe it's already in the website assets directory
        src_path = os.path.join(WEBSITE_ASSETS_DIR, fname)
        if not os.path.exists(src_path):
            print(f"ERROR: Cannot find {fname}")
            continue
            
    try:
        with Image.open(src_path) as img:
            orig_w, orig_h = img.size
            
            # Calculate scaling
            scale = TARGET_LONG_SIDE / max(orig_w, orig_h)
            new_w = round(orig_w * scale)
            new_h = round(orig_h * scale)
            
            # Ensure even dimensions
            new_w = new_w if new_w % 2 == 0 else new_w + 1
            new_h = new_h if new_h % 2 == 0 else new_h + 1
            
            print(f"Processing {fname}: {orig_w}x{orig_h} -> {new_w}x{new_h}")
            
            # Upscale using Lanczos
            if img.mode in ('P', 'PA'):
                img = img.convert('RGBA')
            elif img.mode == 'L':
                img = img.convert('RGB')
                
            upscaled = img.resize((new_w, new_h), Image.LANCZOS)
            
            # Mild unsharp mask
            sharpened = upscaled.filter(ImageFilter.UnsharpMask(radius=1.5, percent=50, threshold=3))
            
            # Save as WEBP
            base_name = os.path.splitext(fname)[0]
            out_name = f"{base_name}_4k.webp"
            out_path = os.path.join(OUT_DIR, out_name)
            
            sharpened.save(out_path, 'WEBP', quality=95)
            print(f"Saved to {out_path}")
            
            # Copy to website assets
            website_dest = os.path.join(WEBSITE_ASSETS_DIR, out_name)
            shutil.copy2(out_path, website_dest)
            print(f"Copied to {website_dest}")
            
    except Exception as e:
        print(f"Error processing {fname}: {e}")
