import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WhatsNewPopup from './WhatsNewPopup';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../i18n'; // Assuming your i18n instance is exported from here

// Mock react-i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key, options) => {
      if (key === 'whatsNewPopup.title') return "What's New";
      if (key === 'whatsNewPopup.version') return `App Version: ${options.version}`;
      if (key === 'whatsNewPopup.releaseDate') return `Release Date: ${options.date}`;
      return key;
    },
    i18n: {
      language: 'en', // Default language for tests
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('WhatsNewPopup', () => {
  const mockOnClose = jest.fn();
  const appVersion = '1.0.0';
  const currentDate = new Date().toLocaleDateString('en-US'); // Match locale used in mock

  beforeEach(() => {
    // Reset mocks before each test
    mockOnClose.mockClear();
    // Ensure i18n is initialized for each test if not already globally
    // This is important if your i18n setup is asynchronous or relies on init
    // For this example, assuming i18n instance is directly usable
  });

  test('renders correctly with title, version, date, and handles close', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WhatsNewPopup onClose={mockOnClose} />
      </I18nextProvider>
    );

    // Check title
    expect(screen.getByText("What's New")).toBeInTheDocument();

    // Check version
    expect(screen.getByText(`App Version: ${appVersion}`)).toBeInTheDocument();

    // Check date
    // Note: date formatting can be tricky in tests.
    // The mock for useTranslation now handles date formatting.
    expect(screen.getByText(`Release Date: ${currentDate}`)).toBeInTheDocument();

    // Check if close button calls onClose
    const closeButton = screen.getByRole('button', { name: /×/i }); // Using regex for close button
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays date in ru-RU format when language is Russian', () => {
    // Temporarily change the mock implementation for this test
    const originalUseTranslation = useTranslation;
    jest.spyOn(require('react-i18next'), 'useTranslation').mockImplementation(() => ({
        t: (key, options) => {
            if (key === 'whatsNewPopup.title') return 'Что нового';
            if (key === 'whatsNewPopup.version') return `Версия приложения: ${options.version}`;
            if (key === 'whatsNewPopup.releaseDate') return `Дата релиза: ${options.date}`;
            return key;
        },
        i18n: {
            language: 'ru',
            changeLanguage: jest.fn(),
        },
    }));

    const russianDate = new Date().toLocaleDateString('ru-RU');
    render(
        <I18nextProvider i18n={i18n}>
            <WhatsNewPopup onClose={mockOnClose} />
        </I18nextProvider>
    );

    expect(screen.getByText(`Дата релиза: ${russianDate}`)).toBeInTheDocument();
    expect(screen.getByText('Что нового')).toBeInTheDocument();
    expect(screen.getByText(`Версия приложения: ${appVersion}`)).toBeInTheDocument();

    // Restore original mock
    jest.spyOn(require('react-i18next'), 'useTranslation').mockImplementation(originalUseTranslation);
  });
});
