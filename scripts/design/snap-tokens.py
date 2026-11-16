#!/usr/bin/env python3
"""Snap CSS in src/ to the design tokens (docs: DESIGN.md "Tokens").

Rewrites, in src/styles/*.css and every <style> block in src/**/*.astro:
  spacing (padding, margin, gap)  -> SPACE steps
  font-size                       -> TYPE steps
  font-weight                     -> 400 / 600 / 800
  border-radius                   -> 4px / 8px / 999px
  every colour literal            -> one of five tokens
  box-shadow                      -> rings only (no blurred or offset shadows)
  backdrop-filter                 -> removed
Values inside calc()/clamp()/var()/min()/max() are left alone and reported.
Limits of --check: it only knows the patterns above. It does not see Tailwind classes, named or hsl()
colours, em sizes, custom properties that hold lengths, filter: drop-shadow(), display sizes over 40px,
or a declaration that follows a comment on the same line. The rendered audit (every page, both widths)
is the real test; this is a guard against the common drift.
Run:  python3 scripts/design/snap-tokens.py [--check]
"""
import re, sys, pathlib, colorsys

SPACE = [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96]          # px
TYPE = [14, 16, 18, 22, 28, 36]                            # px
TOK = {'paper': '#FFFFFF', 'ink': '#000000', 'mute': '#595959', 'mark': '#FFF3B0', 'magenta': '#D0106F'}
CHECK = '--check' in sys.argv
report = []

def nearest(v, scale):
    return min(scale, key=lambda s: (abs(s - v), -s))

def rem(px):
    if px == 0: return '0'
    if abs(px) <= 2: return f'{px:g}px'
    return f'{px/16:g}rem'

LEN = re.compile(r'(?<![\w.#-])(-?\d*\.?\d+)(px|rem|em)\b')
FUNC = re.compile(r'\b(calc|clamp|var|min|max|env)\(')

def snap_spacing(val):
    if FUNC.search(val): report.append(('spacing-func', val)); return val
    def f(m):
        n = float(m.group(1)); px = n * (1 if m.group(2) == 'px' else 16)
        if abs(px) <= 1: return m.group(0)
        s = nearest(abs(px), SPACE)
        return rem(-s if px < 0 else s)
    return LEN.sub(f, val)

def snap_font_size(val):
    v = val.replace('!important', '').strip()
    m = re.fullmatch(r'(\d*\.?\d+)(px|rem)', v)
    if not m: report.append(('font-size-kept', val)); return val
    px = float(m.group(1)) * (1 if m.group(2) == 'px' else 16)
    if px > 40: report.append(('font-size-display', val)); return val
    return val.replace(v, f'{nearest(px, TYPE)/16:g}rem')

HEAD = {14: 14, 15: 16, 16: 16, 17: 18, 18: 18, 19: 18, 20: 22, 21: 22, 22: 22, 24: 22, 26: 28, 28: 28, 30: 28, 32: 28, 36: 36}

def snap_font(val):
    """`font: <weight> <size>/<line-height> <family>` shorthand."""
    m = re.match(r'\s*(\d{3})\s+(clamp\([^/]*\)|[\d.]+(?:rem|px))(\s*/\s*[\d.]+)?(\s+.*)$', val, re.S)
    if not m: return val
    w, size, lh, fam = m.groups()
    n = int(w); w = 400 if n <= 450 else 600 if n <= 700 else 800
    if size.startswith('clamp'):
        if 'var(' in size: report.append(('font-display', size))
        else: size = '2.25rem'
    else:
        px = round(float(size[:-3]) * 16) if size.endswith('rem') else round(float(size[:-2]))
        if px <= 40: size = f'{HEAD.get(px, nearest(px, TYPE))/16:g}rem'
        else: report.append(('font-display', size))
    return f'{w} {size}{lh or ""}{fam}'

def snap_weight(val):
    m = re.fullmatch(r'\s*(\d{3})\s*(!important)?\s*', val)
    if not m: return val
    n = int(m.group(1)); w = 400 if n <= 450 else 600 if n <= 700 else 800
    return val.replace(m.group(1), str(w))

def snap_radius(val):
    if FUNC.search(val): return val
    def f(m):
        px = float(m.group(1)) * (1 if m.group(2) == 'px' else 16)
        if px == 0: return '0'
        if px >= 99: return '999px'
        return '4px' if px <= 4 else '8px'
    return LEN.sub(f, val)

def classify(r, g, b, a=1.0):
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    if a < 1:
        if l > 0.9: return 'paper'
        if s < 0.2: return 'mute' if a <= 0.65 else 'ink'
    if s > 0.45 and 0.25 < l < 0.75 and (h > 0.86 or h < 0.02):
        return 'magenta' if l > 0.38 and h > 0.86 else 'ink'   # deep magenta and red become ink
    if s > 0.25 and l >= 0.75: return 'mark' if 0.11 < h < 0.2 else 'paper'   # yellow is the mark; other pastels go
    if s > 0.25: return 'mute' if l > 0.3 else 'ink'           # ochres etc.
    if l >= 0.86: return 'paper'
    if l >= 0.25: return 'mute'
    return 'ink'

HEX = re.compile(r'#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b')
RGB = re.compile(r'rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)')

def snap_colors(val):
    def fh(m):
        h = m.group(1)
        if len(h) in (3, 4): h = ''.join(c*2 for c in h)
        a = int(h[6:8], 16)/255 if len(h) == 8 else 1
        return f'var(--{classify(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), a)})'
    def fr(m):
        a = m.group(4); a = 1.0 if a is None else (float(a[:-1])/100 if a.endswith('%') else float(a))
        if a == 0: return 'transparent'
        return f'var(--{classify(int(m.group(1)), int(m.group(2)), int(m.group(3)), a)})'
    return RGB.sub(fr, HEX.sub(fh, val))

def split_top(s):
    out, d, cur = [], 0, ''
    for ch in s:
        if ch == '(': d += 1
        if ch == ')': d -= 1
        if ch == ',' and d == 0: out.append(cur); cur = ''
        else: cur += ch
    out.append(cur); return out

def snap_shadow(val):
    imp = ' !important' if '!important' in val else ''
    v = val.replace('!important', '').strip()
    if v in ('none', 'inherit', 'initial', 'unset') or v.startswith('var('): return val
    keep = []
    for layer in split_top(v):
        nums = re.findall(r'(?<![\w#(-])(-?\d*\.?\d+)(?:px|rem|em)?(?![\w%)])', re.sub(r'(var|rgba?)\([^)]*\)', '', layer))
        nums = [float(n) for n in nums][:4] + [0, 0, 0, 0]
        x, y, blur = nums[0], nums[1], nums[2]
        if blur == 0 and (('inset' in layer) or (x == 0 and y == 0) or abs(x) + abs(y) <= 2): keep.append(layer.strip())
    return (', '.join(keep) if keep else 'none') + imp

SPACING_PROPS = re.compile(r'^(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(row-|column-)?gap$')
DECL = re.compile(r'(?P<pre>(?:^|[;{])\s*)(?P<prop>--[\w-]+|[a-z-]+)(?P<colon>\s*:\s*)(?P<val>[^;{}]+?)(?P<end>\s*(?=[;}]))', re.M)

def transform_css(css):
    def f(m):
        prop, val = m.group('prop'), m.group('val')
        if prop in ('--paper', '--ink', '--mute', '--mark', '--magenta'): return m.group(0)
        if val.lstrip().startswith(('url(', '"', "'")) and 'gradient' not in val: return m.group(0)
        new = val
        if SPACING_PROPS.match(prop): new = snap_spacing(new)
        elif prop == 'font-size': new = snap_font_size(new)
        elif prop == 'font-weight': new = snap_weight(new)
        elif prop == 'font': new = snap_font(new)
        elif prop.startswith('border') and prop.endswith('radius'): new = snap_radius(new)
        elif prop == 'box-shadow': new = snap_shadow(new)
        elif prop in ('backdrop-filter', '-webkit-backdrop-filter'): new = 'none'
        if prop not in ('content',): new = snap_colors(new)
        if 'gradient' in new: report.append(('gradient', new))
        return m.group('pre') + prop + m.group('colon') + new + m.group('end')
    return DECL.sub(f, css)

root = pathlib.Path('src'); changed = 0
STYLE = re.compile(r'(<style\b[^>]*>)(.*?)(</style>)', re.S)
for p in sorted(list(root.rglob('*.css')) + list(root.rglob('*.astro'))):
    src = p.read_text(encoding='utf-8')
    out = transform_css(src) if p.suffix == '.css' else STYLE.sub(lambda m: m.group(1) + transform_css(m.group(2)) + m.group(3), src)
    if out != src:
        changed += 1
        if not CHECK: p.write_text(out, encoding='utf-8')
print(('would change' if CHECK else 'changed'), changed, 'files')
from collections import Counter
for (k, v), n in Counter(report).most_common(60): print(f'  {k}: {v.strip()[:110]}  x{n}')
if CHECK and changed: sys.exit(1)
