import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContext } from "../context/ThemeContext";
import SettingsPage from "./SettingsPage";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // Your i18n instance

// Mock import.meta.env
vi.mock("import.meta.env", () => ({
  VERSION: "1.2.3-test", // Используется в SettingsPage для версии
}));

// Mock osDetection utility
vi.mock("../utils/osDetection", () => ({
  isIOS: vi.fn(), // Мокаем isIOS, чтобы контролировать ее вывод в тестах
}));

// Mock package.json (глобальный мок в setupTests.js должен работать, но для явности можно и здесь, если нужно переопределить)
// vi.mock("../../package.json", () => ({
//   default: { version: "1.0.0-test", releaseDate: "2024-01-01T00:00:00.000Z" },
// }));


// Mock react-i18next
vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key, options) => {
        // Общие ключи
        if (key === "settingsPage.title") return "Settings";
        if (key === "settingsPage.themeTitle") return "Appearance";
        if (key === "settingsPage.themeLight") return "Light";
        if (key === "settingsPage.themeDark") return "Dark";
        if (key === "settingsPage.themeSystem") return "As in system";
        if (key === "settingsPage.appVersion") return `App Version: ${options?.version || "N/A"}`; // import.meta.env.VERSION может быть недоступен здесь напрямую
        if (key === "settingsPage.whatsNew") return "What's new";
        if (key === "settingsPage.contactDeveloper") return "Contact Developer";
        if (key === "settingsPage.dataManagementTitle") return "Data Management"; // Добавленный ключ
        if (key === "settingsPage.exportCards") return "Export Cards";
        if (key === "settingsPage.importCards") return "Import Cards";


        // Ключи для WhatsNewPopup
        if (key === "whatsNewPopup.title") return "Popup Title";
        if (key === "whatsNewPopup.version") return `Popup Version: ${options?.version || "1.0.0-popup"}`; // Отдельная версия для попапа в тесте
        if (key === "whatsNewPopup.releaseDate") return `Popup Date: ${options?.date || "2024-01-02"}`;

        // Ключи для IOSInstallInstruction
        if (key === "iosInstallInstruction.title") return "How to Add to Home Screen";
        if (key === "iosInstallInstruction.step1") return "Step 1: Open in Safari.";
        // ... другие шаги можно не мокать детально, если проверяется только наличие заголовка

        return key; // Возвращаем ключ, если перевод не найден
      },
      i18n: {
        language: "en",
        changeLanguage: vi.fn().mockResolvedValue(undefined), // mockResolvedValue для асинхронной функции
      },
    }),
  };
});

// Импорт isIOS после того, как он был замокан
import { isIOS } from "../utils/osDetection";


const renderWithProviders = (ui, { themeProviderProps, ...renderOptions }) => {
  return render(
    <ThemeContext.Provider value={themeProviderProps}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </ThemeContext.Provider>,
    renderOptions,
  );
};

describe("SettingsPage Component", () => {
  let mockSetTheme;

  beforeEach(() => {
    mockSetTheme = vi.fn();
    Storage.prototype.getItem = vi.fn(() => "system"); // Replaced jest.fn with vi.fn
    Storage.prototype.setItem = vi.fn(); // Replaced jest.fn with vi.fn

    // Ensure i18n is ready if it's loaded asynchronously or needs specific setup for tests
    // For this example, assuming i18n instance is directly usable
  });

  afterEach(() => {
    vi.clearAllMocks(); // Replaced jest.clearAllMocks with vi.clearAllMocks
  });

  const defaultThemeProviderProps = {
    theme: "light",
    setTheme: mockSetTheme,
  };

  test("renders its title, theme selection, and app info", () => {
    renderWithProviders(<SettingsPage />, {
      themeProviderProps: defaultThemeProviderProps,
    });

    expect(
      screen.getByRole("heading", { name: /Settings/i, level: 1 }), // Уточнен селектор
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Appearance/i, level: 2 }),
    ).toBeInTheDocument();
     expect(
      screen.getByRole("heading", { name: /Data Management/i, level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Light/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark/i)).toBeInTheDocument();
    expect(screen.getByText(/As in system/i)).toBeInTheDocument();
    // Проверка версии приложения может быть сложной из-за import.meta.env, оставим как есть или упростим
    expect(screen.getByText(/App Version: N\/A/i)).toBeInTheDocument(); // Мок t() теперь возвращает N/A если версия не передана
    expect(screen.getByText("What's new")).toBeInTheDocument();
    expect(screen.getByText(/Contact Developer/i)).toBeInTheDocument();
  });

  test("calls setTheme when a theme button is clicked", () => {
    renderWithProviders(<SettingsPage />, {
      themeProviderProps: defaultThemeProviderProps,
    });

    fireEvent.click(screen.getByRole("button", { name: /Dark/i }));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");

    fireEvent.click(screen.getByRole("button", { name: /As in system/i }));
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  describe("WhatsNewPopup interaction", () => {
    test("does not show WhatsNewPopup by default", () => {
      renderWithProviders(<SettingsPage />, {
        themeProviderProps: defaultThemeProviderProps,
      });
      expect(screen.queryByText("Popup Title")).not.toBeInTheDocument(); // WhatsNewPopup title
    });

    test('shows WhatsNewPopup when "What\'s new" button is clicked', () => {
      renderWithProviders(<SettingsPage />, {
        themeProviderProps: defaultThemeProviderProps,
      });

      const whatsNewButton = screen.getByRole("button", {
        name: /What's new/i,
      });
      fireEvent.click(whatsNewButton);

      expect(screen.getByText("Popup Title")).toBeInTheDocument();
      // Check for elements within the popup to be more specific
      expect(screen.getByText(/Popup Version: 1.0.0-popup/i)).toBeInTheDocument();
      expect(screen.getByText(/Popup Date: 2024-01-02/i)).toBeInTheDocument();
    });

    test("hides WhatsNewPopup when its close button is clicked", () => {
      renderWithProviders(<SettingsPage />, {
        themeProviderProps: defaultThemeProviderProps,
      });

      // Open the popup first
      const whatsNewButton = screen.getByRole("button", {
        name: /What's new/i,
      });
      fireEvent.click(whatsNewButton);
      expect(screen.getByText("Popup Title")).toBeInTheDocument(); // Popup is open

      // Click the close button within the popup
      // The close button in WhatsNewPopup has an aria-label or text like "×"
      // In WhatsNewPopup.test.jsx, it was mocked as `screen.getByRole('button', { name: /×/i });`
      // Let's assume it's the only button with "×" or we can add a more specific test-id
      const closePopupButton = screen.getByRole("button", { name: /×/i });
      fireEvent.click(closePopupButton);

      expect(screen.queryByText("Popup Title")).not.toBeInTheDocument(); // Popup is closed
    });
  });

  describe("IOSInstallInstruction visibility", () => {
    test("renders IOSInstallInstruction when isIOS returns true", () => {
      isIOS.mockReturnValue(true);
      renderWithProviders(<SettingsPage />, {
        themeProviderProps: defaultThemeProviderProps,
      });
      expect(screen.getByText("How to Add to Home Screen")).toBeInTheDocument();
      expect(screen.getByText("Step 1: Open in Safari.")).toBeInTheDocument();
    });

    test("does not render IOSInstallInstruction when isIOS returns false", () => {
      isIOS.mockReturnValue(false);
      renderWithProviders(<SettingsPage />, {
        themeProviderProps: defaultThemeProviderProps,
      });
      expect(screen.queryByText("How to Add to Home Screen")).not.toBeInTheDocument();
    });
  });
});
