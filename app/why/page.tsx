import Link from "next/link";

const advantages = [
  "continuous AI monitoring",
  "claim verification",
  "competitor analysis",
  "marketing insights",
  "brand trust scoring",
];

export default function WhyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F26419]">
                VerdictAI
              </p>
              <h1 className="mt-2 font-display text-4xl text-slate-950">
                Why VerdictAI?
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-[#002855] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#F26419]"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-slate-200/80 bg-[#002855] p-7 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">
            Live AI Monitoring
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-5xl leading-tight">
            Why VerdictAI?
          </h2>
          <div className="mt-6 space-y-4 text-base leading-8 text-slate-200">
            <p>AI assistants answer questions.</p>
            <p>VerdictAI analyzes how those answers represent your brand.</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
                Key Advantages
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                What clients gain with VerdictAI
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {advantages.map((item) => (
              <article
                key={item}
                className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F26419]/10 text-sm font-bold tracking-[0.18em] text-[#F26419]">
                  VA
                </div>
                <p className="mt-4 text-base font-semibold capitalize text-slate-900">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
