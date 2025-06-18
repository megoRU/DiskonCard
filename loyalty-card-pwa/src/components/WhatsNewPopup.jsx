import React from 'react';
import { useTranslation } from 'react-i18next';
import './WhatsNewPopup.css';

const WhatsNewPopup = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const appVersion = '1.0.0';

  // Determine locale for date formatting based on current language
  const currentLanguage = i18n.language;
  const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : 'en-US';
  const currentDate = new Date().toLocaleDateString(dateLocale);

  return (
    <div className="whats-new-popup-overlay">
      <div className="whats-new-popup">
        <button className="whats-new-popup-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{t('whatsNewPopup.title')}</h2>
        <p>{t('whatsNewPopup.releaseDate', { date: currentDate })}</p>
        <p>{t('whatsNewPopup.version', { version: appVersion })}</p>
      </div>
    </div>
  );
};

export default WhatsNewPopup;
