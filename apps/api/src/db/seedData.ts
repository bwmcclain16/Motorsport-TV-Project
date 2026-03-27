import { MotorsportCategory, Provider } from '../types/models.js';

export const defaultProviders: Provider[] = [
  {
    id: 'f1tv',
    name: 'F1 TV',
    type: 'premium',
    icon: '🏎️',
    enabled: true,
    capabilities: { search: true, hub: true, liveHints: true, supportsPlaylists: false },
    limitations: ['No public full-content API. Uses curated links and provider search page.']
  },
  {
    id: 'hulu_live',
    name: 'Hulu + Live TV',
    type: 'premium',
    icon: '📺',
    enabled: true,
    capabilities: { search: true, hub: true, liveHints: false, supportsPlaylists: false },
    limitations: ['Search exposed via provider web app flow; catalog details are limited.']
  },
  {
    id: 'max',
    name: 'HBO / Max',
    type: 'premium',
    icon: '🎬',
    enabled: true,
    capabilities: { search: true, hub: true, liveHints: false, supportsPlaylists: false },
    limitations: ['Uses authenticated browser flow and provider search URLs.']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    type: 'open',
    icon: '▶️',
    enabled: true,
    capabilities: { search: true, hub: true, liveHints: true, supportsPlaylists: true },
    limitations: ['API quota limits apply.']
  }
];

export const defaultCategories: MotorsportCategory[] = [
  { id: 'open-wheel', label: 'Formula / Open Wheel', icon: '🏁', keywords: ['formula 1', 'f1', 'formula 2', 'indycar', 'open wheel'], defaultProviderPriority: ['f1tv', 'youtube', 'hulu_live', 'max'] },
  { id: 'endurance-gt', label: 'Endurance / GT', icon: '⏱️', keywords: ['wec', 'imsa', 'gt3', 'lemans', 'endurance'], defaultProviderPriority: ['youtube', 'hulu_live', 'max', 'f1tv'] },
  { id: 'nascar-oval', label: 'NASCAR / Oval', icon: '🟦', keywords: ['nascar', 'oval', 'stock car'], defaultProviderPriority: ['hulu_live', 'youtube', 'max', 'f1tv'] },
  { id: 'two-wheel', label: 'Two-Wheel', icon: '🏍️', keywords: ['motogp', 'superbike', 'supercross', 'two wheel'], defaultProviderPriority: ['youtube', 'hulu_live', 'max', 'f1tv'] },
  { id: 'rally-rallycross', label: 'Rally / Rallycross', icon: '🪨', keywords: ['wrc', 'rally', 'rallycross'], defaultProviderPriority: ['youtube', 'hulu_live', 'max', 'f1tv'] },
  { id: 'drift', label: 'Drift', icon: '💨', keywords: ['drift', 'formula drift'], defaultProviderPriority: ['youtube', 'hulu_live', 'max', 'f1tv'] },
  { id: 'touring-cars', label: 'Touring Cars', icon: '🚗', keywords: ['btcc', 'dtm', 'touring cars'], defaultProviderPriority: ['youtube', 'hulu_live', 'max', 'f1tv'] },
  { id: 'dirt-offroad', label: 'Dirt / Sprint / Off-Road', icon: '🛻', keywords: ['dirt track', 'baja', 'sprint car', 'off-road'], defaultProviderPriority: ['youtube', 'hulu_live', 'max', 'f1tv'] },
  { id: 'karting-junior', label: 'Karting / Junior Series', icon: '🧒', keywords: ['karting', 'junior formula', 'formula regional'], defaultProviderPriority: ['youtube', 'f1tv', 'hulu_live', 'max'] },
  { id: 'documentary-archive', label: 'Documentary / Archive', icon: '📚', keywords: ['motorsport documentary', 'archive race', 'classic races'], defaultProviderPriority: ['max', 'youtube', 'hulu_live', 'f1tv'] }
];

export const providerHubChannels = [
  { id: 'hub-f1tv', name: 'F1 TV Hub', providerId: 'f1tv', url: 'https://f1tv.formula1.com/' },
  { id: 'hub-hulu', name: 'Hulu Live TV Hub', providerId: 'hulu_live', url: 'https://www.hulu.com/live-tv' },
  { id: 'hub-max', name: 'HBO / Max Hub', providerId: 'max', url: 'https://play.max.com/' },
  { id: 'hub-youtube', name: 'YouTube Motorsport Hub', providerId: 'youtube', url: 'https://www.youtube.com/results?search_query=motorsport+live' }
] as const;
