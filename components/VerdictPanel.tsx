type VerdictPanelProps = {
  trustScore: number;
  summary: string;
};

function getVerdictMessage(trustScore: number) {
  if (trustScore >= 80) {
    return "Trustworthy";
  }

  if (trustScore >= 50) {
    return "Questionable";
  }

  return "Misleading";
}

function getVerdictTone(trustScore: number) {
  if (trustScore >= 80) {
    return {
      badge: "bg-emerald-100/90 text-emerald-800 border border-emerald-200/80",
      meter: "bg-emerald-500",
      score: "text-emerald-200",
    };
  }

  if (trustScore >= 50) {
    return {
      badge: "bg-[#F26419]/15 text-[#F26419] border border-[#F26419]/30",
      meter: "bg-[#F26419]",
      score: "text-[#F9A06F]",
    };
  }

  return {
    badge: "bg-rose-100/90 text-rose-800 border border-rose-200/80",
    meter: "bg-rose-400",
    score: "text-rose-200",
  };
}

export function VerdictPanel({ trustScore, summary }: VerdictPanelProps) {
  const verdictMessage = getVerdictMessage(trustScore);
  const verdictTone = getVerdictTone(trustScore);

  return (
    <article className="rounded-[1.8rem] border border-slate-200/80 bg-[#002855] p-6 text-stone-50 shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Verdict</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${verdictTone.badge}`}
        >
          {verdictMessage}
        </span>
      </div>
      <p className="mt-5 text-sm leading-7 text-stone-200/85">{summary}</p>
      <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
          Trust Score
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${verdictTone.meter}`}
            style={{ width: `${trustScore}%` }}
          />
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className={`text-3xl font-semibold ${verdictTone.score}`}>
            {trustScore}%
          </p>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-300">
            {verdictMessage}
          </p>
        </div>
      </div>
    </article>
  );
}
