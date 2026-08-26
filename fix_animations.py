import re

with open("css/animations.css", "r", encoding="utf-8") as f:
    content = f.read()

with open("loader.css", "r", encoding="utf-8") as f:
    loader_css = f.read()

# Replace everything from /* ==== CINEMATIC LOADER to the end of the file
content = re.sub(r"/\* =+?[\n\r\s]*CINEMATIC LOADER.*", loader_css, content, flags=re.DOTALL)

with open("css/animations.css", "w", encoding="utf-8") as f:
    f.write(content)

