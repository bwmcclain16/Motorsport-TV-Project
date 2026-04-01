import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { createChannel, db, listChannels } from '../db/database.js';
import { unifiedSearch } from '../services/searchService.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'motorsport-tv-api', timestamp: new Date().toISOString() });
});

apiRouter.get('/providers', (_req, res) => {
  const rows = db.prepare('SELECT * FROM providers WHERE enabled = 1 ORDER BY name').all() as Record<string, unknown>[];
  res.json(rows.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    enabled: Number(row.enabled) === 1,
    capabilities: JSON.parse(String(row.capabilities_json)),
    limitations: JSON.parse(String(row.limitations_json))
  })));
});

apiRouter.get('/categories', (_req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY label').all() as Record<string, unknown>[];
  res.json(rows.map((row) => ({
    id: row.id,
    label: row.label,
    icon: row.icon,
    keywords: JSON.parse(String(row.keywords_json)),
    defaultProviderPriority: JSON.parse(String(row.default_provider_priority_json))
  })));
});

apiRouter.get('/channels', (_req, res) => {
  res.json(listChannels());
});

const channelSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['static', 'provider_hub', 'smart_category', 'search_backed', 'hybrid']),
  providerIds: z.array(z.enum(['f1tv', 'hulu_live', 'max', 'youtube'])).min(1),
  categoryId: z.string().optional(),
  query: z.string().optional(),
  description: z.string().optional(),
  launchStrategy: z.enum(['direct_url', 'provider_hub', 'search_results', 'best_match']),
  autoplayMode: z.enum(['none', 'best_result', 'live_first']),
  fallbackConfig: z.string().optional(),
  artwork: z.string().optional(),
  createdByUser: z.boolean().default(true),
  enabled: z.boolean().default(true)
});

apiRouter.post('/channels', (req, res) => {
  const parsed = channelSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid channel payload', details: parsed.error.flatten() });
  }
  const channel = createChannel(parsed.data);
  return res.status(201).json(channel);
});

apiRouter.get('/search', async (req, res) => {
  const query = String(req.query.q ?? '').trim();
  if (!query) return res.status(400).json({ error: 'Missing q parameter' });

  const providers = req.query.providers ? String(req.query.providers).split(',').map((v) => v.trim()) : undefined;
  const categoryTags = req.query.categories ? String(req.query.categories).split(',').map((v) => v.trim()) : undefined;

  const results = await unifiedSearch({
    query,
    providers,
    categoryTags,
    liveOnly: req.query.liveOnly === 'true',
    includeReplay: req.query.includeReplay !== 'false'
  });

  db.prepare('INSERT INTO recent_searches (id, query, filters_json, created_at) VALUES (?, ?, ?, ?)').run(
    randomUUID(),
    query,
    JSON.stringify({ providers, categoryTags, liveOnly: req.query.liveOnly === 'true' }),
    new Date().toISOString()
  );

  return res.json({ query, results });
});

apiRouter.post('/launch', (req, res) => {
  const payload = req.body as { providerId: string; url?: string };
  if (!payload?.providerId || !payload?.url) return res.status(400).json({ error: 'providerId and url required' });
  db.prepare('INSERT INTO recently_watched (id, title, provider_id, launch_payload_json, watched_at) VALUES (?, ?, ?, ?, ?)').run(
    randomUUID(),
    `Launch ${payload.providerId}`,
    payload.providerId,
    JSON.stringify(payload),
    new Date().toISOString()
  );
  return res.json({ ok: true, launchUrl: payload.url });
});
