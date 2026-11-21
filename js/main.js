import { checkBreach, hashPasswordSha1 } from "./breach.js";
import {
  generatePassphrase,
  generateRandomPassword,
} from "./generator.js";
import { securityChecklist, checkStrength } from "./strength.js";

const cardContainer = document.querySelector(".hashlight-card");
const passwordInput = document.getElementById("password-input");
const clearBtn = document.getElementById("clear-btn");
const toggleBtn = document.getElementById("toggle-visibility-btn");
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");

const generateToggleBtn = document.getElementById("generate-toggle-btn");
const generatorPanel = document.getElementById("generator-panel");
const modeRandomBtn = document.getElementById("mode-random-btn");
const modePassphraseBtn = document.getElementById("mode-passphrase-btn");
const regenerateBtn = document.getElementById("regenerate-btn");
const copyBtn = document.getElementById("copy-btn");

const meterStatus = document.getElementById("meter-status");
const meterBar = document.getElementById("meter-bar");

const scanBtn = document.getElementById("breach-check-btn");
const scanIcon = document.getElementById("scan-icon");
const scanSpinner = document.getElementById("scan-spinner");
const scanLabel = document.getElementById("scan-btn-label");
const defaultScanLabel = scanLabel.textContent;
const breachAlert = document.getElementById("breach-alert");

const inspectProtocolBtn = document.getElementById("inspect-protocol-btn");
const protocolInspector = document.getElementById("protocol-inspector");
const inspectorEmpty = document.getElementById("inspector-empty");
const inspectorData = document.getElementById("inspector-data");
const inspectorHashHead = document.getElementById("inspector-hash-head");
const inspectorHashTail = document.getElementById("inspector-hash-tail");
const inspectorPrefix = document.getElementById("inspector-prefix");
const inspectorSuffix = document.getElementById("inspector-suffix");

const checklistElements = {
  length: document.getElementById("req-length"),
  upperCase: document.getElementById("req-uppercase"),
  lowerCase: document.getElementById("req-lowercase"),
  numbers: document.getElementById("req-numbers"),
  symbols: document.getElementById("req-symbols"),
  noCommonPatterns: document.getElementById("req-patterns"),
};

const labels = {
  neutral: "Awaiting Input",
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
};

let inputVersion = 0;
let generatorMode = "random";
let copyTimeoutId = null;

function setVisibility(visible) {
  passwordInput.type = visible ? "text" : "password";
  eyeOpen.classList.toggle("hidden", !visible);
  eyeClosed.classList.toggle("hidden", visible);
  toggleBtn.setAttribute("aria-pressed", String(visible));
  toggleBtn.setAttribute(
    "aria-label",
    visible ? "Hide password" : "Show password",
  );
}

async function updateProtocolInspector(value, version) {
  if (value.length === 0) {
    inspectorEmpty.classList.remove("hidden");
    inspectorData.classList.add("hidden");
    inspectorHashHead.textContent = "";
    inspectorHashTail.textContent = "";
    inspectorPrefix.textContent = "—";
    inspectorSuffix.textContent = "—";
    return;
  }

  try {
    const { prefix, suffix } = await hashPasswordSha1(value);
    if (version !== inputVersion) {
      return;
    }
    inspectorHashHead.textContent = prefix;
    inspectorHashTail.textContent = suffix;
    inspectorPrefix.textContent = prefix;
    inspectorSuffix.textContent = suffix;
    inspectorEmpty.classList.add("hidden");
    inspectorData.classList.remove("hidden");
  } catch {
    if (version !== inputVersion) {
      return;
    }
    inspectorEmpty.textContent =
      "Local SHA-1 hashing requires a secure HTTPS browser context.";
    inspectorEmpty.classList.remove("hidden");
    inspectorData.classList.add("hidden");
  }
}

function evaluatePassword(value) {
  inputVersion++;
  const currentVersion = inputVersion;

  breachAlert.classList.add("hidden");
  clearBtn.classList.toggle("hidden", value.length === 0);
  scanBtn.disabled = value.length === 0;

  securityChecklist.forEach((rule) => {
    checklistElements[rule.id].classList.toggle("valid", rule.check(value));
  });

  const level = checkStrength(value);

  meterBar.classList.remove("weak", "medium", "strong");
  meterStatus.classList.remove("weak", "medium", "strong");

  if (level !== "neutral") {
    meterBar.classList.add(level);
    meterStatus.classList.add(level);
    cardContainer.setAttribute("data-strength", level);
    document.body.setAttribute("data-strength", level);
  } else {
    cardContainer.removeAttribute("data-strength");
    document.body.removeAttribute("data-strength");
  }

  meterStatus.textContent = labels[level];

  updateProtocolInspector(value, currentVersion);
}

function applyGeneratedPassword() {
  const generated =
    generatorMode === "passphrase"
      ? generatePassphrase(7)
      : generateRandomPassword(16);

  passwordInput.value = generated;
  setVisibility(true);
  evaluatePassword(generated);
}

toggleBtn.addEventListener("click", () => {
  setVisibility(passwordInput.type === "password");
});

passwordInput.addEventListener("input", () => {
  evaluatePassword(passwordInput.value);
});

clearBtn.addEventListener("click", () => {
  passwordInput.value = "";
  evaluatePassword("");
  passwordInput.focus();
});

generateToggleBtn.addEventListener("click", () => {
  const isOpening = generatorPanel.classList.contains("hidden");
  generatorPanel.classList.toggle("hidden", !isOpening);
  generateToggleBtn.setAttribute("aria-expanded", String(isOpening));
  if (isOpening) {
    applyGeneratedPassword();
  }
});

function setGeneratorMode(mode) {
  generatorMode = mode;
  const isRandom = mode === "random";
  modeRandomBtn.classList.toggle("active", isRandom);
  modeRandomBtn.setAttribute("aria-pressed", String(isRandom));
  modePassphraseBtn.classList.toggle("active", !isRandom);
  modePassphraseBtn.setAttribute("aria-pressed", String(!isRandom));
  applyGeneratedPassword();
}

modeRandomBtn.addEventListener("click", () => setGeneratorMode("random"));
modePassphraseBtn.addEventListener("click", () =>
  setGeneratorMode("passphrase"),
);
regenerateBtn.addEventListener("click", applyGeneratedPassword);

copyBtn.addEventListener("click", async () => {
  const value = passwordInput.value;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    copyBtn.textContent = "Copied ✓";
    copyBtn.classList.add("copied");
    if (copyTimeoutId) clearTimeout(copyTimeoutId);
    copyTimeoutId = setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.classList.remove("copied");
    }, 2000);
  } catch {
    copyBtn.textContent = "Failed";
    copyBtn.classList.remove("copied");
    if (copyTimeoutId) clearTimeout(copyTimeoutId);
    copyTimeoutId = setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 2000);
  }
});

inspectProtocolBtn.addEventListener("click", () => {
  const isOpening = protocolInspector.classList.contains("hidden");
  protocolInspector.classList.toggle("hidden", !isOpening);
  inspectProtocolBtn.setAttribute("aria-expanded", String(isOpening));
});

scanBtn.addEventListener("click", async () => {
  const password = passwordInput.value;
  if (password.length === 0) {
    return;
  }

  const myVersion = inputVersion;
  scanBtn.disabled = true;
  scanBtn.setAttribute("aria-busy", "true");
  scanIcon.classList.add("hidden");
  scanSpinner.classList.remove("hidden");
  scanLabel.textContent = "Scanning hashes...";

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
      breachAlert.textContent =
        "Not found in known breaches. That doesn't guarantee it's safe.";
    }
    breachAlert.classList.remove("hidden");
  } catch {
    if (myVersion !== inputVersion) {
      return;
    }
    breachAlert.classList.add("error");
    breachAlert.textContent =
      "Couldn't check right now. Please try again. This does not mean the password is safe.";
    breachAlert.classList.remove("hidden");
  } finally {
    scanBtn.removeAttribute("aria-busy");
    scanIcon.classList.remove("hidden");
    scanSpinner.classList.add("hidden");
    scanLabel.textContent = defaultScanLabel;
    scanBtn.disabled = passwordInput.value.length === 0;
    if (document.activeElement === document.body && !scanBtn.disabled) {
      scanBtn.focus();
    }
  }
});