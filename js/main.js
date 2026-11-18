import { checkBreach } from "./breach.js";
import { securityChecklist, checkStrength } from "./strength.js";

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
const scan = document.getElementById("breach-check-btn");
const breachAlert = document.getElementById("breach-alert");
const scanLabel = scan.querySelector("span");
const scanText = scanLabel.textContent;
let inputVersion = 0;
const labels = {
  neutral: "Awaiting Input",
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
};

const checklistElements = {
  length,
  upperCase,
  lowerCase,
  numbers,
  symbols,
};

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

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  breachAlert.classList.add("hidden");
  inputVersion++;

  securityChecklist.forEach((rule) => {
    checklistElements[rule.id].classList.toggle("valid", rule.check(value));
  });

  const level = checkStrength(value);

  // remove/add class on meter bar
  meterBar.classList.remove("weak", "medium", "strong");
  if (level !== "neutral") {
    meterBar.classList.add(level);
  }
  // remove/add class on meter status
  meterStatus.classList.remove("weak", "medium", "strong");
  if (level !== "neutral") {
    meterStatus.classList.add(level);
  }
  meterStatus.textContent = labels[level];
});

// breach check btn
scan.addEventListener("click", async () => {
  const password = passwordInput.value;
  if (password.length === 0) {
    return;
  }

  const myVersion = inputVersion;
  scan.disabled = true;
  breachAlert.classList.remove("safe", "danger", "error");
  try {
    const result = await checkBreach(password);
    if (myVersion !== inputVersion) {
      return;
    }
    if (result > 0) {
      breachAlert.classList.add("danger");
      breachAlert.textContent = `Found in known breaches ${result.toLocaleString()} times. Change it anywhere you use it.`;
    } else {
      breachAlert.classList.add("safe");
      breachAlert.textContent = "Not found in known breaches. That doesn't guarantee it's safe.";
    }
  } catch (error) {
    if (myVersion !== inputVersion) {
      return;
    }
    breachAlert.classList.add("error");
    breachAlert.textContent = "Couldn't check right now. Please try again. This does not mean the password is safe.";
  } finally {
    scan.disabled = false;
    if (document.activeElement === document.body) {
      scan.focus();
    }
  }
  breachAlert.classList.remove("hidden");
});