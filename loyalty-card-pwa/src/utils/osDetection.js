/**
 * Утилита для определения операционной системы пользователя.
 */

/**
 * Проверяет, является ли текущая операционная система iOS.
 * Учитывает различные устройства Apple и симуляторы.
 *
 * @returns {boolean} true, если ОС - iOS, иначе false.
 */
export const isIOS = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  let platformCheck = false;
  // navigator.platform может отсутствовать в некоторых окружениях или быть пустым.
  if (typeof navigator.platform === 'string' && navigator.platform.length > 0) {
    platformCheck = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform);
  }

  let userAgentCheck = false;
  // navigator.userAgent может отсутствовать или быть пустым.
  if (typeof navigator.userAgent === 'string' && navigator.userAgent.length > 0) {
    userAgentCheck = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // PWA на iPadOS 13+ может иметь userAgent от macOS Safari, но platform будет 'iPad'.
  // Поэтому platformCheck более приоритетен в таких случаях.
  return platformCheck || userAgentCheck;
};
