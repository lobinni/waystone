// The one place that knows where the contract lives.
//
// Order of precedence for the address:
//   1. the WAYSTONE_ADDRESS environment variable (a one-off run against another deployment)
//   2. deployment.json -> contract.address       (the file `node scripts/deploy.mjs` writes)
//   3. .waystone-address                        (a plain text file, kept for older tooling)
//
// Everything that needs the address - the deploy script, the live run and the website - goes through this module,
// so moving the contract to a new address is one edit of deployment.json.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const deploymentUrl = new URL("deployment.json", root);
const flatUrl = new URL(".waystone-address", root);

export function readDeployment() {
  if (!existsSync(deploymentUrl)) return null;
  try {
    return JSON.parse(readFileSync(deploymentUrl, "utf8"));
  } catch (err) {
    throw new Error(`deployment.json is not valid JSON: ${String(err?.message ?? err)}`);
  }
}

/** @returns {{address: string, source: string, origin: "env" | "deployment" | "flat" | "none"}} */
export function resolveAddress(explicit = process.env.WAYSTONE_ADDRESS) {
  const env = (explicit ?? "").trim();
  if (env) return { address: env, source: "contracts/waystone.py", origin: "env" };

  const file = readDeployment();
  const stored = String(file?.contract?.address ?? "").trim();
  if (stored) return { address: stored, source: String(file?.contract?.source ?? "contracts/waystone.py"), origin: "deployment" };

  if (existsSync(flatUrl)) {
    const flat = readFileSync(flatUrl, "utf8").trim();
    if (flat) return { address: flat, source: "contracts/waystone.py", origin: "flat" };
  }
  return { address: "", source: "contracts/waystone.py", origin: "none" };
}

/** Writes the address everywhere the rest of the project looks for it. */
export function writeAddress(address, { hash = "", source = "contracts/waystone.py" } = {}) {
  const file = readDeployment() ?? {
    $comment: "Single source of truth for the deployed contract. Change contract.address here and every script and the website follow.",
    contract: { name: "Waystone", source, address: "", deployedAt: "", chain: {}, links: {} },
  };
  file.contract ??= {};
  file.contract.address = address;
  file.contract.source = source;
  if (hash) file.contract.lastTx = hash;
  file.contract.deployedAt = new Date().toISOString();
  writeFileSync(deploymentUrl, JSON.stringify(file, null, 2) + "\n");
  writeFileSync(flatUrl, address + "\n");
  return file;
}
