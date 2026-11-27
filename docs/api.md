# Contract reference

`contracts/waystone.py` is a GenLayer Intelligent Contract. Every method below is called from a wallet or from a
script; nothing here is internal to this repository.

Amounts are **wei** (1 GEN = 10¹⁸ wei). Times are **seconds** from the current chain time. `who` is always a member
address in hex.

---

## Write methods

| method                                                                                                   | who                                                                          | what                                                   |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| create_pool(title, rules, stake, rounds, round_len, starts_in, min_entrants, max_entrants, referee)      | anyone                                                                       | opens a pool; referee is an address or an empty string |
| set_terms(pool_id, grace, review_span, dispute_span, doubt_limit)                                        | organizer, before the start                                                  | tunes the time limits and the judge's strictness       |
| cancel_pool(pool_id)                                                                                     | organizer before the start; anyone after the start if too few members joined | sends every stake back                                 |
| join(pool_id, evidence_url) payable                                                                      | anyone but the referee, before the start                                     | exact stake; one evidence page per member              |
| leave(pool_id)                                                                                           | member, before the start                                                     | takes the stake back; cannot join this pool again      |
| claim(pool_id, round_no, note)                                                                            | member                                                                       | files the claim for an open round                      |
| judge(pool_id, who, round_no)                                                                             | anyone, after the round closed                                               | asks the AI judge about one claim                      |
| contest(pool_id, who, round_no, reason) payable                                                           | member                                                                       | posts the bond and asks for the second look            |
| audit(pool_id, who, round_no)                                                                             | anyone                                                                       | runs the stricter second look on a contested judgement |
| lapse_contest(pool_id, who, round_no)                                                                     | anyone, a day after a contest                                                | returns the bond of an unaudited contest               |
| overrule(pool_id, who, round_no, credit, note)                                                            | referee                                                                      | settles a filed claim by hand while it is not final    |
| settle(pool_id)                                                                                           | anyone                                                                       | shares the pool out once every round is final          |

Every write method either succeeds or raises an error with a sentence that says what is wrong. The website lists all
of them in `src/lib/errors.ts` so a refused call can be shown for what it was.

---

## Views

| view                            | returns                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------- |
| stats()                         | counters of the whole contract: pools, claims, judgements, contests, volume      |
| solvency()                      | deposited, paid, held, bonds, and whether the books balance                       |
| get_pool(id)                    | one pool with its members and their marks                                        |
| list_pools(offset, limit)       | pools, newest first, at most 50 per call                                         |
| pools_of(address, offset, limit) | pools an address organizes, referees or has joined, newest first                |
| get_round(pool_id, who, round)  | one member's round: claim, judgement, audit, contest and bond                    |
| standing(pool_id)               | credited and pending rounds of every member and what each would receive now      |

All of them return JSON text. Wei amounts arrive as strings because they do not fit in a JSON number.

---

## Enumerations

| field                          | values                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------- |
| pool `state`                   | 0 open, 1 cancelled, 2 settled                                                   |
| pool `phase`                   | joining, failed, running, finishing, settled, cancelled                          |
| round `state`                  | OPEN, CLAIMED, PASSED, MISSED                                                   |
| round `decided_by`             | 0 nobody, 1 the AI, 2 default (unreadable evidence), 3 audit, 4 referee         |
| `bond_state`                   | 0 none, 1 held, 2 refunded, 3 forfeited, 4 rewarded                             |
| judgement `verdict`            | MET, UNCLEAR, NOT_MET                                                           |
| judgement `flags`              | off_rules, injection, vague, stale, mismatch, unverifiable                      |

Marks, one character per round on every member: `.` open and claimable, `_` a final miss with no claim, `c` claimed
and waiting, `p` or `m` judged and still contestable, `P` or `M` final.

---

## Limits and defaults

| value                 | range                                       | default     |
| --------------------- | ------------------------------------------- | ----------- |
| title                 | 3 to 60 characters                          | —           |
| rules                 | 20 to 1200 characters                       | —           |
| claim                 | 12 to 300 characters                        | —           |
| contest reason        | 12 to 300 characters                        | —           |
| rounds                | 2 to 14                                     | —           |
| members at once       | 2 to 12                                     | —           |
| entries ever          | at most 24 per pool                         | —           |
| round length          | 1 minute to 30 days                         | —           |
| start delay           | 1 minute to 30 days                         | —           |
| grace                 | 0 to 7 days                                 | 10 minutes  |
| review time           | 10 minutes to 30 days                       | 3 days      |
| dispute time          | 2 minutes to 7 days                         | 1 hour      |
| doubt limit           | 0 to 100                                   | 35          |
| slice                 | stake divided by rounds, at least 0.001 GEN | —           |
| contest bond          | 20% of a slice, at least 0.001 GEN          | —           |
| contest reward        | 25% of a slice                             | —           |
| audit strictness      | two thirds of the pool's doubt limit        | —           |

---

## Errors

Every refusal the contract can raise, with what causes it:

| refusal                                                                  | cause                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| The title needs 3 to 60 characters.                                       | the title is too short or too long                                          |
| The rules need 20 to 1200 characters.                                     | the rules are too short or too long                                         |
| The claim needs 12 to 300 characters.                                     | the note filed with a round is out of range                                 |
| Say in 12 to 300 characters why the judgement is wrong.                   | the contest reason is out of range                                          |
| The number of rounds has to be between 2 and 14.                          | rounds outside the supported range                                          |
| The member limits must satisfy 2 <= minimum <= maximum <= 12.             | impossible member limits                                                    |
| A round has to last between 1 minute and 30 days.                         | round length outside the supported range                                    |
| The pool has to start between 1 minute and 30 days from now.              | start delay outside the supported range                                     |
| The grace time has to be between 0 and 7 days.                            | grace outside the supported range                                           |
| The review time has to be between 10 minutes and 30 days.                 | review time outside the supported range                                     |
| The dispute time has to be between 2 minutes and 7 days.                  | dispute time outside the supported range                                    |
| The doubt limit has to be between 0 and 100.                              | doubt limit outside the supported range                                     |
| Every round has to be worth at least 0.001 GEN.                           | the slice would be too small                                                |
| The stake is out of range.                                                | zero, negative or absurdly large                                            |
| The evidence must be a single public http(s) link.                        | the evidence page is not a plain public URL                                 |
| That address cannot be the referee.                                       | the referee is the organizer or an empty address                            |
| That is not a valid address.                                              | an address argument is malformed                                            |
| No such pool. / No such round.                                            | the id does not exist                                                       |
| The pool is full. / This pool has no room for more members.               | the pool already has its maximum members                                    |
| You are not a member of this pool.                                        | a member-only call from a non-member                                        |
| The referee cannot join the pool.                                         | the referee tried to join                                                  |
| You joined this pool before.                                              | a member who left tried to join again                                       |
| That evidence page is already used by another member of this pool.        | two members would share one evidence page                                   |
| The pool has already started. / The pool has not started yet.             | a call outside its time window                                              |
| The pool has started; it cannot be called off.                            | cancelling a pool that already ran with enough members                      |
| The pool did not get enough members; it can be called off.                | cancelling a pool that has enough members                                   |
| Only the organizer can do that. / Only the organizer can call the pool off before it starts. | a restricted call from somebody else                        |
| Only the referee can do that.                                             | overrule from somebody who is not the referee                               |
| Only members of this pool can contest.                                    | a contest from a non-member                                                 |
| You can contest only your own missed rounds.                              | contesting your own credited round                                          |
| You can contest only a round that the other member was credited for.      | contesting somebody else's missed round                                     |
| Only a judgement of the AI can be contested.                              | contesting a default, an audit or a referee ruling                          |
| That judgement has been contested before.                                 | a second contest of the same round                                          |
| That judgement is not under contest.                                      | an audit or a lapse of a round that is not under contest                     |
| Send exactly the contest bond. / Send exactly the stake of the pool.      | the value sent with the call is wrong                                        |
| That claim has already been judged.                                       | judging twice                                                               |
| That member made no claim for that round.                                 | judging a round with nothing to judge                                       |
| The round is still running. The judge looks at it after it closes.         | judging before the round closed                                             |
| The review time is over; a claim nobody judged counts as missed.          | judging after the review time                                               |
| Wait two minutes before asking again.                                     | the same claim was asked for too soon                                       |
| The dispute time of that judgement is over.                               | contesting a judgement that is already final                                |
| The contest has not lapsed yet. Run the audit instead.                    | returning a bond that is still inside its patience window                    |
| The contest lapsed. Call lapse_contest to get the bond back.               | auditing a contest that has already lapsed                                   |
| A contest bond is still waiting for its audit.                            | settling a pool whose bonds are unresolved                                   |
| Some rounds are not final yet.                                            | settling before every round is final                                        |
| The last round is still running.                                          | settling before the last round closed                                       |
| The pool has not run. / The pool is already closed.                       | settling a pool that never ran, or one already settled                       |
| The books of this pool do not add up.                                     | an internal invariant failed; the call is refused rather than corrupting     |
| You already claimed that round.                                           | filing a second claim for the same round                                    |
| That round has not started yet. / The time to claim that round is over.    | claiming outside the round's window                                         |
| That round is already final.                                              | overruling a round that cannot change any more                              |
| [LLM_ERROR] the judge did not return a valid JSON object                  | the model answered with something that could not be parsed                   |
