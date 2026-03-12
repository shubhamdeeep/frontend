/**
 * Content container with optional title. Use for sections and forms.
 */
function Card({ title, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {title && <h3 className="card__title">{title}</h3>}
      {children}
    </section>
  );
}

export default Card;
