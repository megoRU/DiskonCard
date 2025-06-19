import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // Assuming i18n.js is in src/
import AddCardForm from "./AddCardForm";
import { addCardToStorage } from "../utils/localStorage"; // Import directly for mock clarity

// Mock react-router-dom's useNavigate specifically
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Import and retain default exports
  useNavigate: () => mockedNavigate, // Mock useNavigate
}));

// Mock localStorage utilities used by the form
jest.mock("../utils/localStorage", () => ({
  addCardToStorage: jest.fn(),
}));

// Mock react-html5-camera-photo
jest.mock("react-html5-camera-photo", () => () => "Mock Camera Component");

describe("AddCardForm Component", () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockedNavigate.mockClear();
    // jest.clearAllMocks() will clear addCardToStorage, which is fine.
    addCardToStorage.mockClear();
    mockedNavigate.mockClear();
    // No need to clear react-router-dom mock here as it's handled by jest.mock
    // jest.clearAllMocks(); // This was too broad, cleared the module mock itself.
  });

  // No afterEach needed for jest.mock

  test("renders input fields and buttons", () => {
    render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <AddCardForm />
        </I18nextProvider>
      </Router>,
    );
    // Using Russian labels as per i18n.js and previous tasks
    expect(screen.getByLabelText(/Название магазина:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Номер карты/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Добавить карту/i }),
    ).toBeInTheDocument();
    // "Add by Photo" button was removed in previous tasks, so we don't test for it.
  });

  test("calls addCardToStorage and navigates on successful submission", async () => {
    render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <AddCardForm />
        </I18nextProvider>
      </Router>,
    );
    fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
      target: { value: "ТестМагазин" },
    });
    fireEvent.change(screen.getByLabelText(/Номер карты/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Добавить карту/i }));

    await waitFor(() => {
      expect(addCardToStorage).toHaveBeenCalledWith(
        expect.objectContaining({
          storeName: "ТестМагазин",
          cardNumber: "123456",
        }),
      );
    });
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/"), {
      timeout: 1000,
    }); // Added timeout for navigation
  });

  test("shows notification if fields are empty", async () => {
    render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <AddCardForm />
        </I18nextProvider>
      </Router>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Добавить карту/i }));

    // Check for notification message from i18n
    // The key 'addCardForm.fillFieldsAlert' translates to "Пожалуйста, заполните поля \"Номер карты\" и \"Название магазина\"."
    // However, "Название магазина" was changed to "Название".
    // The current key 'addCardForm.fillFieldsAlert' in i18n.js for 'ru' is:
    // "Пожалуйста, заполните поля \"Номер карты\" и \"Название магазина\"." - this needs to be updated in i18n.js if "Название" is final.
    // For now, test against the existing string in i18n.js or a generic part of it.
    // Let's use a more general approach to find the notification.
    // The Notification component might render the message directly.
    expect(
      await screen.findByText(/Пожалуйста, заполните поля/i),
    ).toBeInTheDocument();
    expect(addCardToStorage).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  // The "shows camera" test is removed as the "Add by Photo" feature was removed.

  describe("Cover Image Logic in handleSubmit", () => {
    test("TC1: uses logoUrl as coverImage if no custom image is uploaded and logoUrl is not default", async () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );

      fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
        target: { value: "Магнит" },
      });
      fireEvent.change(screen.getByLabelText(/Номер карты/i), {
        target: { value: "12345" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Добавить карту/i }));

      await waitFor(() => {
        expect(addCardToStorage).toHaveBeenCalledWith(
          expect.objectContaining({
            storeName: "Магнит",
            cardNumber: "12345",
            logoUrl: "/card-logos/magnit.png", // Check that logoUrl is also passed correctly
            coverImage: "/card-logos/magnit.png",
          }),
        );
      });
    });

    test("TC2: uses uploaded coverImageData even if logoUrl is present", async () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );

      fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
        target: { value: "Магнит" },
      }); // To get a non-default logoUrl
      fireEvent.change(screen.getByLabelText(/Номер карты/i), {
        target: { value: "67890" },
      });

      const file = new File(["(⌐□_□)"], "chucknorris.png", {
        type: "image/png",
      });
      // The label for cover image input is "Обложка карты (изображение)" from i18n
      const coverImageInput = screen.getByLabelText(/Обложка карты/i);
      fireEvent.change(coverImageInput, { target: { files: [file] } });

      // Wait for FileReader to process the file and update state
      // We can check if the preview image appears with the base64 data
      const previewImage = await screen.findByAltText(/Предпросмотр обложки/i);
      expect(previewImage.src).toMatch(/^data:image\/(png|jpeg|gif);base64,/);

      fireEvent.click(screen.getByRole("button", { name: /Добавить карту/i }));

      await waitFor(() => {
        expect(addCardToStorage).toHaveBeenCalledWith(
          expect.objectContaining({
            storeName: "Магнит",
            cardNumber: "67890",
            logoUrl: "/card-logos/magnit.png",
            coverImage: expect.stringContaining("data:image/png;base64,"),
          }),
        );
      });
    });

    test("TC3: coverImage is default.png if no custom image and logoUrl is default", async () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );

      // Ensure storeName results in a default logo (e.g., empty or non-matching)
      fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/Номер карты/i), {
        target: { value: "11223" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Добавить карту/i }));

      await waitFor(() => {
        expect(addCardToStorage).toHaveBeenCalledWith(
          expect.objectContaining({
            storeName: "",
            cardNumber: "11223",
            logoUrl: "/card-logos/default.png", // Default logoUrl
            coverImage: "/card-logos/default.png", // CoverImage should now be default.png
          }),
        );
      });
    });
  });

  describe("Cover Image Preview Logic", () => {
    const getPreviewImageSrc = () => {
      // The alt text is "Предпросмотр обложки" from i18n addCardForm.coverPreviewAlt
      // For some reason, during tests, the default value "Предпросмотр обложки" might be used if i18n keys are not fully resolved for alt tags.
      // Let's try a more general regex or the direct key if possible.
      // The key is 'addCardForm.coverPreviewAlt'
      // Using a general alt text query first.
      const previewImg = screen.getByAltText(/Предпросмотр обложки/i); // More robust to slight i18n variations
      return previewImg ? previewImg.src : null;
    };

    test("shows default.png in preview initially", () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );
      expect(getPreviewImageSrc()).toContain("/card-logos/default.png");
    });

    test("preview shows specific store logo after store name input", async () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );
      fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
        target: { value: "Магнит" },
      });
      await waitFor(() =>
        expect(getPreviewImageSrc()).toContain("/card-logos/magnit.png"),
      );
    });

    test("preview shows uploaded image data", async () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );
      const file = new File(["(⌐□_□)"], "chucknorris.png", {
        type: "image/png",
      });
      const coverImageInput = screen.getByLabelText(/Обложка карты/i);
      fireEvent.change(coverImageInput, { target: { files: [file] } });

      await waitFor(() =>
        expect(getPreviewImageSrc()).toMatch(/^data:image\/png;base64,/),
      );
    });

    test("preview falls back to default.png if a non-default logoUrl is then cleared by empty store name", async () => {
      render(
        <Router>
          <I18nextProvider i18n={i18n}>
            <AddCardForm />
          </I18nextProvider>
        </Router>,
      );
      // Set a specific store first
      fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
        target: { value: "Магнит" },
      });
      await waitFor(() =>
        expect(getPreviewImageSrc()).toContain("/card-logos/magnit.png"),
      );

      // Clear store name, which should make logoUrl default and thus preview default
      fireEvent.change(screen.getByLabelText(/Название магазина:/i), {
        target: { value: "" },
      });
      await waitFor(() =>
        expect(getPreviewImageSrc()).toContain("/card-logos/default.png"),
      );
    });
  });
});
