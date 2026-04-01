import { ReactNode } from 'react';

export function SectionRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-zinc-200">{title}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">{children}</div>
    </section>
  );
}
