import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getCardsFromStorage, saveCardsToStorage } from "../utils/localStorage"; // Import for export and import
// Removed: import { version } from '../../../package.json'; // No longer needed, use import.meta.env.APP_VERSION
import "./SettingsPage.css";
import WhatsNewPopup from "../components/WhatsNewPopup";

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { t } = useTranslation();

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
        alert(t("settingsPage.noCardsToExport")); // Or use a more sophisticated notification
        return;
      }
      const jsonString = JSON.stringify(cards, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
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
      alert(t("settingsPage.exportError")); // Or use a more sophisticated notification
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
            alert(t("settingsPage.importErrorInvalidFormat"));
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
            t("settingsPage.importSuccess", {
              count: addedCount,
              skipped: skippedCount,
            }),
          );
          window.location.reload(); // Reload to reflect changes
        } catch (error) {
          console.error("Error parsing or processing imported file:", error);
          alert(t("settingsPage.importErrorInvalidFile"));
        }
      };

      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        alert(t("settingsPage.importErrorReadFile"));
      };

      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div className="settings-page">
      <h1>{t("settingsPage.title")}</h1>

      {/* New Theme Selector Buttons */}
      <div className="theme-selector">
        <h2>{t("settingsPage.themeTitle")}</h2>
        <div className="theme-buttons-container">
          <button
            className={`theme-button ${theme === "light" ? "active" : ""}`}
            onClick={() => handleThemeChange("light")}
            aria-pressed={theme === "light"}
            title={t("settingsPage.themeLight")}
          >
            <span className="theme-icon">☀️</span>
            <span className="theme-label">{t("settingsPage.themeLight")}</span>
          </button>
          <button
            className={`theme-button ${theme === "dark" ? "active" : ""}`}
            onClick={() => handleThemeChange("dark")}
            aria-pressed={theme === "dark"}
            title={t("settingsPage.themeDark")}
          >
            <span className="theme-icon">🌙</span>
            <span className="theme-label">{t("settingsPage.themeDark")}</span>
          </button>
          <button
            className={`theme-button ${theme === "system" ? "active" : ""}`}
            onClick={() => handleThemeChange("system")}
            aria-pressed={theme === "system"}
            title={t("settingsPage.themeSystem")}
          >
            <span className="theme-icon">🌓</span>
            <span className="theme-label">{t("settingsPage.themeSystem")}</span>
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="data-management-section">
        <h2>{t("settingsPage.dataManagementTitle")}</h2>
        <div className="data-management-buttons">
          <button className="data-button" onClick={handleExportCards}>
            {t("settingsPage.exportCards")}
          </button>
          <button className="data-button" onClick={handleImportCards}>
            {t("settingsPage.importCards")}
          </button>
        </div>
      </div>

      {/* Restored App Info Section */}
      <div className="app-info-section">
        <p className="app-version">
          {t("settingsPage.appVersion", {
            version: import.meta.env.VERSION || "N/A",
          })}
        </p>
        <button onClick={openPopup} className="whats-new-link">
          {t("settingsPage.whatsNew")}
        </button>
        <p className="contact-developer-container">
          {t("settingsPage.contactDeveloper")}:{" "}
          <a
            href="https://t.me/mego_RU"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            t.me/mego_RU
          </a>
        </p>
      </div>
      {isPopupOpen && <WhatsNewPopup onClose={closePopup} />}
    </div>
  );
};

export default SettingsPage;
