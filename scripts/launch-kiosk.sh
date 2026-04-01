#!/usr/bin/env bash
set -euo pipefail

APP_URL="${APP_URL:-http://localhost:5173}"
CHROMIUM_BIN="${CHROMIUM_BIN:-chromium-browser}"

$CHROMIUM_BIN \
  --kiosk \
  --disable-infobars \
  --no-first-run \
  --disable-session-crashed-bubble \
  --autoplay-policy=no-user-gesture-required \
  --user-data-dir="${HOME}/.config/motorsport-tv-profile" \
  "$APP_URL"
