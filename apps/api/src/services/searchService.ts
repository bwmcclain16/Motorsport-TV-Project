import { getAdapters } from './adapterRegistry.js';
import { SearchResult } from '../types/models.js';

export interface UnifiedSearchInput {
  query: string;
  providers?: string[];
  categoryTags?: string[];
  liveOnly?: boolean;
  includeReplay?: boolean;
}

export async function unifiedSearch(input: UnifiedSearchInput): Promise<Record<string, SearchResult[]>> {
  const providers = input.providers?.length ? new Set(input.providers) : null;
  const resultsByProvider: Record<string, SearchResult[]> = {};

  await Promise.all(
    getAdapters().map(async (adapter) => {
      if (providers && !providers.has(adapter.providerId)) return;
      const results = await adapter.search({
        query: input.query,
        liveOnly: input.liveOnly,
        includeReplay: input.includeReplay,
        categoryTags: input.categoryTags
      });
      resultsByProvider[adapter.providerId] = results;
    })
  );

  return resultsByProvider;
}
