import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { version } from '../../../package.json';
import './SettingsPage.css';

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="settings-page">
      <h1>{t('settingsPage.title')}</h1>
      <div className="theme-selector">
        <h2>{t('settingsPage.themeTitle')}</h2>
        <div className="theme-buttons-container">
          <button
            className={`theme-button ${theme === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}
            aria-pressed={theme === 'light'}
            title={t('settingsPage.themeLight')}
          >
            <span className="theme-icon">☀️</span>
            <span className="theme-label">{t('settingsPage.themeLight')}</span>
          </button>
          <button
            className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}
            aria-pressed={theme === 'dark'}
            title={t('settingsPage.themeDark')}
          >
            <span className="theme-icon">🌙</span>
            <span className="theme-label">{t('settingsPage.themeDark')}</span>
          </button>
          <button
            className={`theme-button ${theme === 'system' ? 'active' : ''}`}
            onClick={() => handleThemeChange('system')}
            aria-pressed={theme === 'system'}
            title={t('settingsPage.themeSystem')}
          >
            <span className="theme-icon">🌓</span>
            <span className="theme-label">{t('settingsPage.themeSystem')}</span>
          </button>
        </div>
      </div>

      <div className="app-info-section">
        <p className="app-version">{t('settingsPage.appVersion', { version })}</p>
        <a href="#" className="whats-new-link">
          {t('settingsPage.whatsNew')}
        </a>
        <p className="contact-developer-container">
          {t('settingsPage.contactDeveloper')}:{' '}
          <a href="https://t.me/mego_RU" target="_blank" rel="noopener noreferrer" className="contact-link">
            t.me/mego_RU
          </a>
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
