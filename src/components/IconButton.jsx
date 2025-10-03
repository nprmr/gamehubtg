import React, { useRef } from "react";
import "../theme.css";

/**
 * Универсальная кнопка с иконкой
 * @param {React.Component} icon - React-компонент иконки (SVG)
 * @param {Function} onClick - обработчик клика
 * @param {number} size - размер кнопки (по умолчанию 48px)
 */
function IconButton({ icon: Icon, onClick, size = 48 }) {
    const hapticTriggered = useRef(false);

    const handleClick = (e) => {
        onClick?.(e);
        // 👇 сброс после клика
        hapticTriggered.current = false;
    };

    const handlePressStart = () => {
        if (!hapticTriggered.current) {
            hapticTriggered.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
        }
    };

    const handlePressEnd = () => {
        hapticTriggered.current = false;
    };

    return (
        <button
            onClick={handleClick}
            onMouseDown={handlePressStart}
            onTouchStart={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchEnd={handlePressEnd}
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
                transition: "transform 0.1s ease",
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDownCapture={(e) =>
                (e.currentTarget.style.transform = "scale(0.93)")
            }
        >
            {Icon && (
                <Icon
                    width={size / 2}
                    height={size / 2}
                    fill="var(--icotex-white)"
                />
            )}
        </button>
    );
}

export default IconButton;
