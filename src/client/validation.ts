import {
  applicationSchema,
  APPLICATION_FIELD_INPUT_IDS,
} from '../shared/applicationSchema.js';

const form = document.getElementById('adopt-form') as HTMLFormElement | null;
if (form) {
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

  type SchemaKey = keyof typeof applicationSchema.shape;

  const inputIdToSchemaKey: Record<string, SchemaKey> = {};
  for (const [schemaKey, inputId] of Object.entries(APPLICATION_FIELD_INPUT_IDS)) {
    inputIdToSchemaKey[inputId] = schemaKey as SchemaKey;
  }

  const validateField = (inputId: string): boolean => {
    const schemaKey = inputIdToSchemaKey[inputId];
    if (!schemaKey) return true;

    const input = document.getElementById(inputId) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
    const errorSpan = document.getElementById(inputId + '-error');
    if (!input) return true;

    const value = input.value.trim();
    const fieldSchema = applicationSchema.shape[schemaKey];
    const result = fieldSchema.safeParse(value);

    if (result.success) {
      input.classList.remove('is-invalid');
      if (value !== '') {
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
      }
      if (errorSpan) errorSpan.textContent = '';
      return true;
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (errorSpan) {
        errorSpan.textContent = result.error.issues[0]?.message ?? 'Invalid value.';
      }
      return false;
    }
  };

  for (const inputId of Object.values(APPLICATION_FIELD_INPUT_IDS)) {
    const input = document.getElementById(inputId);
    if (!input) continue;

    input.addEventListener('blur', () => {
      validateField(inputId);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(inputId);
      }
    });
  }

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
    const formData = new FormData(form);
    const obj: Record<string, string> = {};
    for (const [key, val] of formData.entries()) {
      if (typeof val === 'string') obj[key] = val;
    }

    const result = applicationSchema.safeParse(obj);
    if (result.success) {
      return;
    }

    e.preventDefault();

    for (const inputId of Object.values(APPLICATION_FIELD_INPUT_IDS)) {
      const input = document.getElementById(inputId);
      if (input) {
        input.classList.remove('is-invalid', 'is-valid');
      }
      const errorSpan = document.getElementById(inputId + '-error');
      if (errorSpan) errorSpan.textContent = '';
    }

    let firstInvalid: HTMLElement | null = null;
    for (const issue of result.error.issues) {
      const schemaKey = String(issue.path[0] ?? '');
      const inputId = APPLICATION_FIELD_INPUT_IDS[schemaKey];
      if (!inputId) continue;
      const input = document.getElementById(inputId);
      const errorSpan = document.getElementById(inputId + '-error');
      if (input && !input.classList.contains('is-invalid')) {
        input.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = input;
      }
      if (errorSpan && !errorSpan.textContent) {
        errorSpan.textContent = issue.message;
      }
    }

    if (feedback) {
      feedback.textContent = 'Please fix the errors above before submitting.';
      feedback.className = 'alert alert-danger';
    }
    if (firstInvalid) firstInvalid.focus();
  });
}
