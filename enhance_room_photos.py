import os
import shutil
import cv2
import numpy as np
from PIL import Image

SOURCE_DIR = r"C:\Users\deena\OneDrive\Desktop\photos"
ASSETS_DIR = r"C:\Users\deena\OneDrive\Desktop\temp\assets\images"
BACKUP_DIR = os.path.join(ASSETS_DIR, "originals_backup")
os.makedirs(BACKUP_DIR, exist_ok=True)

ROOM_TARGETS = [
    {
        "id": "aframe",
        "name": "A-Frame Room",
        "filename": "1000032836_professional.webp",
        "out_filename": "1000032836_professional_4k.webp",
        "shadow_boost": 0.16,
        "highlight_recovery": 0.08,
        "clahe_clip": 1.2,
        "warmth_adjust": 1.02, # subtle natural warm wood tone
        "struct_sharp_amt": 0.40,
        "micro_sharp_amt": 0.30
    },
    {
        "id": "glasshouse",
        "name": "Glass House",
        "filename": "1000032837_professional.webp",
        "out_filename": "1000032837_professional_4k.webp",
        "shadow_boost": 0.18,
        "highlight_recovery": 0.10,
        "clahe_clip": 1.25,
        "warmth_adjust": 1.01,
        "struct_sharp_amt": 0.42,
        "micro_sharp_amt": 0.32
    },
    {
        "id": "suite",
        "name": "Luxurious Suite",
        "filename": "1000032838_professional.webp",
        "out_filename": "1000032838_professional_4k.webp",
        "shadow_boost": 0.14,
        "highlight_recovery": 0.12,
        "clahe_clip": 1.2,
        "warmth_adjust": 1.02,
        "struct_sharp_amt": 0.40,
        "micro_sharp_amt": 0.30
    },
    {
        "id": "standard",
        "name": "Standard Room",
        "filename": "1000032839_professional.webp",
        "out_filename": "1000032839_professional_4k.webp",
        "shadow_boost": 0.18,
        "highlight_recovery": 0.22, # High highlight recovery for blown window
        "clahe_clip": 1.15,
        "warmth_adjust": 1.02,
        "struct_sharp_amt": 0.38,
        "micro_sharp_amt": 0.28
    }
]

TARGET_LONG_SIDE = 3840

def enhance_and_upscale_photo(target_info):
    fname = target_info["filename"]
    out_fname = target_info["out_filename"]
    
    # Locate source file
    src_path = os.path.join(SOURCE_DIR, fname)
    if not os.path.exists(src_path):
        src_path = os.path.join(ASSETS_DIR, fname)
    if not os.path.exists(src_path):
        raise FileNotFoundError(f"Cannot find source {fname}")
        
    print(f"\n========================================================")
    print(f"Processing: {target_info['name']} ({fname})")
    print(f"Source: {src_path}")
    
    # 1. Backup original
    backup_path = os.path.join(BACKUP_DIR, fname)
    if not os.path.exists(backup_path):
        shutil.copy2(src_path, backup_path)
        print(f"  -> Backed up original to: {backup_path}")
    
    # 2. Load with PIL / convert to NumPy RGB float
    with Image.open(src_path) as pil_img:
        orig_w, orig_h = pil_img.size
        img_rgb = np.array(pil_img.convert("RGB")).astype(np.float32) / 255.0

    print(f"  -> Original dimensions: {orig_w}x{orig_h}")

    # 3. Color Space Conversion to LAB for clean separation of luminance & chrominance
    # Convert RGB float to uint8 for OpenCV cvtColor
    img_bgr = cv2.cvtColor((img_rgb * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    
    L = lab[:, :, 0]  # 0 to 255
    A = lab[:, :, 1]  # 0 to 255 (128 is neutral)
    B = lab[:, :, 2]  # 0 to 255 (128 is neutral)

    # 4. Photographic Lighting & Tone Curve
    # A. Controlled Shadow Lift:
    # L_norm: 0 to 1
    L_norm = L / 255.0
    shadow_weight = np.clip((1.0 - L_norm) ** 2.0, 0.0, 1.0)
    shadow_lift = target_info["shadow_boost"] * shadow_weight * L_norm * 255.0
    
    # B. Highlight Recovery / Soft compression:
    highlight_weight = np.clip((L_norm - 0.70) / 0.30, 0.0, 1.0)
    highlight_compression = target_info["highlight_recovery"] * (highlight_weight ** 1.8) * 35.0
    
    L_adjusted = np.clip(L + shadow_lift - highlight_compression, 0.0, 255.0).astype(np.uint8)

    # C. Natural Micro-Contrast via subtle CLAHE on Luminance
    clahe = cv2.createCLAHE(
        clipLimit=target_info["clahe_clip"],
        tileGridSize=(8, 8)
    )
    L_enhanced = clahe.apply(L_adjusted).astype(np.float32)

    # Blend 80% enhanced with 20% adjusted for ultra-natural roll-off
    L_final = np.clip(0.80 * L_enhanced + 0.20 * L_adjusted.astype(np.float32), 0.0, 255.0)

    # D. Color Balance & Natural Warmth
    # Gently nudge B channel (blue-yellow axis) for cozy warm wood feel while preserving neutral whites
    B_offset = (target_info["warmth_adjust"] - 1.0) * (B - 128.0)
    B_final = np.clip(B + B_offset, 0.0, 255.0)
    A_final = A

    lab_enhanced = np.dstack([L_final, A_final, B_final]).astype(np.uint8)
    enhanced_bgr = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
    enhanced_rgb = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)

    # 5. 4K Precision Upscaling with Lanczos-4
    # Calculate target dimensions preserving exact aspect ratio
    scale = TARGET_LONG_SIDE / float(max(orig_w, orig_h))
    target_w = round(orig_w * scale)
    target_h = round(orig_h * scale)
    # Ensure even dimensions
    target_w = target_w if target_w % 2 == 0 else target_w + 1
    target_h = target_h if target_h % 2 == 0 else target_h + 1

    print(f"  -> 4K Target Dimensions: {target_w}x{target_h} (scale factor: {scale:.3f}x)")

    upscaled = cv2.resize(enhanced_rgb, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

    # 6. Intelligent Dual-Scale Photographic Sharpening
    # Scale 1: Structural sharpness (edges, architectural beams, window frames)
    blur_struct = cv2.GaussianBlur(upscaled, (0, 0), sigmaX=1.8, sigmaY=1.8)
    struct_mask = upscaled.astype(np.float32) - blur_struct.astype(np.float32)
    
    # Scale 2: Micro-texture (wood grain, linen weave, bedding texture)
    blur_micro = cv2.GaussianBlur(upscaled, (0, 0), sigmaX=0.8, sigmaY=0.8)
    micro_mask = upscaled.astype(np.float32) - blur_micro.astype(np.float32)
    # Apply soft threshold to micro mask to avoid amplifying noise
    micro_mask_thresholded = np.where(np.abs(micro_mask) < 1.5, 0.0, micro_mask)

    sharpened = upscaled.astype(np.float32) + \
                target_info["struct_sharp_amt"] * struct_mask + \
                target_info["micro_sharp_amt"] * micro_mask_thresholded
                
    sharpened_clipped = np.clip(sharpened, 0.0, 255.0).astype(np.uint8)

    # 7. Save 4K Master WebP
    out_path = os.path.join(ASSETS_DIR, out_fname)
    final_pil = Image.fromarray(sharpened_clipped)
    final_pil.save(out_path, "WEBP", quality=96, method=6)
    
    out_size = os.path.getsize(out_path)
    print(f"  -> Saved 4K Enhanced: {out_path} ({out_size:,} bytes, {out_size/1024:.1f} KB)")
    
    return {
        "name": target_info["name"],
        "orig_dims": f"{orig_w}x{orig_h}",
        "new_dims": f"{target_w}x{target_h}",
        "file_size_kb": round(out_size / 1024, 1),
        "output_path": out_path
    }

if __name__ == "__main__":
    results = []
    for target in ROOM_TARGETS:
        res = enhance_and_upscale_photo(target)
        results.append(res)
        
    print("\n========================================================")
    print("ALL 4 ROOM SHOWCASE PHOTOS SUCCESSFULLY ENHANCED TO 4K:")
    for r in results:
        print(f"  * {r['name']:<18}: {r['orig_dims']} -> {r['new_dims']} ({r['file_size_kb']} KB)")
    print("========================================================\n")
