import React from "react";
import "../theme.css";

function PrimaryButton({ children }) {
    return (
        <button
            style={{
                display: "flex",
                width: "calc(100% - 32px)", // отступы по 16px
                height: "64px",
                margin: "0 16px 24px 16px", // снизу 24px
                padding: "8px 16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                borderRadius: "20px",
                background: "var(--surface-normal-alfa)",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Advent Pro', sans-serif",
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--icotex-white)",
                backdropFilter: "blur(20px)",       // 👈 blur
                WebkitBackdropFilter: "blur(20px)", // 👈 для Safari
                transition: "transform 0.1s ease", // плавный клик-эффект
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.985)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {children}
        </button>
    );
}

export default PrimaryButton;
