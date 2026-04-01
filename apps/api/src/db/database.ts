import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { defaultCategories, defaultProviders, providerHubChannels } from './seedData.js';
import { Channel } from '../types/models.js';

const dbPath = process.env.DATABASE_PATH ?? './apps/api/data/motorsport-tv.db';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT NOT NULL,
  enabled INTEGER NOT NULL,
  capabilities_json TEXT NOT NULL,
  limitations_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  keywords_json TEXT NOT NULL,
  default_provider_priority_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  provider_ids_json TEXT NOT NULL,
  category_id TEXT,
  query TEXT,
  description TEXT,
  launch_strategy TEXT NOT NULL,
  autoplay_mode TEXT NOT NULL,
  fallback_config TEXT,
  artwork TEXT,
  created_by_user INTEGER NOT NULL,
  enabled INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS recent_searches (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  filters_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS recently_watched (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  launch_payload_json TEXT NOT NULL,
  watched_at TEXT NOT NULL
);
`);

const providerCount = db.prepare('SELECT COUNT(*) as count FROM providers').get() as { count: number };
if (!providerCount.count) {
  const stmt = db.prepare('INSERT INTO providers (id, name, type, icon, enabled, capabilities_json, limitations_json) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const p of defaultProviders) {
    stmt.run(p.id, p.name, p.type, p.icon, p.enabled ? 1 : 0, JSON.stringify(p.capabilities), JSON.stringify(p.limitations));
  }
}

const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (!categoryCount.count) {
  const stmt = db.prepare('INSERT INTO categories (id, label, icon, keywords_json, default_provider_priority_json) VALUES (?, ?, ?, ?, ?)');
  for (const c of defaultCategories) {
    stmt.run(c.id, c.label, c.icon, JSON.stringify(c.keywords), JSON.stringify(c.defaultProviderPriority));
  }
}

const channelCount = db.prepare('SELECT COUNT(*) as count FROM channels').get() as { count: number };
if (!channelCount.count) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO channels
    (id, name, type, provider_ids_json, category_id, query, description, launch_strategy, autoplay_mode, fallback_config, artwork, created_by_user, enabled, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  for (const hub of providerHubChannels) {
    stmt.run(
      hub.id,
      hub.name,
      'provider_hub',
      JSON.stringify([hub.providerId]),
      null,
      null,
      'Provider entry point',
      'provider_hub',
      'none',
      null,
      null,
      0,
      1,
      now,
      now
    );
  }
}

export function listChannels(): Channel[] {
  const rows = db.prepare('SELECT * FROM channels ORDER BY created_by_user DESC, name ASC').all() as Record<string, unknown>[];
  return rows.map(deserializeChannel);
}

export function createChannel(input: Omit<Channel, 'id'>): Channel {
  const now = new Date().toISOString();
  const id = randomUUID();
  db.prepare(`INSERT INTO channels
    (id, name, type, provider_ids_json, category_id, query, description, launch_strategy, autoplay_mode, fallback_config, artwork, created_by_user, enabled, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(
      id,
      input.name,
      input.type,
      JSON.stringify(input.providerIds),
      input.categoryId ?? null,
      input.query ?? null,
      input.description ?? null,
      input.launchStrategy,
      input.autoplayMode,
      input.fallbackConfig ?? null,
      input.artwork ?? null,
      input.createdByUser ? 1 : 0,
      input.enabled ? 1 : 0,
      now,
      now
    );

  return { ...input, id };
}

function deserializeChannel(row: Record<string, unknown>): Channel {
  return {
    id: String(row.id),
    name: String(row.name),
    type: row.type as Channel['type'],
    providerIds: JSON.parse(String(row.provider_ids_json)),
    categoryId: row.category_id ? String(row.category_id) : undefined,
    query: row.query ? String(row.query) : undefined,
    description: row.description ? String(row.description) : undefined,
    launchStrategy: row.launch_strategy as Channel['launchStrategy'],
    autoplayMode: row.autoplay_mode as Channel['autoplayMode'],
    fallbackConfig: row.fallback_config ? String(row.fallback_config) : undefined,
    artwork: row.artwork ? String(row.artwork) : undefined,
    createdByUser: Number(row.created_by_user) === 1,
    enabled: Number(row.enabled) === 1
  };
}
