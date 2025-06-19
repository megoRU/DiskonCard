import React, {useContext, useState} from "react";
import {ThemeContext} from "../context/ThemeContext";
import {getCardsFromStorage, saveCardsToStorage} from "../utils/localStorage";
import "./SettingsPage.css";
import WhatsNewPopup from "../components/WhatsNewPopup";
import IOSInstallInstruction from "../components/IOSInstallInstruction";
import {isIOS} from "../utils/osDetection";

const SettingsPage = () => {
  const {theme, setTheme} = useContext(ThemeContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const showIOSInstruction = isIOS();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleExportCards = () => {
    try {
      const cards = getCardsFromStorage();
      if (!cards || cards.length === 0) {
        alert("Нет карт для экспорта."); // Or use a more sophisticated notification
        return;
      }
      const jsonString = JSON.stringify(cards, null, 2);
      const blob = new Blob([jsonString], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "loyalty_cards_backup.json";
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting cards:", error);
      alert("Ошибка экспорта карт."); // Or use a more sophisticated notification
    }
  };

  const handleImportCards = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          let importedCardsData = JSON.parse(text);

          if (!Array.isArray(importedCardsData)) {
            alert("Ошибка импорта: Неверный формат данных в файле.");
            return;
          }

          const existingCards = getCardsFromStorage();
          const existingCardIds = new Set(existingCards.map((card) => card.id));
          let newCardsToSave = [...existingCards];
          let addedCount = 0;
          let skippedCount = 0;

          importedCardsData.forEach((importedCard) => {
            if (typeof importedCard !== "object" || importedCard === null) {
              skippedCount++;
              return; // Skip non-object entries
            }

            let currentCardId = importedCard.id;

            if (currentCardId && existingCardIds.has(currentCardId)) {
              // Card with this ID already exists, skip it
              skippedCount++;
            } else {
              // New card or card with ID not present in existing cards
              if (!currentCardId) {
                // Generate ID if missing
                currentCardId =
                    Date.now().toString() +
                    Math.random().toString(36).substring(2, 9);
                importedCard.id = currentCardId;
              }

              if (!importedCard.dateAdded) {
                importedCard.dateAdded = new Date().toISOString();
              }

              if (existingCardIds.has(importedCard.id) && !newCardsToSave.find((c) => c.id === importedCard.id)
              ) {
                skippedCount++;
              } else if (
                  !newCardsToSave.find((c) => c.id === importedCard.id)
              ) {
                newCardsToSave.push(importedCard);
                addedCount++;
                existingCardIds.add(importedCard.id);
              } else {
                skippedCount++;
              }
            }
          });

          saveCardsToStorage(newCardsToSave);
          alert(
              `Импорт завершен. Добавлено: ${addedCount} карта(ы).`
          );
          window.location.reload(); // Reload to reflect changes
        } catch (error) {
          console.error("Error parsing or processing imported file:", error);
          alert("Ошибка импорта: Неверный тип файла. Пожалуйста, выберите .json файл.");
        }
      };

      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        alert("Ошибка импорта: Не удалось прочитать файл.");
      };

      reader.readAsText(file);
    };

    input.click();
  };

  return (
      <div className="settings-page">
        <h1>Настройки</h1>
        <div className="theme-selector">
          <h2>Тема оформления</h2>

          {theme === 'light' && (
              <p>Светлая тема в стадии доработки!</p>
          )}

          <div className="theme-buttons-container">
            <button
                className={`theme-button ${theme === "light" ? "active" : ""}`}
                onClick={() => handleThemeChange("light")}
                aria-pressed={theme === "light"}
                title="Светлая"
            >
              <span className="theme-icon">☀️</span>
              <span className="theme-label">Светлая</span>
            </button>
            <button
                className={`theme-button ${theme === "dark" ? "active" : ""}`}
                onClick={() => handleThemeChange("dark")}
                aria-pressed={theme === "dark"}
                title="Темная"
            >
              <span className="theme-icon">🌙</span>
              <span className="theme-label">Темная</span>
            </button>
            <button
                className={`theme-button ${theme === "system" ? "active" : ""}`}
                onClick={() => handleThemeChange("system")}
                aria-pressed={theme === "system"}
                title="Как в системе"
            >
              <span className="theme-icon">🌓</span>
              <span className="theme-label">Как в системе</span>
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="data-management-section">
          <h2>Управление данными</h2>
          <div className="data-management-buttons">
            <button className="data-button" onClick={handleExportCards}>
              Экспорт карт
            </button>
            <button className="data-button" onClick={handleImportCards}>
              Импорт карт
            </button>
          </div>
        </div>

        {/* Restored App Info Section */}
        <div className="app-info-section">
          <h4>О приложении</h4>

          <div className="data-management-buttons">
            <button onClick={openPopup} className="data-button">
              Что нового
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
          </p>
          <p className="app-version">
            {`Версия приложения: ${import.meta.env.VERSION || "N/A"}`}
          </p>
        </div>

        <IOSInstallInstruction/>

        {isPopupOpen && <WhatsNewPopup onClose={closePopup}/>}
      </div>
  );
};

export default SettingsPage;
