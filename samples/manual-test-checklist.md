# Manual test checklist

A hands-on pass over the deployed contract and the website. It uses the live deployment — no demo data, no fixtures,
no mocked responses. Tick every line; record what you actually saw in `templates/manual-test-report.md`.

**Contract:** `0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85` on GenLayer Studionet
**Explorer:** <https://explorer-studio.genlayer.com/address/0xe740d1378Cd4002b8bdaC8bec2B1A83F73adFe85>

Time needed: about 45 minutes, plus the chain time of a short pool.

---

## A. Before you start

| # | step | expected |
| - | ---- | -------- |
| A1 | Install the tooling with the setup script in `scripts/` | Python and Node packages installed, no errors |
| A2 | Run the static check on `contracts/waystone.py` | no problems reported |
| A3 | Run the local test suite | every test passes, no network traffic |
| A4 | Confirm `deployment.json` holds the address above | the file and `.waystone-address` agree |
| A5 | Open the address in the explorer | type is Contract, code matches the contract in this repository |

## B. The website, read-only

| # | step | expected |
| - | ---- | -------- |
| B1 | Open the home page | no "no address configured" banner; counters come from `stats()` |
| B2 | Open the pool list | the pools from the live run, newest first, each with a phase badge |
| B3 | Open one pool | title, rules, stake, rounds, members and one stone per round per member |
| B4 | Hover a stone | a tooltip explaining what that round did |
| B5 | Open the ledger | deposited, paid, held, bonds, and the solvency line reading as balanced |
| B6 | Open five documentation pages | prose only, no code listings, every internal link resolves |
| B7 | Resize to a narrow window | the navigation collapses, nothing overflows or is clipped |
| B8 | Switch the theme | the light page and the dark page both stay readable |

## C. Wallet and network

| # | step | expected |
| - | ---- | -------- |
| C1 | Connect a wallet on another network | a banner offers the switch, the site does not send anything |
| C2 | Accept the switch | the wallet is on GenLayer Studionet, chain id 61999 |
| C3 | Disconnect | the address disappears and the site does not reconnect by itself |
| C4 | Reconnect | the same wallet is offered first, and the balance shows |

## D. A pool, end to end

Use the parameters in `samples/live-pool-parameters.md`. The two-day habit pool finishes fastest.

| # | step | expected |
| - | ---- | -------- |
| D1 | Create a pool with an impossible value (a title of two characters) | the form refuses it before any wallet prompt |
| D2 | Create a valid pool | a transaction dialog, then the new pool page |
| D3 | Open the pool in the explorer | the transaction decided as a success |
| D4 | Join from a second account with a duplicate evidence page | refused with the sentence about the shared page |
| D5 | Join from a second account with its own page | both members listed, balance equals the two stakes |
| D6 | Leave before the start | the stake comes back, the entry stays recorded |
| D7 | Wait for the start | the phase changes from Joining to Running without a reload |
| D8 | File a claim in the open round | the stone changes to the claimed state |
| D9 | Ask the AI judge after the round closes | a decision arrives; the stone becomes credited or missed |
| D10 | Contest a judgement you disagree with | the bond is held, the contest is recorded |
| D11 | Run the audit | the second look decides, and the bond is refunded, forfeited or rewarded accordingly |
| D12 | Let every round become final, then settle | every member is paid exactly what the standing view projected |
| D13 | Check `solvency()` in the ledger | everything paid in is either paid out or still held, and it reads as balanced |

## E. Refusals worth seeing

Each of these must change nothing at all: totals, members and stones are identical before and after.

| # | step | expected |
| - | ---- | -------- |
| E1 | Judge a round that has not closed yet | refused: the judge looks at it after it closes |
| E2 | Judge the same claim twice | refused: it has already been judged |
| E3 | Contest a referee ruling | refused: only an AI judgement can be contested |
| E4 | Settle while a round is still open | refused: not every round is final |
| E5 | Join a pool you already left | refused: a member who left cannot join again |
| E6 | Overrule as somebody who is not the referee | refused: only the referee can do that |

## F. After the pass

- Save the report filled in from `templates/manual-test-report.md`.
- Attach any failing transaction hash and the two values that disagreed.
- Re-run only the failed step; nothing in this checklist depends on another step having been faked.
