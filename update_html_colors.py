import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the inline style color:var(--color-cream) with color:var(--text-on-image)
    new_content = content.replace('color:var(--color-cream)', 'color:var(--text-on-image)')
    
    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
