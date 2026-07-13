#!/usr/bin/env python3
"""
Compress images/ to WebP for fast page loads, keeping full-resolution
originals backed up under images/originals/ (committed to git), and
rewriting the images/*.jpg / images/*.png references in the site's HTML
files to point at the new .webp files.

Run this any time you add or replace photos in images/:

    python scripts/compress_images.py

Already-compressed images (ones that already have a .webp next to them)
are skipped on future runs. Pass --force to recompress everything, e.g.
after changing --quality or --max-dim.

Requires Pillow: python -m pip install Pillow
"""

import argparse
import shutil
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "images"
ORIGINALS_DIR = IMAGES_DIR / "originals"
SOURCE_EXTS = {".jpg", ".jpeg", ".png"}

# Small flat-color graphics (logos, icons) are kept lossless so text/edges
# stay crisp; everything above this is treated as a photo and compressed
# lossily.
SMALL_GRAPHIC_MAX_DIM = 800


def iter_source_images():
    for path in IMAGES_DIR.rglob("*"):
        if path.is_dir() or ORIGINALS_DIR in path.parents:
            continue
        if path.suffix.lower() in SOURCE_EXTS:
            yield path


def compress_one(path, max_dim, quality, force):
    rel = path.relative_to(IMAGES_DIR)
    backup_path = ORIGINALS_DIR / rel
    webp_path = path.with_suffix(".webp")

    if webp_path.exists() and not force:
        return None

    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, backup_path)

    im = Image.open(backup_path)
    im = ImageOps.exif_transpose(im)

    if im.mode == "P":
        im = im.convert("RGBA")
    elif im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")

    is_small_graphic = max(im.size) <= SMALL_GRAPHIC_MAX_DIM
    if not is_small_graphic and max(im.size) > max_dim:
        ratio = max_dim / max(im.size)
        new_size = (round(im.width * ratio), round(im.height * ratio))
        im = im.resize(new_size, Image.LANCZOS)

    save_kwargs = {"format": "WEBP"}
    if is_small_graphic:
        save_kwargs["lossless"] = True
    else:
        save_kwargs["quality"] = quality
        save_kwargs["method"] = 6

    im.save(webp_path, **save_kwargs)
    path.unlink()

    return rel, backup_path.stat().st_size, webp_path.stat().st_size


def update_html_references(renamed):
    for html_path in ROOT.glob("*.html"):
        text = html_path.read_text(encoding="utf-8")
        updated = text
        for old, new in renamed.items():
            updated = updated.replace(f"images/{old}", f"images/{new}")
        if updated != text:
            html_path.write_text(updated, encoding="utf-8")
            print(f"  updated references in {html_path.name}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--force", action="store_true", help="recompress even if a .webp already exists")
    parser.add_argument("--max-dim", type=int, default=2000, help="max width/height in px for photos (default 2000)")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality 1-100 for photos (default 82)")
    args = parser.parse_args()

    ORIGINALS_DIR.mkdir(parents=True, exist_ok=True)

    sources = sorted(iter_source_images())

    # Guard against e.g. foo.jpg and foo.png sitting side by side: both would
    # collapse onto the same foo.webp, so silently processing one and
    # skipping the other can leave a real, referenced image uncompressed.
    by_target = {}
    for path in sources:
        by_target.setdefault(path.with_suffix(".webp"), []).append(path)
    collisions = {target: paths for target, paths in by_target.items() if len(paths) > 1}
    if collisions:
        print("ERROR: multiple source images would produce the same .webp file. Remove the unused duplicate(s) and re-run:")
        for target, paths in collisions.items():
            names = ", ".join(str(p.relative_to(IMAGES_DIR)) for p in paths)
            print(f"  {target.relative_to(IMAGES_DIR)}  <-  {names}")
        raise SystemExit(1)

    renamed = {}
    total_old = total_new = processed = 0

    for path in sources:
        result = compress_one(path, args.max_dim, args.quality, args.force)
        if result is None:
            continue
        rel, old_size, new_size = result
        old_rel = rel.as_posix()
        new_rel = rel.with_suffix(".webp").as_posix()
        renamed[old_rel] = new_rel
        total_old += old_size
        total_new += new_size
        processed += 1
        print(f"  {old_rel} -> {new_rel}  ({old_size / 1024:.0f} KB -> {new_size / 1024:.0f} KB)")

    if renamed:
        print("\nUpdating HTML references...")
        update_html_references(renamed)

    if processed:
        print(f"\nProcessed {processed} images.")
        print(f"Total size before: {total_old / 1024 / 1024:.1f} MB")
        print(f"Total size after:  {total_new / 1024 / 1024:.1f} MB")
        print(f"Saved: {(total_old - total_new) / 1024 / 1024:.1f} MB ({(1 - total_new / total_old) * 100:.0f}%)")
    else:
        print("Nothing to do -- all images already have a .webp. Use --force to recompress.")


if __name__ == "__main__":
    main()
