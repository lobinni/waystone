# Deployment and the contract address

Everything in this repository that needs the address of the contract reads it from one file. There is no second
copy, no address baked into a build, and no address hard-coded in a script.

---

## The file

`deployment.json` sits at the repository root:

```json
{
  "contract": {
    "name": "Waystone",
    "source": "contracts/waystone.py",
    "address": "0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85",
    "deployedAt": "2026-11-27T11:09:23Z",
    "chain": {
      "id": 61999,
      "hex": "0xf22f",
      "name": "GenLayer Studionet",
      "rpc": "https://studio.genlayer.com/api",
      "explorer": "https://genlayer-explorer.vercel.app",
      "currency": { "name": "GEN Token", "symbol": "GEN", "decimals": 18 }
    },
    "links": { "github": "", "x": "", "xHandle": "", "genlayer": "...", "genlayerDocs": "..." }
  }
}
```

`address` empty means "not deployed yet": the website says so on every screen that needs the contract instead of
showing errors, and the live run deploys a fresh contract when it starts. It is not empty in this repository.

The chain block is the network the contract lives on. Changing it — a different RPC endpoint, a different explorer,
a different chain id — is the same one-file edit.

---

## Who reads it

| reader                          | what it takes from the file                                                     |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `src/config.ts`                | the address, the chain, the explorer links; the whole website follows           |
| `scripts/deployment.mjs`       | resolves the address for every script and writes it back after a deploy         |
| `scripts/deploy.mjs`           | writes the address after a successful deployment                               |
| `scripts/e2e.mjs`              | the address to run the scenarios against                                       |
| `.waystone-address`            | a plain-text copy, written for older tooling and read as the last fallback      |

---

## Precedence

The address is resolved in this order, first hit wins:

1. the `WAYSTONE_ADDRESS` environment variable — a one-off run against a different deployment;
2. `deployment.json` → `contract.address` — the normal case;
3. `.waystone-address` — the flat fallback;
4. nothing — the caller decides what to do (the website shows the notice, the live run deploys).

---

## The live deployment in this repository

| field        | value                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| address      | `0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85`                                   |
| network      | GenLayer Studionet, chain id 61999                                             |
| deployer     | `0xc782a9C1Ee1cFdc7D26AAa3c0649Cd6827fd6246`                                   |
| deployment   | `0x953b86bc76a5524eea9d1daaadd314f859f91de71118b474387b51b4e33e07ef`            |
| decided at   | 2026-11-27T11:09:23Z                                                           |
| explorer     | <https://explorer-studio.genlayer.com/address/0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85> |

The same values are recorded in `deployment.json` and copied as plain text into `.waystone-address`. The explorer
base URL is part of `deployment.json` too, so transaction and address links in the website follow it.

To check it by hand: open the explorer link, confirm the type is Contract and that the code is `contracts/waystone.py`,
then call `stats()` from the website's ledger page and confirm it answers rather than erroring.

## Deploying

```bash
DEPLOY_KEY=$ORGANIZER_KEY node scripts/deploy.mjs
```

The script sends `contracts/waystone.py`, waits for the decision, prints the address and the transaction hash, then
writes the address into `deployment.json` and `.waystone-address`. Nothing else has to be edited.

## Moving the contract to a new address

1. Deploy the new contract, or copy its address from the explorer.
2. Put the address into `deployment.json` under `contract.address`.
3. Rebuild the website. The address is read at build time, so a running server keeps the old one until it is rebuilt.

For a single run of the live script, export `WAYSTONE_ADDRESS` instead of editing the file:

```bash
WAYSTONE_ADDRESS=0x... node scripts/e2e.mjs --only basics
```

## Pointing the website at another network

Set `NEXT_PUBLIC_WAYSTONE_ADDRESS` and `NEXT_PUBLIC_RPC_URL` when building. They override the file, which is useful
for a preview of a deployment that is not committed yet:

```bash
NEXT_PUBLIC_WAYSTONE_ADDRESS=0x... npm run build
```

Only `NEXT_PUBLIC_*` variables reach the browser bundle. Nothing else is exposed.

---

## What is not in the file

Private keys never touch `deployment.json`. Accounts live in `.env`, which is git-ignored, and are named by role
(`ORGANIZER_KEY`, `ALICE_KEY`, `BOB_KEY`, `CAROL_KEY`, `REFEREE_KEY`, `OUTSIDER_KEY`). See `.env.example`.
