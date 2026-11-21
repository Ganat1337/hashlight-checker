## Features (v1 scope)

| # | Feature | Done when |
|---|---------|-----------|
| 1 | Show/hide password | A toggle switches the input between hidden and visible |
| 2 | Live strength meter | A bar updates on every keystroke (weak / medium / strong) |
| 3 | Requirements checklist | A list shows which rules pass or fail (length, upper/lower case, digits, symbols, common patterns) |
| 4 | Breach check | SHA-1 hash in the browser, send only the first 5 characters to Have I Been Pwned (k-anonymity), match the rest locally, show the breach count |
| 5 | Loading, errors, responsive | A loading state, clear messages when the network or API fails, usable on mobile |
| 6 | Password generator (added during v1) | Generates a random password or a 7-word passphrase using `crypto.getRandomValues`; the result always passes the checklist |
| 7 | Protocol inspector (added during v1) | A panel shows the local SHA-1 hash split into the 5 characters sent and the 35 kept local |

## Scope changes
- 20 Nov 2026: features 6 and 7 were built before v1 shipped and are now part of v1, so the document matches the code.
- An "Upgrade" button (rewrote a weak password with predictable substitutions) was built and then removed: it labeled a lightly modified weak password as Strong, and its retry loop could freeze the page.
- A review also fixed: the strength meter contradicting the checklist, the passphrase entropy claim (now 7 words from a 160-word list, about 51 bits), and the privacy copy (only a 5-character hash prefix is sent).

## Out of scope (v2 list)
- Hint under the meter suggesting the next rule to fix for weak/medium passwords
- Time-to-crack or entropy estimate (or an existing library such as zxcvbn)
- Larger passphrase wordlist (EFF large list, with attribution)
- Unit tests for `strength.js` and `generator.js`
- Self-hosted fonts (no Google Fonts request)
- TypeScript, rebuild in React, favicon, debounce tuning beyond the basics
- "Which site leaked my password" (needs an email lookup with a paid API key and a backend)

Any new idea that appears during v1 goes here and is not built until v1 ships.

## Definition of Done (v1)
- All 7 features work.
- No error breaks the page, even when offline, and no input can freeze it.
- The meter and the checklist never contradict each other.
- Layout is clean on mobile (down to 320px) and desktop.
- Deployed live on GitHub Pages.
- README includes a screenshot, the live demo link, an explanation of k-anonymity, known limitations, and credits.
- Release tagged `v1.0.0`.