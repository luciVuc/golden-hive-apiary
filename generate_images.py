#!/usr/bin/env python3
"""Generate product images for CS Regus Apiary"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

OUTPUT_DIR = "/home/user/Documents/Dev/github/cs-regus-apiary/public/images/products"
THUMB_DIR = OUTPUT_DIR

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)

def create_gradient(size, color1, color2):
    """Create a radial gradient"""
    img = Image.new('RGB', size)
    draw = ImageDraw.Draw(img)
    
    w, h = size
    for y in range(h):
        for x in range(w):
            dist = ((x - w/2)**2 + (y - h/2)**2)**0.5 / ((w**2 + h**2)**0.5)
            ratio = max(0, 1 - dist * 1.5)
            
            r = int(color1[0] * ratio + color2[0] * (1 - ratio))
            g = int(color1[1] * ratio + color2[1] * (1 - ratio))
            b = int(color1[2] * ratio + color2[2] * (1 - ratio))
            draw.point((x, y), (r, g, b))
    
    return img

def create_honey_jar(size, honey_color, label_text, subtext=""):
    """Create a honey jar image"""
    w, h = size
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Background gradient circle (soft glow)
    cx, cy = w // 2, h // 2
    radius = min(w, h) // 2 - 10
    
    # Draw jar body (rounded rectangle approximation using ellipse)
    jar_body = (w//4, h//6, 3*w//4, 5*h//6)
    draw.ellipse(jar_body, fill=honey_color)
    draw.rectangle((w//4+5, h//6, 3*w//4-5, 5*h//6), fill=honey_color)
    
    # Jar lid (gold/brown)
    lid_color = (180, 150, 80)
    lid_rect = (w//4 + 5, h//6 - 8, 3*w//4 - 5, h//6 + 10)
    draw.rectangle(lid_rect, fill=lid_color, outline=(140, 120, 60), width=2)
    
    # Lid shine
    draw.line((w//4 + 15, h//6, w//2 - 10, h//6), fill=(220, 200, 150), width=3)
    
    # Label
    label_w = w // 2
    label_h = h // 4
    label_x = (w - label_w) // 2
    label_y = h // 2 - 5
    draw.rectangle((label_x, label_y, label_x + label_w, label_y + label_h), 
                fill=(255, 250, 240), outline=(180, 170, 150), width=1)
    
    # Label text
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", min(14, h//10))
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", min(10, h//14))
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Center text
    def draw_centered_text(draw_obj, text, y_pos, font, color=(60, 50, 40)):
        bbox = draw_obj.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        x = (w - text_w) // 2
        draw_obj.text((x, y_pos), text, fill=color, font=font)
    
    draw_centered_text(draw, label_text, label_y + 5, font_large)
    if subtext:
        draw_centered_text(draw, subtext, label_y + label_h - 12, font_small)
    
    # Glass reflection
    reflection_color = (255, 255, 255, 60)
    draw.polygon([(w//4 + 20, h//3), (w//4 + 10, h//3), (w//4 + 15, 3*h//5)], 
               fill=reflection_color)
    
    return img

def create_lip_balm_set(size):
    """Create lip balm set image"""
    w, h = size
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    tube_color = (245, 235, 220)
    cap_color = (180, 140, 80)
    
    # Draw 4 small tubes horizontally
    tube_w, tube_h = w // 5, h // 2
    spacing = w // 8
    
    for i in range(4):
        x = spacing + i * (tube_w + 10)
        y = h // 4
        
        # Tube body
        draw.ellipse((x, y, x + tube_w, y + tube_h), fill=tube_color, outline=(200, 190, 170))
        
        # Cap
        cap_w = tube_w
        cap_h = tube_h // 3
        draw.ellipse((x, y - cap_h, x + cap_w, y), fill=cap_color)
        draw.line((x, y - cap_h, x + cap_w, y - cap_h), fill=(160, 120, 60), width=2)
    
    # Label at bottom
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", min(12, h//8))
    except:
        font = ImageFont.load_default()
    
    text = "Lip Balm Set"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, 3*h//4), text, fill=(80, 60, 40), font=font)
    
    return img

def create_candles(size):
    """Create beeswax candles image"""
    w, h = size
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    candle_color = (255, 220, 80)
    wick_color = (60, 40, 20)
    
    # Draw 4 candles in a cluster
    positions = [(w//4, h//3), (w//2, h//2 + 10), (3*w//4, h//3), (w//2, h//5)]
    sizes = [30, 35, 28, 32]
    
    for (cx, cy), r in zip(positions, sizes):
        # Candle body (vertical ellipse)
        draw.ellipse((cx - r, cy - r//2, cx + r, cy + r + 20), fill=candle_color)
        
        # Wick
        draw.line((cx, cy - r//2 - 5, cx, cy - r//2 - 15), fill=wick_color, width=2)
        
        # Flame
        flame_color = (255, 200, 50, 200)
        draw.ellipse((cx - 5, cy - r//2 - 20, cx + 5, cy - r//2 - 8), fill=flame_color)
    
    # Label
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", min(12, h//8))
    except:
        font = ImageFont.load_default()
    
    text = "Beeswax Candles"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, 4*h//5), text, fill=(80, 60, 40), font=font)
    
    return img

def create_gift_box(size, is_premium=False):
    """Create gift box image"""
    w, h = size
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    if is_premium:
        # Wooden box look
        box_color = (120, 80, 50)
        ribbon_color = (180, 140, 70)
    else:
        # Kraft paper box
        box_color = (210, 180, 140)
        ribbon_color = (200, 100, 80)
    
    # Box body (3D perspective)
    box_left, box_top = w//6, h//4
    box_right, box_bottom = 5*w//6, 5*h//6
    
    draw.rectangle((box_left, box_top, box_right, box_bottom), fill=box_color, outline=(80, 50, 30), width=2)
    
    # Ribbon
    ribbon_w = 15
    draw.rectangle((w//2 - ribbon_w//2, box_top, w//2 + ribbon_w//2, box_bottom), fill=ribbon_color)
    draw.rectangle((box_left, h//2 - ribbon_w//2, box_right, h//2 + ribbon_w//2), fill=ribbon_color)
    
    # Label
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", min(14, h//8))
    except:
        font = ImageFont.load_default()
    
    if is_premium:
        text = "Premium Collection"
    else:
        text = "Honey Gift Set"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, 3*h//4), text, fill=(255, 250, 240), font=font)
    
    return img

def create_subscription(size):
    """Create subscription box image"""
    w, h = size
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Box/package
    box_color = (255, 250, 240)
    accent_color = (255, 180, 50)
    
    box_left, box_top = w//5, h//5
    box_right, box_bottom = 4*w//5, 4*h//5
    
    draw.rectangle((box_left, box_top, box_right, box_bottom), fill=box_color, outline=(200, 180, 150), width=3)
    
    # Monthly badge
    badge_r = 35
    draw.ellipse((w//2 - badge_r, h//2 - badge_r, w//2 + badge_r, h//2 + badge_r), fill=accent_color)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", min(12, h//10))
    except:
        font = ImageFont.load_default()
    
    text = "Monthly"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, h//2 - 6), text, fill=(255, 255, 255), font=font)
    
    # Label below
    try:
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", min(10, h//12))
    except:
        font_small = ImageFont.load_default()
    
    subtext = "Honey Club"
    bbox = draw.textbbox((0, 0), subtext, font=font_small)
    text_w = bbox[2] - bbox[0]
    draw.text(((w - text_w) // 2, 4*h//5), subtext, fill=(80, 60, 40), font=font_small)
    
    return img

# Product definitions
products = [
    {
        "name": "wildflower",
        "jar_label": "Wildflower",
        "jar_sub": "Raw Honey",
        "color": (255, 200, 50),
        "type": "jar"
    },
    {
        "name": "clover", 
        "jar_label": "Clover",
        "jar_sub": "Blossom Honey",
        "color": (255, 220, 100),
        "type": "jar"
    },
    {
        "name": "buckwheat",
        "jar_label": "Buckwheat",
        "jar_sub": "Dark Honey",
        "color": (180, 100, 40),
        "type": "jar"
    },
    {"name": "lip-balm", "type": "balm"},
    {"name": "candles", "type": "candles"},
    {"name": "gift-junior", "type": "gift", "premium": False},
    {"name": "gift-premium", "type": "gift", "premium": True},
    {"name": "subscription", "type": "subscription"},
]

def create_gradient_bg(size):
    """Create nice gradient background"""
    w, h = size
    img = Image.new('RGB', size, (255, 252, 245))
    draw = ImageDraw.Draw(img)
    
    # Subtle radial gradient from center
    for y in range(h):
        for x in range(w):
            dist = ((x - w/2)**2 + (y - h/2)**2)**0.5 / ((w**2 + h**2)**0.5)
            ratio = int(max(0, 255 - dist * 100))
            draw.point((x, y), (255, ratio + 245, ratio + 240))
    
    return img

# Generate all images
print("Generating product images...")

for i, prod in enumerate(products):
    size = (600, 600)
    thumb_size = (300, 300)
    prod_type = prod.get("type", "jar")
    
    if prod_type == "jar":
        # Honey jar
        img = create_honey_jar(size, prod["color"], prod["jar_label"], prod.get("jar_sub"))
        thumb = img.resize(thumb_size, Image.Resampling.LANCZOS)
    elif prod_type == "balm":
        img = create_lip_balm_set(size)
        thumb = img.resize(thumb_size, Image.Resampling.LANCZOS)
    elif prod_type == "candles":
        img = create_candles(size)
        thumb = img.resize(thumb_size, Image.Resampling.LANCZOS)
    elif prod_type == "gift":
        img = create_gift_box(size, prod.get("premium", False))
        thumb = img.resize(thumb_size, Image.Resampling.LANCZOS)
    elif prod_type == "subscription":
        img = create_subscription(size)
        thumb = img.resize(thumb_size, Image.Resampling.LANCZOS)
    else:
        continue
    
    # Save with white background
    bg = Image.new('RGBA', size, (255, 255, 255, 255))
    bg.paste(img, (0, 0), img)
    
    bg_thumb = Image.new('RGBA', thumb_size, (255, 255, 255, 255))
    bg_thumb.paste(thumb, (0, 0), thumb)
    
    # Save images
    img_path = os.path.join(OUTPUT_DIR, f"{prod['name']}.png")
    thumb_path = os.path.join(THUMB_DIR, f"{prod['name']}-thumb.png")
    
    bg.save(img_path, "PNG")
    bg_thumb.save(thumb_path, "PNG")
    
    print(f"  Created {prod['name']}.png and {prod['name']}-thumb.png")

print("Done!")