import React from "react";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // Assuming i18n.js is in src/
import HomePage from "./HomePage";
import { getCardsFromStorage } from "../utils/localStorage";

// Mock the localStorage utility
vi.mock("../utils/localStorage", () => ({
  getCardsFromStorage: vi.fn(),
  saveCardsToStorage: vi.fn(), // Mock saveCardsToStorage as it might be called during drag-n-drop
  deleteCardFromStorage: vi.fn(), // Mock deleteCardFromStorage for completeness
}));

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(), // Mock useNavigate if used internally or by sub-components
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock use-long-press
vi.mock("use-long-press", () => ({
  useLongPress: vi.fn(() => vi.fn()), // Returns a dummy bind function
}));

// Mock @hello-pangea/dnd
vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) =>
    children(
      { innerRef: vi.fn(), droppableProps: {}, placeholder: null }, // Changed jest.fn() to vi.fn()
      {},
    ),
  Draggable: ({ children }) =>
    children(
      { innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} }, // Changed jest.fn() to vi.fn()
      {},
    ),
}));

// Mocking FiTrash2 icon
vi.mock("react-icons/fi", () => ({
  FiTrash2: () => <svg data-testid="trash-icon" />,
}));

describe("HomePage Component", () => {
  beforeEach(() => {
    getCardsFromStorage.mockClear();
    // Clear other mocks if necessary, e.g., saveCardsToStorage.mockClear();
  });

  const renderHomePage = (props = {}) => {
    return render(
      // Router mock is above, so we don't need to wrap with <Router> here explicitly
      // if the mock handles all RRD context. However, using Router for clarity if needed.
      <I18nextProvider i18n={i18n}>
        <HomePage isEditMode={false} setIsEditMode={() => {}} {...props} />
      </I18nextProvider>,
    );
  };

  test("renders its title", () => {
    getCardsFromStorage.mockReturnValue([]);
    renderHomePage();
    // Title "Ваши карты" is from Russian i18n homePage.title
    expect(
      screen.getByRole("heading", { name: /Ваши карты/i }),
    ).toBeInTheDocument();
  });

  test('displays "No cards yet..." message when no cards are present', () => {
    getCardsFromStorage.mockReturnValue([]);
    renderHomePage();
    // Message from i18n homePage.noCardsMessage
    expect(
      screen.getByText(/Карт пока нет\. Добавьте свою первую карту!/i),
    ).toBeInTheDocument();
  });

  test("displays cards when cards are present", () => {
    const mockCards = [
      {
        id: "1",
        storeName: "Магазин Кофе",
        cardNumber: "123",
        coverImage: "/card-logos/default.png",
        logoUrl: "/card-logos/default.png",
        dateAdded: new Date().toISOString(),
      },
      {
        id: "2",
        storeName: "Книжный Мир",
        cardNumber: "456",
        coverImage: "data:image/png;base64,sometestdata",
        logoUrl: "/card-logos/bookstore.png",
        dateAdded: new Date().toISOString(),
      },
    ];
    getCardsFromStorage.mockReturnValue(mockCards);
    renderHomePage();

    // Cards don't display storeName or cardNumber as text directly on them anymore.
    // They use background images. The most we can test here is that a list of items renders.
    // We expect two card items to be rendered. A common way is to check for a role or testId.
    // Assuming '.card-item' divs are rendered for each card:
    const cardItems = screen.getAllByRole("button"); // Cards are clickable buttons
    expect(cardItems.length).toBe(mockCards.length);

    expect(
      screen.queryByText(/Карт пока нет\. Добавьте свою первую карту!/i),
    ).not.toBeInTheDocument();
  });

  test("does not display corner logos (img.card-logo)", () => {
    const mockCards = [
      {
        id: "1",
        storeName: "Test Store",
        cardNumber: "123",
        coverImage: "some-image.jpg",
        logoUrl: "/card-logos/some-logo.png",
        dateAdded: new Date().toISOString(),
      },
    ];
    getCardsFromStorage.mockReturnValue(mockCards);
    renderHomePage();
    // Check that no image with className 'card-logo' is rendered.
    // queryByClassName is not standard in RTL, need to use querySelector or check for alt text if it were there.
    // Since the element itself is removed, we can check it's not in the document.
    // A robust way is to ensure no image with the typical alt text for card logos is present.
    expect(screen.queryByAltText(/Логотип/i)).not.toBeInTheDocument();
  });
});
