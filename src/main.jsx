import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";
import WebApp from "@twa-dev/sdk";

// Инициализация Telegram Mini App
function initTelegram() {
    try {
        WebApp.ready();

        // fullscreen (работает только в Telegram)
        if (typeof WebApp.requestFullscreen === "function") {
            WebApp.requestFullscreen();
        }

        // блокировка свайпов вниз (API 7.7+)
        if (typeof WebApp.disableVerticalSwipes === "function") {
            WebApp.disableVerticalSwipes();
        } else if (WebApp.viewport?.lockOrientation) {
            // fallback для старых версий SDK
            WebApp.viewport.lockOrientation();
        }
    } catch (e) {
        console.log("Работаем в браузере — методы Telegram отключены");
    }
}

initTelegram();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
