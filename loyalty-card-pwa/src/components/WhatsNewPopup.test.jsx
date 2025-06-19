import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WhatsNewPopup from "./WhatsNewPopup";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

// Mock package.json (уже должен быть в setupTests.js, но для явности)
vi.mock("../../package.json", () => ({
  default: { version: "1.0.0-test", releaseDate: "2024-01-01T00:00:00.000Z" },
}));

// Mock react-i18next
vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => {
      const currentLang = i18n.language; // Получаем текущий язык из инстанса i18n
      return {
        t: (key, options) => {
          if (currentLang === "ru") {
            if (key === "whatsNewPopup.title") return "Что нового";
            if (key === "whatsNewPopup.version") return `Версия приложения: ${options.version}`;
            if (key === "whatsNewPopup.releaseDate") return `Дата релиза: ${options.date}`;
          } else { // Default to English
            if (key === "whatsNewPopup.title") return "What's New";
            if (key === "whatsNewPopup.version") return `App Version: ${options.version}`;
            if (key === "whatsNewPopup.releaseDate") return `Release Date: ${options.date}`;
          }
          return key;
        },
        i18n: {
          language: currentLang,
          changeLanguage: async (lang) => {
            i18n.language = lang; // Меняем язык в инстансе i18n
          },
        },
      };
    },
  };
});

describe("WhatsNewPopup", () => {
  const mockOnClose = vi.fn();
  // Версия и дата теперь должны браться из мока package.json, который используется компонентом
  // const appVersion = "1.0.0-test"; // Из мока package.json
  // const currentDate = new Date("2024-01-01T00:00:00.000Z").toLocaleDateString("en-US");

  beforeEach(async () => {
    mockOnClose.mockClear();
    vi.resetAllMocks(); // Сбрасываем все моки, включая react-i18next, чтобы язык был свежим
    await i18n.changeLanguage("en"); // Устанавливаем язык по умолчанию перед каждым тестом
  });

  test("renders correctly with title, version, date, and handles close", async () => {
    // Ожидаемая версия и дата из мока package.json
    const expectedVersion = "1.0.0-test";
    const expectedDate = new Date("2024-01-01T00:00:00.000Z").toLocaleDateString("en-US");

    render(
      <I18nextProvider i18n={i18n}>
        <WhatsNewPopup onClose={mockOnClose} />
      </I18nextProvider>,
    );
    expect(screen.getByText("What's New")).toBeInTheDocument();
    // Теперь текст должен совпадать с тем, что генерирует компонент на основе мока package.json
    expect(await screen.findByText(`App Version: ${expectedVersion}`)).toBeInTheDocument();
    expect(await screen.findByText(`Release Date: ${expectedDate}`)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /×/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("displays date in ru-RU format when language is Russian", async () => {
    await i18n.changeLanguage("ru"); // Меняем язык для этого теста

    const expectedVersion = "1.0.0-test"; // Из мока package.json
    const expectedDate = new Date("2024-01-01T00:00:00.000Z").toLocaleDateString("ru-RU");

    render(
      <I18nextProvider i18n={i18n}>
        <WhatsNewPopup onClose={mockOnClose} />
      </I18nextProvider>,
    );

    expect(screen.getByText("Что нового")).toBeInTheDocument();
    expect(await screen.findByText(`Версия приложения: ${expectedVersion}`)).toBeInTheDocument();
    expect(await screen.findByText(`Дата релиза: ${expectedDate}`)).toBeInTheDocument();
  });
});
