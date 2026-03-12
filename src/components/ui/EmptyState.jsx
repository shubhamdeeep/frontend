/**
 * Shown when a list or section has no data. Optional action (e.g. "Add first item").
 */
function EmptyState({ message, action }) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__message">{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
