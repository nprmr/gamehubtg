import React, { useRef, forwardRef, useCallback } from "react";
import { motion } from "framer-motion";
import "../theme.css";
import ArrowBackIcon from "../icons/arrowback.svg?react";

const IconPrimaryButton = forwardRef(function IconPrimaryButton({ onClick, ariaLabel = "Назад", className }, ref) {
    const hapticTriggered = useRef(false);

    const handleClick = useCallback((e) => {
        onClick?.(e);
        hapticTriggered.current = false;
    }, [onClick]);

    const handlePressStart = useCallback(() => {
        if (!hapticTriggered.current) {
            hapticTriggered.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
        }
    }, []);

    const handlePressEnd = useCallback(() => {
        hapticTriggered.current = false;
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
        }
    }, [onClick]);

    return (
        <motion.button
            ref={ref}
            onClick={handleClick}
            onPointerDown={handlePressStart}
            onPointerUp={handlePressEnd}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabel}
            className={className}
            whileTap={{ scale: 0.93 }}
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
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
        >
            <ArrowBackIcon
                width={24}
                height={24}
                style={{ color: "var(--icotex-white)" }}
            />
        </motion.button>
    );
});

export default IconPrimaryButton;
