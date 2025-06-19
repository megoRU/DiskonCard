import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Service worker auto-update logic
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                newWorker.onstatechange = () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    }
                };
            };
        });
    });
}

reportWebVitals();