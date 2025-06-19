import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./WhatsNewPopup.css";

const WhatsNewPopup = ({ onClose }) => {
  const { theme } = useContext(ThemeContext);

  const popupClassName = `whats-new-popup ${theme === "dark" ? "dark" : ""}`;

  return (
      <div className="whats-new-popup-overlay">
        <div className={popupClassName}>
          <button className="whats-new-popup-close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Что нового</h2>
          <ul className="whats-new-list">
            <li><strong>1.3.7</strong> — Улучшили позиционирование кнопки добавления</li>
            <li><strong>1.3.6</strong> — Добавили инструкцию по добавлению приложения</li>
            <li><strong>1.3.0</strong> — Исправили подгрузку картинки Fix Price</li>
            <li><strong>1.2.0</strong> — Исправили подгрузку картинок</li>
          </ul>
        </div>
      </div>
  );
};

export default WhatsNewPopup;