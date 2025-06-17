import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext, ThemeProvider } from '../context/ThemeContext'; // Import actual context
import SettingsPage from './SettingsPage';

// Helper to render with ThemeProvider for this specific test,
// as SettingsPage consumes ThemeContext directly.
// For a larger app, you might have a custom render function that wraps providers.
const renderWithThemeProvider = (ui, { providerProps, ...renderOptions }) => {
  return render(
    // Correctly pass the providerProps as the 'value' prop
    <ThemeContext.Provider value={providerProps}>{ui}</ThemeContext.Provider>,
    renderOptions
  );
};


describe('SettingsPage Component', () => {
  let mockSetTheme;

  beforeEach(() => {
    mockSetTheme = jest.fn();
    // Mock localStorage for ThemeContext, though ThemeContext itself handles it
    // We are primarily testing that SettingsPage calls setTheme from context
    Storage.prototype.getItem = jest.fn(() => 'system'); // Default or any value
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders its title and theme selection options', () => {
    const providerProps = {
      theme: 'light', // Initial theme for testing
      setTheme: mockSetTheme,
    };
    renderWithThemeProvider(<SettingsPage />, { providerProps });

    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /theme/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/light/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dark/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/as in system/i)).toBeInTheDocument();

    // Check if the correct radio button is checked based on context
    expect(screen.getByLabelText(/light/i).checked).toBe(true);
  });

  test('calls setTheme from context when a theme option is selected', () => {
     const providerProps = {
      theme: 'light',
      setTheme: mockSetTheme,
    };
    renderWithThemeProvider(<SettingsPage />, { providerProps });

    fireEvent.click(screen.getByLabelText(/dark/i));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByLabelText(/as in system/i));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  test('radio buttons reflect the current theme from context', () => {
    let providerProps = { theme: 'dark', setTheme: mockSetTheme };
    const { rerender } = renderWithThemeProvider(<SettingsPage />, { providerProps });
    expect(screen.getByLabelText(/dark/i).checked).toBe(true);

    providerProps = { theme: 'system', setTheme: mockSetTheme };
    // Correctly pass 'value' prop to Provider during rerender
    rerender(
      <ThemeContext.Provider value={providerProps}><SettingsPage /></ThemeContext.Provider>
    );
    expect(screen.getByLabelText(/as in system/i).checked).toBe(true);
  });
});
