import React from "react";
import "../theme.css";

function PrimaryButton({ children, textColor = "var(--icotex-white)", onClick, disabled = false }) {
    return (
        <button
            onClick={disabled ? undefined : onClick} // если disabled → клик не работает
            disabled={disabled}
            style={{
                display: "flex",
                width: "calc(100% - 32px)",
                height: "64px",
                margin: "0 16px 24px 16px",
                padding: "8px 16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                background: "var(--surface-normal-alfa)",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Gilroy, sans-serif",
                fontSize: "24px",
                fontWeight: "600",
                color: textColor,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "transform 0.1s ease",
                opacity: disabled ? 0.6 : 1, // визуально подсветим
            }}
            onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.985)")}
            onMouseUp={(e) => !disabled && (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = "scale(1)")}
        >
            {children}
        </button>
    );
}

export default PrimaryButton;
