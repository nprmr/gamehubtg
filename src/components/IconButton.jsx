import React from "react";
import "../theme.css";

/**
 * Универсальная кнопка с иконкой
 * @param {React.Component} icon - React-компонент иконки (SVG)
 * @param {Function} onClick - обработчик клика
 * @param {number} size - размер кнопки (по умолчанию 48px)
 */
function IconButton({ icon: Icon, onClick, size = 48 }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--surface-normal-alfa)",
                borderRadius: "16px",
                border: "none",
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            {Icon && <Icon width={size / 2} height={size / 2} fill="var(--icotex-white)" />}
        </button>
    );
}

export default IconButton;
