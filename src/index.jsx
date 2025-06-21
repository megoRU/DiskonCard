import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { registerSW } from 'virtual:pwa-register';

function PWAUpdate() {
    const [needRefresh, setNeedRefresh] = useState(false);
    const [updateServiceWorker, setUpdateServiceWorker] = useState(null);

    useEffect(() => {
        registerSW({
            immediate: true,
            onNeedRefresh() {
                setNeedRefresh(true);
            },
            onRegisteredSW(swUrl, r) {
                setUpdateServiceWorker(() => r?.update);
            }
        });
    }, []);

    if (!needRefresh) return null;

    return (
        <button
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                padding: '10px 15px',
                backgroundColor: '#317EFB',
                color: '#fff',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                zIndex: 1000,
            }}
            onClick={async () => {
                if (updateServiceWorker) {
                    await updateServiceWorker();
                    window.location.reload();
                }
            }}
        >
            Обновить приложение
        </button>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
        <PWAUpdate />
    </React.StrictMode>
);

reportWebVitals();