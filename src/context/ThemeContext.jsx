import React, { createContext, useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "themePreference";
const defaultTheme = "dark"; // 'light', 'dark', 'system'

export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: (themeName) => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(defaultTheme);

  const applyTheme = useCallback((themeName) => {
    document.documentElement.removeAttribute("data-theme");
    if (themeName === "light" || themeName === "dark") {
      document.documentElement.setAttribute("data-theme", themeName);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || defaultTheme;
    setThemeState(storedTheme);
    applyTheme(storedTheme);
  }, [applyTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

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