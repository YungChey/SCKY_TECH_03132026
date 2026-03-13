type CaseHeaderProps = {
  title: string;
  subtitle: string;
  trustScore: number;
  caseStatus: string;
  argumentsLogged: number;
};

export function CaseHeader({
  title,
  subtitle,
  trustScore,
  caseStatus,
  argumentsLogged,
}: CaseHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-amber-950/15 bg-[linear-gradient(135deg,rgba(48,28,12,0.96),rgba(115,74,27,0.92))] px-6 py-8 text-stone-50 shadow-[0_24px_80px_rgba(63,34,8,0.28)] sm:px-8 lg:px-10">
      <div className="absolute inset-y-0 right-0 hidden w-80 bg-[radial-gradient(circle_at_center,rgba(255,232,181,0.34),transparent_68%)] lg:block" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-amber-200/20 bg-amber-50/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100/80">
            Courtroom Analysis Dashboard
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-200/85 sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-[1.5rem] border border-amber-100/15 bg-black/15 p-4 backdrop-blur sm:max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
              Trust Score
            </p>
            <p className="mt-2 text-4xl font-semibold text-amber-200">
              {trustScore}%
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
              Case Status
            </p>
            <p className="mt-2 text-lg font-semibold">{caseStatus}</p>
            <p className="mt-1 text-sm text-stone-300">
              {argumentsLogged} arguments logged
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
