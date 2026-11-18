import { checkStrength, hasCommonPattern } from "./strength.js";

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%^&*-_+=?";
const ALL_CHARS = UPPER + LOWER + DIGITS + SYMBOLS;

const PASSPHRASE_WORDS = [
  "amber", "anchor", "anvil", "apron", "arctic", "arrow", "aspen", "atlas",
  "audio", "autumn", "badge", "bamboo", "beacon", "binary", "birch", "blade",
  "blaze", "bloom", "boulder", "breeze", "bridge", "bronze", "brook", "canyon",
  "carbon", "cedar", "chalk", "cipher", "citadel", "cloud", "clover", "cobalt",
  "comet", "compass", "copper", "coral", "crater", "crest", "crimson", "crystal",
  "delta", "desert", "drift", "dune", "echo", "ember", "emerald", "engine",
  "epoch", "falcon", "fern", "fiber", "fjord", "flame", "flint", "forest",
  "fossil", "frost", "galaxy", "garnet", "glacier", "granite", "gravel", "grove",
  "harbor", "harvest", "haven", "hazel", "helium", "horizon", "ivory", "jasper",
  "juniper", "kernel", "kestrel", "lantern", "lapis", "laurel", "ledger", "linen",
  "lotus", "lunar", "magnet", "maple", "marble", "meadow", "mercury", "meteor",
  "mirage", "monarch", "moss", "nebula", "nectar", "nickel", "nimbus", "nordic",
  "obsidian", "ochre", "olive", "onyx", "opal", "orbit", "orchid", "osprey",
  "ozone", "paddle", "pebble", "pelican", "pepper", "photon", "pine", "planet",
  "plasma", "plume", "polar", "prism", "pulse", "quartz", "quiver", "radar",
  "raven", "redwood", "relay", "ridge", "ripple", "river", "rocket", "saffron",
  "sage", "sandal", "saturn", "scarlet", "sculpt", "sequoia", "shadow", "shield",
  "sierra", "signal", "silver", "slate", "solar", "spruce", "static", "stellar",
  "stone", "summit", "timber", "topaz", "torrent", "tunnel", "umbra", "valley",
  "vector", "velvet", "vertex", "violet", "voyage", "walnut", "willow", "zenith",
];

function randomInt(max) {
  const array = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value;
  do {
    globalThis.crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % max;
}

function pickChar(charset) {
  return charset[randomInt(charset.length)];
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateRandomPassword(length = 16) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const chars = [
      pickChar(UPPER),
      pickChar(LOWER),
      pickChar(DIGITS),
      pickChar(SYMBOLS),
    ];

    while (chars.length < length) {
      chars.push(pickChar(ALL_CHARS));
    }

    const candidate = shuffleArray(chars).join("");
    if (checkStrength(candidate) === "strong") {
      return candidate;
    }
  }
  return `${pickChar(UPPER)}${pickChar(LOWER)}${pickChar(DIGITS)}${pickChar(SYMBOLS)}-${PASSPHRASE_WORDS[randomInt(PASSPHRASE_WORDS.length)]}`;
}

export function generatePassphrase(wordCount = 4) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const chosen = [];
    while (chosen.length < wordCount) {
      const word = PASSPHRASE_WORDS[randomInt(PASSPHRASE_WORDS.length)];
      if (!chosen.includes(word)) {
        chosen.push(word);
      }
    }
    const candidate = chosen.join("-");
    if (checkStrength(candidate) === "strong") {
      return candidate;
    }
  }
  return generateRandomPassword(18);
}

function breakCommonPatterns(input) {
  let result = input.replace(/(.)\1{2,}/g, (match) => match.slice(0, 2));

  // Break obvious dictionary/sequence chunks by substituting internal characters
  const replacements = [
    [/password/gi, "p@s$w0rd"],
    [/passw0rd/gi, "p@s$w0rD"],
    [/qwerty/gi, "qW3r!y"],
    [/asdfgh/gi, "a$dF6h"],
    [/zxcvbn/gi, "zX7v!n"],
    [/admin/gi, "aDm!n"],
    [/letmein/gi, "l3tM3!n"],
    [/welcome/gi, "w3lC0m!"],
    [/123456/g, "19#48!"],
    [/1234/g, "19#4"],
    [/abcd/gi, "aB#d"],
  ];

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  // If any 4-char sequential run or pattern still remains, interleave a random symbol
  if (hasCommonPattern(result)) {
    result = result
      .split("")
      .map((ch, idx) => (idx % 3 === 2 ? `${ch}${pickChar(SYMBOLS)}` : ch))
      .join("");
  }

  return result;
}

export function upgradePassword(weakPassword) {
  if (!weakPassword || weakPassword.trim().length === 0) {
    return generateRandomPassword(16);
  }

  let upgraded = breakCommonPatterns(weakPassword.trim());

  // Capitalize first alphabetic character if no uppercase exists
  if (!/[A-Z]/.test(upgraded)) {
    const firstAlpha = upgraded.search(/[a-z]/);
    if (firstAlpha !== -1) {
      upgraded =
        upgraded.slice(0, firstAlpha) +
        upgraded[firstAlpha].toUpperCase() +
        upgraded.slice(firstAlpha + 1);
    } else {
      upgraded = `${pickChar(UPPER)}${upgraded}`;
    }
  }

  if (!/[a-z]/.test(upgraded)) {
    upgraded += pickChar(LOWER);
  }

  if (!/[0-9]/.test(upgraded)) {
    upgraded += pickChar(DIGITS);
  }

  if (!/[^A-Za-z0-9\s]/.test(upgraded)) {
    upgraded += pickChar(SYMBOLS);
  }

  // Append a compact random separator + high-entropy tail until strong and >= 14 chars
  if (upgraded.length < 14 || checkStrength(upgraded) !== "strong") {
    upgraded += pickChar("-_!#");
    while (upgraded.length < 14 || checkStrength(upgraded) !== "strong") {
      upgraded += pickChar(ALL_CHARS);
    }
  }

  return upgraded;
}
