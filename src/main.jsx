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

        // ✅ Берём реальные safe-area insets из SDK
        if (WebApp.viewport?.safeAreaInsets) {
            const { top, bottom, left, right } = WebApp.viewport.safeAreaInsets;

            document.documentElement.style.setProperty("--my-safe-top", `${top}px`);
            document.documentElement.style.setProperty("--my-safe-bottom", `${bottom}px`);
            document.documentElement.style.setProperty("--my-safe-left", `${left}px`);
            document.documentElement.style.setProperty("--my-safe-right", `${right}px`);
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
