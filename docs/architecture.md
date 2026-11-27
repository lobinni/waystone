# Architecture

The repository has three parts that share one set of numbers: the contract, the tests and scripts that drive it on a
real network, and the website. Every limit, every rule and every refusal exists in exactly one place — the contract —
and the other two mirror it.

---

## The contract

`contracts/waystone.py` is a single GenLayer Intelligent Contract. It has no imports from this repository and no
configuration; the model and the web are asked for facts, never for decisions about money.

### Storage

| structure | contents                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| `Entrant` | one join: the address, the evidence page, when they joined, whether they left                                  |
| `Slot`   | one round of one member: the claim, its state, who decided it, the judgement, the audit, the contest and the bond |
| `Pool`   | everything about one pool: the terms, the clock, the money and the list of entrants                            |

Pools are stored by id, entrants by pool, and slots by a flat key of pool, entrant and round, so a round is one lookup.

### Deterministic helpers

Everything that does not need the model or the network lives above the contract class: text cleaning, the public-URL
check, the evidence-page fetch and its readability rules, the prompt, the mapping from a verdict plus a doubt to a
decision, the validator acceptance rule, and the clock arithmetic for a round. They are pure functions, which is why
the local suite can exercise them without a network.

### The contract class

Write methods come first (`create_pool`, `set_terms`, `cancel_pool`, `join`, `leave`, `claim`, `judge`, `contest`,
`audit`, `lapse_contest`, `overrule`, `settle`), then the views (`stats`, `solvency`, `get_pool`, `list_pools`,
`pools_of`, `get_round`, `standing`), then the private helpers: access checks, lookups, the bond bookkeeping, the
payout arithmetic, the phase and the marks.

The pattern every write method follows is the same: validate the input, check who is calling and when, check the
money, change the state, and return nothing. A refusal is a raised error with a sentence that says what is wrong;
`src/lib/errors.ts` lists every one of them so the interface can show the real reason instead of a generic failure.

### Judgement

`judge` and `audit` call one helper that runs a leader/validator consensus over a narrow question. The leader asks the
model; each validator asks itself the same question and accepts the leader only if it is at least as strict. The
result is settled against the pool's doubt limit, so the model's answer can only withhold credit, never grant it.

---

## The tests

`tests/direct/` runs the contract in the GenVM direct runner with the web and the model mocked, so the suite needs no
network and finishes quickly.

| file                 | what it covers                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| `test_smoke.py`      | the smallest possible happy path                                                |
| `test_pools.py`      | creation, terms, joining, leaving, cancelling                                   |
| `test_rounds.py`     | claims, judging, timeouts and the marks                                         |
| `test_settle.py`     | contests, audits, referee rulings and every payout                              |
| `test_consensus.py`  | the validators' acceptance rule, case by case                                   |
| `test_adversarial.py`| hostile text, hostile pages, prompt steering                                    |
| `test_fuzz.py`       | random games that must keep the books balanced                                  |
| `test_rehearsal.py`  | the live script itself, run offline against the real contract code              |

`rehearsal/` is the stand-in used by the last one: a fake GenLayer client and a virtual clock, so the live script can
be walked end to end without a network.

---

## The scripts

| script                | job                                                                       |
| --------------------- | ------------------------------------------------------------------------- |
| `scripts/setup.sh`    | installs the Python and Node packages                                     |
| `scripts/keys.mjs`    | creates four accounts, writes `.env`, asks the simulator to fund them      |
| `scripts/deploy.mjs`  | deploys the contract and records the address                              |
| `scripts/deployment.mjs` | resolves and writes the address; the only file that knows where it lives |
| `scripts/receipt.mjs` | reads the outcome of a decided transaction, whatever shape it comes in     |
| `scripts/e2e.mjs`     | the live run: four scenarios, a report after every transaction             |
| `scripts/run-all.sh`  | static check, local tests, live run, one summary                          |

---

## The website

The site is a Next.js App Router application. Routes are thin; the screens live in `src/views/`.

```
src/app/                routes: one file per URL, plus the root layout and the global stylesheet
src/views/              the screens: Home, Pools, PoolDetail, Create, MyPools, Ledger, Docs, NotFound
src/components/         the reusable pieces: layout shell, wallet, transaction dialog, cards, icons, forms
src/lib/                the talking-to-everything layer
src/styles/             design tokens, base, components, pages, docs and the signature layer
src/docs/               the documentation pages the site renders
```

`src/lib/` is deliberately split by concern:

| module          | responsibility                                                             |
| --------------- | -------------------------------------------------------------------------- |
| `config.ts`     | the address, the chain, the limits — the only place the site reads config  |
| `chain.ts`      | reading and writing the contract through the GenLayer client                |
| `wallet.ts`     | EIP-6963 discovery, connect, disconnect, network switching                 |
| `rpc.ts`        | bare JSON-RPC against the endpoint, no wallet                              |
| `tx.ts`         | the transaction state machine and the per-browser history                   |
| `clock.ts`      | the network clock, so deadlines match the chain                             |
| `pool.ts`       | the pure rules of the contract: phases, marks, action availability, payouts |
| `format.ts`     | amounts, addresses, durations and the evidence-URL check                    |
| `errors.ts`     | every refusal the contract can raise                                       |
| `hooks.ts`      | data loading, clipboard, reveal-on-scroll                                   |

The website shows no code listings. The documentation pages are prose; the exact commands live in this repository.
`src/docs/*.md` are the source, `src/docs/content.ts` is generated from them by `scripts/sync-docs.mjs`, and
`src/docs/index.ts` is the table of contents. After editing a page, run `node scripts/sync-docs.mjs`.

---

## Where a number lives

The stake, the rounds, the grace time, the review time, the dispute time, the doubt limit, the bond and the reward are
defined in `contracts/waystone.py`. The website repeats them in `src/config.ts` under `LIMITS`, `DEFAULTS` and the
bond constants so its forms can refuse an impossible value before a transaction is signed. When one changes, change
both; `docs/api.md` lists them side by side.
