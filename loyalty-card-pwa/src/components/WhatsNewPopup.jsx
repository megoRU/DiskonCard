import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../context/ThemeContext";
import "./WhatsNewPopup.css";

const WhatsNewPopup = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext); // Consume ThemeContext

  // Determine locale for date formatting based on current language
  const currentLanguage = i18n.language;
  const dateLocale = currentLanguage === "ru" ? "ru-RU" : "en-US";
  const currentDate = new Date().toLocaleDateString(dateLocale);

  const popupClassName = `whats-new-popup ${theme === "dark" ? "dark" : ""}`;

  return (
    <div className="whats-new-popup-overlay">
      <div className={popupClassName}>
        <button className="whats-new-popup-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{t("whatsNewPopup.title")}</h2>
        <p>{t("whatsNewPopup.releaseDate", { date: currentDate })}</p>
      </div>
    </div>
  );
};

export default WhatsNewPopup;