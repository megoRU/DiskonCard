import React, { useContext, useState, useCallback } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { getCardsFromStorage, saveCardsToStorage } from "../utils/localStorage";
import { isIOS } from "../utils/osDetection";
import { checkForAppUpdate } from "../utils/pwaUpdate";
import WhatsNewPopup from "../components/WhatsNewPopup";
import PrivacyPolicy from "../components/PrivacyPolicy";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenPrivacy, setIsPopupOpenPrivacy] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleThemeChange = useCallback((newTheme) => setTheme(newTheme), [setTheme]);

  const handleExportCards = useCallback(() => {
    try {
      const cards = getCardsFromStorage();
      if (!cards?.length) return alert("Нет карт для экспорта.");

      const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), {
        href: url,
        download: "DiskonCard_backup.json",
      });

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error exporting cards:", e);
      alert("Ошибка экспорта карт.");
    }
  }, []);

  const handleImportCards = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = ({ target }) => {
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ({ target }) => {
        try {
          const data = JSON.parse(target.result);
          if (!Array.isArray(data)) return alert("Неверный формат данных.");

          const existing = getCardsFromStorage();
          const ids = new Set(existing.map((c) => c.id));
          const merged = [...existing];
          let added = 0;

          for (const card of data) {
            if (typeof card !== "object" || !card) continue;
            if (!card.id) card.id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
            if (!card.dateAdded) card.dateAdded = new Date().toISOString();
            if (ids.has(card.id)) continue;

            merged.push(card);
            ids.add(card.id);
            added++;
          }

          saveCardsToStorage(merged);
          alert(`Импорт завершен. Добавлено: ${added} карта(ы).`);
          window.location.reload();
        } catch (e) {
          console.error("Error reading file:", e);
          alert("Ошибка импорта. Проверьте формат .json.");
        }
      };

      reader.onerror = () => {
        console.error("File read error:", reader.error);
        alert("Не удалось прочитать файл.");
      };

      reader.readAsText(file);
    };

    input.click();
  }, []);

  const handleCheckUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      await checkForAppUpdate();
    } catch (error) {
      console.error("Error during app update:", error);
      alert("Не удалось обновить приложение.");
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return (
    <div className="settings-page">
      <h1>Настройки</h1>

      <section className="theme-selector">
        <h2>Тема оформления</h2>
        {theme === "light" && <p>Светлая тема в стадии доработки!</p>}
        <div className="theme-buttons-container">
          {["light", "dark", "system"].map((t) => (
            <button
              key={t}
              className={`theme-button ${theme === t ? "active" : ""}`}
              onClick={() => handleThemeChange(t)}
              aria-pressed={theme === t}
              title={t === "light" ? "Светлая" : t === "dark" ? "Темная" : "Как в системе"}
            >
              <span className="theme-icon">{t === "light" ? "☀️" : t === "dark" ? "🌙" : "🌓"}</span>
              <span className="theme-label">
                {t === "light" ? "Светлая" : t === "dark" ? "Темная" : "Как в системе"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="data-management-section">
        <h2>Управление данными</h2>
        <div className="data-management-buttons">
          <button className="data-button" onClick={handleExportCards}>
            Экспорт карт
          </button>
          <button className="data-button" onClick={handleImportCards}>
            Импорт карт
          </button>
        </div>
      </section>

      <section className="app-update-section">
        <h2>Обновление приложения</h2>
        <button
          className="data-button update-button"
          onClick={handleCheckUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Проверка обновлений..." : "Обновить приложение"}
        </button>
        {isIOS() && (
          <p className="ios-update-note">
            Принудительно проверяет обновления PWA, обновляет кэш и перезагружает приложение для iOS.
          </p>
        )}
      </section>

      <section className="app-info-section">
        <h4>О приложении</h4>
        <div className="data-management-buttons">
          <button onClick={() => setIsPopupOpen(true)} className="data-button">
            Что нового
          </button>
          <button onClick={() => setIsPopupOpenPrivacy(true)} className="data-button">
            Политика конфиденциальности
          </button>
        </div>
        <p className="contact-developer-container">
          Связь с разработчиком:{" "}
          <a
            href="https://t.me/mego_RU"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            t.me/mego_RU
          </a>
          <br />
          Почта:{" "}
          <a
            href="mailto:contact@megoru.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            contact@megoru.ru
          </a>
        </p>
        <p className="app-version">Версия: 2.1.0</p>
        <p style={{ fontSize: "12px", color: "gray" }}>
          Все логотипы и торговые марки принадлежат их владельцам. Сервис не связан с указанными
          магазинами и используется только в ознакомительных целях.
        </p>
      </section>

      {isPopupOpen && <WhatsNewPopup onClose={() => setIsPopupOpen(false)} />}
      {isPopupOpenPrivacy && <PrivacyPolicy onClose={() => setIsPopupOpenPrivacy(false)} />}
    </div>
  );
};

export default SettingsPage;
