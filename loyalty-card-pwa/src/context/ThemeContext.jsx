import React, { createContext, useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "themePreference";
const defaultTheme = "system"; // 'light', 'dark', 'system'

export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: (themeName) => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(defaultTheme);

  const applyTheme = useCallback((themeName) => {
    document.documentElement.removeAttribute("data-theme"); // Clear previous theme
    if (themeName === "light" || themeName === "dark") {
      document.documentElement.setAttribute("data-theme", themeName);
    } else {
      // System preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        systemPrefersDark ? "dark" : "light",
      );
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || defaultTheme;
    setThemeState(storedTheme);
    applyTheme(storedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (theme === "system") {
        // Only re-apply if current theme is 'system'
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [applyTheme, theme]); // Include theme here to re-run if system theme changes it

  const setTheme = (themeName) => {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    setThemeState(themeName);
    applyTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
