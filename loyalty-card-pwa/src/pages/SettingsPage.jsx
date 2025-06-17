import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './SettingsPage.css';

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <div className="settings-page">
      <h1>{t('settingsPage.title')}</h1>
      <div className="theme-options">
        <h2>{t('settingsPage.themeTitle')}</h2>
        <div className="theme-option">
          <input
            type="radio"
            id="theme-light"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={handleThemeChange}
          />
          <label htmlFor="theme-light">{t('settingsPage.themeLight')}</label>
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
          <label htmlFor="theme-dark">{t('settingsPage.themeDark')}</label>
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
          <label htmlFor="theme-system">{t('settingsPage.themeSystem')}</label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
