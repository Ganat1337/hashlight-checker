const toggleBtn = document.getElementById("toggle-visibility-btn");
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");
const passwordInput = document.getElementById("password-input");
const length = document.getElementById("req-length");
const upperCase = document.getElementById("req-uppercase");
const lowerCase = document.getElementById("req-lowercase");
const numbers = document.getElementById("req-numbers");
const symbols = document.getElementById("req-symbols");
const meterStatus = document.getElementById("meter-status");
const meterBar = document.getElementById("meter-bar");

toggleBtn.addEventListener("click", () => {
  eyeOpen.classList.toggle("hidden");
  eyeClosed.classList.toggle("hidden");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.setAttribute("aria-pressed", "true");
  } else {
    passwordInput.type = "password";
    toggleBtn.setAttribute("aria-pressed", "false");
  }
});

// Security Checklist
const securityChecklist = [
  // #1-At least 8 characters
  { element: length, check: (value) => value.length >= 8 },
  // #2-At least one uppercase letter (A-Z)
  { element: upperCase, check: (value) => /[A-Z]/.test(value) },
  // #3-At least one lowercase letter (a-z)
  { element: lowerCase, check: (value) => /[a-z]/.test(value) },
  // #4-At least one number (0-9)
  { element: numbers, check: (value) => /[0-9]/.test(value) },
  // #5-At least one special symbol (!@#$%^&*)
  { element: symbols, check: (value) => /[!@#$%^&*]/.test(value) },
];

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  securityChecklist.forEach((rule) => {
    rule.element.classList.toggle("valid", rule.check(value));
  });

  // Strength Meter
  const passedRules = securityChecklist.filter((rule) =>
    rule.check(passwordInput.value),
  );

  // console.log(passedRules.length);
  let level;
  if (passedRules.length == 0) {
    level = "neutral";
  } else if (passedRules.length <= 2) {
    level = "weak";
  } else if ((passedRules.length === 5 && value.length >= 12)) {
    level = "strong";
  } else {
    level = "medium";
  }
  // console.log(level);
  // remove/add class on meter bar
  meterBar.classList.remove("weak", "medium", "strong");
  if (level !== "neutral") {
    meterBar.classList.add(level);
  }
});
