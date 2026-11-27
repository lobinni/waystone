# Live pool parameters

These are parameter sets that sit inside the contract's limits and are realistic for a real pool on Studionet.
Use them as a starting point when you organize a live run; nothing here is pre-filled data for the site.

Every value below has been checked against the ranges in `docs/api.md`.

---

## A two-day habit pool (the shortest useful pool)

| parameter        | value                | why                                                        |
| ---------------- | -------------------- | ---------------------------------------------------------- |
| title            | Morning pages        | 3 to 60 characters                                         |
| rules            | Write at least 300 words every morning and publish the entry on the evidence page before midnight UTC. | 20 to 1200 characters |
| stake            | 0.012 GEN            | 0.001 GEN minimum slice after the division                 |
| rounds           | 4                    | 2 to 14                                                    |
| round length     | 12 hours             | 1 minute to 30 days                                        |
| starts in        | 1 hour               | 1 minute to 30 days                                        |
| minimum members  | 2                    | 2 to 12                                                    |
| maximum members  | 6                    | at most 24 entries ever                                    |
| referee          | none                 | an empty address means no referee                          |
| grace            | 10 minutes (default) | the last moment to file a claim after a round closes       |
| review time      | 1 day                | 10 minutes to 30 days                                      |
| dispute time     | 1 hour (default)     | 2 minutes to 7 days                                        |
| doubt limit      | 35 (default)         | the audit uses two thirds of it, so 23                     |

The slice is 0.003 GEN. A member who keeps all four rounds gets 0.012 back plus a share of the pot.

---

## A week-long training log

| parameter        | value                                                        |
| ---------------- | ------------------------------------------------------------ |
| title            | Ten kilometres a week                                        |
| rules            | Run at least ten kilometres in total each week and post the summary with the dates on the evidence page. |
| stake            | 0.03 GEN                                                     |
| rounds           | 3                                                            |
| round length     | 7 days                                                       |
| starts in        | 2 days                                                       |
| minimum members  | 3                                                            |
| maximum members  | 10                                                           |
| review time      | 3 days (default)                                             |
| dispute time     | 1 day                                                        |
| doubt limit      | 25                                                           |

The slice is 0.01 GEN, so the contest bond is 0.002 GEN and the reward for upholding somebody else's contest is
0.0025 GEN.

---

## Choosing a doubt limit

The doubt limit is the organizer's main knob. It is the number of points of doubt the judge is allowed to have and
still credit a round.

- **0 to 20** — strict. Only a page that clearly shows the act inside the window counts.
- **21 to 40** — the working range. The default of 35 leaves room for a page that is hard to read.
- **41 to 100** — lenient. The judge will credit rounds it is not sure about.

Whatever you choose, the audit is stricter: it credits only up to two thirds of the limit, so a contest is a real
second opinion rather than a coin flip.

---

## Choosing the review time

The review time is the window in which somebody has to ask the judge about a claim. A claim nobody asks about in
that window becomes a final miss and can never be credited afterwards.

- Set it long enough that a member can realistically trigger the judgement — a day is comfortable, three days is
  the default.
- The member who filed the claim has the most to lose, so they are the one who normally asks; anyone else may ask
  as well, at no cost to themselves.
- The shortest the contract allows is ten minutes, which is what the unattended scenario of the live run uses on
  purpose.
