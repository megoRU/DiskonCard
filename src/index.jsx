import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { registerSW } from 'virtual:pwa-register';

// add this to prompt for a refresh
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("Новое обновление доступно. Обновить?")) {
            let promise = updateSW(true);
            console.log(promise);
        }
    },
    onOfflineReady() {
        console.log("offline ready");
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

reportWebVitals();