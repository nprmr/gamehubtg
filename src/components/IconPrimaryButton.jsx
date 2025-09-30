import React from "react";
import "../theme.css";
import ArrowBackIcon from "../icons/arrowback.svg?react";

function IconPrimaryButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                width: "64px",
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
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
