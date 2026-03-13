type Metric = {
  label: string;
  value: number;
  tone: "navy" | "emerald" | "orange" | "rose";
};

type TrustScoreDashboardProps = {
  metrics: Metric[];
};

const toneClasses = {
  navy: {
    text: "text-[#002855]",
    bar: "bg-[#002855]",
    panel: "bg-[#002855]/5 border-[#002855]/20",
  },
  emerald: {
    text: "text-emerald-700",
    bar: "bg-emerald-500",
    panel: "bg-emerald-50 border-emerald-200/80",
  },
  orange: {
    text: "text-[#F26419]",
    bar: "bg-[#F26419]",
    panel: "bg-[#F26419]/8 border-[#F26419]/25",
  },
  rose: {
    text: "text-rose-700",
    bar: "bg-rose-500",
    panel: "bg-rose-50 border-rose-200/80",
  },
};

export function TrustScoreDashboard({ metrics }: TrustScoreDashboardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
            Trust Score Dashboard
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">
            AI visibility and accuracy metrics
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const tone = toneClasses[metric.tone];

          return (
            <article
              key={metric.label}
              className={`rounded-[1.5rem] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${tone.panel}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </p>
              <p className={`mt-3 text-4xl font-semibold ${tone.text}`}>
                {metric.value}%
              </p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full ${tone.bar}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
