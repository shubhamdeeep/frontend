/**
 * Centered loading indicator. Use for list/data loading states.
 */
function LoadingSpinner({ message = "Loading…" }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="loading-spinner__dot" aria-hidden />
      <span className="loading-spinner__message">{message}</span>
    </div>
  );
}

export default LoadingSpinner;
