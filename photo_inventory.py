"""
Photo Inventory Script
Scans all images in the photos folder and reports dimensions, file size, aspect ratio,
and whether the image needs upscaling.
"""
import os
import json
from PIL import Image
from math import gcd

PHOTOS_DIR = r"C:\Users\deena\OneDrive\Desktop\photos"

# Threshold: images below this pixel count on their longest side are considered low-res
# 4K reference: 3840 pixels on the long side
# We'll consider anything below ~1920px on the long side as genuinely needing upscale
LOW_RES_THRESHOLD = 1920

results = []

for fname in sorted(os.listdir(PHOTOS_DIR)):
    fpath = os.path.join(PHOTOS_DIR, fname)
    if not os.path.isfile(fpath):
        continue
    
    ext = os.path.splitext(fname)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif'):
        continue
    
    try:
        with Image.open(fpath) as img:
            w, h = img.size
            fsize = os.path.getsize(fpath)
            
            # Calculate aspect ratio
            g = gcd(w, h)
            ar_w, ar_h = w // g, h // g
            
            # Determine if it needs upscaling
            long_side = max(w, h)
            needs_upscale = long_side < LOW_RES_THRESHOLD
            
            results.append({
                "filename": fname,
                "filetype": ext,
                "width": w,
                "height": h,
                "filesize_bytes": fsize,
                "filesize_kb": round(fsize / 1024, 1),
                "aspect_ratio": f"{ar_w}:{ar_h}",
                "long_side": long_side,
                "needs_upscale": needs_upscale
            })
    except Exception as e:
        results.append({
            "filename": fname,
            "error": str(e)
        })

# Print report
print(f"\n{'='*100}")
print(f"PHOTO INVENTORY REPORT")
print(f"{'='*100}")
print(f"{'Filename':<55} {'Type':<8} {'Resolution':<15} {'Size KB':<10} {'Aspect':<12} {'Needs Upscale'}")
print(f"{'-'*100}")

needs_count = 0
good_count = 0

for r in results:
    if "error" in r:
        print(f"{r['filename']:<55} ERROR: {r['error']}")
        continue
    
    res_str = f"{r['width']}x{r['height']}"
    upscale_str = "YES *" if r['needs_upscale'] else "NO"
    
    if r['needs_upscale']:
        needs_count += 1
    else:
        good_count += 1
    
    print(f"{r['filename']:<55} {r['filetype']:<8} {res_str:<15} {r['filesize_kb']:<10} {r['aspect_ratio']:<12} {upscale_str}")

print(f"\n{'='*100}")
print(f"SUMMARY:")
print(f"  Total photos: {len(results)}")
print(f"  Already good quality (>={LOW_RES_THRESHOLD}px long side): {good_count}")
print(f"  Requiring upscale (<{LOW_RES_THRESHOLD}px long side): {needs_count}")
print(f"{'='*100}")

# Output as JSON for further processing
with open(os.path.join(PHOTOS_DIR, "inventory.json"), "w") as f:
    json.dump(results, f, indent=2)
print(f"\nJSON inventory saved to: {os.path.join(PHOTOS_DIR, 'inventory.json')}")
