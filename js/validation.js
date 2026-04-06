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

  // ── Pre-fill from URL params (linked from pet cards) ───────────────
  const params = new URLSearchParams(window.location.search);
  const prefillPet = params.get("pet");
  const prefillType = params.get("type");

  if (prefillPet) {
    const petNameInput = document.getElementById("pet-name");
    if (petNameInput) petNameInput.value = prefillPet;
  }

  if (prefillType) {
    const petTypeSelect = document.getElementById("pet-type");
    if (petTypeSelect) {
      petTypeSelect.value = prefillType;
      // Mark as valid since it's pre-filled
      petTypeSelect.classList.add("input-success");
    }
  }

  // ── CPF validator (professor-specified logic) ───────────────────────
  /**
   * Validates a Brazilian CPF using a custom check-digit algorithm.
   * Accepts formats: 000.000.000-00 or 00000000000
   */
  function validateCPF(cpf) {
    // Strip dots, keep the hyphen as the separator
    cpf = cpf.replace(/\./g, "");
    const parts = cpf.split("-");

    if (parts.length !== 2 || parts[0].length !== 9 || parts[1].length !== 2) {
      return false;
    }

    const digits = parts[0];
    const checkDigits = parts[1];

    let sumForwards = 0;
    let sumBackwards = 0;

    for (let i = 0; i < 9; i++) {
      const digit = parseInt(digits[i], 10);
      if (isNaN(digit)) return false;
      sumForwards += digit * (1 + i);
      sumBackwards += digit * (9 - i);
    }

    const trimTen = (value) => (value === 10 ? 0 : value);

    const expected1 = trimTen(sumForwards % 11);
    const expected2 = trimTen(sumBackwards % 11);

    return (
      expected1 === parseInt(checkDigits[0], 10) &&
      expected2 === parseInt(checkDigits[1], 10)
    );
  }

  // ── CPF input mask (auto-format as user types) ─────────────────────
  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", function () {
      let raw = cpfInput.value.replace(/\D/g, "").slice(0, 11);
      let formatted = "";

      for (let i = 0; i < raw.length; i++) {
        if (i === 3 || i === 6) formatted += ".";
        if (i === 9) formatted += "-";
        formatted += raw[i];
      }

      cpfInput.value = formatted;
    });
  }

  // ── Phone input mask (auto-format as user types) ────────────────────
  // Supports both (XX) XXXX-XXXX (10 digits) and (XX) XXXXX-XXXX (11 digits)
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var raw = phoneInput.value.replace(/\D/g, "").slice(0, 11);
      var formatted = "";
      // Position of the hyphen depends on total length:
      // 11 digits → hyphen after index 6 (5-digit first half)
      // 10 or fewer → hyphen after index 5 (4-digit first half)
      var hyphenAt = raw.length === 11 ? 7 : 6;

      if (raw.length > 0) formatted += "(";
      for (var i = 0; i < raw.length; i++) {
        if (i === 2) formatted += ") ";
        if (i === hyphenAt) formatted += "-";
        formatted += raw[i];
      }

      phoneInput.value = formatted;
    });
  }

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
      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      message: "Please enter a valid phone number, e.g. (19) 99999-9999.",
    },
    cpf: {
      required: true,
      custom: validateCPF,
      message: "Please enter a valid CPF (000.000.000-00).",
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
    } else if (rule.custom && value && !rule.custom(value)) {
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
  const notesMax = notes
    ? parseInt(notes.getAttribute("maxlength"), 10) || 500
    : 500;

  if (notes && counter) {

    notes.addEventListener("input", function () {
      const len = notes.value.length;
      counter.textContent = len + " / " + notesMax;
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
    if (counter) counter.textContent = "0 / " + notesMax;

    // Scroll feedback into view
    feedback.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
