export type Claim = {
  type: "price" | "feature" | "comparison" | "availability";
  value: string;
};

export type ExtractedClaims = {
  product: string | null;
  claims: Claim[];
};

const featurePatterns = [
  /\b\d+\s*(?:hours?|hrs?)\s+of\s+battery\s+life\b/gi,
  /\b\d+\s*(?:gb|tb)\s+(?:ram|memory|storage)\b/gi,
  /\b\d+(?:\.\d+)?\s*(?:inch|inches)\s+(?:display|screen)\b/gi,
  /\b(?:ssd|oled|retina|touchscreen)\b/gi,
];

const comparisonPatterns = [
  /\b(?:best|better than|faster than|cheaper than|top|most affordable)\b/gi,
];

const availabilityPatterns = [
  /\b(?:in stock|out of stock|limited stock|available now)\b/gi,
];

export function extractProductClaims(response: string): ExtractedClaims {
  const claims: Claim[] = [];

  const productMatch = response.match(
    /\b(?:The\s+)?([A-Z][a-zA-Z0-9&-]*(?:\s+[A-Z][a-zA-Z0-9&-]*){0,4})\b/
  );
  const priceMatch = response.match(
    /\b(?:under|below|less than|for)\s+\$?\d+(?:,\d{3})*(?:\.\d{2})?\b/i
  );

  if (priceMatch) {
    claims.push({ type: "price", value: priceMatch[0] });
  }

  for (const pattern of featurePatterns) {
    for (const match of response.matchAll(pattern)) {
      claims.push({ type: "feature", value: match[0] });
    }
  }

  for (const pattern of comparisonPatterns) {
    for (const match of response.matchAll(pattern)) {
      claims.push({ type: "comparison", value: match[0] });
    }
  }

  for (const pattern of availabilityPatterns) {
    for (const match of response.matchAll(pattern)) {
      claims.push({ type: "availability", value: match[0] });
    }
  }

  return {
    product: productMatch ? productMatch[1] : null,
    claims,
  };
}
