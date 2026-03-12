import { useTheme } from "../../contexts/ThemeContext";
import Button from "./Button";

/**
 * Toggle between light and dark theme. Uses aria-label for accessibility.
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <span className="theme-toggle__icon" aria-hidden>☀️</span>
      ) : (
        <span className="theme-toggle__icon" aria-hidden>🌙</span>
      )}
    </Button>
  );
}

export default ThemeToggle;
