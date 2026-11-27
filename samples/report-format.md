# Live run report format

`scripts/e2e.mjs` writes three files into `reports/` after every transaction, named with the time the run started.
This page describes what each one contains, so you can read a report without running anything.

---

## JSON

Machine readable, one object for the whole run:

| field        | meaning                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| `startedAt`  | UTC time the run started                                                       |
| `contract`   | the address the run used and where it came from                                |
| `network`    | chain id and RPC endpoint                                                      |
| `scenarios`  | one entry per scenario, in the order they ran                                  |
| `checks`     | every assertion: the name, whether it passed, and the two values it compared   |
| `txs`        | every transaction: the step, the hash, the decided status and the parsed result |
| `failures`   | only the checks that failed, so a CI job can read just this                     |

A check that compares two amounts records both of them as decimal strings, because wei does not fit in a JSON
number.

---

## Markdown

The same information as a readable summary: one section per scenario, a list of the steps, and a table of the checks
with a mark in the status column. Amounts are shown in GEN. This is the file to attach to an issue.

---

## HTML

A single self-contained page that refreshes itself while the run is going, so you can leave it open in a browser.
It shows the current scenario, the last decided transaction, a running count of passed and failed checks, and the
same tables as the Markdown report once the run finishes.

---

## Reading a failure

1. Open the JSON and look at `failures`. Each entry names the scenario and the step.
2. Find the two values that disagreed. If they are amounts, the payout model and the contract computed different
   numbers — that is a bug, not a flaky network.
3. If the failure is a status rather than an amount, the transaction was not decided as expected. The explorer link
   for the hash is in `txs`.
4. Re-run only that scenario with the `--only` flag. Nothing else in the run depends on it.

---

## Exit codes

| code | meaning                                                       |
| ---- | ------------------------------------------------------------- |
| 0    | every check passed                                            |
| 1    | at least one check failed, or a scenario could not be decided |

The static check and the local suite have their own results; `scripts/run-all.sh` writes one summary line for all
three into `reports/summary-<time>.md`.
