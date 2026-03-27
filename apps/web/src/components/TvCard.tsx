interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}

export function TvCard({ title, subtitle, badge, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="tv-card rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-left transition hover:border-zinc-600"
    >
      {badge ? <span className="mb-2 inline-block rounded bg-accent/20 px-2 py-0.5 text-xs uppercase tracking-wide text-accent">{badge}</span> : null}
      <div className="text-lg font-semibold">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-zinc-400">{subtitle}</div> : null}
    </button>
  );
}
