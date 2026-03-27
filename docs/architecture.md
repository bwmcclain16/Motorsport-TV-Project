# Motorsport TV Architecture

## Design goals
- Local-first Raspberry Pi 5 deployment.
- TV-first focus navigation and readability.
- Legal provider usage: authenticated hubs/search pages for premium providers.
- Modular provider adapters so new providers can be added without rewriting core search logic.

## Runtime structure
- `apps/api`: Express + TypeScript API with SQLite persistence.
- `apps/web`: React + Vite + Tailwind TV launcher UI.
- `systemd/*.service`: production service definitions.
- `scripts/launch-kiosk.sh`: Chromium kiosk bootstrap with persistent browser profile.

## Provider adapter model
Each provider adapter owns:
- search behavior
- provider hub launch payload
- provider search-launch payload

`YouTubeAdapter` uses the YouTube Data API v3 when `YOUTUBE_API_KEY` is configured.
Premium adapters (`f1tv`, `hulu_live`, `max`) use curated motorsport mappings plus provider-native search/hub launch URLs.

## Data model
SQLite tables:
- providers
- categories
- channels
- app_settings
- recent_searches
- recently_watched

Seed data includes:
- all required providers
- all required motorsport taxonomy categories
- provider hub channels
