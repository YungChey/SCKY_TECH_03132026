import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const defaultPromptLibrary = [
  "best laptops under $500",
  "best noise-cancelling headphones",
  "affordable 4k monitors",
  "best phone with a good camera",
  "protein powder for muscle gain",
];

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export async function GET() {
  try {
    const recentRuns = await prisma.analysisRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        brand: true,
        brandMentions: true,
        claims: true,
      },
    });

    const allRuns = await prisma.analysisRun.findMany({
      orderBy: { createdAt: "asc" },
      take: 30,
      include: {
        brand: true,
        claims: true,
      },
    });

    const promptLibrary = Array.from(
      new Set([...recentRuns.map((run) => run.prompt), ...defaultPromptLibrary])
    )
      .slice(0, 8)
      .map((prompt) => ({ prompt }));

    const averageTrustScore =
      allRuns.length > 0
        ? Math.round(
            allRuns.reduce((sum, run) => sum + run.trustScore, 0) / allRuns.length
          )
        : 0;

    const averageHallucinationRate =
      allRuns.length > 0
        ? Math.round(
            allRuns.reduce((sum, run) => {
              const total = run.correctClaims + run.incorrectClaims;
              return sum + (total === 0 ? 0 : (run.incorrectClaims / total) * 100);
            }, 0) / allRuns.length
          )
        : 0;

    const trendSeries = allRuns.slice(-6).map((run) => ({
      label: formatDateLabel(run.createdAt),
      trustScore: run.trustScore,
      hallucinationRate:
        run.correctClaims + run.incorrectClaims === 0
          ? 0
          : Math.round(
              (run.incorrectClaims / (run.correctClaims + run.incorrectClaims)) *
                100
            ),
    }));

    const brandFrequency = new Map<string, number>();
    for (const run of recentRuns) {
      const brandName = run.brand?.name ?? run.resolvedBrandName;
      if (!brandName) continue;
      brandFrequency.set(brandName, (brandFrequency.get(brandName) ?? 0) + 1);
    }

    const topBrands = Array.from(brandFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      promptLibrary,
      recentRuns: recentRuns.map((run) => ({
        id: run.id,
        prompt: run.prompt,
        brand: run.brand?.name ?? run.resolvedBrandName ?? "Unknown",
        product: run.resolvedProductName,
        trustScore: run.trustScore,
        verdict: run.verdict,
        createdAt: run.createdAt,
        claimCount: run.claims.length,
        incorrectClaims: run.incorrectClaims,
        resolutionConfidence: run.resolutionConfidence,
      })),
      trends: {
        totalRuns: allRuns.length,
        averageTrustScore,
        averageHallucinationRate,
        topBrands,
        trendSeries,
      },
    });
  } catch (error) {
    console.error("Failed to load insights", error);
    return NextResponse.json(
      {
        promptLibrary: [],
        recentRuns: [],
        trends: {
          totalRuns: 0,
          averageTrustScore: 0,
          averageHallucinationRate: 0,
          topBrands: [],
          trendSeries: [],
        },
      },
      { status: 200 }
    );
  }
}
