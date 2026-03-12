/**
 * Wraps a form control with label and optional error message.
 * Use with Input, Select, or any form element.
 */
function FormField({ label, error, htmlFor, required, children, className = "" }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="form-field__label">
          {label}
          {required && <span className="form-field__required" aria-hidden> *</span>}
        </label>
      )}
      <div className="form-field__control">{children}</div>
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
