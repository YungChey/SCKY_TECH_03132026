export type VerifiedProduct = {
  product: string;
  brand: string;
  category: string;
  price: number;
  features: string[];
  availability: "in stock" | "limited stock" | "out of stock";
  verificationSource: string;
  lastVerifiedAt: string;
  verificationSources: {
    officialBrandWebsite: string;
    productSpecificationPage: string;
    retailerListing: string;
    googleBusinessProfile: string;
    structuredProductSchema: string;
  };
};

export type BrandMention = {
  brandName: string;
  mentionCount: number;
  aiVisibilityScore: number;
};

export type EntityResolution = {
  resolvedBrand: string | null;
  resolvedProduct: string | null;
  verifiedProduct?: VerifiedProduct;
  confidence: "high" | "medium" | "low";
  reason: string;
};

export const productCatalog: VerifiedProduct[] = [
  {
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
  {
    product: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    price: 399,
    features: [
      "30 hours of battery life",
      "active noise cancellation",
      "bluetooth 5.2",
    ],
    availability: "limited stock",
    verificationSource: "Official Sony product page",
    lastVerifiedAt: "2026-03-12",
    verificationSources: {
      officialBrandWebsite: "Sony official website",
      productSpecificationPage: "Sony WH-1000XM5 product specification page",
      retailerListing: "Approved retailer listing feed",
      googleBusinessProfile: "Sony brand business profile",
      structuredProductSchema: "Schema.org Product markup feed",
    },
  },
  {
    product: "Samsung ViewFinity S7",
    brand: "Samsung",
    category: "monitor",
    price: 349,
    features: ["27 inch display", "4K screen", "HDR10", "USB-C"],
    availability: "in stock",
    verificationSource: "Official Samsung monitor catalog",
    lastVerifiedAt: "2026-03-12",
    verificationSources: {
      officialBrandWebsite: "Samsung official website",
      productSpecificationPage: "Samsung ViewFinity S7 product specification page",
      retailerListing: "Approved retailer listing feed",
      googleBusinessProfile: "Samsung brand business profile",
      structuredProductSchema: "Schema.org Product markup feed",
    },
  },
  {
    product: "Optimum Nutrition Gold Standard Whey",
    brand: "Optimum Nutrition",
    category: "supplement",
    price: 42,
    features: ["24g protein", "5.5g BCAAs", "double rich chocolate"],
    availability: "in stock",
    verificationSource: "Manufacturer nutrition label feed",
    lastVerifiedAt: "2026-03-12",
    verificationSources: {
      officialBrandWebsite: "Optimum Nutrition official website",
      productSpecificationPage: "Gold Standard Whey product specification page",
      retailerListing: "Approved retailer listing feed",
      googleBusinessProfile: "Optimum Nutrition brand business profile",
      structuredProductSchema: "Schema.org Product markup feed",
    },
  },
  {
    product: "Xiaomi Redmi Note 13 Pro",
    brand: "Xiaomi",
    category: "phone",
    price: 329,
    features: ["200MP camera", "8GB RAM", "256GB storage", "OLED display"],
    availability: "limited stock",
    verificationSource: "Official Xiaomi product page",
    lastVerifiedAt: "2026-03-12",
    verificationSources: {
      officialBrandWebsite: "Xiaomi official website",
      productSpecificationPage: "Redmi Note 13 Pro product specification page",
      retailerListing: "Approved retailer listing feed",
      googleBusinessProfile: "Xiaomi brand business profile",
      structuredProductSchema: "Schema.org Product markup feed",
    },
  },
];

export function findVerifiedProduct(
  prompt: string,
  productName: string | null,
  answer: string
) {
  const haystack = `${prompt} ${productName ?? ""} ${answer}`.toLowerCase();

  const exactMatch = productName
    ? productCatalog.find((product) =>
        productName.toLowerCase().includes(product.product.toLowerCase())
      )
    : undefined;

  if (exactMatch) {
    return exactMatch;
  }

  return productCatalog.find((product) => {
    return (
      haystack.includes(product.product.toLowerCase()) ||
      haystack.includes(product.brand.toLowerCase()) ||
      haystack.includes(product.category.toLowerCase())
    );
  });
}

export function resolveEntity(
  prompt: string,
  productName: string | null,
  answer: string,
  brandMentions: BrandMention[]
): EntityResolution {
  const normalizedAnswer = answer.toLowerCase();

  if (productName) {
    const exactProduct = productCatalog.find((product) =>
      productName.toLowerCase().includes(product.product.toLowerCase())
    );

    if (exactProduct) {
      return {
        resolvedBrand: exactProduct.brand,
        resolvedProduct: exactProduct.product,
        verifiedProduct: exactProduct,
        confidence: "high",
        reason:
          "The AI answer explicitly named a known product in the verification catalog.",
      };
    }
  }

  const explicitBrand = brandMentions.find((mention) =>
    normalizedAnswer.includes(mention.brandName.toLowerCase())
  );

  if (explicitBrand) {
    const candidateProducts = productCatalog.filter(
      (product) => product.brand === explicitBrand.brandName
    );

    return {
      resolvedBrand: explicitBrand.brandName,
      resolvedProduct:
        candidateProducts.length === 1 &&
        normalizedAnswer.includes(candidateProducts[0].product.toLowerCase())
          ? candidateProducts[0].product
          : null,
      verifiedProduct:
        candidateProducts.length === 1 &&
        normalizedAnswer.includes(candidateProducts[0].product.toLowerCase())
          ? candidateProducts[0]
          : undefined,
      confidence: "medium",
      reason:
        "The AI answer explicitly named a brand, but did not cleanly resolve to a single verified product.",
    };
  }

  return {
    resolvedBrand: null,
    resolvedProduct: null,
    confidence: "low",
    reason: `No explicit brand or product mention from the AI answer could be verified for the prompt "${prompt}".`,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractBrandMentions(answer: string): BrandMention[] {
  const normalizedAnswer = answer.toLowerCase();
  const mentions = new Map<string, number>();

  for (const product of productCatalog) {
    const brandPattern = new RegExp(`\\b${escapeRegExp(product.brand)}\\b`, "gi");
    const productPattern = new RegExp(
      `\\b${escapeRegExp(product.product)}\\b`,
      "gi"
    );

    const brandMatches = [...answer.matchAll(brandPattern)].length;
    const productMatches = [...answer.matchAll(productPattern)].length;
    const totalMatches = brandMatches + productMatches;

    if (totalMatches > 0 || normalizedAnswer.includes(product.brand.toLowerCase())) {
      mentions.set(product.brand, (mentions.get(product.brand) ?? 0) + Math.max(1, totalMatches));
    }
  }

  const totalMentionWeight = Array.from(mentions.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  return Array.from(mentions.entries())
    .map(([brandName, mentionCount]) => ({
      brandName,
      mentionCount,
      aiVisibilityScore:
        totalMentionWeight === 0
          ? 0
          : Math.round((mentionCount / totalMentionWeight) * 100),
    }))
    .sort((left, right) => right.mentionCount - left.mentionCount);
}
