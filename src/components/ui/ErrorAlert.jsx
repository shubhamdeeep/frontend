import { useState } from "react";
import Button from "./Button";

/**
 * Inline error message with optional dismiss. Use for API/form errors.
 */
function ErrorAlert({ message, onDismiss, dismissible = true }) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (!message || dismissed) return null;

  return (
    <div className="error-alert" role="alert">
      <span className="error-alert__message">{message}</span>
      {dismissible && (
        <Button variant="ghost" size="sm" className="error-alert__dismiss" onClick={handleDismiss} aria-label="Dismiss">
          ×
        </Button>
      )}
    </div>
  );
}

export default ErrorAlert;
