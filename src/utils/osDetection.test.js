import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isIOS } from './osDetection';

describe('osDetection utility', () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  it('should return true for iPhone userAgent', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        platform: 'iPhone',
        maxTouchPoints: 5,
      },
      writable: true,
      configurable: true,
    });
    expect(isIOS()).toBe(true);
  });

  it('should return true for iPad userAgent', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X)',
        platform: 'iPad',
        maxTouchPoints: 5,
      },
      writable: true,
      configurable: true,
    });
    expect(isIOS()).toBe(true);
  });

  it('should return false for Android userAgent', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G960F)',
        platform: 'Linux armv8l',
        maxTouchPoints: 5,
      },
      writable: true,
      configurable: true,
    });
    expect(isIOS()).toBe(false);
  });
});
