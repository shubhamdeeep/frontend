/**
 * Page title with optional primary action (e.g. "Add Employee").
 */
function PageHeader({ title, action }) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {action && <div className="page-header__action">{action}</div>}
    </header>
  );
}

export default PageHeader;
