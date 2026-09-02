export const checkForAppUpdate = async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
    }
    // Reload the application to apply changes
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error while updating application:", error);
    window.location.reload();
    return false;
  }
};
