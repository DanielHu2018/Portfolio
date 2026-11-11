"""Make web-sized copies of the site's photos and avatar sprites.

The originals in public/assets/ are full-resolution camera files (1-5 MB each). The site
displays them at most ~440 CSS px wide, so this writes copies sized for 3x retina screens to
public/assets/web/ and converts the avatar GIFs to lossless animated WebP (pixel-identical,
much smaller). Re-run it after adding or replacing a photo:

    python scripts/optimize-images.py            # only missing / outdated outputs
    python scripts/optimize-images.py --force    # rebuild everything

Needs Pillow (pip install pillow).
"""
import os
import sys
from PIL import Image, ImageOps, ImageSequence

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'assets')
OUT = os.path.join(ROOT, 'web')
FORCE = '--force' in sys.argv

# Photos: (source file, shortest edge in px, JPEG quality)
PHOTOS = [
    ('photo_of_me.jpg', 1200, 84),
    ('sierra.png', 1000, 90),  # opaque screenshot; 1000px tall = 2154px wide
    ('Baby_Keem_06102026_Columbus.jpeg', 1200, 82),
    ('Glaive_10042026_Columbus.JPG', 1200, 82),
    ('Jane_Remover_09182026_Columbus.JPEG', 1200, 82),
    ('jpegmafia_9202024_Columbus.JPEG', 1200, 82),
    ('Kid_Cudi_09172022_Cleveland.JPG', 1200, 82),
    ('Ninajirachi_099222026_Columbus.JPG', 1200, 82),
    ('slayr_09052026_Columbus.jpg', 1200, 82),
    ('The_Strokes_07142026_Cincinnati.jpg', 1200, 82),
    ('Tiffany_Day_10042026_Columbus.JPEG', 1200, 82),
    ('Wynton_Marsalis_10062026_Columbus.jpeg', 1200, 82),
]


def stale(src, dst):
    return FORCE or not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


def photo(name, short, quality):
    src = os.path.join(ROOT, name)
    dst = os.path.join(OUT, os.path.splitext(name)[0] + '.jpg')
    if not stale(src, dst):
        return
    im = Image.open(src)
    icc = im.info.get('icc_profile')  # keep Display P3 etc. so colors match the original
    im = ImageOps.exif_transpose(im)  # bake in phone rotation, since EXIF is dropped below
    im = im.convert('RGB')
    s = short / min(im.size)
    if s < 1:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    im.save(dst, 'JPEG', quality=quality, optimize=True, progressive=True, icc_profile=icc)
    report(src, dst)


def sprite(name):
    src = os.path.join(ROOT, 'avatar', name)
    dst = os.path.join(OUT, 'avatar', os.path.splitext(name)[0] + '.webp')
    if not stale(src, dst):
        return
    gif = Image.open(src)
    frames, durations = [], []
    for f in ImageSequence.Iterator(gif):
        frames.append(f.convert('RGBA'))
        durations.append(f.info.get('duration', 20))
    frames[0].save(dst, 'WEBP', save_all=True, append_images=frames[1:], duration=durations,
                   loop=gif.info.get('loop', 0), lossless=True, quality=100, method=4)
    report(src, dst)


def report(src, dst):
    a, b = os.path.getsize(src), os.path.getsize(dst)
    print(f'{os.path.relpath(dst, ROOT):48s} {a / 1024:7.0f} KB -> {b / 1024:6.0f} KB')


if __name__ == '__main__':
    os.makedirs(os.path.join(OUT, 'avatar'), exist_ok=True)
    for args in PHOTOS:
        photo(*args)
    for n in sorted(os.listdir(os.path.join(ROOT, 'avatar'))):
        if n.endswith('.gif'):
            sprite(n)
