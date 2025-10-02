import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";
import WebApp from "@twa-dev/sdk";

function initTelegram() {
    try {
        WebApp.ready();

        // ✅ принудительно в полноэкранный режим
        if (typeof WebApp.expand === "function") {
            WebApp.expand();
        }

        // блокировка свайпов вниз
        if (typeof WebApp.disableVerticalSwipes === "function") {
            WebApp.disableVerticalSwipes();
        } else if (WebApp.viewport?.lockOrientation) {
            WebApp.viewport.lockOrientation();
        }

        // подписка на safe-area
        WebApp.onEvent("safe_area_changed", (insets) => {
            console.log("Safe area updated:", insets);
        });
    } catch (e) {
        console.log("Работаем в браузере — методы Telegram отключены", e);
    }
}

initTelegram();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
