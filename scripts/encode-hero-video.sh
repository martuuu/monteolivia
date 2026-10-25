#!/usr/bin/env bash
# Codifica un clip HORIZONTAL para el fondo del hero (solo desktop).
#   brew install ffmpeg
#   scripts/encode-hero-video.sh entrada.mov   →  public/videos/hero.mp4 + hero.webm
# Luego en src/data/site.ts: heroVideo: { mp4: '/videos/hero.mp4', webm: '/videos/hero.webm' }
set -euo pipefail
IN="${1:?uso: scripts/encode-hero-video.sh entrada.mov}"
OUT=public/videos
mkdir -p "$OUT"
# 1920px de ancho, 12 s máx, sin audio, H.264 CRF 28 (~1,5–2 MB), arranque rápido
ffmpeg -y -i "$IN" -t 12 -an -vf "scale=1920:-2,fps=30" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart "$OUT/hero.mp4"
ffmpeg -y -i "$IN" -t 12 -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 "$OUT/hero.webm"
ls -lh "$OUT"
