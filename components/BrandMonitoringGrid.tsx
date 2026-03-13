import { BrandCard } from "@/components/BrandCard";
import type { AccuracyIndicator } from "@/components/BrandCard";

type BrandMonitoringGridProps = {
  brands: Array<{
    brandName: string;
    trustScore: number;
    aiVisibilityScore: number;
    accuracyIndicator: AccuracyIndicator;
  }>;
};

export function BrandMonitoringGrid({ brands }: BrandMonitoringGridProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
            Brand Monitoring Grid
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">
            Featured brands in AI answers
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          Monitor which brands are being surfaced, how often they appear, and
          whether those mentions stay accurate.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <BrandCard key={brand.brandName} {...brand} />
        ))}
      </div>
    </section>
  );
}
