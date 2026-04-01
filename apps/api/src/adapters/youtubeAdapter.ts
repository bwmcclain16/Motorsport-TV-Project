import { randomUUID } from 'node:crypto';
import { ProviderAdapter, ProviderSearchContext } from './types.js';
import { LaunchPayload, SearchResult } from '../types/models.js';

interface YoutubeApiItem {
  id: { kind: string; videoId?: string; playlistId?: string; channelId?: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    liveBroadcastContent: 'none' | 'live' | 'upcoming';
    thumbnails?: { medium?: { url: string } };
  };
}

export class YouTubeAdapter implements ProviderAdapter {
  providerId = 'youtube' as const;
  displayName = 'YouTube';

  async search(context: ProviderSearchContext): Promise<SearchResult[]> {
    const key = process.env.YOUTUBE_API_KEY;

    if (!key) {
      return [
        {
          id: `youtube-manual-${context.query}`,
          providerId: 'youtube',
          title: `YouTube Search: ${context.query}`,
          resultType: 'search_shortcut',
          categoryTags: context.categoryTags ?? [],
          launchPayload: this.buildSearchLaunch(context.query),
          description: 'Set YOUTUBE_API_KEY for full API-backed results.'
        }
      ];
    }

    const params = new URLSearchParams({
      part: 'snippet',
      q: context.query,
      maxResults: '12',
      type: 'video,playlist,channel',
      key
    });

    if (context.liveOnly) params.set('eventType', 'live');

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!response.ok) {
      return [
        {
          id: `youtube-fallback-${context.query}`,
          providerId: 'youtube',
          title: `YouTube Search (fallback): ${context.query}`,
          resultType: 'search_shortcut',
          categoryTags: context.categoryTags ?? [],
          launchPayload: this.buildSearchLaunch(context.query),
          description: `YouTube API returned ${response.status}.`
        }
      ];
    }

    const data = (await response.json()) as { items?: YoutubeApiItem[] };
    const items = data.items ?? [];

    return items.map((item) => {
      const kind = item.id.kind.split('#')[1] ?? 'video';
      const id = item.id.videoId ?? item.id.playlistId ?? item.id.channelId ?? randomUUID();
      return {
        id: `youtube-${id}`,
        providerId: 'youtube' as const,
        title: item.snippet.title,
        resultType: kind === 'playlist' ? 'playlist' : kind === 'channel' ? 'channel' : item.snippet.liveBroadcastContent === 'live' ? 'live' : 'video',
        categoryTags: context.categoryTags ?? [],
        launchPayload: {
          providerId: 'youtube',
          url: `https://www.youtube.com/${kind === 'playlist' ? `playlist?list=${item.id.playlistId}` : kind === 'channel' ? `channel/${item.id.channelId}` : `watch?v=${item.id.videoId}`}`,
          launchMode: 'external_chromium',
          sessionProfile: 'default'
        },
        liveStatus: item.snippet.liveBroadcastContent,
        artwork: item.snippet.thumbnails?.medium?.url,
        description: `${item.snippet.channelTitle} · ${item.snippet.description}`
      } as SearchResult;
    });
  }

  buildHubLaunch(): LaunchPayload {
    return {
      providerId: 'youtube',
      url: 'https://www.youtube.com/results?search_query=motorsport+live',
      launchMode: 'external_chromium',
      sessionProfile: 'default'
    };
  }

  buildSearchLaunch(query: string): LaunchPayload {
    return {
      providerId: 'youtube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      launchMode: 'external_chromium',
      sessionProfile: 'default',
      metadata: { query }
    };
  }
}
