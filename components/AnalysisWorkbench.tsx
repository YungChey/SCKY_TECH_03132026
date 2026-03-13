"use client";

import { useMemo, useState } from "react";
import { AnalysisCategories } from "@/components/AnalysisCategories";
import type { AccuracyIndicator } from "@/components/BrandCard";
import { BrandMonitoringGrid } from "@/components/BrandMonitoringGrid";
import { EvidencePanel } from "@/components/EvidencePanel";
import { NavigationBar } from "@/components/NavigationBar";
import { ObjectionPanel } from "@/components/ObjectionPanel";
import { TrustScoreDashboard } from "@/components/TrustScoreDashboard";
import { VerdictPanel } from "@/components/VerdictPanel";
import type { RecommendationAnalysis } from "@/lib/analyzeRecommendation";
import type { ExtractedClaims } from "@/lib/extractProductClaims";
import {
  extractBrandMentions,
  productCatalog,
  type BrandMention,
  type EntityResolution,
  type VerifiedProduct,
} from "@/lib/productCatalog";

type AnalysisResponse = {
  prompt: string;
  answer: string;
  claims: ExtractedClaims;
  brandMentions: BrandMention[];
  verifiedProduct?: VerifiedProduct;
  resolution?: EntityResolution;
  analysis: RecommendationAnalysis;
  source?: "openai" | "demo";
  modeMessage?: string;
};

const initialData: AnalysisResponse = {
  prompt: "Best laptops under $500",
  answer:
    "The Dell Inspiron 15 is one of the best laptops under $500, with 12 hours of battery life, 8GB RAM, and a 256GB SSD. It is currently in stock and offers strong everyday value.",
  claims: {
    product: "Dell Inspiron 15",
    claims: [
      { type: "price", value: "under $500" },
      { type: "feature", value: "12 hours of battery life" },
      { type: "feature", value: "8GB RAM" },
      { type: "feature", value: "256GB SSD" },
      { type: "availability", value: "in stock" },
      { type: "comparison", value: "best" },
    ],
  },
  brandMentions: [
    {
      brandName: "Dell",
      mentionCount: 2,
      aiVisibilityScore: 100,
    },
  ],
  verifiedProduct: {
    product: "Dell Inspiron 15",
    brand: "Dell",
    category: "laptop",
    price: 479,
    features: [
      "12 hours of battery life",
      "15.6 inch display",
      "8GB RAM",
      "256GB SSD",
    ],
    availability: "in stock",
    verificationSource: "Manufacturer catalog + structured product feed",
    lastVerifiedAt: "2026-03-12",
    verificationSources: {
      officialBrandWebsite: "Dell official website",
      productSpecificationPage: "Dell Inspiron 15 product specification page",
      retailerListing: "Approved retailer listing feed",
      googleBusinessProfile: "Dell brand business profile",
      structuredProductSchema: "Schema.org Product markup feed",
    },
  },
  resolution: {
    resolvedBrand: "Dell",
    resolvedProduct: "Dell Inspiron 15",
    confidence: "high",
    reason:
      "The AI answer explicitly named a known product in the verification catalog.",
    verifiedProduct: {
      product: "Dell Inspiron 15",
      brand: "Dell",
      category: "laptop",
      price: 479,
      features: [
        "12 hours of battery life",
        "15.6 inch display",
        "8GB RAM",
        "256GB SSD",
      ],
      availability: "in stock",
      verificationSource: "Manufacturer catalog + structured product feed",
      lastVerifiedAt: "2026-03-12",
      verificationSources: {
        officialBrandWebsite: "Dell official website",
        productSpecificationPage: "Dell Inspiron 15 product specification page",
        retailerListing: "Approved retailer listing feed",
        googleBusinessProfile: "Dell brand business profile",
        structuredProductSchema: "Schema.org Product markup feed",
      },
    },
  },
  analysis: {
    brand: "Dell",
    flaggedClaims: [],
    correctClaims: 4,
    incorrectClaims: 0,
    recommendedFixes: [
      "Maintain current product feeds and continue periodic retesting to preserve AI accuracy.",
    ],
    verificationSummary:
      "Claims were checked against official brand websites, product specification pages, retailer listings, Google Business profiles, and structured product schema. Primary verification source: Manufacturer catalog + structured product feed. Last verified: 2026-03-12. Entity resolution confidence: high.",
    resolutionConfidence: "high",
    claimVerifications: [
      {
        claim: { type: "price", value: "under $500" },
        status: "Verified",
        explanation: "price claim aligned with verified data.",
        sourcesUsed: [
          "Dell official website",
          "Dell Inspiron 15 product specification page",
          "Approved retailer listing feed",
          "Dell brand business profile",
          "Schema.org Product markup feed",
        ],
      },
      {
        claim: { type: "feature", value: "12 hours of battery life" },
        status: "Verified",
        explanation: "feature claim aligned with verified data.",
        sourcesUsed: [
          "Dell official website",
          "Dell Inspiron 15 product specification page",
          "Approved retailer listing feed",
          "Dell brand business profile",
          "Schema.org Product markup feed",
        ],
      },
    ],
    trustScore: 100,
    verdict: "Trustworthy",
    evidence: [
      "Matched verified catalog record for Dell Inspiron 15 by Dell.",
      "Verified price claim: under $500.",
      "Verified feature claim: 12 hours of battery life.",
      "Verified feature claim: 8GB RAM.",
      "Verified feature claim: 256GB SSD.",
      "Verified availability claim: in stock.",
      "Current availability: in stock. Verified price: $479.",
    ],
    objections: [
      "No material inconsistencies were identified in the extracted claims.",
    ],
  },
  source: "demo",
  modeMessage:
    "Demo mode is active. Live OpenAI analysis will appear automatically once credentials are configured.",
};

const pricingTiers: Array<{
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
}> = [
  {
    name: "Starter",
    price: "$49/month",
    features: [
      "Basic brand monitoring",
      "AI visibility score",
      "Up to 20 prompt analyses per month",
      "Monthly report",
    ],
  },
  {
    name: "Professional",
    price: "$199/month",
    features: [
      "Competitor tracking",
      "Real-time objection alerts",
      "Up to 100 prompt analyses",
      "Weekly analytics reports",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$499/month",
    features: [
      "Unlimited prompt analyses",
      "API access",
      "Deep analytics dashboard",
      "Multi-brand monitoring",
    ],
  },
] as const;

const promotionalOffers: Array<{
  title: string;
  description: string;
  badge?: string;
}> = [
  {
    title: "14-Day Free Trial",
    description:
      "New businesses can try VerdictAI for 14 days with access to AI recommendation monitoring and brand visibility insights.",
  },
  {
    title: "Early Adopter Program",
    badge: "Limited Offer",
    description:
      "Early customers receive 50% off their subscription for the first 6 months.",
  },
  {
    title: "Referral Program",
    description:
      "Refer another business to VerdictAI and both companies receive 1 month free.",
  },
] as const;

export function AnalysisWorkbench() {
  const [prompt, setPrompt] = useState(initialData.prompt);
  const [result, setResult] = useState<AnalysisResponse>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!prompt.trim()) {
      setError("Enter a prompt before starting analysis.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const payload = (await response.json()) as AnalysisResponse & {
        error?: string;
        details?: string;
      };

      if (!response.ok) {
        throw new Error(payload.details || payload.error || "Analysis failed.");
      }

      setResult(payload);
      setError(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unexpected error while analyzing the prompt."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const brandCards = useMemo(() => {
    const dynamicBrands =
      result.brandMentions.length > 0
        ? result.brandMentions
        : extractBrandMentions(result.answer);

    const featuredBrands = dynamicBrands.map((mention, index) => {
      const matchedProduct = productCatalog.find(
        (product) => product.brand === mention.brandName
      );
      let accuracyIndicator: AccuracyIndicator;

      const derivedTrustScore =
        mention.brandName === result.analysis.brand
          ? result.analysis.trustScore
          : matchedProduct
            ? Math.max(
                45,
                Math.min(
                  90,
                  Math.round(
                    result.analysis.trustScore -
                      Math.max(8, result.analysis.incorrectClaims * 6) +
                      matchedProduct.features.length * 2 -
                      index * 3
                  )
                )
              )
            : Math.max(40, result.analysis.trustScore - 20 - index * 4);

      if (derivedTrustScore >= 80) {
        accuracyIndicator =
          "high";
      } else if (derivedTrustScore >= 55) {
        accuracyIndicator = "medium";
      } else {
        accuracyIndicator = "low";
      }

      return {
        brandName: mention.brandName,
        aiVisibilityScore: mention.aiVisibilityScore,
        trustScore: derivedTrustScore,
        accuracyIndicator,
      };
    });

    const deduped = new Map(
      featuredBrands.map((brand) => [brand.brandName, brand])
    );
    return Array.from(deduped.values()).slice(0, 6);
  }, [
    result.analysis.brand,
    result.analysis.incorrectClaims,
    result.analysis.trustScore,
    result.answer,
    result.brandMentions,
  ]);

  const hallucinationRate =
    result.analysis.correctClaims + result.analysis.incorrectClaims === 0
      ? 0
      : Math.round(
          (result.analysis.incorrectClaims /
            (result.analysis.correctClaims + result.analysis.incorrectClaims)) *
            100
        );
  const visibilityScore = brandCards.find(
    (brand) => brand.brandName === result.analysis.brand
  )?.aiVisibilityScore ?? (brandCards[0]?.aiVisibilityScore ?? 0);
  const productAccuracyScore =
    result.analysis.correctClaims + result.analysis.incorrectClaims === 0
      ? result.analysis.trustScore
      : Math.round(
          (result.analysis.correctClaims /
            (result.analysis.correctClaims + result.analysis.incorrectClaims)) *
            100
        );
  const businessStatus =
    result.claims.claims.length > 0 ? "Active" : "Unknown";

  const metrics = [
    {
      label: "Overall Trust Score",
      value: result.analysis.trustScore,
      tone:
        result.analysis.trustScore >= 80
          ? "emerald"
          : result.analysis.trustScore >= 55
            ? "orange"
            : "rose",
    },
    {
      label: "Hallucination Rate",
      value: hallucinationRate,
      tone: hallucinationRate < 25 ? "emerald" : hallucinationRate < 45 ? "orange" : "rose",
    },
    {
      label: "AI Visibility Score",
      value: visibilityScore,
      tone: "navy",
    },
    {
      label: "Product Accuracy Score",
      value: productAccuracyScore,
      tone:
        productAccuracyScore >= 80
          ? "emerald"
          : productAccuracyScore >= 55
            ? "orange"
            : "rose",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <NavigationBar
        prompt={prompt}
        isLoading={isLoading}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
      />

      <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-[#002855] p-7 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              Live AI Monitoring
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
              Brand trust intelligence for AI recommendations
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Inspired by modern shopping dashboards, rebuilt for AI analytics.
              Track AI visibility, pricing accuracy, feature accuracy, and final
              Trust Scores across brands.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Business status
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {businessStatus}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Claims extracted
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {result.claims.claims.length}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Verdict label
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {result.analysis.verdict}
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700/70">
              Live Analysis
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Prompt
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {result.prompt}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  AI Response Analysis
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {result.answer}
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {result.analysis.verificationSummary}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Product under review
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {result.resolution?.resolvedProduct
                    ? `${result.resolution.resolvedProduct} by ${result.resolution.resolvedBrand}`
                    : result.resolution?.resolvedBrand
                      ? `${result.resolution.resolvedBrand} (product unresolved)`
                      : "No matching product record found"}
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Resolution confidence: {result.analysis.resolutionConfidence}. {result.resolution?.reason}
                </p>
              </div>
              {error ? (
                <p className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </p>
              ) : null}
            </div>
          </aside>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
                Create Account - Coming Soon
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                SaaS plans for AI brand intelligence
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Pricing is structured for teams that want continuous AI shopping
              monitoring, evidence-backed audits, and brand trust reporting.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className={`rounded-[1.75rem] border p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${
                  tier.featured
                    ? "border-[#F26419] bg-[linear-gradient(180deg,#fff7f2,#ffe3d1)]"
                    : tier.name === "Enterprise"
                      ? "border-[#002855]/25 bg-[linear-gradient(180deg,#ffffff,#eef4ff)]"
                      : "border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {tier.name}
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-slate-950">
                      {tier.price}
                    </p>
                  </div>
                  {tier.featured ? (
                    <span className="rounded-full bg-[#F26419] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      Popular
                    </span>
                  ) : null}
                </div>

                <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                    tier.featured
                      ? "bg-[#F26419] text-white hover:bg-[#002855]"
                      : tier.name === "Enterprise"
                        ? "bg-[#002855] text-white hover:bg-[#F26419]"
                        : "bg-slate-100 text-slate-900 hover:bg-[#F26419] hover:text-white"
                  }`}
                >
                  Create Account (Coming Soon)
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
                Promotions & Early Access Benefits
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                Incentives for new businesses
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Promotional offers are designed to help new businesses start
              monitoring AI shopping answers with lower adoption friction.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {promotionalOffers.map((offer) => (
              <article
                key={offer.title}
                className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">
                    {offer.title}
                  </p>
                  {offer.badge ? (
                    <span className="rounded-full border border-[#F26419] bg-[#F26419]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                      {offer.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {offer.description}
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#F26419] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#002855]"
                >
                  Join Early Access
                </button>
              </article>
            ))}
          </div>
        </section>

        <AnalysisCategories />
        <BrandMonitoringGrid brands={brandCards} />
        <TrustScoreDashboard metrics={[...metrics]} />

        <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F26419]">
                Evidence and Objections
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                Courtroom review of extracted claims
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.claims.claims.map((claim) => {
                const verification = result.analysis.claimVerifications.find(
                  (entry) =>
                    entry.claim.type === claim.type &&
                    entry.claim.value === claim.value
                );

                const statusStyles =
                  verification?.status === "Verified"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : verification?.status === "Partially Verified"
                      ? "border-[#F26419]/30 bg-[#F26419]/10 text-[#F26419]"
                      : verification?.status === "Unverified"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-slate-50 text-slate-600";

                return (
                  <span
                    key={`${claim.type}-${claim.value}`}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusStyles}`}
                    title={verification?.sourcesUsed.join(" | ")}
                  >
                    {claim.type}: {claim.value}
                    {verification ? ` · ${verification.status}` : ""}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <EvidencePanel items={result.analysis.evidence} />
            <ObjectionPanel items={result.analysis.objections} />
            <VerdictPanel
              trustScore={result.analysis.trustScore}
              summary={`${result.analysis.verdict}. ${result.analysis.correctClaims} claims were supported, ${result.analysis.incorrectClaims} were challenged, and the current Trust Score reflects brand visibility, verification strength, and entity resolution confidence. Next best action: ${result.analysis.recommendedFixes[0]}`}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
