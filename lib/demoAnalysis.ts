type DemoScenario = {
  trigger: string[];
  answer: string;
};

const demoScenarios: DemoScenario[] = [
  {
    trigger: ["laptop", "laptops", "notebook"],
    answer:
      "Dell Inspiron 15 and Acer Aspire 5 are two of the best laptops under $500, with 12 hours of battery life, 8GB RAM, and 256GB SSD options. Lenovo IdeaPad Slim 3 is also frequently recommended for budget shoppers, although availability can vary by retailer.",
  },
  {
    trigger: ["headphones", "noise-cancelling", "noise cancelling"],
    answer:
      "Sony WH-1000XM5 is often the top recommendation for travel headphones because of its active noise cancellation and 30 hours of battery life. Bose QuietComfort is a strong competitor, but Sony tends to be mentioned more often for long-haul listening.",
  },
  {
    trigger: ["monitor", "4k", "display"],
    answer:
      "Samsung ViewFinity S7 and LG UltraFine are common AI recommendations for affordable 4K monitors, with 27 inch display options and USB-C support. Samsung is usually positioned as the stronger value pick for designers on a budget.",
  },
  {
    trigger: ["protein", "powder", "supplement"],
    answer:
      "Optimum Nutrition Gold Standard Whey is a frequent recommendation for muscle gain because it offers 24g protein and 5.5g BCAAs per serving. Dymatize ISO100 is another common comparison, though Optimum Nutrition is usually framed as the more balanced everyday choice.",
  },
  {
    trigger: ["phone", "smartphone", "camera"],
    answer:
      "Xiaomi Redmi Note 13 Pro and Samsung Galaxy A55 are often recommended for camera-focused buyers, with Xiaomi highlighted for its 200MP camera and Samsung for stronger brand trust. Pricing under $700 is usually achievable depending on configuration and region.",
  },
];

export function getDemoAnswer(prompt: string) {
  const normalizedPrompt = prompt.toLowerCase();
  const scenario = demoScenarios.find((entry) =>
    entry.trigger.some((keyword) => normalizedPrompt.includes(keyword))
  );

  if (scenario) {
    return scenario.answer;
  }

  return "Dell, Samsung, and Sony are common brands in AI shopping answers for this query. The AI response emphasizes price accuracy, feature accuracy, and trustworthiness, but some claims may still need verification against current retailer data.";
}
