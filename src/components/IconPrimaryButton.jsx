import React, { useRef } from "react";
import "../theme.css";
import ArrowBackIcon from "../icons/arrowback.svg?react";

function IconPrimaryButton({ onClick }) {
    const hapticTriggered = useRef(false);

    const handleClick = (e) => {
        onClick?.(e);
    };

    const handlePressStart = () => {
        if (!hapticTriggered.current) {
            hapticTriggered.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
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
                display: "flex",
                width: "64px",
                minWidth: "64px",
                height: "64px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                background: "var(--surface-normal-alfa)",
                border: "none",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "transform 0.1s ease",
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
            onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
            }
            onTouchEnd={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseDownCapture={(e) =>
                (e.currentTarget.style.transform = "scale(0.93)")
            }
        >
            <ArrowBackIcon
                width={24}
                height={24}
                style={{ color: "var(--icotex-white)" }}
            />
        </button>
    );
}

export default IconPrimaryButton;
