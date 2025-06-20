import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./WhatsNewPopup.css";

const PrivacyPolicy = ({ onClose }) => {
    const { theme } = useContext(ThemeContext);

    const popupClassName = `whats-new-popup ${theme === "dark" ? "dark" : ""}`;

    return (
        <div className="whats-new-popup-overlay">
            <div className={popupClassName}>
                <button className="whats-new-popup-close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Политика конфиденциальности</h2>
                <p>Приложение сохраняет бонусные и дисконтные карты магазинов локально на устройстве пользователя. Мы не собираем, не храним и не передаём никакие персональные данные. Вся информация остаётся только у вас.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;