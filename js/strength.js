// Security Checklist
export const securityChecklist = [
  // #1-At least 8 characters
  { id: "length", check: (value) => value.length >= 8 },
  // #2-At least one uppercase letter (A-Z)
  { id: "upperCase", check: (value) => /[A-Z]/.test(value) },
  // #3-At least one lowercase letter (a-z)
  { id: "lowerCase", check: (value) => /[a-z]/.test(value) },
  // #4-At least one number (0-9)
  { id: "numbers", check: (value) => /[0-9]/.test(value) },
  // #5-At least one special symbol (!@#$%^&*)
  { id: "symbols", check: (value) => /[!@#$%^&*]/.test(value) },
];

export function checkStrength(value) {
  // Strength Meter
  const passedRules = securityChecklist.filter((rule) => rule.check(value));

  // console.log(passedRules.length);
  let level;
  if (value.length === 0) {
    level = "neutral";
  } else if (passedRules.length <= 2 || value.length < 8) {
    level = "weak";
  } else if (passedRules.length === 5 && value.length >= 12) {
    level = "strong";
  } else {
    level = "medium";
  }
  // console.log(level);
  return level;
}