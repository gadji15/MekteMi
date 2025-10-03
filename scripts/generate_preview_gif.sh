#!/usr/bin/env bash
# Generate a lightweight GIF preview from a video file using ffmpeg.
# Usage:
#   ./scripts/generate_preview_gif.sh /path/to/video.mp4 public/preview.gif
# Requires: ffmpeg installed on your system.

set -euo pipefail

INPUT="${1:-}"
OUTPUT="${2:-public/preview.gif}"

if [[ -z "$INPUT" ]]; then
  echo "Error: missing input video path."
  echo "Example: ./scripts/generate_preview_gif.sh /path/to/video.mp4 public/preview.gif"
  exit 1
fi

# Create output directory if needed
mkdir -p "$(dirname "$OUTPUT")"

# Generate palette for better colors
PALETTE="$(mktemp)"
ffmpeg -y -i "$INPUT" -vf "fps=12,scale=640:-1:flags=lanczos" -t 8 -vf palettegen "$PALETTE"

# Create GIF using palette (12 fps, max 8s, width 640px, keeps aspect ratio)
ffmpeg -y -i "$INPUT" -i "$PALETTE" -lavfi "fps=12,scale=640:-1:flags=lanczos [x]; [x][1:v] paletteuse" -t 8 "$OUTPUT"

rm -f "$PALETTE"

echo "Preview GIF generated at: $OUTPUT"