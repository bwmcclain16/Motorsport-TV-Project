export type ProviderId = 'f1tv' | 'hulu_live' | 'max' | 'youtube';

export type ChannelType =
  | 'static'
  | 'provider_hub'
  | 'smart_category'
  | 'search_backed'
  | 'hybrid';

export type LaunchStrategy = 'direct_url' | 'provider_hub' | 'search_results' | 'best_match';
export type AutoplayMode = 'none' | 'best_result' | 'live_first';

export interface Provider {
  id: ProviderId;
  name: string;
  type: 'premium' | 'mixed' | 'open';
  icon: string;
  enabled: boolean;
  capabilities: {
    search: boolean;
    hub: boolean;
    liveHints: boolean;
    supportsPlaylists: boolean;
  };
  limitations: string[];
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
  type: ChannelType;
  providerIds: ProviderId[];
  categoryId?: string;
  query?: string;
  description?: string;
  launchStrategy: LaunchStrategy;
  autoplayMode: AutoplayMode;
  fallbackConfig?: string;
  artwork?: string;
  createdByUser: boolean;
  enabled: boolean;
}

export interface LaunchPayload {
  providerId: ProviderId;
  url?: string;
  launchMode: 'kiosk_tab' | 'external_chromium';
  sessionProfile: 'default';
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  providerId: ProviderId;
  title: string;
  resultType: 'live' | 'replay' | 'channel' | 'playlist' | 'hub' | 'search_shortcut' | 'video';
  categoryTags: string[];
  launchPayload: LaunchPayload;
  liveStatus?: 'live' | 'upcoming' | 'none';
  artwork?: string;
  description?: string;
}
