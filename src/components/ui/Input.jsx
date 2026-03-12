import { forwardRef } from "react";
import FormField from "./FormField";

/**
 * Text/email/date input with optional label and error.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    required,
    id,
    className = "",
    ...props
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const inputClasses = ["input", error && "input--error", className].filter(Boolean).join(" ");

  const input = (
    <input
      ref={ref}
      id={inputId}
      className={inputClasses}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${inputId}-error` : undefined}
      {...props}
    />
  );

  if (label || error) {
    return (
      <FormField label={label} error={error} htmlFor={inputId} required={required}>
        {input}
      </FormField>
    );
  }

  return input;
});

export default Input;
