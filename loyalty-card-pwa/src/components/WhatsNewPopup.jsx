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
            <li><strong>1.5.3</strong> — Улучшения на страницы добавления</li>
            <li><strong>1.5.2</strong> — Улучшение обновления приложения</li>
            <li><strong>1.5.1</strong> — Теперь инструкция показывается только в браузерах</li>
            <li><strong>1.4.8</strong> — Улучшение UX/UI</li>
            <li><strong>1.4.0</strong> — Исправили обновление приложения</li>
            <li><strong>1.3.7</strong> — Улучшили позиционирование кнопки добавления</li>
            <li><strong>1.3.6</strong> — Добавили инструкцию по добавлению приложения</li>
            <li><strong>1.3.0</strong> — Исправили загрузку картинки Fix Price</li>
            <li><strong>1.2.0</strong> — Исправили загрузку картинок</li>
            <li><strong>1.0.0</strong> — Релиз</li>
          </ul>
        </div>
      </div>
  );
};

export default WhatsNewPopup;