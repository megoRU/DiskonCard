import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext } from '../context/ThemeContext';
import SettingsPage from './SettingsPage';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; // Your i18n instance

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  APP_VERSION: '1.2.3-test',
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key, options) => {
      if (key === 'settingsPage.title') return 'Settings';
      if (key === 'settingsPage.themeTitle') return 'Appearance';
      if (key === 'settingsPage.themeLight') return 'Light';
      if (key === 'settingsPage.themeDark') return 'Dark';
      if (key === 'settingsPage.themeSystem') return 'As in system';
      if (key === 'settingsPage.appVersion') return `App Version: ${options?.version || import.meta.env.APP_VERSION}`;
      if (key === 'settingsPage.whatsNew') return "What's new";
      if (key === 'settingsPage.contactDeveloper') return 'Contact Developer';
      // For WhatsNewPopup content (simplified for this test scope)
      if (key === 'whatsNewPopup.title') return "Popup Title";
      if (key === 'whatsNewPopup.version') return `Popup Version: ${options?.version}`;
      if (key === 'whatsNewPopup.releaseDate') return `Popup Date: ${options?.date}`;
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));


const renderWithProviders = (ui, { themeProviderProps, ...renderOptions }) => {
  return render(
    <ThemeContext.Provider value={themeProviderProps}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </ThemeContext.Provider>,
    renderOptions
  );
};

describe('SettingsPage Component', () => {
  let mockSetTheme;

  beforeEach(() => {
    mockSetTheme = jest.fn();
    Storage.prototype.getItem = jest.fn(() => 'system');
    Storage.prototype.setItem = jest.fn();

    // Ensure i18n is ready if it's loaded asynchronously or needs specific setup for tests
    // For this example, assuming i18n instance is directly usable
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultThemeProviderProps = {
    theme: 'light',
    setTheme: mockSetTheme,
  };

  test('renders its title, theme selection, and app info', () => {
    renderWithProviders(<SettingsPage />, { themeProviderProps: defaultThemeProviderProps });

    expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Appearance/i })).toBeInTheDocument();
    expect(screen.getByText(/Light/i)).toBeInTheDocument(); // Button text
    expect(screen.getByText(/Dark/i)).toBeInTheDocument(); // Button text
    expect(screen.getByText(/As in system/i)).toBeInTheDocument(); // Button text
    expect(screen.getByText("App Version: 1.2.3-test")).toBeInTheDocument();
    expect(screen.getByText("What's new")).toBeInTheDocument();
    expect(screen.getByText(/Contact Developer/i)).toBeInTheDocument();
  });

  test('calls setTheme when a theme button is clicked', () => {
    renderWithProviders(<SettingsPage />, { themeProviderProps: defaultThemeProviderProps });

    fireEvent.click(screen.getByRole('button', { name: /Dark/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByRole('button', { name: /As in system/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });


  describe('WhatsNewPopup interaction', () => {
    test('does not show WhatsNewPopup by default', () => {
      renderWithProviders(<SettingsPage />, { themeProviderProps: defaultThemeProviderProps });
      expect(screen.queryByText('Popup Title')).not.toBeInTheDocument(); // WhatsNewPopup title
    });

    test('shows WhatsNewPopup when "What\'s new" button is clicked', () => {
      renderWithProviders(<SettingsPage />, { themeProviderProps: defaultThemeProviderProps });

      const whatsNewButton = screen.getByRole('button', { name: /What's new/i });
      fireEvent.click(whatsNewButton);

      expect(screen.getByText('Popup Title')).toBeInTheDocument();
      // Check for elements within the popup to be more specific
      expect(screen.getByText(/Popup Version: 1.0.0/i)).toBeInTheDocument(); // Version defined in WhatsNewPopup
      // Date is dynamic, so checking for its label part
      expect(screen.getByText(/Popup Date:/i)).toBeInTheDocument();
    });

    test('hides WhatsNewPopup when its close button is clicked', () => {
      renderWithProviders(<SettingsPage />, { themeProviderProps: defaultThemeProviderProps });

      // Open the popup first
      const whatsNewButton = screen.getByRole('button', { name: /What's new/i });
      fireEvent.click(whatsNewButton);
      expect(screen.getByText('Popup Title')).toBeInTheDocument(); // Popup is open

      // Click the close button within the popup
      // The close button in WhatsNewPopup has an aria-label or text like "×"
      // In WhatsNewPopup.test.jsx, it was mocked as `screen.getByRole('button', { name: /×/i });`
      // Let's assume it's the only button with "×" or we can add a more specific test-id
      const closePopupButton = screen.getByRole('button', { name: /×/i });
      fireEvent.click(closePopupButton);

      expect(screen.queryByText('Popup Title')).not.toBeInTheDocument(); // Popup is closed
    });
  });
});
