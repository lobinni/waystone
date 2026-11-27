import { DOC_BODIES } from "./content";
import type { IconName } from "../components/Icon";

export interface DocPage { slug: string; title: string; group: string; summary: string; icon: IconName; body?: string; custom?: "calculator" }

export const DOCS: DocPage[] = [
  { slug: "introduction", title: "Introduction", group: "Getting started", summary: "What Waystone is and the idea in one minute.", icon: "book", body: DOC_BODIES["introduction"] },
  { slug: "quickstart", title: "Quickstart", group: "Getting started", summary: "Create, join, claim, judge and settle a pool on this site.", icon: "zap", body: DOC_BODIES["quickstart"] },
  { slug: "wallet", title: "Wallet & network", group: "Getting started", summary: "EIP-6963 wallet discovery, connecting, disconnecting and switching to Studionet.", icon: "wallet", body: DOC_BODIES["wallet"] },
  { slug: "lifecycle", title: "Lifecycle & timing", group: "Concepts", summary: "Phases of a pool and every moment of a round.", icon: "clock", body: DOC_BODIES["lifecycle"] },
  { slug: "money", title: "Money rules", group: "Concepts", summary: "Slices, the pot, bonds, rewards and exact payouts.", icon: "coins", body: DOC_BODIES["money"] },
  { slug: "judge", title: "The AI judge", group: "Concepts", summary: "What the model sees, what it can say and why it can only withhold.", icon: "scale", body: DOC_BODIES["judge"] },
  { slug: "disputes", title: "Contests, audits & referee", group: "Concepts", summary: "How a judgement is challenged and how a pool never gets stuck.", icon: "gavel", body: DOC_BODIES["disputes"] },
  { slug: "reference", title: "Contract reference", group: "Reference", summary: "Every write method, every view and the JSON they return.", icon: "terminal", body: DOC_BODIES["reference"] },
  { slug: "limits", title: "Limits & numbers", group: "Reference", summary: "Ranges, defaults and enumerations used by the contract.", icon: "list", body: DOC_BODIES["limits"] },
  { slug: "errors", title: "Errors", group: "Reference", summary: "Every refusal the contract can raise and what to do about it.", icon: "alert", body: DOC_BODIES["errors"] },
  { slug: "calculator", title: "Calculators", group: "Reference", summary: "Try the payout arithmetic and a round-by-round schedule.", icon: "spark", custom: "calculator" },
  { slug: "security", title: "Trade-offs & security", group: "Guides", summary: "What the design protects against and what it cannot.", icon: "shield", body: DOC_BODIES["security"] },
  { slug: "run", title: "Run & test the contract", group: "Guides", summary: "Setup, local tests, the rehearsal and the live Studionet run.", icon: "terminal", body: DOC_BODIES["run"] },
  { slug: "frontend", title: "This website", group: "Guides", summary: "Configuration, build, deploy and how the app is organised.", icon: "layers", body: DOC_BODIES["frontend"] },
  { slug: "faq", title: "FAQ", group: "Guides", summary: "Short answers to common questions.", icon: "info", body: DOC_BODIES["faq"] },
];

export const GROUPS = ["Getting started", "Concepts", "Reference", "Guides"];
