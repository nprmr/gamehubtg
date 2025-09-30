import React from "react";
import "../theme.css";

function PrimaryButton({
                           children,
                           textColor = "var(--icotex-white)",
                           onClick,
                           disabled = false,
                           withMargin = false, // отступы слева/справа по 16px
                       }) {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            style={{
                display: "flex",
                width: withMargin ? "calc(100% - 32px)" : "100%", // уменьшаем ширину на 32px
                height: "64px",
                padding: "8px 16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                background: disabled
                    ? "var(--surface-normal-alfa)"
                    : "var(--surface-normal-alfa)",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Gilroy, sans-serif",
                fontSize: "24px",
                fontWeight: "600",
                color: disabled ? "var(--icotex-white-alfa)" : textColor,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "transform 0.1s ease",
                margin: withMargin ? "0 16px 24px 16px" : "0 0 24px 0",
                boxSizing: "border-box",
            }}
            onMouseDown={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(0.985)")
            }
            onMouseUp={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseLeave={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(1)")
            }
        >
            {children}
        </button>
    );
}

export default PrimaryButton;
