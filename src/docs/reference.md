The contract is contracts/waystone.py. Everything below is what this site calls, through [genlayer-js](https://github.com/genlayerlabs/genlayer-js), from your wallet.

## Write methods

| method | who | what |
| --- | --- | --- |
| create_pool(title, rules, stake, rounds, round_len, starts_in, min_entrants, max_entrants, referee) | anyone | opens a pool; referee is an address or an empty string |
| set_terms(pool_id, grace, review_span, dispute_span, doubt_limit) | organizer, before the start | tunes the time limits and the judge's strictness |
| cancel_pool(pool_id) | organizer before the start; anyone after the start if too few members joined | sends every stake back |
| join(pool_id, evidence_url) **payable** | anyone but the referee, before the start | exact stake; one evidence page per member |
| leave(pool_id) | member, before the start | takes the stake back; cannot join this pool again |
| claim(pool_id, round_no, note) | member | files the claim for an open round |
| judge(pool_id, who, round_no) | anyone, after the round closed | asks the AI judge about one claim |
| contest(pool_id, who, round_no, reason) **payable** | member (see [Contests](/docs/disputes)) | posts the bond and asks for the second look |
| audit(pool_id, who, round_no) | anyone | runs the stricter second look on a contested judgement |
| lapse_contest(pool_id, who, round_no) | anyone, a day after a contest | returns the bond of an unaudited contest |
| overrule(pool_id, who, round_no, credit, note) | referee | settles a filed claim by hand while it is not final |
| settle(pool_id) | anyone | shares the pool out once every round is final |

who is the member's address. starts_in, round_len, grace, review_span and dispute_span are in **seconds**. Amounts (stake, and the value of payable calls) are in **wei** (1 GEN = 10¹⁸ wei).

## Views

| view | returns |
| --- | --- |
| stats() | counters of the whole contract (pools, claims, judgements, contests, volume…) |
| solvency() | deposited, paid, held, bonds and balanced |
| get_pool(id) | one pool with its members |
| list_pools(offset, limit) | pools, **newest first** (at most 50 per call) |
| pools_of(address, offset, limit) | pools an address organizes, referees or has joined, newest first |
| get_round(pool_id, who, round_no) | one member's round: claim, judgement, audit, bond |
| standing(pool_id) | credited and pending rounds of every member and what each would receive if the pool were settled now |

All of them return **JSON text**; large numbers (wei) are strings.

## How the site reads the contract

Every view returns JSON text. The site calls a view, parses the text, and renders it; a wei amount arrives as a string and is converted for display. Reads are retried once, because a node can be briefly unavailable, and a read that names a missing pool or a missing round is not retried — the answer is already final.


## Sending a transaction from a browser wallet

walletProvider is the EIP-1193 provider of the wallet the person chose in the EIP-6963 list.

## The shape of a pool

A pool carries its identity (the id, the organizer, the optional referee, the title and the rules), its clock (when it was created, when it starts, when the last round closes), its terms (the stake, the slice, the number of rounds, the round length, the member limits, the grace, review and dispute times, and the doubt limit), its money (the balance, the bonds held, the bond due, the rewards and the forfeited amounts) and its members.

Each member carries the address, the evidence page, when they joined, whether they left, one character per round describing what happened, the payout they would receive, and how many rounds currently count for them.


## Marks

Every member has marks, one character per round: . open, _ missed with no claim, c claimed, p/m judged but contestable, P/M final. See [Lifecycle & timing](/docs/lifecycle).

## Numbers in the JSON

- pool state: 0 open, 1 cancelled, 2 settled. phase: joining, failed, running, finishing, settled, cancelled.
- round decided_by: 0 nobody, 1 the AI, 2 default (unreadable evidence), 3 audit, 4 referee. Round state: OPEN, CLAIMED, PASSED, MISSED.
- bond_state: 0 none, 1 held, 2 refunded, 3 forfeited, 4 rewarded.
