/**
 * Returns theme-aware SweetAlert2 base options.
 * Reads the current theme from the document root class so that
 * alerts always match the app's light/dark mode.
 */
export function getSwalTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    background: isDark ? "rgba(15, 23, 42, 0.97)" : "rgba(255, 255, 255, 0.97)",
    color: isDark ? "#f8fafc" : "#0f172a",
  };
}

/**
 * Returns a consistent customClass for themed SweetAlert popups.
 * The border color can be customised per-call.
 */
export function getSwalCustomClass(accentClass = "border-cyan-500/20") {
  const isDark = document.documentElement.classList.contains("dark");
  return {
    popup: `${accentClass} border backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.12)] ${isDark ? "" : "shadow-lg"}`,
  };
}
