const toggleBtn = document.getElementById("toggle-visibility-btn");
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");
const passwordInput = document.getElementById("password-input");

toggleBtn.addEventListener("click", () => {
  eyeOpen.classList.toggle("hidden");
  eyeClosed.classList.toggle("hidden");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.setAttribute("aria-pressed","true")
  } else {
    passwordInput.type = "password";
    toggleBtn.setAttribute("aria-pressed","false")
  }
});
