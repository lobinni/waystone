# Live testing the contract

This guide runs the real contract on GenLayer Studionet with the real AI judge. Nothing here is a demo: every
scenario sends real transactions, waits for a real decision, and checks the result against an independent model.

The contract is already deployed at `0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85`, and `deployment.json` points at
it. Skip section 3 unless you want a fresh deployment of your own.

The whole run takes about 60 minutes of chain time. Use `--only` to run a single scenario while you are iterating.

---

## 1. What you need

- Python 3.11 or newer and Node 20 or newer.
- An account on Studionet with a little GEN in it. `node scripts/keys.mjs` creates four fresh accounts and asks the
  Studionet simulator to fund them; if the simulator refuses, fund them from the Studio faucet by hand.
- Network access. The run talks to the Studionet RPC endpoint and to the model.

Install the tooling once, from the repository root:

```bash
bash scripts/setup.sh
```

That installs the Python packages from `requirements.txt` (the local test runner, the static checker and the
pickle helper) and the Node packages, including the GenLayer client.

---

## 2. Accounts and keys

Create the accounts:

```bash
node scripts/keys.mjs
```

It writes a fresh `.env` with four private keys and prints the address of each one together with whether it was
funded. The file also contains empty slots for a referee and an outsider; leave them empty and the run picks random
accounts for those two roles.

Load the file into your shell before running anything else:

```bash
set -a
. ./.env
set +a
```

The run script does this for you, so you only need it when you call `scripts/e2e.mjs` directly.

`.env.example` documents every variable and roughly how much GEN each role needs. Never commit a filled `.env`.

---

## 3. Deploy the contract (optional)

The repository already records a deployment. Run this only if you want a second one of your own.

Deploy once and record the address:

```bash
DEPLOY_KEY=$ORGANIZER_KEY node scripts/deploy.mjs
```

The script prints the address and the transaction hash, then writes the address into `deployment.json` and into
`.waystone-address`. Both files are read by every other script, and `deployment.json` is what the website reads.

If you already have a deployment, skip this step and set the address instead:

```bash
export WAYSTONE_ADDRESS=0x... # optional, overrides deployment.json for one run
```

---

## 4. Run everything

```bash
bash scripts/run-all.sh
```

That is three steps in order:

1. `genvm-lint check contracts/waystone.py` — the static check of the contract.
2. `python3 -m pytest -q` — the local suite, no network, a few hundred assertions.
3. `node scripts/e2e.mjs` — the live run.

Useful variants:

```bash
SKIP_LOCAL=1 bash scripts/run-all.sh        # only the live run
SKIP_LIVE=1  bash scripts/run-all.sh        # only the static check and the local tests
bash scripts/run-all.sh --only arena        # a single scenario
bash scripts/run-all.sh --dry-run           # print the plan, touch no network
```

The static check and the local suite can also be run on their own:

```bash
genvm-lint check contracts/waystone.py
python3 -m pytest -q
```

---

## 4b. The manual pass

Before the hour-long live run, walk the browser checklist in `samples/manual-test-checklist.md`. It covers the
website read-only, the wallet and the network switch, one pool from creation to settlement, and six refusals that
must change nothing. Record what you saw in `templates/manual-test-report.md`.

The manual pass uses the same deployment, so it costs a little GEN and a little chain time; the two-day habit pool
in `samples/live-pool-parameters.md` finishes fastest.

---

## 5. The scenarios

### `basics` — about 4 minutes

Pool creation rules, the terms call, joining, leaving, a duplicate member, and calling a pool off before it starts.
Every refusal is checked twice: the call is rejected, and the totals afterwards are exactly what they were before.

### `nostart` — about 4 minutes

A pool that does not get enough members. After the start time a complete stranger calls it off and every stake goes
back to the member who sent it.

### `unattended` — about 20 minutes

A claim that nobody sends to the judge. Two members, the shortest review time the contract allows. Only one of the two
claims is sent to the real judge. While the review time runs, the other claim is still provisional and earns nothing.
When the review time is over it is a final miss with no decision on record: the judge, a contest and an audit are all
refused, and at the settlement it receives no credited slice. The check compares the payout against the independent
model in both cases — if the real judge happened to refuse the credited claim too, nobody holds a credit, the pool is
shared equally, and the run records that instead.

### `arena` — about 30 minutes

Three members and a referee play a whole pool, round by round. Claims are filed, the real judge is asked about each
one, a rival contests a credited round and the real auditor runs the second look, a member contests their own missed
round, a steering claim is decided without the model, the referee overrules one round by hand, and once every dispute
time has passed a stranger settles the pool.

The model is not scripted, so the arena accepts any verdict and checks what must hold for all of them:

- a round counts exactly when the judge said `MET` with enough confidence for that pool;
- an audit's outcome follows the auditor's answer, including who receives the bond;
- a refused call changes no total anywhere;
- the standing view projects exactly what the independent payout model computes;
- every member is paid exactly that projection;
- the contract's books balance at the end, for the pool and for the contract as a whole.

---

## 6. Reading the report

After every transaction the run writes three files into `reports/`:

- `waystone-e2e-<time>.json` — machine readable: every call, every check, every amount.
- `waystone-e2e-<time>.md` — the same as a readable summary.
- `waystone-e2e-<time>.html` — a page that refreshes itself while the run is going; open it in a browser.

The exit code is `0` when every check passed and `1` when any check failed. A failed check names the scenario, the
step and the two numbers that disagreed.

The run summary is appended to `reports/summary-<time>.md` together with the result of the static check and the local
suite.

---

## 7. When something goes wrong

- **The static check fails.** The contract does not compile for GenVM. Fix `contracts/waystone.py` and run the check
  again; nothing else has run yet.
- **A local test fails.** Reproduce it on its own with `python3 -m pytest tests/direct/test_pools.py -q` (or whichever
  file reported the failure). The local suite never touches the network, so it is the fastest loop.
- **The live run cannot reach the network.** Check the RPC endpoint in `deployment.json` and your connection. The run
  retries each read twice before it gives up.
- **A scenario times out waiting for a decision.** The validators did not agree. The run records the receipt and
  continues where it can; re-run that scenario on its own with `--only`.
- **The model gave an unexpected verdict.** That is not a failure. The arena only checks the invariants that must hold
  for every verdict; read the report to see what it actually answered.

---

## 8. What the report does not prove

The rehearsal and the local suite prove that the script takes the right steps in the right order and that its checks
agree with the contract. They cannot prove how the real model behaves. Only the live run does that, and only for the
pages it actually read at that moment. Treat a green live run as evidence for that run, not as a permanent property of
the network.
