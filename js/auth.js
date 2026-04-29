/**
 * auth.js — Hardcoded login/logout with sessionStorage.
 *
 * Credentials: teste@teste / teste
 * Protected pages check for a session flag; if missing, redirect to login.
 */
(function () {
  "use strict";

  const VALID_USER = "teste@teste";
  const VALID_PASS = "teste";
  const SESSION_KEY = "paws-auth";

  const isLoggedIn = () => sessionStorage.getItem(SESSION_KEY) === "true";

  // === Login page logic ===
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    // If already logged in, skip straight to home
    if (isLoggedIn()) {
      window.location.replace("home.html");
      return;
    }

    const feedback = document.getElementById("login-feedback");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      feedback.textContent = "";
      feedback.className = "alert d-none";
      usernameError.textContent = "";
      passwordError.textContent = "";
      usernameInput.classList.remove("is-invalid");
      passwordInput.classList.remove("is-invalid");

      // Validate fields
      if (!usernameInput.value.trim()) {
        usernameError.textContent = "Please enter your username.";
        usernameInput.classList.add("is-invalid");
        valid = false;
      }

      if (!passwordInput.value) {
        passwordError.textContent = "Please enter your password.";
        passwordInput.classList.add("is-invalid");
        valid = false;
      }

      if (!valid) return;

      // Check credentials
      if (
        usernameInput.value.trim() === VALID_USER &&
        passwordInput.value === VALID_PASS
      ) {
        sessionStorage.setItem(SESSION_KEY, "true");
        window.location.replace("home.html");
      } else {
        feedback.textContent = "Invalid username or password. Please try again.";
        feedback.className = "alert alert-danger";
        passwordInput.value = "";
        passwordInput.focus();
      }
    });

    return; // Don't run protected-page logic on login page
  }

  // === Protected page logic ===
  if (!isLoggedIn()) {
    window.location.replace("index.html");
    return;
  }

  // === Logout ===
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem(SESSION_KEY);
      window.location.replace("index.html");
    });
  }
})();
