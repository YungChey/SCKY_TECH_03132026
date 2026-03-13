type ObjectionPanelProps = {
  items: string[];
};

export function ObjectionPanel({ items }: ObjectionPanelProps) {
  return (
    <article className="rounded-[1.8rem] border border-rose-200/80 bg-[linear-gradient(180deg,#ffffff,#fff1f2)] p-6 shadow-[0_18px_50px_rgba(97,38,38,0.10)] backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-slate-950">Objections</h3>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-rose-800">
          Sustained
        </span>
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-rose-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
