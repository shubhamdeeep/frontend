import { forwardRef } from "react";
import FormField from "./FormField";

/**
 * Select dropdown with optional label and error.
 * options: [{ value, label }] or children <option>
 */
const Select = forwardRef(function Select(
  {
    label,
    error,
    required,
    id,
    options = [],
    placeholder = "Select…",
    className = "",
    children,
    ...props
  },
  ref
) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
  const selectClasses = ["input", "input--select", error && "input--error", className]
    .filter(Boolean)
    .join(" ");

  const select = (
    <select
      ref={ref}
      id={selectId}
      className={selectClasses}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${selectId}-error` : undefined}
      {...props}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.length > 0
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );

  if (label || error) {
    return (
      <FormField label={label} error={error} htmlFor={selectId} required={required}>
        {select}
      </FormField>
    );
  }

  return select;
});

export default Select;
