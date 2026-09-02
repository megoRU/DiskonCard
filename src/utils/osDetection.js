export const isIOS = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isIosUserAgent = /iPad|iPhone|iPod/.test(userAgent);
  const isIosPlatform = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(platform);

  // iPad on iOS 13+ reports platform as 'MacIntel' but maxTouchPoints > 1
  const isIPadOS = platform === 'MacIntel' && maxTouchPoints > 1;

  return isIosUserAgent || isIosPlatform || isIPadOS;
};
