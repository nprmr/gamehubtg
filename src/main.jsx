import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";

// === Telegram Mini App API ===
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();   // сообщает Telegram, что приложение загружено
    tg.expand();  // растягивает bottom sheet
}

// Универсальная функция для fullscreen
function requestFullscreen() {
    const event = "web_app_request_fullscreen";
    const data = JSON.stringify({});
    if (window.TelegramWebviewProxy) {
        // мобильные и десктоп-клиенты
        window.TelegramWebviewProxy.postEvent(event, data);
    } else if (window.external && window.external.notify) {
        // windows phone (устар.)
        window.external.notify(JSON.stringify({ eventType: event, eventData: {} }));
    } else if (window.parent) {
        // web версия (iframe)
        window.parent.postMessage(
            JSON.stringify({ eventType: event, eventData: {} }),
            "https://web.telegram.org"
        );
    }
}

// 👉 вызов сразу при старте (если нужно всегда fullscreen)
requestFullscreen();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

export { requestFullscreen };
