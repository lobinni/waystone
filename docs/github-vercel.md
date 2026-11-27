# Publishing to GitHub and Vercel

The website is a plain Next.js application. It needs no database, no environment variables and no build-time
secret to render, because every number on the screen comes from the contract through the public Studionet endpoint.

---

## 1. Push the repository to GitHub

Run these from the repository root. Replace `<user>` and `<repo>` with your own.

```bash
git init
git add .
git commit -m "Waystone: contract, tests, live-run scripts and website"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

To push a later change:

```bash
git add .
git commit -m "Describe what changed"
git push
```

### What is committed and what is not

`.gitignore` already excludes the following, so none of it can be pushed by accident:

| excluded        | why                                                                  |
| --------------- | -------------------------------------------------------------------- |
| `.env`          | private keys; never commit it                                        |
| `node_modules/` | installed packages                                                   |
| `.next/`        | the build output                                                     |
| `reports/`      | run reports, regenerated every time                                  |
| `*.tsbuildinfo` | TypeScript incremental state                                          |

Committed on purpose: `deployment.json` (the contract address), `.waystone-address`, `contracts/`, `tests/`,
`scripts/`, `docs/`, `samples/`, `templates/`, `src/` and `public/`.

If you keep your own keys in a fork, add `.env` to the repository's secret scanning rules as well; the file is
already ignored locally.

---

## 2. Build it on Vercel — no database URL

### Option A: the dashboard

1. Open <https://vercel.com/new> and import the GitHub repository you just pushed.
2. Leave every field at its default. Vercel detects Next.js and uses:
   - **Framework preset:** Next.js
   - **Build command:** `next build`
   - **Install command:** `npm install`
   - **Output directory:** `.next` (handled by the framework preset)
3. In **Environment Variables** add nothing. In particular do **not** add `DATABASE_URL` — the application does not
   use it. See the table below for the variables that are optional.
4. Press **Deploy**. The first build takes about a minute.

### Option B: the command line

```bash
npm install -g vercel
vercel login
vercel --prod
```

Answer the prompts with the defaults: **Yes** to `Set up and deploy`, your project name, and no changes to the
settings. Vercel writes a `vercel.json` only if you ask it to; none is required here.

Redeploy after a later push:

```bash
vercel --prod
```

### Environment variables

| variable                       | required | what it does                                                        |
| ------------------------------ | -------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                | **no**   | not used by the website at all; leave it unset                      |
| `NEXT_PUBLIC_WAYSTONE_ADDRESS` | no       | overrides `deployment.json` for this build only                     |
| `NEXT_PUBLIC_RPC_URL`          | no       | overrides the Studionet RPC endpoint                                |

Without any of them the build still succeeds: `deployment.json` already holds the contract address and the chain.

### What Vercel serves

- `/` — the landing page with live counters from the contract
- `/pools`, `/pools/[id]` — the pool list and one pool in detail
- `/create` — the create form
- `/me` — the pools the connected address is in
- `/ledger` — contract-wide totals and the solvency line
- `/docs/[slug]` — the documentation, prose only
- `/api/health` — answers `{"ok":true,"database":"not-configured"}` when no database is configured

### If the build fails

| symptom                                                                    | fix                                                                          |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| A page renders but every data panel says the contract is unreachable        | the address in `deployment.json` is wrong or the RPC endpoint is unreachable |
| The build reports a missing environment variable                            | remove it; nothing is required                                               |
| A route is missing after a push                                            | check that the push reached the branch Vercel is watching                    |

---

## 3. Verify the deployment

Open the site and work through [the steward checklist in the README](../README.md#what-the-steward-should-see-after-following-the-instructions).
The two quick checks are that the footer contract chip links to
`https://explorer-studio.genlayer.com/address/0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85` and that the home
counters show non-zero live numbers.
