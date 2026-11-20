const COMMON_WORDS = [
  "password",
  "passw0rd",
  "qwerty",
  "asdfgh",
  "zxcvbn",
  "admin",
  "letmein",
  "welcome",
  "iloveyou",
  "monkey",
  "dragon",
  "football",
  "baseball",
  "sunshine",
  "princess",
  "trustno1",
];

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "01234567890"];

function hasSequentialRun(lowerValue, minLen = 4) {
  for (const row of KEYBOARD_ROWS) {
    const rev = row.split("").reverse().join("");
    for (let i = 0; i <= row.length - minLen; i++) {
      const seq = row.slice(i, i + minLen);
      const revSeq = rev.slice(i, i + minLen);
      if (lowerValue.includes(seq) || lowerValue.includes(revSeq)) {
        return true;
      }
    }
  }

  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const alphaRev = alpha.split("").reverse().join("");
  for (let i = 0; i <= alpha.length - minLen; i++) {
    const seq = alpha.slice(i, i + minLen);
    const revSeq = alphaRev.slice(i, i + minLen);
    if (lowerValue.includes(seq) || lowerValue.includes(revSeq)) {
      return true;
    }
  }

  return false;
}

export function hasCommonPattern(value) {
  if (!value) return false;
  const lower = value.toLowerCase();

  if (COMMON_WORDS.some((word) => lower.includes(word))) {
    return true;
  }

  // 3 or more identical consecutive characters (e.g., "aaa", "111", "!!!")
  if (/(.)\1{2,}/.test(value)) {
    return true;
  }

  if (hasSequentialRun(lower, 4)) {
    return true;
  }

  return false;
}

// Security Checklist (all 6 rules align with Strong rating)
export const securityChecklist = [
  { id: "length", check: (value) => value.length >= 12 },
  { id: "upperCase", check: (value) => /[A-Z]/.test(value) },
  { id: "lowerCase", check: (value) => /[a-z]/.test(value) },
  { id: "numbers", check: (value) => /[0-9]/.test(value) },
  { id: "symbols", check: (value) => /[^A-Za-z0-9\s]/.test(value) },
  {
    id: "noCommonPatterns",
    check: (value) => value.length > 0 && !hasCommonPattern(value),
  },
];

export function checkStrength(value) {
  if (value.length === 0) {
    return "neutral";
  }

  const hasPattern = hasCommonPattern(value);
  const passedRules = securityChecklist.filter((rule) => rule.check(value));

  if (value.length < 8) {
    return "weak";
  }

  if (hasPattern) {
    return value.length < 16 ? "weak" : "medium";
  }

  if (passedRules.length === securityChecklist.length) {
    return "strong";
  }

  if (passedRules.length <= 2) {
    return "weak";
  }

  return "medium";
}