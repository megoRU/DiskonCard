export function register() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                newWorker.onstatechange = () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // Новый SW установлен и ожидает активации
                            console.log('Новый сервис готов к активации');
                            // Здесь можно уведомить пользователя и вызвать skipWaiting
                        } else {
                            // Первый запуск SW
                            console.log('Сервис установлен');
                        }
                    }
                };
            };
        });
    }
}