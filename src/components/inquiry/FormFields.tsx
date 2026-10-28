// =============================================================
// FormFields.tsx
// Accessible form building blocks for the inquiry and offer forms:
// text input, textarea, select and a radio "chip" group.
// Each shows its own error message right under the field.
// =============================================================

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

/* ---------- 1. Shared styles ---------- */
const INPUT_CLASSES =
  'w-full rounded-xl border bg-ink/60 px-4 text-[16px] text-text placeholder:text-muted/70 transition-colors ' +
  'focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/30';

function borderFor(error?: string): string {
  return error ? 'border-danger/70' : 'border-line-strong';
}

/** The small red message under a field. */
function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] text-danger">
      {error}
    </p>
  );
}

/* ---------- 2. Text input ---------- */
interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ id, label, error, hint, ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium">
        {label} {hint && <span className="font-normal text-muted">{hint}</span>}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${INPUT_CLASSES} h-12 ${borderFor(error)}`}
        {...inputProps}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

/* ---------- 3. Textarea ---------- */
interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  footer?: ReactNode; // e.g. a character counter
  className?: string; // extra classes for the textarea, e.g. a smaller min height
}

export function TextAreaField({ id, label, error, footer, className = 'min-h-32', ...textareaProps }: TextAreaFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${INPUT_CLASSES} resize-y py-3 leading-relaxed ${borderFor(error)} ${className}`}
        {...textareaProps}
      />
      <div className="flex items-start justify-between gap-3">
        <FieldError id={errorId} error={error} />
        {footer}
      </div>
    </div>
  );
}

/* ---------- 4. Select (dropdown) ---------- */
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: readonly string[];
  placeholder?: string; // first, empty choice — e.g. "Choose…"
  error?: string;
}

export function SelectField({ id, label, options, placeholder, error, ...selectProps }: SelectFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${INPUT_CLASSES} h-12 cursor-pointer ${borderFor(error)}`}
        {...selectProps}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

/* ---------- 5. Radio chip group ---------- */
interface ChoiceOption {
  value: string;
  label: string;
}

interface ChoiceChipsProps {
  name: string;
  legend: string;
  options: readonly ChoiceOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
}

/** Real radio buttons styled as chips — keyboard and screen-reader friendly. */
export function ChoiceChips({ name, legend, options, selectedValue, onSelect, error }: ChoiceChipsProps) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2.5 text-[14px] font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <label
              key={option.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-xl border px-4 text-[14px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan ${
                isSelected ? 'border-blue bg-blue/15 text-text' : 'border-line-strong text-muted hover:border-fg/30 hover:text-text'
              }`}
            >
              <input type="radio" name={name} value={option.value} checked={isSelected} onChange={() => onSelect(option.value)} className="sr-only" />
              {option.label}
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} error={error} />
    </fieldset>
  );
}
