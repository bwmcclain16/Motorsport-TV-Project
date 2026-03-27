import { FormEvent, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';
import { MotorsportCategory, Provider } from '../types/models';

type ChannelFormType = 'static' | 'smart_category' | 'search_backed' | 'hybrid';

export function AddChannelPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<MotorsportCategory[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<ChannelFormType>('smart_category');
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['youtube']);
  const [categoryId, setCategoryId] = useState('open-wheel');
  const [query, setQuery] = useState('');
  const [description, setDescription] = useState('');
  const [autoplayMode, setAutoplayMode] = useState<'none' | 'best_result' | 'live_first'>('best_result');
  const [launchStrategy, setLaunchStrategy] = useState<'direct_url' | 'provider_hub' | 'search_results' | 'best_match'>('best_match');

  useEffect(() => {
    apiGet<Provider[]>('/providers').then(setProviders);
    apiGet<MotorsportCategory[]>('/categories').then(setCategories);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await apiPost('/channels', {
      name,
      type,
      providerIds: selectedProviders,
      categoryId: type === 'smart_category' ? categoryId : undefined,
      query: type === 'search_backed' || type === 'hybrid' ? query : undefined,
      description,
      launchStrategy,
      autoplayMode,
      fallbackConfig: type === 'hybrid' ? 'fallback:provider_hub' : undefined,
      createdByUser: true,
      enabled: true
    });
    setName('');
    setDescription('');
    setQuery('');
    alert('Channel created. Return to home to launch it.');
  };

  const toggleProvider = (providerId: string) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId) ? prev.filter((item) => item !== providerId) : [...prev, providerId]
    );
  };

  return (
    <main className="min-h-screen p-6">
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold">Add Channel</h1>
        <p className="text-zinc-400">Create static provider, motorsport category, search-backed, or hybrid channels.</p>

        <label className="block text-sm">
          Channel Name
          <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3" />
        </label>

        <label className="block text-sm">
          Channel Type
          <select value={type} onChange={(e) => setType(e.target.value as ChannelFormType)} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3">
            <option value="static">Static Provider Channel</option>
            <option value="smart_category">Motorsport Category Channel</option>
            <option value="search_backed">Search-Backed Channel</option>
            <option value="hybrid">Custom Hybrid Channel</option>
          </select>
        </label>

        <div>
          <div className="mb-1 text-sm">Provider Priority</div>
          <div className="flex flex-wrap gap-2">
            {providers.map((provider) => (
              <button key={provider.id} type="button" className={`rounded px-3 py-1 ${selectedProviders.includes(provider.id) ? 'bg-accent text-white' : 'bg-zinc-800'}`} onClick={() => toggleProvider(provider.id)}>
                {provider.name}
              </button>
            ))}
          </div>
        </div>

        {type === 'smart_category' ? (
          <label className="block text-sm">
            Motorsport Category
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </label>
        ) : null}

        {type === 'search_backed' || type === 'hybrid' ? (
          <label className="block text-sm">
            Search Query
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="GT3, MotoGP, Rallycross..." className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3" />
          </label>
        ) : null}

        <label className="block text-sm">
          Launch Behavior
          <select value={launchStrategy} onChange={(e) => setLaunchStrategy(e.target.value as 'direct_url' | 'provider_hub' | 'search_results' | 'best_match')} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3">
            <option value="best_match">Autoselect best match</option>
            <option value="search_results">Show result grid first</option>
            <option value="provider_hub">Open provider hub</option>
            <option value="direct_url">Direct URL target</option>
          </select>
        </label>

        <label className="block text-sm">
          Autoplay Mode
          <select value={autoplayMode} onChange={(e) => setAutoplayMode(e.target.value as 'none' | 'best_result' | 'live_first')} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3">
            <option value="none">No autoplay (show options)</option>
            <option value="best_result">Autoplay best result</option>
            <option value="live_first">Live-first autoplay</option>
          </select>
        </label>

        <label className="block text-sm">
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-3" rows={3} />
        </label>

        <button type="submit" className="rounded bg-accent px-4 py-2 font-semibold">Create Channel</button>
      </form>
    </main>
  );
}
