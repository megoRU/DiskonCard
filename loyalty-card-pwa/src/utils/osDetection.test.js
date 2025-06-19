import { isIOS } from './osDetection';

describe('isIOS Utility', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    // Восстанавливаем оригинальный navigator после каждого теста
    global.navigator = originalNavigator;
  });

  test('should return true for iPhone platform', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'iPhone',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    };
    expect(isIOS()).toBe(true);
  });

  test('should return true for iPad platform', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'iPad',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    };
    expect(isIOS()).toBe(true);
  });

  test('should return true for iPod platform', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'iPod',
      userAgent: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    };
    expect(isIOS()).toBe(true);
  });

  test('should return true for iPhone Simulator platform', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'iPhone Simulator',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    };
    expect(isIOS()).toBe(true);
  });

  test('should return true for iPad userAgent (even if platform is Linux, for example)', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'Linux armv81', // Пример другой платформы
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    };
    expect(isIOS()).toBe(true);
  });

  test('should return false for Android platform and userAgent', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'Linux armv81', // Типично для Android
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
    };
    expect(isIOS()).toBe(false);
  });

  test('should return false for Windows platform and userAgent', () => {
    global.navigator = {
      ...originalNavigator,
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
    };
    expect(isIOS()).toBe(false);
  });

  test('should return false if navigator is undefined (e.g., non-browser environment)', () => {
    global.navigator = undefined;
    expect(isIOS()).toBe(false);
  });

  test('should return false if navigator.platform is missing', () => {
    global.navigator = {
        ...originalNavigator,
        platform: undefined,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X)'
    };
    // В этом случае userAgentCheck все еще может вернуть true, если он содержит iPhone, iPad, or iPod
    // Поэтому результат будет true, если userAgent содержит iOS-специфичные строки
    // Изменим userAgent, чтобы он не был iOS
    global.navigator = {
        ...originalNavigator,
        platform: undefined,
        userAgent: 'Some other agent'
    };
    expect(isIOS()).toBe(false);

    // А если userAgent все-таки iOS?
     global.navigator = {
        ...originalNavigator,
        platform: undefined,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X)'
    };
    expect(isIOS()).toBe(true); // Потому что userAgentCheck сработает
  });

   test('should return false if navigator.userAgent is missing and platform is not iOS', () => {
    global.navigator = { ...originalNavigator, platform: 'Win32', userAgent: undefined };
    expect(isIOS()).toBe(false);
  });

  test('should return true if navigator.userAgent is missing but platform IS iOS', () => {
    global.navigator = { ...originalNavigator, platform: 'iPhone', userAgent: undefined };
    expect(isIOS()).toBe(true);
  });

  // Тест для navigator.standalone (если бы он был включен в основную логику isIOS)
  // test('should return true if navigator.standalone is true on an Apple device (simulated)', () => {
  //   global.navigator = {
  //     ...originalNavigator,
  //     platform: 'iPhone', // или другая iOS платформа
  //     userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X)',
  //     standalone: true,
  //   };
  //   // Если бы isIOS() проверяла navigator.standalone, этот тест был бы актуален
  //   // expect(isIOS()).toBe(true);
  // });
});
