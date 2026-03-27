# Motorsport TV

Motorsport TV is a **local-first Raspberry Pi 5 TV launcher** designed specifically for motorsport streaming workflows.
It unifies F1 TV, Hulu + Live TV, HBO/Max, and YouTube into a channel-oriented interface with provider-aware search and custom channel creation.

## Core capabilities
- TV-style home screen with motorsport-first rows.
- Provider hubs for F1 TV, Hulu + Live TV, HBO/Max, YouTube.
- Unified search grouped by provider.
- YouTube Data API v3 integration for real video/playlist/channel results.
- Custom channel creation flow:
  - Static Provider Channel
  - Motorsport Category Channel
  - Search-Backed Channel
  - Custom Hybrid Channel
- Local persistence via SQLite for channels, searches, watch history, and settings.
- Chromium kiosk launch for full-screen TV usage.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Persistence: SQLite (better-sqlite3)
- Deployment: systemd units + Chromium kiosk shell

## Project structure
- `apps/api` – local backend, provider adapters, SQLite schema/seed
- `apps/web` – TV-optimized launcher UI
- `docs/architecture.md` – architecture notes
- `systemd/` – production service templates
- `scripts/launch-kiosk.sh` – kiosk browser launch script

## Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Set `YOUTUBE_API_KEY` in `.env` for API-backed YouTube results.
4. Run dev servers:
   ```bash
   npm run dev
   ```

- API: `http://localhost:4100/api`
- Web UI: `http://localhost:5173`

## Production build
```bash
npm run build
npm --workspace apps/api run start
npm --workspace apps/web run preview -- --host 0.0.0.0 --port 5173
```

## Raspberry Pi 5 deployment (Raspberry Pi OS)
1. Clone repo to `/opt/motorsport-tv`.
2. Install Node 20+ and Chromium.
3. Install dependencies + build:
   ```bash
   cd /opt/motorsport-tv
   npm install
   npm run build
   cp .env.example .env
   ```
4. Edit `.env` (API key, paths, ports).
5. Install services:
   ```bash
   sudo cp systemd/motorsport-tv-api.service /etc/systemd/system/
   sudo cp systemd/motorsport-tv-web.service /etc/systemd/system/
   sudo cp systemd/motorsport-tv-kiosk.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable motorsport-tv-api motorsport-tv-web motorsport-tv-kiosk
   sudo systemctl start motorsport-tv-api motorsport-tv-web motorsport-tv-kiosk
   ```

## Crash recovery / safe behavior
- API/web/kiosk services all use `Restart=always`.
- Chromium profile persisted at `~/.config/motorsport-tv-profile` to preserve provider sessions.
- Launch failures are surfaced in UI and logged into `recently_watched` for diagnostics.

## Legal and provider boundaries
This project intentionally avoids DRM bypassing, illegal stream discovery, or protected API scraping.
Premium providers are launched through legitimate browser flows; YouTube uses official API integration.
