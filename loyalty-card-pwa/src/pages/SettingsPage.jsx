import React, {useContext, useState} from "react";
import {ThemeContext} from "../context/ThemeContext";
import {getCardsFromStorage, saveCardsToStorage} from "../utils/localStorage"; // Import for export and import
// Removed: import { version } from '../../../package.json'; // No longer needed, use import.meta.env.APP_VERSION
import "./SettingsPage.css";
import WhatsNewPopup from "../components/WhatsNewPopup";
import IOSInstallInstruction from "../components/IOSInstallInstruction"; // Импорт нового компонента
import {isIOS} from "../utils/osDetection"; // Импорт утилиты

const SettingsPage = () => {
  const {theme, setTheme} = useContext(ThemeContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const showIOSInstruction = isIOS(); // Определение, нужно ли показывать инструкцию

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Updated handleThemeChange
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

              // Ensure we don't add a card if its (potentially new) ID is now a duplicate
              // This is a safeguard, primary check is existingCardIds.has(importedCard.id) before this block
              if (
                  existingCardIds.has(importedCard.id) &&
                  !newCardsToSave.find((c) => c.id === importedCard.id)
              ) {
                // This case should ideally not be hit if IDs are handled correctly before this point.
                // If an ID was generated, and it accidentally matched an existing one (highly unlikely)
                // or if the card was processed in a way that it's considered new but ID matches.
                // For safety, we can choose to skip or overwrite. Skipping is safer.
                skippedCount++;
              } else if (
                  !newCardsToSave.find((c) => c.id === importedCard.id)
              ) {
                newCardsToSave.push(importedCard);
                addedCount++;
                existingCardIds.add(importedCard.id); // Add new ID to set to prevent duplicates from imported file itself
              } else {
                // This means a card with this ID (either original or newly generated)
                // already exists in newCardsToSave, likely due to prior processing in this loop or from existing cards.
                skippedCount++;
              }
            }
          });

          saveCardsToStorage(newCardsToSave);
          alert(
              `Импорт успешно завершен. Добавлено: ${addedCount} карта(ы). Пропущено (дубликаты): ${skippedCount} карта(ы).`
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

        {/* New Theme Selector Buttons */}
        <div className="theme-selector">
          <h2>Тема оформления</h2>
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

        {/* Секция для инструкции по установке на iOS */}
        {showIOSInstruction && (
            <div className="ios-instruction-section app-info-section"> {/* Используем схожий стиль секции */}
              <h4>Установка на iOS</h4>
              <IOSInstallInstruction/>
            </div>
        )}

        {isPopupOpen && <WhatsNewPopup onClose={closePopup}/>}
      </div>
  );
};

export default SettingsPage;
