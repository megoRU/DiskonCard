/// <reference types="vitest" />
import { defineConfig } from 'vite'; // Используем defineConfig из vite для лучшей типизации

export default defineConfig({
  test: {
    globals: true, // Включает Jest-совместимые глобальные переменные (describe, it, expect, jest/vi)
    environment: 'jsdom', // Эмулирует окружение DOM для тестов, использующих window, localStorage и т.д.
    setupFiles: './src/setupTests.js', // Если есть файл для начальной настройки тестов (например, импорт jest-dom/extend-expect)
    // Можно добавить и другие опции при необходимости
    // coverage: { // Пример конфигурации покрытия
    //   provider: 'v8', // или 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
});
