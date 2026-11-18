# Hashlight

Client-side password strength evaluator, CSPRNG generator, and breach scanner built with vanilla HTML, CSS, and ES modules.

Your password never leaves the browser. Strength checks, hash generation, and breach suffix matching all run locally via the Web Crypto API.

## What It Does

- **Strength Evaluation (`js/strength.js`)**: Evaluates passwords in real time against 6 criteria—12+ characters, uppercase, lowercase, digits, special symbols (`[^A-Za-z0-9\s]`), and common-pattern detection (dictionary words, keyboard walks, ascending/descending sequences, and repeated characters). Long, high-variety passphrases (20+ chars without common patterns) are scored accurately instead of being penalized for missing punctuation.
- **Breach Scanning (`js/breach.js`)**: Checks passwords against Have I Been Pwned (HIBP) using k-anonymity, caching responses per 5-character hash prefix in memory for the current session.
- **Smart Generator & Upgrader (`js/generator.js`)**: Uses `crypto.getRandomValues` with rejection sampling (no modulo bias) to generate 16-character random passwords or 4-word EFF-style passphrases (`word-word-word-word`), and provides a one-click **Upgrade** action when a weak password is detected.
- **Live k-Anonymity Inspector (`js/main.js`)**: Optional protocol drawer showing the locally computed SHA-1 digest split into the 5-character prefix sent to HIBP and the 35-character suffix kept in the browser.

## How k-Anonymity Works

```
password ──(Web Crypto SHA-1)──▶ 40-char hex hash
                                   ├── first 5 chars (prefix) ──▶ GET api.pwnedpasswords.com/range/{prefix}
                                   └── remaining 35 chars     ◀── matched locally against returned suffixes
```

1. `hashPasswordSha1()` hashes the input locally using `crypto.subtle.digest("SHA-1", ...)`.
2. Only the first 5 hex characters (`prefix`) are sent to the HIBP Pwned Passwords Range API.
3. HIBP returns all known breached hash suffixes sharing that 5-character prefix (~500–1,000 entries).
4. `checkBreach()` searches the response locally for an exact match against the remaining 35 characters (`suffix`) and reports the breach count.
5. An `inputVersion` guard in `js/main.js` discards stale in-flight responses if the input changes before the network request settles.

## Project Structure

```
.
├── index.html          # Semantic markup, ARIA live regions, inspector & generator panels
├── css/
│   └── style.css       # Design tokens, state-driven ambient glow, responsive 2-col checklist
├── js/
│   ├── main.js         # UI state, event wiring, race-condition guards, clipboard feedback
│   ├── strength.js     # Checklist rules, pattern detection, passphrase-aware scoring
│   ├── breach.js       # Local SHA-1 hashing, session prefix cache, HIBP range client
│   └── generator.js    # Bias-free CSPRNG generator, passphrase wordlist, weak password upgrader
├── server.js           # Minimal Express static server (port 3000)
├── package.json        # Scripts (dev, start, build, lint)
└── LICENSE             # MIT
```

## Running Locally

Requires Node.js 18+ (tested on Node 22).

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

You can also verify syntax across all JavaScript modules with:

```bash
npm run lint
```

> **Note on Browser Context**: `crypto.subtle` is only exposed in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (`https://` or `http://localhost`). Serving the app over plain `http://` on a LAN IP will disable local SHA-1 hashing in the browser.

## License

[MIT](LICENSE) — Copyright (c) 2026 Ganat Ahmed