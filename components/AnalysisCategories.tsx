const categories = [
  {
    title: "Product Accuracy",
    icon: "PA",
    blurb: "Tracks whether named products match verified catalog records.",
  },
  {
    title: "Price Accuracy",
    icon: "PR",
    blurb: "Flags price claims that drift from current verified pricing.",
  },
  {
    title: "Feature Accuracy",
    icon: "FA",
    blurb: "Checks claimed specs against verified feature data.",
  },
  {
    title: "Competitor Comparison",
    icon: "CC",
    blurb: "Measures how AI frames better-than and top-pick comparisons.",
  },
  {
    title: "Brand Visibility",
    icon: "BV",
    blurb: "Surfaces which brands are winning AI mention share.",
  },
];

export function AnalysisCategories() {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
            AI Analysis Categories
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">
            Recommendation audit lanes
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          Explore the key accuracy layers that shape a brand&apos;s Trust Score.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {categories.map((category) => (
          <button
            key={category.title}
            type="button"
            className="group rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[#F26419] hover:shadow-[0_18px_35px_rgba(242,100,25,0.16)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002855]/8 text-sm font-bold tracking-[0.18em] text-[#002855] group-hover:bg-[#F26419]/10 group-hover:text-[#F26419]">
              {category.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {category.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {category.blurb}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
