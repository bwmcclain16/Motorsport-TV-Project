import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet, apiPost } from '../api/client';
import { MotorsportCategory, Provider, SearchResult } from '../types/models';
import { SectionRow } from '../components/SectionRow';
import { TvCard } from '../components/TvCard';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<MotorsportCategory[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') ?? 'Formula 1');
  const [results, setResults] = useState<Record<string, SearchResult[]>>({});
  const [liveOnly, setLiveOnly] = useState(false);

  useEffect(() => {
    apiGet<Provider[]>('/providers').then((p) => {
      setProviders(p);
      setSelectedProviders(p.map((v) => v.id));
    });
    apiGet<MotorsportCategory[]>('/categories').then(setCategories);
  }, []);

  const fetchResults = async (currentQuery: string) => {
    const providerParam = selectedProviders.join(',');
    const categoryParam = searchParams.get('category') ? String(searchParams.get('category')) : '';
    const data = await apiGet<{ results: Record<string, SearchResult[]> }>(`/search?q=${encodeURIComponent(currentQuery)}&providers=${providerParam}&categories=${categoryParam}&liveOnly=${liveOnly}`);
    setResults(data.results);
  };

  useEffect(() => {
    fetchResults(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProviders, liveOnly]);

  const providerIds = useMemo(() => providers.map((p) => p.id), [providers]);

  const toggleProvider = (providerId: string) => {
    setSelectedProviders((prev) => (prev.includes(providerId) ? prev.filter((v) => v !== providerId) : [...prev, providerId]));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSearchParams({ q: query });
    await fetchResults(query);
  };

  return (
    <main className="min-h-screen space-y-6 p-6">
      <form onSubmit={onSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-3 text-2xl font-bold">Search Motorsport</div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded border border-zinc-700 bg-zinc-950 p-3 text-lg" />
        <div className="mt-3 flex flex-wrap gap-2">
          {providerIds.map((id) => (
            <button key={id} type="button" onClick={() => toggleProvider(id)} className={`rounded px-3 py-1 text-sm ${selectedProviders.includes(id) ? 'bg-accent text-white' : 'bg-zinc-800'}`}>
              {id}
            </button>
          ))}
          <button type="button" className={`rounded px-3 py-1 text-sm ${liveOnly ? 'bg-accent text-white' : 'bg-zinc-800'}`} onClick={() => setLiveOnly((v) => !v)}>
            Live only
          </button>
          <button type="submit" className="rounded bg-zinc-100 px-3 py-1 text-sm text-zinc-900">Run search</button>
        </div>
      </form>

      {Object.entries(results).map(([providerId, list]) => (
        <SectionRow key={providerId} title={providers.find((p) => p.id === providerId)?.name ?? providerId}>
          {list.map((item) => (
            <TvCard
              key={item.id}
              title={item.title}
              subtitle={item.description}
              badge={item.resultType}
              onClick={async () => {
                await apiPost('/launch', item.launchPayload);
                if (item.launchPayload.url) window.open(item.launchPayload.url, '_blank', 'noopener,noreferrer');
              }}
            />
          ))}
        </SectionRow>
      ))}

      {categories.length ? (
        <div className="text-sm text-zinc-500">Category hints: {categories.map((c) => c.label).slice(0, 4).join(' · ')}...</div>
      ) : null}
    </main>
  );
}
