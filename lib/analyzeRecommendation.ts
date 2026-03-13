import type { Claim, ExtractedClaims } from "@/lib/extractProductClaims";
import type { EntityResolution, VerifiedProduct } from "@/lib/productCatalog";

export type FlaggedClaim = {
  claim: Claim;
  explanation: string;
};

export type ClaimVerificationStatus =
  | "Verified"
  | "Partially Verified"
  | "Unverified"
  | "Unknown";

export type ClaimVerification = {
  claim: Claim;
  status: ClaimVerificationStatus;
  explanation: string;
  sourcesUsed: string[];
};

export type RecommendationAnalysis = {
  brand: string | null;
  claimVerifications: ClaimVerification[];
  flaggedClaims: FlaggedClaim[];
  correctClaims: number;
  incorrectClaims: number;
  recommendedFixes: string[];
  verificationSummary: string;
  resolutionConfidence: EntityResolution["confidence"];
  trustScore: number;
  verdict: "Trustworthy" | "Questionable" | "Misleading";
  evidence: string[];
  objections: string[];
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/hrs?\b/g, "hours")
    .replace(/inches?\b/g, "inch")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNumber(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function comparePriceClaim(claimValue: string, verifiedPrice: number) {
  const normalized = normalizeText(claimValue);
  const claimNumber = extractNumber(normalized);

  if (claimNumber === null) {
    return {
      correct: false,
      explanation: `Could not verify price claim "${claimValue}".`,
    };
  }

  if (
    normalized.includes("under") ||
    normalized.includes("below") ||
    normalized.includes("less than")
  ) {
    return verifiedPrice <= claimNumber
      ? { correct: true, explanation: "" }
      : {
          correct: false,
          explanation: `Price claim "${claimValue}" conflicts with verified price of $${verifiedPrice}.`,
        };
  }

  if (normalized.includes("over") || normalized.includes("more than")) {
    return verifiedPrice >= claimNumber
      ? { correct: true, explanation: "" }
      : {
          correct: false,
          explanation: `Price claim "${claimValue}" conflicts with verified price of $${verifiedPrice}.`,
        };
  }

  return verifiedPrice === claimNumber
    ? { correct: true, explanation: "" }
    : {
        correct: false,
        explanation: `Claimed price "${claimValue}" does not match verified price of $${verifiedPrice}.`,
      };
}

function compareFeatureClaim(claimValue: string, verifiedFeatures: string[]) {
  const normalizedClaim = normalizeText(claimValue);
  const matched = verifiedFeatures.some((feature) => {
    const normalizedFeature = normalizeText(feature);
    return (
      normalizedFeature.includes(normalizedClaim) ||
      normalizedClaim.includes(normalizedFeature) ||
      extractNumber(normalizedFeature) === extractNumber(normalizedClaim)
    );
  });

  return matched
    ? { correct: true, explanation: "" }
    : {
        correct: false,
        explanation: `Feature claim "${claimValue}" was not found in the verified product specs.`,
      };
}

function compareAvailabilityClaim(
  claimValue: string,
  availability: VerifiedProduct["availability"]
) {
  return normalizeText(claimValue) === normalizeText(availability)
    ? { correct: true, explanation: "" }
    : {
        correct: false,
        explanation: `Availability claim "${claimValue}" is outdated. Verified availability is "${availability}".`,
      };
}

function getVerdict(trustScore: number) {
  if (trustScore >= 80) {
    return "Trustworthy";
  }

  if (trustScore >= 55) {
    return "Questionable";
  }

  return "Misleading";
}

function evaluateClaim(claim: Claim, verifiedProduct?: VerifiedProduct) {
  if (!verifiedProduct) {
    return {
      correct: false,
      status: "Unknown" as const,
      explanation:
        "No verified product record was available to confirm this claim.",
    };
  }

  if (claim.type === "price") {
    const result = comparePriceClaim(claim.value, verifiedProduct.price);
    return {
      ...result,
      status: result.correct ? ("Verified" as const) : ("Unverified" as const),
    };
  }

  if (claim.type === "feature") {
    const result = compareFeatureClaim(claim.value, verifiedProduct.features);
    return {
      ...result,
      status: result.correct
        ? ("Verified" as const)
        : extractNumber(claim.value) !== null
          ? ("Partially Verified" as const)
          : ("Unverified" as const),
    };
  }

  if (claim.type === "availability") {
    const result = compareAvailabilityClaim(claim.value, verifiedProduct.availability);
    return {
      ...result,
      status: result.correct ? ("Verified" as const) : ("Unverified" as const),
    };
  }

  return {
    correct: true,
    status: "Partially Verified" as const,
    explanation:
      "Comparison or quality claim was identified, but requires qualitative review against approved messaging.",
  };
}

export function analyzeRecommendation(
  extractedClaims: ExtractedClaims,
  resolution: EntityResolution
): RecommendationAnalysis {
  const verifiedProduct = resolution.verifiedProduct;
  const claimVerifications: ClaimVerification[] = [];
  const flaggedClaims: FlaggedClaim[] = [];
  const evidence: string[] = [];
  const objections: string[] = [];
  const recommendedFixes: string[] = [];
  let correctClaims = 0;
  let incorrectClaims = 0;

  for (const claim of extractedClaims.claims) {
    const evaluation = evaluateClaim(claim, verifiedProduct);
    const sourcesUsed = verifiedProduct
      ? [
          verifiedProduct.verificationSources.officialBrandWebsite,
          verifiedProduct.verificationSources.productSpecificationPage,
          verifiedProduct.verificationSources.retailerListing,
          verifiedProduct.verificationSources.googleBusinessProfile,
          verifiedProduct.verificationSources.structuredProductSchema,
        ]
      : [];

    claimVerifications.push({
      claim,
      status: evaluation.status,
      explanation: evaluation.explanation || `${claim.type} claim aligned with verified data.`,
      sourcesUsed,
    });

    if (evaluation.correct) {
      correctClaims += 1;
      if (claim.type !== "comparison") {
        evidence.push(`Verified ${claim.type} claim: ${claim.value}.`);
      } else {
        evidence.push(
          `Partially verified ${claim.type} claim: ${claim.value}. Qualitative review recommended.`
        );
      }
    } else {
      incorrectClaims += 1;
      flaggedClaims.push({ claim, explanation: evaluation.explanation });
      objections.push(evaluation.explanation);
      if (claim.type === "price") {
        recommendedFixes.push(
          "Update retailer and structured pricing data so AI systems see the current price ceiling and promo context."
        );
      } else if (claim.type === "feature") {
        recommendedFixes.push(
          "Refresh product specification pages and schema markup to reinforce the correct feature set."
        );
      } else if (claim.type === "availability") {
        recommendedFixes.push(
          "Synchronize stock and availability feeds to reduce outdated inventory claims."
        );
      }
    }
  }

  if (verifiedProduct) {
    evidence.unshift(
      `Matched verified catalog record for ${verifiedProduct.product} by ${verifiedProduct.brand}.`
    );
    evidence.push(
      `Current availability: ${verifiedProduct.availability}. Verified price: $${verifiedProduct.price}.`
    );
    evidence.push(
      `Verification source: ${verifiedProduct.verificationSource}. Last verified: ${verifiedProduct.lastVerifiedAt}.`
    );
  } else {
    objections.unshift(
      `${resolution.reason} Confidence is reduced until a verified brand or product match is available.`
    );
    recommendedFixes.push(
      "Ensure AI-facing product content explicitly names the brand and product to improve entity resolution confidence."
    );
  }

  const verifiableClaims = correctClaims + incorrectClaims;
  const scoreBase =
    verifiableClaims === 0 ? (verifiedProduct ? 70 : 40) : Math.round((correctClaims / verifiableClaims) * 100);
  const confidencePenalty =
    resolution.confidence === "high" ? 0 : resolution.confidence === "medium" ? 8 : 18;
  const trustScore = Math.max(
    20,
    verifiedProduct ? scoreBase - confidencePenalty : Math.max(25, scoreBase - 10 - confidencePenalty)
  );
  const verdict = getVerdict(trustScore);

  if (objections.length === 0) {
    objections.push("No material inconsistencies were identified in the extracted claims.");
  }

  if (recommendedFixes.length === 0) {
    recommendedFixes.push(
      "Maintain current product feeds and continue periodic retesting to preserve AI accuracy."
    );
  }

  return {
    brand: resolution.resolvedBrand ?? verifiedProduct?.brand ?? extractedClaims.product?.split(" ")[0] ?? null,
    claimVerifications,
    flaggedClaims,
    correctClaims,
    incorrectClaims,
    recommendedFixes: Array.from(new Set(recommendedFixes)),
    verificationSummary: verifiedProduct
      ? `Claims were checked against official brand websites, product specification pages, retailer listings, Google Business profiles, and structured product schema. Primary verification source: ${verifiedProduct.verificationSource}. Last verified: ${verifiedProduct.lastVerifiedAt}. Entity resolution confidence: ${resolution.confidence}.`
      : `No verified product match was confirmed, so claim status remains limited. Entity resolution confidence: ${resolution.confidence}.`,
    resolutionConfidence: resolution.confidence,
    trustScore,
    verdict,
    evidence,
    objections,
  };
}
