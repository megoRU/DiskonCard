import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./WhatsNewPopup.css";

const WhatsNewPopup = ({ onClose }) => {
  const { theme } = useContext(ThemeContext); // Consume ThemeContext

  const popupClassName = `whats-new-popup ${theme === "dark" ? "dark" : ""}`;

  return (
    <div className="whats-new-popup-overlay">
      <div className={popupClassName}>
        <button className="whats-new-popup-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Что нового</h2>
        <p>1.2.0 — Исправили подгрузку картинок</p>
      </div>
    </div>
  );
};

export default WhatsNewPopup;