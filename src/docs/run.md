The repository carries everything that tests this contract: a static check, a local suite that needs no network, a rehearsal of the live script, and the script that runs the whole thing against the real Studionet.

The exact commands live in the repository documentation, in the file named live-testing under the docs folder. This page explains the shape of it, so you know what to expect before you start.

## Quick start

There are three steps, in this order. First install the Python and Node packages with the setup script in the scripts folder. Second create the test accounts, which writes a private environment file and asks the network to fund each account. Third run the single entry point that does the static check, then the local suite, then the live run.

That entry point takes options. One skips the local checks so only the live run happens; another skips the live run so only the local checks happen; extra arguments are passed straight to the live script, which takes a list of scenario names. It also accepts a dry-run flag that prints the plan without touching the network.

## Tests (no network)

The local suite runs the contract in the GenVM direct runner with the web and the model mocked. It covers input checks, the whole lifecycle, every refusal (each refused call is also shown to change nothing), payouts against an independent model, the validators' acceptance rule case by case, hostile text and pages, the order of effects, and random games that must keep the books balanced. Without the random games it takes under a minute.

The direct runner needs a GenVM runtime. On a machine where it cannot download one, copy the tarball that the static checker fetched from its cache directory into the direct runner's cache directory.

## The rehearsal

One test file runs the live script in Node with a virtual clock and a stand-in for the GenLayer client. Every call of the live script is answered by the real contract code, with the web and the model mocked in three different ways so that every branch of the arena is walked: a dismissed contest, an upheld contest with the reward, and a member winning a contest of their own round. It proves that the live script takes the right steps in the right order and that its checks agree with the contract. It cannot prove how the real model behaves.

## The live run on Studionet

The live script deploys the contract from the repository unless an address is already configured, then runs four scenarios with real transactions and the real AI. Expect about an hour of chain time in total; a single scenario can be run on its own.

| scenario | time | what it does |
| --- | --- | --- |
| basics | about 4 min | refused pool creations, terms, joining, leaving, a duplicate member, calling a pool off before its start |
| nostart | about 4 min | a pool that gets too few members is called off by a stranger after its start time |
| unattended | about 20 min | a claim nobody sends to the judge becomes a final miss and receives nothing at the settlement |
| arena | about 30 min | three members and a referee play a full pool, with contests, an audit and a referee ruling |

The model is not scripted. The arena accepts any verdict and checks what must hold for all of them: a round counts exactly when the judge said it was met with enough confidence, an audit's outcome follows the auditor's answer, a refused call changes no total, the standing view projects what an independent payout model computes, every member is paid exactly that, and the books balance at the end.

Reports are written after every transaction as JSON, as a readable summary and as a page that refreshes itself while the run is going. The exit code is zero only when every check passed.

## Deploying your own copy

Deploy the contract once with the deploy script in the scripts folder, giving it the private key of a funded account. It prints the address and the transaction, then records the address where every other script and this website look for it. After that, build the website and it will read from your deployment. The full procedure, including how to move the contract to a different address later, is in the repository documentation under the docs folder, in the file named deployment.

## Repository layout

The contract sits in the contracts folder as a single Python file. The local suite sits in tests, the scripts in scripts, the offline stand-in in rehearsal, and the written documentation in docs. This website is the Next.js application under src, one file per screen in views, the reusable pieces in components, everything that talks to the chain in lib, and the pages you are reading in this folder.
