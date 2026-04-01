import { ProviderAdapter, ProviderSearchContext } from './types.js';
import { LaunchPayload, ProviderId, SearchResult } from '../types/models.js';

const providerConfig: Record<Exclude<ProviderId, 'youtube'>, { hubUrl: string; searchUrl: string; label: string }> = {
  f1tv: {
    hubUrl: 'https://f1tv.formula1.com/',
    searchUrl: 'https://f1tv.formula1.com/search',
    label: 'F1 TV'
  },
  hulu_live: {
    hubUrl: 'https://www.hulu.com/live-tv',
    searchUrl: 'https://www.hulu.com/search?q=',
    label: 'Hulu + Live TV'
  },
  max: {
    hubUrl: 'https://play.max.com/',
    searchUrl: 'https://play.max.com/search',
    label: 'HBO / Max'
  }
};

const curatedKeywords: Record<string, string[]> = {
  f1tv: ['formula 1', 'formula 2', 'formula 3', 'f1 academy', 'open wheel'],
  hulu_live: ['nascar', 'indycar', 'motogp', 'supercross', 'rally'],
  max: ['motorsport documentary', 'racing archive', 'indy 500', 'nascar highlights']
};

export class CuratedProviderAdapter implements ProviderAdapter {
  providerId: Exclude<ProviderId, 'youtube'>;
  displayName: string;

  constructor(providerId: Exclude<ProviderId, 'youtube'>) {
    this.providerId = providerId;
    this.displayName = providerConfig[providerId].label;
  }

  async search(context: ProviderSearchContext): Promise<SearchResult[]> {
    const hints = curatedKeywords[this.providerId] || [];
    const isMatch = hints.some((hint) => context.query.toLowerCase().includes(hint) || hint.includes(context.query.toLowerCase()));

    const base: SearchResult[] = [
      {
        id: `${this.providerId}-hub-${context.query}`,
        providerId: this.providerId,
        title: `${this.displayName} Hub`,
        resultType: 'hub',
        categoryTags: context.categoryTags ?? [],
        launchPayload: this.buildHubLaunch(),
        description: 'Open provider home/hub in authenticated session.'
      },
      {
        id: `${this.providerId}-search-${context.query}`,
        providerId: this.providerId,
        title: `${this.displayName} Search: ${context.query}`,
        resultType: 'search_shortcut',
        categoryTags: context.categoryTags ?? [],
        launchPayload: this.buildSearchLaunch(context.query),
        description: 'Run query in provider-native search interface.'
      }
    ];

    if (isMatch) {
      base.unshift({
        id: `${this.providerId}-curated-${context.query}`,
        providerId: this.providerId,
        title: `${this.displayName} Curated motorsport entry for “${context.query}”`,
        resultType: context.liveOnly ? 'live' : 'replay',
        categoryTags: context.categoryTags ?? [],
        launchPayload: this.buildSearchLaunch(context.query),
        description: 'Curated mapping based on known motorsport coverage patterns.'
      });
    }

    return base;
  }

  buildHubLaunch(): LaunchPayload {
    return {
      providerId: this.providerId,
      url: providerConfig[this.providerId].hubUrl,
      launchMode: 'external_chromium',
      sessionProfile: 'default'
    };
  }

  buildSearchLaunch(query: string): LaunchPayload {
    const cfg = providerConfig[this.providerId];
    const queryUrl = cfg.searchUrl.includes('?q=')
      ? `${cfg.searchUrl}${encodeURIComponent(query)}`
      : `${cfg.searchUrl}?q=${encodeURIComponent(query)}`;

    return {
      providerId: this.providerId,
      url: queryUrl,
      launchMode: 'external_chromium',
      sessionProfile: 'default',
      metadata: { query }
    };
  }
}
