import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api/client';
import { Channel, MotorsportCategory, Provider } from '../types/models';
import { SectionRow } from '../components/SectionRow';
import { TvCard } from '../components/TvCard';

export function HomePage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<MotorsportCategory[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    apiGet<Provider[]>('/providers').then(setProviders);
    apiGet<MotorsportCategory[]>('/categories').then(setCategories);
    apiGet<Channel[]>('/channels').then(setChannels);
  }, []);

  const customChannels = useMemo(() => channels.filter((c) => c.createdByUser), [channels]);

  const launch = async (url?: string, providerId?: string) => {
    if (!url || !providerId) return;
    await apiPost('/launch', { url, providerId });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen space-y-8 p-6">
      <header className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div>
          <h1 className="text-3xl font-bold">Motorsport TV</h1>
          <p className="text-zinc-400">Unified motorsport channels for Raspberry Pi kiosk playback</p>
        </div>
        <div className="text-right text-sm text-zinc-400">{new Date().toLocaleString()}</div>
      </header>

      <SectionRow title="Primary">
        <TvCard title="Search" subtitle="Provider-aware motorsport discovery" badge="Core" onClick={() => navigate('/search')} />
        <TvCard title="Favorites" subtitle="Pinned channels (coming next)" badge="Pinned" />
        <TvCard title="Recently Watched" subtitle="Launch history shortcuts" badge="History" />
        <TvCard title="Add Channel" subtitle="Create static, smart, search, or hybrid channels" badge="Create" onClick={() => navigate('/add-channel')} />
      </SectionRow>

      <SectionRow title="Provider Hubs">
        {providers.map((provider) => (
          <TvCard key={provider.id} title={`${provider.icon} ${provider.name}`} subtitle="Open provider hub" badge="Hub" onClick={() => {
            const hub = channels.find((c) => c.type === 'provider_hub' && c.providerIds[0] === provider.id);
            launch(hub?.providerIds[0] === 'f1tv' ? 'https://f1tv.formula1.com/' : hub?.providerIds[0] === 'hulu_live' ? 'https://www.hulu.com/live-tv' : hub?.providerIds[0] === 'max' ? 'https://play.max.com/' : 'https://www.youtube.com/results?search_query=motorsport+live', provider.id);
          }} />
        ))}
      </SectionRow>

      <SectionRow title="Motorsport Categories">
        {categories.map((category) => (
          <TvCard key={category.id} title={`${category.icon} ${category.label}`} subtitle={category.keywords.slice(0, 3).join(' · ')} badge="Category" onClick={() => navigate(`/search?q=${encodeURIComponent(category.keywords[0])}&category=${category.id}`)} />
        ))}
      </SectionRow>

      <SectionRow title="Custom Channels">
        {customChannels.length ? customChannels.map((channel) => (
          <TvCard key={channel.id} title={channel.name} subtitle={channel.description || channel.type} badge={channel.type.replace('_', ' ')} onClick={() => {
            if (channel.query) navigate(`/search?q=${encodeURIComponent(channel.query)}`);
          }} />
        )) : <TvCard title="No custom channels yet" subtitle="Use Add Channel to create your first motorsport channel." />}
      </SectionRow>
    </main>
  );
}
