import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="theme-options">
        <h2>Theme</h2>
        <div className="theme-option">
          <input
            type="radio"
            id="theme-light"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={handleThemeChange}
          />
          <label htmlFor="theme-light">Light</label>
        </div>
        <div className="theme-option">
          <input
            type="radio"
            id="theme-dark"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={handleThemeChange}
          />
          <label htmlFor="theme-dark">Dark</label>
        </div>
        <div className="theme-option">
          <input
            type="radio"
            id="theme-system"
            name="theme"
            value="system"
            checked={theme === 'system'}
            onChange={handleThemeChange}
          />
          <label htmlFor="theme-system">As in system</label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
