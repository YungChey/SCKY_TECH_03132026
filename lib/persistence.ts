import type { RecommendationAnalysis } from "@/lib/analyzeRecommendation";
import type { ExtractedClaims } from "@/lib/extractProductClaims";
import { prisma } from "@/lib/prisma";
import type {
  BrandMention,
  EntityResolution,
  VerifiedProduct,
} from "@/lib/productCatalog";

type PersistAnalysisInput = {
  prompt: string;
  answer: string;
  source: "openai" | "demo";
  model: string;
  modeMessage?: string;
  claims: ExtractedClaims;
  brandMentions: BrandMention[];
  verifiedProduct?: VerifiedProduct;
  resolution: EntityResolution;
  analysis: RecommendationAnalysis;
};

function categorizeFix(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes("schema")) {
    return "schema";
  }

  if (
    normalized.includes("price") ||
    normalized.includes("retailer") ||
    normalized.includes("promo")
  ) {
    return "pricing";
  }

  if (normalized.includes("stock") || normalized.includes("availability")) {
    return "inventory";
  }

  if (normalized.includes("brand") || normalized.includes("product")) {
    return "entity";
  }

  return "content";
}

function mapVerificationStatus(status: RecommendationAnalysis["claimVerifications"][number]["status"]) {
  if (status === "Partially Verified") {
    return "PartiallyVerified" as const;
  }

  return status;
}

function mapVerdict(verdict: RecommendationAnalysis["verdict"]) {
  return verdict;
}

function parseVerifiedDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function upsertVerifiedProduct(verifiedProduct?: VerifiedProduct) {
  if (!verifiedProduct) {
    return { brandId: null, productId: null };
  }

  const brand = await prisma.brand.upsert({
    where: { name: verifiedProduct.brand },
    update: {
      status: "Active",
    },
    create: {
      name: verifiedProduct.brand,
      status: "Active",
    },
  });

  const product = await prisma.product.upsert({
    where: {
      brandId_name: {
        brandId: brand.id,
        name: verifiedProduct.product,
      },
    },
    update: {
      category: verifiedProduct.category,
      price: verifiedProduct.price,
      availability: verifiedProduct.availability,
      verificationSource: verifiedProduct.verificationSource,
      lastVerifiedAt: parseVerifiedDate(verifiedProduct.lastVerifiedAt),
      officialBrandWebsite:
        verifiedProduct.verificationSources.officialBrandWebsite,
      productSpecificationPage:
        verifiedProduct.verificationSources.productSpecificationPage,
      retailerListing: verifiedProduct.verificationSources.retailerListing,
      googleBusinessProfile:
        verifiedProduct.verificationSources.googleBusinessProfile,
      structuredProductSchema:
        verifiedProduct.verificationSources.structuredProductSchema,
      featureSnapshot: JSON.stringify(verifiedProduct.features),
    },
    create: {
      brandId: brand.id,
      name: verifiedProduct.product,
      category: verifiedProduct.category,
      price: verifiedProduct.price,
      availability: verifiedProduct.availability,
      verificationSource: verifiedProduct.verificationSource,
      lastVerifiedAt: parseVerifiedDate(verifiedProduct.lastVerifiedAt),
      officialBrandWebsite:
        verifiedProduct.verificationSources.officialBrandWebsite,
      productSpecificationPage:
        verifiedProduct.verificationSources.productSpecificationPage,
      retailerListing: verifiedProduct.verificationSources.retailerListing,
      googleBusinessProfile:
        verifiedProduct.verificationSources.googleBusinessProfile,
      structuredProductSchema:
        verifiedProduct.verificationSources.structuredProductSchema,
      featureSnapshot: JSON.stringify(verifiedProduct.features),
    },
  });

  return { brandId: brand.id, productId: product.id };
}

export async function persistAnalysisRun(input: PersistAnalysisInput) {
  const { brandId, productId } = await upsertVerifiedProduct(input.verifiedProduct);

  const fallbackBrandName =
    input.resolution.resolvedBrand ?? input.analysis.brand ?? null;
  let fallbackBrandId = brandId;

  if (!fallbackBrandId && fallbackBrandName) {
    const brand = await prisma.brand.upsert({
      where: { name: fallbackBrandName },
      update: {
        status: input.claims.claims.length > 0 ? "Active" : "Unknown",
      },
      create: {
        name: fallbackBrandName,
        status: input.claims.claims.length > 0 ? "Active" : "Unknown",
      },
    });
    fallbackBrandId = brand.id;
  }

  return prisma.analysisRun.create({
    data: {
      prompt: input.prompt,
      rawAnswer: input.answer,
      source: input.source,
      model: input.model,
      modeMessage: input.modeMessage,
      extractedProductName: input.claims.product,
      resolvedBrandName: input.resolution.resolvedBrand,
      resolvedProductName: input.resolution.resolvedProduct,
      resolutionReason: input.resolution.reason,
      resolutionConfidence: input.resolution.confidence,
      trustScore: input.analysis.trustScore,
      verdict: mapVerdict(input.analysis.verdict),
      correctClaims: input.analysis.correctClaims,
      incorrectClaims: input.analysis.incorrectClaims,
      verificationSummary: input.analysis.verificationSummary,
      brandId: fallbackBrandId,
      productId,
      claims: {
        create: input.claims.claims.map((claim, index) => {
          const verification = input.analysis.claimVerifications.find(
            (item) =>
              item.claim.type === claim.type && item.claim.value === claim.value
          );

          const flagged = input.analysis.flaggedClaims.some(
            (item) =>
              item.claim.type === claim.type && item.claim.value === claim.value
          );

          return {
            type: claim.type,
            value: claim.value,
            verificationStatus: verification
              ? mapVerificationStatus(verification.status)
              : "Unknown",
            verificationExplanation:
              verification?.explanation ??
              "No verification explanation was recorded for this claim.",
            isFlagged: flagged,
            sortOrder: index,
            sources: {
              create: (verification?.sourcesUsed ?? []).map((label, sourceIndex) => ({
                label,
                sortOrder: sourceIndex,
              })),
            },
          };
        }),
      },
      brandMentions: {
        create: input.brandMentions.map((mention) => ({
          brandName: mention.brandName,
          mentionCount: mention.mentionCount,
          aiVisibilityScore: mention.aiVisibilityScore,
        })),
      },
      recommendedFixes: {
        create: input.analysis.recommendedFixes.map((text, index) => ({
          category: categorizeFix(text),
          text,
          sortOrder: index,
        })),
      },
      evidenceItems: {
        create: input.analysis.evidence.map((text, index) => ({
          text,
          sortOrder: index,
        })),
      },
      objectionItems: {
        create: input.analysis.objections.map((text, index) => ({
          text,
          sortOrder: index,
        })),
      },
    },
  });
}
