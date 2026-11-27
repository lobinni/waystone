This website is a Next.js application: the App Router for the pages, React and TypeScript for the interface, and the GenLayer client for talking to the contract. There is no backend of our own — every number on the screen comes from the contract or from the network.

## Run it

Install the packages once, then start the development server from the repository root. The production build is the usual build command, and the built site is served by the start command.

Two environment variables are read at build time: one overrides the contract address, the other the network endpoint. Both fall back to deployment.json, so most of the time there is nothing to set.

## Configuration

Everything configurable lives in src/config.ts:

| setting | meaning |
| --- | --- |
| CONTRACT_ADDRESS | the deployed contract; empty means not deployed yet |
| CHAIN | chain id, RPC endpoint, currency and explorer |
| GITHUB_URL, X_URL, GENLAYER_URL | the links in the header and the footer; an empty link is simply not shown |
| LIMITS, DEFAULTS | the contract's ranges, used to validate the forms before anything is signed |

The address and the network come from deployment.json at the repository root. Editing that one file and rebuilding moves the whole site to a new deployment; the environment variable overrides it for a single build. See the deployment document in the repository for the full order of precedence.

## Themes

There are two themes: the daylight page and a deep ink-green night. The first visit follows the operating system, and the toggle in the top bar remembers your choice. Every colour is a CSS variable in src/styles/tokens.css, so a palette change is one file.

## The visuals

- The landing page and the create page draw the stack as flat SVG: one stone per round, each with its own tone, leaning gently towards the pointer. There is no WebGL, so it works everywhere and respects the reduced-motion setting.
- The loaders are CSS: a small stack that drops in and sways.
- Guide, the mascot, tilts towards the pointer and floats.
- The whole page sits on a fixed engineering grid, and cards cast a hard offset shadow instead of a soft blur.

## Adding a documentation page

Create the markdown file in this folder, run the sync script in the scripts folder to regenerate the content module, and add an entry to the table of contents in index.ts. The website renders prose only: it never shows code listings, so keep commands out of these files and put them in the repository documentation instead.

Callouts use the note, tip, warning and danger markers on a blockquote. Links to other pages of the documentation navigate inside the application.
