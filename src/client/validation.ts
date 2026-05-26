(function () {
  'use strict';

  const form = document.getElementById('adopt-form') as HTMLFormElement | null;
  if (!form) return;

  const feedback = document.getElementById('form-feedback');

  const params = new URLSearchParams(window.location.search);
  const prefillPet = params.get('pet');
  const prefillType = params.get('type');

  if (prefillPet) {
    const petNameInput = document.getElementById('pet-name') as HTMLInputElement | null;
    if (petNameInput) petNameInput.value = prefillPet;
  }

  if (prefillType) {
    const petTypeSelect = document.getElementById('pet-type') as HTMLSelectElement | null;
    if (petTypeSelect) {
      petTypeSelect.value = prefillType;
      petTypeSelect.classList.add('is-valid');
    }
  }

  // CPF check-digit algorithm (Brazilian tax ID): two check digits computed from
  // weighted sums of the first 9 digits. Required by the project spec.
  function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/\./g, '');
    const parts = cpf.split('-');

    if (parts.length !== 2 || parts[0]!.length !== 9 || parts[1]!.length !== 2) {
      return false;
    }

    const digits = parts[0]!;
    const checkDigits = parts[1]!;

    let sumForwards = 0;
    let sumBackwards = 0;

    for (let i = 0; i < 9; i++) {
      const digit = parseInt(digits[i]!, 10);
      if (isNaN(digit)) return false;
      sumForwards += digit * (1 + i);
      sumBackwards += digit * (9 - i);
    }

    const trimTen = (value: number): number => (value === 10 ? 0 : value);

    const expected1 = trimTen(sumForwards % 11);
    const expected2 = trimTen(sumBackwards % 11);

    return (
      expected1 === parseInt(checkDigits[0]!, 10) &&
      expected2 === parseInt(checkDigits[1]!, 10)
    );
  }

  const cpfInput = document.getElementById('cpf') as HTMLInputElement | null;
  if (cpfInput) {
    cpfInput.addEventListener('input', () => {
      const raw = cpfInput.value.replace(/\D/g, '').slice(0, 11);
      let formatted = '';

      for (let i = 0; i < raw.length; i++) {
        if (i === 3 || i === 6) formatted += '.';
        if (i === 9) formatted += '-';
        formatted += raw[i];
      }

      cpfInput.value = formatted;
    });
  }

  const phoneInput = document.getElementById('phone') as HTMLInputElement | null;
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const raw = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      let formatted = '';
      const hyphenAt = raw.length === 11 ? 7 : 6;

      if (raw.length > 0) formatted += '(';
      for (let i = 0; i < raw.length; i++) {
        if (i === 2) formatted += ') ';
        if (i === hyphenAt) formatted += '-';
        formatted += raw[i];
      }

      phoneInput.value = formatted;
    });
  }

  interface FieldRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
    message: string;
  }

  const rules: Record<string, FieldRule> = {
    'full-name': {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Please enter your full name (at least 2 characters).',
    },
    'adopt-email': {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.',
    },
    phone: {
      required: true,
      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      message: 'Please enter a valid phone number, e.g. (19) 99999-9999.',
    },
    cpf: {
      required: true,
      custom: validateCPF,
      message: 'Please enter a valid CPF (000.000.000-00).',
    },
    'pet-type': {
      required: true,
      message: 'Please select a pet type.',
    },
    'home-type': {
      required: true,
      message: 'Please select your home type.',
    },
    experience: {
      required: true,
      message: 'Please select your experience level.',
    },
  };

  function validateField(id: string): boolean {
    const rule = rules[id];
    if (!rule) return true;

    const input = document.getElementById(id) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
    const errorSpan = document.getElementById(id + '-error');
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

    input.classList.toggle('is-invalid', !valid);
    input.classList.toggle('is-valid', valid && !!value);

    if (errorSpan) {
      errorSpan.textContent = valid ? '' : rule.message;
    }

    return valid;
  }

  Object.keys(rules).forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', () => {
      validateField(id);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(id);
      }
    });
  });

  const notes = document.getElementById('notes') as HTMLTextAreaElement | null;
  const counter = document.getElementById('notes-counter');
  const notesMaxAttr = notes?.getAttribute('maxlength');
  const notesMax = notesMaxAttr ? parseInt(notesMaxAttr, 10) || 500 : 500;

  if (notes && counter) {
    notes.addEventListener('input', () => {
      const len = notes.value.length;
      counter.textContent = len + ' / ' + notesMax;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalid: HTMLElement | null = null;

    Object.keys(rules).forEach((id) => {
      const isValid = validateField(id);
      if (!isValid && allValid) {
        firstInvalid = document.getElementById(id);
        allValid = false;
      }
    });

    if (!allValid) {
      if (feedback) {
        feedback.textContent = 'Please fix the errors above before submitting.';
        feedback.className = 'alert alert-danger';
      }
      if (firstInvalid) (firstInvalid as HTMLElement).focus();
      return;
    }

    if (feedback) {
      feedback.textContent =
        "🎉 Application submitted successfully! We'll be in touch within 48 hours.";
      feedback.className = 'alert alert-success';
    }

    form.reset();

    form.querySelectorAll('.is-invalid, .is-valid').forEach((el) => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    form.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
    if (counter) counter.textContent = '0 / ' + notesMax;

    if (feedback) feedback.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
