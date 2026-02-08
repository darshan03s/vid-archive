#!/usr/bin/env bash

set -e

# Create temp dir for shadowed binaries
SHADOW_BIN="$(mktemp -d)"

# Create fake yt-dlp
cat > "$SHADOW_BIN/yt-dlp" <<'EOF'
#!/usr/bin/env bash
exit 127
EOF

# Create fake ffmpeg
cat > "$SHADOW_BIN/ffmpeg" <<'EOF'
#!/usr/bin/env bash
exit 127
EOF

chmod +x "$SHADOW_BIN/yt-dlp" "$SHADOW_BIN/ffmpeg"

# Prepend shadow bin to PATH
export PATH="$SHADOW_BIN:$PATH"

# Run normally
pnpm dev
