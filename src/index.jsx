import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { registerSW } from 'virtual:pwa-register';

registerSW({
    immediate: true,
    onNeedRefresh() {
        // можно уведомить пользователя
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

reportWebVitals();