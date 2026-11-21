import { checkStrength } from "./strength.js";

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

export function generatePassphrase(wordCount = 7) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const chosen = [];
    while (chosen.length < wordCount) {
      const word = PASSPHRASE_WORDS[randomInt(PASSPHRASE_WORDS.length)];
      if (!chosen.includes(word)) {
        chosen.push(word);
      }
    }
    const candidate = `${chosen
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("-")}-${pickChar(DIGITS)}`;
    if (checkStrength(candidate) === "strong") {
      return candidate;
    }
  }
  return generateRandomPassword(18);
}
