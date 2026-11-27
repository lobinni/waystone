// Central configuration. Every value that points at the deployed contract lives here.

import deployment from "../deployment.json";

const chain = deployment.contract.chain;
const links = deployment.contract.links;

/** The deployed contract address. NEXT_PUBLIC_WAYSTONE_ADDRESS overrides deployment.json at build time. */
export const CONTRACT_ADDRESS: string =
  (process.env.NEXT_PUBLIC_WAYSTONE_ADDRESS as string | undefined)?.trim() || String(deployment.contract.address ?? "").trim();

export const IS_DEPLOYED = /^0x[0-9a-fA-F]{40}$/.test(CONTRACT_ADDRESS);
export const NOT_DEPLOYED_NOTICE = "This site is not connected to a deployment yet. Run the deploy script from the repository root, then put the address it prints into deployment.json.";

export const CONTRACT_SOURCE: string = String(deployment.contract.source ?? "contracts/waystone.py");
export const CONTRACT_NAME: string = String(deployment.contract.name ?? "Waystone");

export const GITHUB_URL: string = String(links.github ?? "").trim();
export const X_URL: string = String(links.x ?? "").trim();
export const X_HANDLE: string = String(links.xHandle ?? "").trim();
export const GENLAYER_URL: string = String(links.genlayer ?? "https://www.genlayer.com");
export const GENLAYER_DOCS_URL: string = String(links.genlayerDocs ?? "https://docs.genlayer.com");

/** GenLayer Studionet — the exact same shape the reference project uses, with static values. */
export const CHAIN = {
  id: 61999,
  hex: "0xf22f",
  name: "GenLayer Studionet",
  rpc: (process.env.NEXT_PUBLIC_RPC_URL as string | undefined)?.trim() || String(chain.rpc),
  explorer: String(chain.explorer).replace(/\/$/, ""),
  currency: { name: "GEN Token", symbol: "GEN", decimals: 18 },
} as const;

export const explorerAddress = (addr: string) => `${CHAIN.explorer}/address/${addr}`;
export const explorerTx = (hash: string) => `${CHAIN.explorer}/tx/${hash}`;

/** Limits of the contract (see contracts/waystone.py). The forms validate with the same numbers. */
export const LIMITS = {
  title: [3, 60],
  rules: [20, 1200],
  claim: [12, 300],
  reason: [12, 300],
  rounds: [2, 14],
  entrants: [2, 12],
  roundLen: [60, 30 * 86400],
  startsIn: [60, 30 * 86400],
  grace: [0, 7 * 86400],
  review: [600, 30 * 86400],
  dispute: [120, 7 * 86400],
  doubt: [0, 100],
  minSliceWei: 10n ** 15n,
  maxStakeWei: 10n ** 24n,
  maxUrl: 300,
} as const;

export const DEFAULTS = { grace: 600, review: 3 * 86400, dispute: 3600, doubt: 35 } as const;
export const BOND_BPS = 2000n;
export const MIN_BOND_WEI = 10n ** 15n;
export const REWARD_BPS = 2500n;
export const BPS = 10000n;
export const AUDIT_PATIENCE = 86400;

export const KNOWN_CHAINS: Record<number, string> = {
  1: "Ethereum Mainnet",
  10: "OP Mainnet",
  56: "BNB Smart Chain",
  137: "Polygon",
  8453: "Base",
  42161: "Arbitrum One",
  11155111: "Sepolia",
  84532: "Base Sepolia",
  61999: "GenLayer Studionet",
};
