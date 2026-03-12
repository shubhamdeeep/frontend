/**
 * Status badge (e.g. Present / Absent) with semantic color.
 */
const VARIANT_CLASS = {
  success: "badge--success",
  danger: "badge--danger",
  neutral: "badge--neutral",
};

function Badge({ children, variant = "neutral", className = "" }) {
  const classes = ["badge", VARIANT_CLASS[variant] ?? VARIANT_CLASS.neutral, className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}

export default Badge;
