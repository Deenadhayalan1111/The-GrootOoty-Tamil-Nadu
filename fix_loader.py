import os, glob

html_files = glob.glob("*.html")

new_loader = """<!-- Cinematic Loader -->
<div id="cinematic-loader" aria-hidden="true">
  <div class="cinematic-text-wrapper">
    <div class="cinematic-text-main" aria-label="The Groot">
      <span class="c-char" style="--i:0">T</span><span class="c-char" style="--i:1">h</span><span class="c-char" style="--i:2">e</span><span class="c-space">&nbsp;</span><span class="c-char" style="--i:3">G</span><span class="c-char" style="--i:4">r</span><span class="c-char" style="--i:5">o</span><span class="c-char" style="--i:6">o</span><span class="c-char" style="--i:7">t</span>
    </div>
    <div class="cinematic-text-sub" aria-label="Ooty, Tamil Nadu">
      <span class="c-sub-word" style="--w:0">Ooty,</span>
      <span class="c-sub-word" style="--w:1">Tamil</span>
      <span class="c-sub-word" style="--w:2">Nadu</span>
    </div>
  </div>
  <div class="cinematic-light-sweep"></div>
</div>"""

for f in html_files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Simple replace
    import re
    content = re.sub(r"<!-- Cinematic Loader -->.*?</div>\s*</div>\s*</div>", new_loader, content, flags=re.DOTALL)
    
    with open(f, "w", encoding="utf-8") as file:
        file.write(content)
    print(f"Updated {f}")

