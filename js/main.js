const toggleBtn = document.getElementById("toggle-visibility-btn");
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");
const passwordInput = document.getElementById("password-input");
const length = document.getElementById("req-length")
const upperCase = document.getElementById("req-uppercase")
const lowerCase = document.getElementById("req-lowercase")
const numbers = document.getElementById("req-numbers")
const symbols = document.getElementById("req-symbols")

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
passwordInput.addEventListener("input", () => {
  // #1-At least 8 characters
  if (passwordInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }

  // #2-At least one uppercase letter (A-Z)
  var upperCaseLetters = /[A-Z]/g ;
  if(passwordInput.value.match(upperCaseLetters)){
    upperCase.classList.remove("invalid");
    upperCase.classList.add("valid");
  }
  else{
    upperCase.classList.remove("valid");
    upperCase.classList.add("invalid");    
  }

  // #3-At least one lowercase letter (a-z)
  var lowerCaseLetters = /[a-z]/g ;
  if(passwordInput.value.match(lowerCaseLetters)){
    lowerCase.classList.remove("invalid");
    lowerCase.classList.add("valid");
  }
  else{
    lowerCase.classList.remove("valid");
    lowerCase.classList.add("invalid");    
  }

  // #4-At least one number (0-9)
  var oneNumber = /[0-9]/g ;
  if(passwordInput.value.match(oneNumber)){
    numbers.classList.remove("invalid");
    numbers.classList.add("valid");
  }
  else{
    numbers.classList.remove("valid");
    numbers.classList.add("invalid");    
  }
  
  // #5-At least one special symbol (!@#$%^&*)
  var oneSymbol = /[!@#$%^&*]/ ;
  if(passwordInput.value.match(oneSymbol)){
    symbols.classList.remove("invalid");
    symbols.classList.add("valid");
  }
  else{
    symbols.classList.remove("valid");
    symbols.classList.add("invalid");    
  }


});
