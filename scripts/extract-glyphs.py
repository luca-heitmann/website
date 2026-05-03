#!/opt/homebrew/opt/python@3.14/bin/python3.14
"""
Extract "lh" glyph outlines from Dancing Script Bold as SVG path data,
then assemble the favicon.svg and generate PNG icons via rsvg-convert.
"""
import subprocess
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONT_PATH = "scripts/DancingScript-Bold.ttf"
FAVICON_PATH = "static/favicon.svg"
ICON_DIR = "static/icons"

BG_COLOR = "#0e1518"
FG_COLOR = "#7fb086"
VIEWBOX = 32
PADDING = 2.5

font = TTFont(FONT_PATH)
cmap = font.getBestCmap()
hmtx = font["hmtx"].metrics
glyphs = font.getGlyphSet()

l_name = cmap[ord('l')]
h_name = cmap[ord('h')]
l_advance = hmtx[l_name][0]

# --- Compute actual bounding box of the combined "lh" outlines ---
bp_l = BoundsPen(glyphs)
glyphs[l_name].draw(bp_l)
bp_h = BoundsPen(glyphs)
glyphs[h_name].draw(bp_h)

# Merge bounds — h glyph is shifted right by l_advance
bx_min = min(bp_l.bounds[0], bp_h.bounds[0] + l_advance)
by_min = min(bp_l.bounds[1], bp_h.bounds[1])
bx_max = max(bp_l.bounds[2], bp_h.bounds[2] + l_advance)
by_max = max(bp_l.bounds[3], bp_h.bounds[3])

glyph_w = bx_max - bx_min
glyph_h = by_max - by_min

print(f"Glyph bounds: ({bx_min:.0f}, {by_min:.0f}) → ({bx_max:.0f}, {by_max:.0f})")
print(f"Glyph size: {glyph_w:.0f} × {glyph_h:.0f} font units")

# --- Scale to fit padded viewBox, preserving aspect ratio ---
avail = VIEWBOX - 2 * PADDING
scale = min(avail / glyph_w, avail / glyph_h)

render_w = glyph_w * scale
render_h = glyph_h * scale

# Center in viewBox
cx = PADDING + (avail - render_w) / 2
cy = PADDING + (avail - render_h) / 2

print(f"scale: {scale:.4f}, canvas offset: ({cx:.2f}, {cy:.2f})")

def draw_glyph(glyph_name, x_shift=0):
    """Return SVG path string for a glyph, mapped into the 32×32 viewBox."""
    pen = SVGPathPen(glyphs)
    # SVG Y is inverted vs font Y; shift origin so bx_min/by_max maps to top-left
    tx = cx + (x_shift - bx_min) * scale
    ty = cy + by_max * scale          # baseline reference in SVG coords
    transform = (scale, 0, 0, -scale, tx, ty)
    tpen = TransformPen(pen, transform)
    glyphs[glyph_name].draw(tpen)
    # Round all numeric tokens to 3 decimal places for a compact SVG
    import re
    raw = "".join(pen._commands)
    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.3f}", raw)

l_path = draw_glyph(l_name, x_shift=0)
h_path = draw_glyph(h_name, x_shift=l_advance)

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEWBOX} {VIEWBOX}">
  <rect width="{VIEWBOX}" height="{VIEWBOX}" rx="8" fill="{BG_COLOR}"/>
  <g fill="{FG_COLOR}">
    <path d="{l_path}"/>
    <path d="{h_path}"/>
  </g>
</svg>"""

with open(FAVICON_PATH, "w") as f:
    f.write(svg)
print(f"✓ {FAVICON_PATH}")

# Generate PNG icons
for out, size in [
    (f"{ICON_DIR}/pwa-192.png", 192),
    (f"{ICON_DIR}/pwa-512.png", 512),
    (f"{ICON_DIR}/apple-touch-icon.png", 180),
]:
    subprocess.run(
        ["rsvg-convert", "-w", str(size), "-h", str(size), FAVICON_PATH, "-o", out],
        check=True
    )
    print(f"✓ {out}")

print("Done.")
