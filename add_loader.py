import os
import glob

html_files = glob.glob('*.html')

loader_html = """<body>
<!-- Cinematic Loader -->
<div id="cinematic-loader" aria-hidden="true">
  <div class="cinematic-text-wrapper">
    <div class="cinematic-text-main">The Groot</div>
    <div class="cinematic-text-sub">Ooty, Tamil Nadu</div>
  </div>
</div>"""

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<div id="cinematic-loader"' not in content:
        content = content.replace('<body>', loader_html)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"Skipped {filepath} (loader already exists)")
