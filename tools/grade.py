"""Grade a PlatyByte image toward the banner palette.

Maps luminance through a three stop ramp (indigo shadows, magenta mids, amber
highlights), blends that back over the original so the animal stays readable,
then paints the original cyan circuitry back in so it reads as neon, the way
the banner's grid lines do. Alpha is preserved.
"""
import sys, colorsys
from PIL import Image, ImageFilter, ImageEnhance

SHADOW, MID, HIGHLIGHT = '#140b2e', '#c7419a', '#ff9d5c'
BLEND = 0.80          # how much of the graded tritone to mix in
SATURATION = 1.28     # final saturation lift
CYAN_RANGE = (150, 205)
CYAN_MIN_SAT = 0.45   # high enough to skip the cool highlight on the bill
CYAN_MIN_LIGHT = 0.22

def ramp(a, b, c, n=256):
    def hx(s):
        s = s.lstrip('#'); return tuple(int(s[i:i+2], 16) for i in (0, 2, 4))
    a, b, c = hx(a), hx(b), hx(c)
    out = []
    for i in range(n):
        t = i / (n - 1)
        if t < 0.5:
            u = t / 0.5; lo, hi = a, b
        else:
            u = (t - 0.5) / 0.5; lo, hi = b, c
        out.append(tuple(round(lo[k] + (hi[k] - lo[k]) * u) for k in range(3)))
    return out

def grade(src_path, dst_path):
    src = Image.open(src_path)
    alpha = src.getchannel('A') if src.mode in ('RGBA', 'LA') else None
    base = src.convert('RGB')

    lut = ramp(SHADOW, MID, HIGHLIGHT)
    gray = base.convert('L')
    tri = Image.new('RGB', base.size)
    gp, tp = gray.load(), tri.load()
    for y in range(base.size[1]):
        for x in range(base.size[0]):
            tp[x, y] = lut[gp[x, y]]

    out = Image.blend(base, tri, BLEND)

    mask = Image.new('L', base.size, 0)
    bp, mp = base.load(), mask.load()
    lo, hi = CYAN_RANGE
    for y in range(base.size[1]):
        for x in range(base.size[0]):
            r, g, b = bp[x, y]
            hh, ll, ss = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if lo <= hh * 360 <= hi and ss >= CYAN_MIN_SAT and ll >= CYAN_MIN_LIGHT:
                mp[x, y] = 255
    mask = mask.filter(ImageFilter.GaussianBlur(1.4))

    neon = ImageEnhance.Brightness(ImageEnhance.Color(base).enhance(1.8)).enhance(1.14)
    out = Image.composite(neon, out, mask)
    out = ImageEnhance.Color(out).enhance(SATURATION)

    if alpha is not None:
        out = out.convert('RGBA'); out.putalpha(alpha)
    out.save(dst_path)
    print('wrote', dst_path, out.size, out.mode)

if __name__ == '__main__':
    grade(sys.argv[1], sys.argv[2])
