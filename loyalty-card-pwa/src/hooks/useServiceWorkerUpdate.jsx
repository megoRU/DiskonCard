import { useEffect, useState } from 'react';

export function useServiceWorkerUpdate() {
    const [waitingWorker, setWaitingWorker] = useState(null);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                setWaitingWorker(newWorker);
                            }
                        });
                    }
                });
            });
        }
    }, []);

    function reloadPage() {
        if (!waitingWorker) return;

        waitingWorker.postMessage({ type: 'SKIP_WAITING' });

        waitingWorker.onstatechange = () => {
            if (waitingWorker.state === 'activated') {
                window.location.reload();
            }
        };
    }

    return { waitingWorker, reloadPage };
}