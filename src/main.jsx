import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css"; // подключаем палитру

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
import WebApp from '@twa-dev/sdk';

WebApp.ready();  // важно вызвать в начале

// Пробуем fullscreen
if (WebApp.isExpanded) {
    WebApp.requestFullscreen();
}
