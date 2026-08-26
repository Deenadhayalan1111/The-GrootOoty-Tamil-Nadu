import os, glob, re

def fix_content(c):
    # Task 1: Version bump
    c = c.replace('?v=1.7', '?v=1.8')
    
    # Target characters: Both literal '?' and the unicode replacement character \ufffd
    targets = ['?', chr(65533)]
    
    for t in targets:
        # Escape t for regex if it's '?'
        t_re = re.escape(t)
        
        # Navigation
        nav_items = ['Home', 'Stay', 'Experiences', 'Gallery', 'Ooty', 'Reviews', 'Contact']
        for item in nav_items:
            # Matches Home <span>?</span> or Home ?
            c = re.sub(rf'{item}\s*<span>\s*{t_re}\s*</span>', rf'{item} <span class="arrow" aria-hidden="true">&rarr;</span>', c)
            c = re.sub(rf'{item}\s+{t_re}\s+', rf'{item} <span class="arrow" aria-hidden="true">&rarr;</span> ', c)
            
        # Review Stars
        c = re.sub(rf'(?:<span>\s*{t_re}\s*</span>\s*){{5}}', '★ ★ ★ ★ ★', c)
        c = re.sub(rf'(?:{t_re}\s*){{5}}', '★ ★ ★ ★ ★', c)
        
        # Social/Review separators
        c = c.replace(f'Google Reviews {t} ', 'Google Reviews • ')
        c = c.replace(f'Instagram {t} ', 'Instagram • ')
        
        # Copyright
        # Only replace if missing the copyright symbol
        c = re.sub(rf'(?<!©\s)2025 The Groot Ooty', '© 2025 The Groot Ooty', c)
        c = c.replace('© ©', '©')

    # Word separators (word ? word) -> (word — word)
    # We must be careful not to replace legitimate ternary operators or questions.
    # I will specifically target \ufffd for global replacement to a dash where it's spaced
    c = c.replace(f' {chr(65533)} ', ' — ')
    c = c.replace(chr(65533), '—') # Any remaining \ufffd is a dash
    
    return c

for f in glob.glob('*.html') + glob.glob('js/*.js'):
    with open(f, 'r', encoding='utf-8') as file:
        original = file.read()
    updated = fix_content(original)
    if original != updated:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(updated)
        print(f"Fixed {f}")
