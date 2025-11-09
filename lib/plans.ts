export type CreditPackId = "starter" | "plus" | "pro";

interface CreditPack {
  id: CreditPackId;
  name: string;
  description: string;
  credits: number;
  priceLabel: string;
  highlight?: boolean;
  planTier?: "free" | "plus" | "pro";
  features: string[];
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Run quick spot checks and keep personal chats factual.",
    credits: 50,
    priceLabel: "$9",
    features: ["One-time purchase", "Ideal for individuals", "Includes share cards"],
  },
  {
    id: "plus",
    name: "Plus",
    description: "Monitor multiple channels with scheduled verifications.",
    credits: 150,
    priceLabel: "$19",
    highlight: true,
    planTier: "plus",
    features: [
      "Batch trend analysis",
      "Priority processing",
      "Assign teammates",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Unlimited fact-checking for newsrooms and agencies.",
    credits: 0,
    priceLabel: "$49",
    planTier: "pro",
    features: [
      "Unlimited verifications",
      "Premium support",
      "API + Dashboard access",
    ],
  },
];
