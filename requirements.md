# Hashlight: Requirements v1

## Overview
Hashlight is a web tool that evaluates password strength and checks whether a password appeared in known data breaches, without ever sending the password itself off the user's device.

**Target users:** anyone who wants to check their passwords (students, everyday users).
**Stack:** HTML, CSS, vanilla JavaScript (ES modules). No frameworks in v1.
**Approach:** RAD, in short time-boxed iterations: plan, prototype, build, ship.

## Features (v1 scope)

| # | Feature | Done when |
|---|---------|-----------|
| 1 | Show/hide password | A toggle switches the input between hidden and visible |
| 2 | Live strength meter | A bar updates on every keystroke (weak / medium / strong) |
| 3 | Requirements checklist | A list shows which rules pass or fail (length, upper/lower case, digits, symbols, common patterns) |
| 4 | Breach check | SHA-1 hash in the browser, send only the first 5 characters to Have I Been Pwned (k-anonymity), match the rest locally, show the breach count |
| 5 | Loading, errors, responsive | A loading state, clear messages when the network or API fails, usable on mobile |

## Out of scope (v2 list)
Password generator, time-to-crack estimate, TypeScript, rebuild in React, favicon, debounce tuning beyond the basics.
Any new idea that appears during v1 goes here and is not built until v1 ships.

## Definition of Done (v1)
- All 5 features work.
- No error breaks the page, even when offline.
- Layout is clean on mobile and desktop.
- Deployed live on GitHub Pages.
- README includes a screenshot, the live demo link, and an explanation of k-anonymity.

## Timeline
Start: Fri 6 Nov 2026. Hard deadline: Fri 27 Nov 2026.

| Week | Dates | Target |
|------|-------|--------|
| 1 | 6 to 12 Nov | Requirements, design reference, HTML/CSS layout, features 1 and 2 |
| 2 | 13 to 19 Nov | Feature 3, then feature 4 (the hard one, biggest block of time) |
| 3 | 20 to 26 Nov | Feature 5, polish, deploy, README |
| Buffer | 24 to 27 Nov | Absorbs delays. If unused, final polish. |

## Capacity and delay plan
- Free days (Fri to Mon): about 4 hours per morning. College days (Tue to Thu): 1.5 to 2 hours.
- Plan with roughly 60 percent of that capacity, the rest is the delay cushion.
- If a feature is not done by its date, it moves into the buffer. It does not push the deadline.
- If the buffer is used up, cut scope (simplify feature 5), never silently move the deadline.
- Minimum day: 30 minutes and one commit, so the chain never breaks.
- Exam or quiz weeks: college-day hours drop to zero and the buffer absorbs it.

## Workflow
- One GitHub issue per feature, closed with `closes #N` in the commit.
- Small commits after each working step. Prefixes: `feat:`, `fix:`, `style:`, `docs:`, `chore:`.
- Each prototype iteration is time-boxed to 2 days at most.
- Weekly review on Fridays: what shipped, what slipped, adjust.
