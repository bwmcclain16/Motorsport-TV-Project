export type ProviderId = 'f1tv' | 'hulu_live' | 'max' | 'youtube';

export interface Provider {
  id: ProviderId;
  name: string;
  icon: string;
  capabilities: Record<string, boolean>;
}

export interface MotorsportCategory {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
  defaultProviderPriority: ProviderId[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'static' | 'provider_hub' | 'smart_category' | 'search_backed' | 'hybrid';
  providerIds: ProviderId[];
  categoryId?: string;
  query?: string;
  description?: string;
  launchStrategy: 'direct_url' | 'provider_hub' | 'search_results' | 'best_match';
  autoplayMode: 'none' | 'best_result' | 'live_first';
  fallbackConfig?: string;
  artwork?: string;
  createdByUser: boolean;
  enabled: boolean;
}

export interface SearchResult {
  id: string;
  providerId: ProviderId;
  title: string;
  resultType: string;
  categoryTags: string[];
  launchPayload: { providerId: ProviderId; url?: string };
  liveStatus?: string;
  artwork?: string;
  description?: string;
}
