import { CuratedProviderAdapter } from '../adapters/curatedProviderAdapter.js';
import { ProviderAdapter } from '../adapters/types.js';
import { YouTubeAdapter } from '../adapters/youtubeAdapter.js';

const adapters: ProviderAdapter[] = [
  new CuratedProviderAdapter('f1tv'),
  new CuratedProviderAdapter('hulu_live'),
  new CuratedProviderAdapter('max'),
  new YouTubeAdapter()
];

export function getAdapters() {
  return adapters;
}

export function getAdapterByProvider(providerId: string) {
  return adapters.find((adapter) => adapter.providerId === providerId);
}
