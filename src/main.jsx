import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";
import WebApp from "@twa-dev/sdk";

// применяем safe-area
function applySafeArea(insets) {
    document.documentElement.style.setProperty("--tg-safe-area-inset-top", `${insets.top}px`);
    document.documentElement.style.setProperty("--tg-safe-area-inset-bottom", `${insets.bottom}px`);
    document.documentElement.style.setProperty("--tg-safe-area-inset-left", `${insets.left}px`);
    document.documentElement.style.setProperty("--tg-safe-area-inset-right", `${insets.right}px`);
}

function initTelegram() {
    try {
        WebApp.ready();
        WebApp.expand?.();

        // блокировка свайпов вниз (API 7.7+)
        if (typeof WebApp.disableVerticalSwipes === "function") {
            WebApp.disableVerticalSwipes();
        } else if (WebApp.viewport?.lockOrientation) {
            WebApp.viewport.lockOrientation();
        }

        // сразу применяем текущие insets
        if (WebApp.viewport?.safeAreaInsets) {
            applySafeArea(WebApp.viewport.safeAreaInsets);
        }

        // слушаем изменения safe-area
        WebApp.onEvent("safe_area_changed", (insets) => {
            applySafeArea(insets);
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
