/**
 * validation.js — Real-time form validation for the adoption application.
 *
 * Features:
 * - Per-field validation on blur and input
 * - Visual success/error states on each field
 * - Field-level error messages via aria-live="polite" spans
 * - Global success/error banner via aria-live="assertive" region
 * - Character counter for the notes textarea
 * - Simulated form submission with success feedback
 */
(function () {
  "use strict";

  const form = document.getElementById("adopt-form");
  if (!form) return;

  const feedback = document.getElementById("form-feedback");

  // ── Validation rules ──────────────────────────────────────────────
  const rules = {
    "full-name": {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: "Please enter your full name (at least 2 characters).",
    },
    "adopt-email": {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address.",
    },
    phone: {
      required: true,
      pattern: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
      message: "Please enter a valid phone number, e.g. (19) 99999-9999.",
    },
    "pet-type": {
      required: true,
      message: "Please select a pet type.",
    },
    "home-type": {
      required: true,
      message: "Please select your home type.",
    },
    experience: {
      required: true,
      message: "Please select your experience level.",
    },
  };

  // ── Helpers ────────────────────────────────────────────────────────

  /** Validate a single field. Returns true if valid, false otherwise. */
  function validateField(id) {
    const rule = rules[id];
    if (!rule) return true; // No rule = always valid

    const input = document.getElementById(id);
    const errorSpan = document.getElementById(id + "-error");
    if (!input) return true;

    const value = input.value.trim();
    let valid = true;

    if (rule.required && !value) {
      valid = false;
    } else if (rule.minLength && value.length < rule.minLength) {
      valid = false;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      valid = false;
    }

    // Update UI
    input.classList.toggle("input-error", !valid);
    input.classList.toggle("input-success", valid && !!value);

    if (errorSpan) {
      errorSpan.textContent = valid ? "" : rule.message;
    }

    return valid;
  }

  // ── Attach real-time listeners ─────────────────────────────────────
  Object.keys(rules).forEach(function (id) {
    const input = document.getElementById(id);
    if (!input) return;

    // Validate on blur (leaving the field)
    input.addEventListener("blur", function () {
      validateField(id);
    });

    // Clear error on input (feels responsive)
    input.addEventListener("input", function () {
      if (input.classList.contains("input-error")) {
        validateField(id);
      }
    });
  });

  // ── Character counter for notes ────────────────────────────────────
  const notes = document.getElementById("notes");
  const counter = document.getElementById("notes-counter");

  if (notes && counter) {
    const max = parseInt(notes.getAttribute("maxlength"), 10) || 500;

    notes.addEventListener("input", function () {
      const len = notes.value.length;
      counter.textContent = len + " / " + max;
    });
  }

  // ── Form submission ────────────────────────────────────────────────
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    let firstInvalid = null;

    Object.keys(rules).forEach(function (id) {
      const isValid = validateField(id);
      if (!isValid && allValid) {
        firstInvalid = document.getElementById(id);
        allValid = false;
      }
    });

    if (!allValid) {
      feedback.textContent =
        "Please fix the errors above before submitting.";
      feedback.className = "form-feedback feedback-error";

      // Focus the first invalid field for accessibility
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // ✅ "Success" — in a real app this would POST to a server
    feedback.textContent =
      "🎉 Application submitted successfully! We'll be in touch within 48 hours.";
    feedback.className = "form-feedback feedback-success";

    form.reset();

    // Clear all validation styles
    form.querySelectorAll(".input-error, .input-success").forEach(function (el) {
      el.classList.remove("input-error", "input-success");
    });
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.textContent = "";
    });
    if (counter) counter.textContent = "0 / 500";

    // Scroll feedback into view
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
