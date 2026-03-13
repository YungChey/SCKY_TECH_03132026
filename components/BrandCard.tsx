type AccuracyIndicator = "high" | "medium" | "low";

type BrandCardProps = {
  brandName: string;
  trustScore: number;
  aiVisibilityScore: number;
  accuracyIndicator: AccuracyIndicator;
};

function getIndicatorTone(accuracyIndicator: AccuracyIndicator) {
  if (accuracyIndicator === "high") {
    return {
      ring: "border-emerald-200 bg-emerald-50/70",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      label: "High accuracy",
    };
  }

  if (accuracyIndicator === "medium") {
    return {
      ring: "border-[#F26419]/30 bg-[#F26419]/8",
      dot: "bg-[#F26419]",
      text: "text-[#F26419]",
      label: "Medium accuracy",
    };
  }

  return {
    ring: "border-rose-200 bg-rose-50/70",
    dot: "bg-rose-500",
    text: "text-rose-700",
    label: "Low accuracy",
  };
}

export function BrandCard({
  brandName,
  trustScore,
  aiVisibilityScore,
  accuracyIndicator,
}: BrandCardProps) {
  const tone = getIndicatorTone(accuracyIndicator);

  return (
    <article
      className={`rounded-[1.6rem] border p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] ${tone.ring}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002855] text-sm font-bold tracking-[0.18em] text-white">
            {brandName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{brandName}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
              <span
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${tone.text}`}
              >
                {tone.label}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`rounded-full bg-white/80 px-3 py-1 text-xs font-semibold ${tone.text}`}
        >
          {trustScore}%
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            AI Visibility
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {aiVisibilityScore}%
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Trust Score
          </p>
          <p className={`mt-2 text-2xl font-semibold ${tone.text}`}>
            {trustScore}%
          </p>
        </div>
      </div>
    </article>
  );
}

export type { AccuracyIndicator, BrandCardProps };
