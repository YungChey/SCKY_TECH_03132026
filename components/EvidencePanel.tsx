type EvidencePanelProps = {
  items: string[];
};

export function EvidencePanel({ items }: EvidencePanelProps) {
  return (
    <article className="rounded-[1.8rem] border border-emerald-200/80 bg-[linear-gradient(180deg,#ffffff,#f0fdf4)] p-6 shadow-[0_18px_50px_rgba(47,84,61,0.10)] backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-slate-950">Evidence</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">
          Admitted
        </span>
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-emerald-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
