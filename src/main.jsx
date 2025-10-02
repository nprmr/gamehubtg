import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";
import WebApp from '@twa-dev/sdk';

function initTelegram() {
    WebApp.ready();

    // пробуем fullscreen
    WebApp.requestFullscreen();

    // блокируем свайп вниз (закрытие)
    if (WebApp.disableVerticalSwipes) {
        WebApp.disableVerticalSwipes();
    } else if (WebApp.viewport?.lockOrientation) {
        // fallback для старых SDK
        WebApp.viewport.lockOrientation();
    }
}

initTelegram();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
