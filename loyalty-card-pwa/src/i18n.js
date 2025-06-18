import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Layout
      nav: {
        home: "Home",
        settings: "Settings",
        addCardLabel: "Add Card", // For accessibility on the + button
        cancelEditModeLabel: "Cancel Edit Mode"
      },
      // HomePage
      homePage: {
        title: "My Cards",
        noCardsMessage: "No cards yet. Add your first card!",
        confirmDeleteMessage: "Are you sure you want to delete this card?",
        deleteCardAriaLabel: "Delete card",
        cardLogoAlt: "Logo of {{storeName}}",
        defaultCardName: "Card"
      },
      // SettingsPage
      settingsPage: {
        title: "Settings",
        themeTitle: "Appearance", // Updated
        themeLight: "Light",
        themeDark: "Dark",
        themeSystem: "As in system",
        appVersion: "App Version: {{version}}", // Added back
        whatsNew: "What's new", // Added back
        contactDeveloper: "Contact Developer" // Added back
      },
      // AddCardPage
      addCardPage: {
        title: "Add New Loyalty Card"
      },
      // AddCardForm
      addCardForm: {
        storeNameLabel: "Store Name:",
        storeNamePlaceholder: "e.g., My Store", // Updated
        cardNumberLabel: "Card Number:",
        cardNumberPlaceholder: "123456789",
        addCardButton: "Add Card",
        addByPhotoButton: "Add by Photo",
        closeCameraButton: "Close Camera",
        fillFieldsAlert: "Please fill in both Card Number and Store Name.",
        cardAddedSuccess: "Card added successfully!",
        photoCapturedSuccess: "Photo captured! Check console for data URI.",
        storeLogoAlt: "Store logo preview for {{storeName}}" // Added
      },
      // BarcodeModal
      barcodeModal: {
        closeLabel: "Close barcode view"
      }
    }
  },
  ru: {
    translation: {
      // Layout
      nav: {
        home: "Главная",
        settings: "Настройки",
        addCardLabel: "Добавить карту", // For accessibility on the + button
        cancelEditModeLabel: "Отменить режим редактирования"
      },
      // HomePage
      homePage: {
        title: "Ваши карты",
        noCardsMessage: "Карт пока нет. Добавьте свою первую карту!",
        confirmDeleteMessage: "Вы уверены, что хотите удалить эту карту?",
        deleteCardAriaLabel: "Удалить карту",
        cardLogoAlt: "Логотип {{storeName}}",
        defaultCardName: "Карты"
      },
      // SettingsPage
      settingsPage: {
        title: "Настройки",
        themeTitle: "Тема оформления", // Updated
        themeLight: "Светлая",
        themeDark: "Темная",
        themeSystem: "Как в системе",
        appVersion: "Версия приложения: {{version}}", // Added back
        whatsNew: "Что нового", // Added back
        contactDeveloper: "Связь с разработчиком" // Added back
      },
      // AddCardPage
      addCardPage: {
        title: "Добавление карты"
      },
      // AddCardForm
      addCardForm: {
        storeNameLabel: "Название:",
        storeNamePlaceholder: "например, Пятерочка", // Updated
        cardNumberLabel: "Номер карты:",
        cardNumberPlaceholder: "123456789",
        addCardButton: "Добавить карту",
        addByPhotoButton: "Добавить по фото",
        closeCameraButton: "Закрыть камеру",
        fillFieldsAlert: "Пожалуйста, заполните поля \"Номер карты\" и \"Название магазина\".",
        cardAddedSuccess: "Карта успешно добавлена!",
        photoCapturedSuccess: "Фото сделано! Проверьте URI данных в консоли.",
        storeLogoAlt: "Предпросмотр логотипа для {{storeName}}" // Added
      },
      // BarcodeModal
      barcodeModal: {
        closeLabel: "Закрыть просмотр штрих-кода"
      }
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ru', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    // debug: true, // Uncomment to see logs
  });

export default i18n;
