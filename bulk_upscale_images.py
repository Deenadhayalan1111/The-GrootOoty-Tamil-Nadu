import os
import shutil
import cv2
import numpy as np
from PIL import Image

ASSETS_DIR = r"C:\Users\deena\OneDrive\Desktop\temp\assets\images"
BACKUP_DIR = os.path.join(ASSETS_DIR, "originals_backup")
os.makedirs(BACKUP_DIR, exist_ok=True)

TARGET_LONG_SIDE = 3840

def enhance_and_upscale_photo(fname):
    src_path = os.path.join(ASSETS_DIR, fname)
    if not os.path.exists(src_path):
        return None
        
    print(f"\n========================================================")
    print(f"Processing: {fname}")
    
    # Check if it's already an upscaled file we should skip
    if "_4k" in fname.lower():
        print("  -> Skipping (already 4k)")
        return None
        
    # 1. Backup original
    backup_path = os.path.join(BACKUP_DIR, fname)
    if not os.path.exists(backup_path):
        shutil.copy2(src_path, backup_path)
        print(f"  -> Backed up original to: {backup_path}")
        
    # Determine base name for output
    base_name = os.path.splitext(fname)[0]
    out_fname = f"{base_name}_4k.webp"
    out_path = os.path.join(ASSETS_DIR, out_fname)
    
    # Skip if output already exists
    if os.path.exists(out_path):
        print(f"  -> Output already exists: {out_fname}")
        return None
    
    # 2. Load with PIL / convert to NumPy RGB float
    try:
        with Image.open(src_path) as pil_img:
            if pil_img.mode != 'RGB':
                pil_img = pil_img.convert('RGB')
            orig_w, orig_h = pil_img.size
            
            # If the original is already huge, don't upscale it much or just sharpen
            if max(orig_w, orig_h) >= 3000:
                print(f"  -> Image already high-res ({orig_w}x{orig_h}). Will only enhance.")
                target_w, target_h = orig_w, orig_h
            else:
                scale = TARGET_LONG_SIDE / float(max(orig_w, orig_h))
                target_w = round(orig_w * scale)
                target_h = round(orig_h * scale)
                
            img_rgb = np.array(pil_img).astype(np.float32) / 255.0
            
    except Exception as e:
        print(f"  -> Failed to open {fname}: {e}")
        return None

    # Ensure even dimensions
    target_w = target_w if target_w % 2 == 0 else target_w + 1
    target_h = target_h if target_h % 2 == 0 else target_h + 1

    # 3. Micro-Contrast Enhancement via LAB color space
    img_bgr = cv2.cvtColor((img_rgb * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    
    # Apply mild CLAHE to luminance for clarity
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.2, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l)
    
    # Blend back slightly for natural look (70% original, 30% enhanced)
    l_final = cv2.addWeighted(l, 0.7, l_enhanced, 0.3, 0)
    
    lab_enhanced = cv2.merge((l_final, a, b))
    enhanced_bgr = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
    enhanced_rgb = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)

    # 4. 4K Upscaling with Lanczos-4
    if (orig_w, orig_h) != (target_w, target_h):
        upscaled = cv2.resize(enhanced_rgb, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    else:
        upscaled = enhanced_rgb

    # 5. Dual-Scale Photographic Sharpening
    # Structural sharpness (edges)
    blur_struct = cv2.GaussianBlur(upscaled, (0, 0), sigmaX=1.5, sigmaY=1.5)
    struct_mask = upscaled.astype(np.float32) - blur_struct.astype(np.float32)
    
    # Micro-texture
    blur_micro = cv2.GaussianBlur(upscaled, (0, 0), sigmaX=0.6, sigmaY=0.6)
    micro_mask = upscaled.astype(np.float32) - blur_micro.astype(np.float32)
    
    # Threshold micro mask to avoid noise amplification
    micro_mask_thresholded = np.where(np.abs(micro_mask) < 2.0, 0.0, micro_mask)

    sharpened = upscaled.astype(np.float32) + (0.35 * struct_mask) + (0.20 * micro_mask_thresholded)
    sharpened_clipped = np.clip(sharpened, 0.0, 255.0).astype(np.uint8)

    # 6. Save as high-quality WebP
    final_pil = Image.fromarray(sharpened_clipped)
    final_pil.save(out_path, "WEBP", quality=95, method=6)
    
    out_size = os.path.getsize(out_path)
    print(f"  -> Saved Enhanced: {out_fname} ({target_w}x{target_h}, {out_size/1024:.1f} KB)")
    
    return {
        "orig": fname,
        "new": out_fname
    }

if __name__ == "__main__":
    valid_exts = {".jpg", ".jpeg", ".png", ".webp"}
    results = []
    
    for fname in os.listdir(ASSETS_DIR):
        if os.path.isfile(os.path.join(ASSETS_DIR, fname)):
            ext = os.path.splitext(fname)[1].lower()
            if ext in valid_exts:
                res = enhance_and_upscale_photo(fname)
                if res:
                    results.append(res)
                    
    print("\nProcessed total files:", len(results))
