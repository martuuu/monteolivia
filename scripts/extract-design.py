#!/usr/bin/env python3
"""Extrae el HTML legible y los assets de los bundles de Claude Design.

  python3 -I scripts/extract-design.py   →  design/extracted/<pagina>/template.html + assets

Los .dc.html empaquetan todo en <script type="__bundler/manifest"> (base64) y
<script type="__bundler/template"> (HTML con estilos inline y la clase DCLogic con datos y lógica).
"""
import base64, gzip, json, os, re, sys, zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'design')
OUT = os.path.join(SRC, 'extracted')
EXT = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/avif': 'avif', 'image/webp': 'webp', 'image/svg+xml': 'svg',
       'text/javascript': 'js', 'application/javascript': 'js', 'font/woff2': 'woff2'}

for fn in sorted(os.listdir(SRC)):
    if not fn.endswith('.dc.html'):
        continue
    slug = re.sub(r'[^a-z0-9]+', '-', fn.replace('Monte Olivia - ', '').replace('.dc.html', '').lower()).strip('-')
    out = os.path.join(OUT, slug)
    os.makedirs(out, exist_ok=True)
    html = open(os.path.join(SRC, fn), encoding='utf-8').read()

    def block(t):
        m = re.search(r'<script type="__bundler/%s">\n?(.*?)\n?\s*</script>' % re.escape(t), html, re.S)
        return m.group(1) if m else None

    manifest = json.loads(block('manifest'))
    template = json.loads(block('template'))
    names = {}
    for uuid, ent in manifest.items():
        data = base64.b64decode(ent['data'])
        if ent.get('compressed'):
            for dec in (gzip.decompress, zlib.decompress):
                try:
                    data = dec(data)
                    break
                except Exception:
                    pass
        ext = EXT.get(ent.get('mime', ''), 'bin')
        if ext in ('js', 'woff2'):
            continue  # runtime de Claude Design y fuentes de Google: no se usan
        name = f'{uuid}.{ext}'
        open(os.path.join(out, name), 'wb').write(data)
        names[uuid] = name
    for uuid, name in names.items():
        template = template.replace(f'"{uuid}"', f'"{name}"')
    open(os.path.join(out, 'template.html'), 'w', encoding='utf-8').write(template)
    print(f'{slug}: template.html + {len(names)} assets')
