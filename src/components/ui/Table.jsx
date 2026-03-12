/**
 * Semantic table wrapper. Pass columns and data for a consistent layout,
 * or use children for custom rows.
 */
function Table({ columns, data, children, emptyMessage = "No data.", className = "" }) {
  const hasData = children ? true : (data && data.length > 0);

  if (!hasData && !columns) {
    return (
      <div className={`table-wrap ${className}`}>
        <table className="table">
          <tbody>
            <tr>
              <td colSpan="1" className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`table-wrap ${className}`}>
      <table className="table">
        {columns && (
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {children}
          {!children &&
            data?.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
