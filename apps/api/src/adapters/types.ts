import { LaunchPayload, ProviderId, SearchResult } from '../types/models.js';

export interface ProviderSearchContext {
  query: string;
  liveOnly?: boolean;
  includeReplay?: boolean;
  categoryTags?: string[];
}

export interface ProviderAdapter {
  providerId: ProviderId;
  displayName: string;
  search(context: ProviderSearchContext): Promise<SearchResult[]>;
  buildHubLaunch(): LaunchPayload;
  buildSearchLaunch(query: string): LaunchPayload;
}
