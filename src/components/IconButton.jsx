import React, { useRef, forwardRef, useCallback } from "react";
import { motion } from "framer-motion";
import "../theme.css";

/**
 * Универсальная кнопка с иконкой
 * @param {React.Component} icon - React-компонент иконки (SVG)
 * @param {Function} onClick - обработчик клика
 * @param {number} size - размер кнопки (по умолчанию 48px)
 */
const IconButton = forwardRef(function IconButton({ icon: Icon, onClick, size = 48, className, ariaLabel }, ref) {
    const hapticTriggered = useRef(false);

    const handleClick = useCallback((e) => {
        onClick?.(e);
        hapticTriggered.current = false;
    }, [onClick]);

    const handlePressStart = useCallback(() => {
        if (!hapticTriggered.current) {
            hapticTriggered.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
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
            className={className}
            aria-label={ariaLabel}
            whileTap={{ scale: 0.93 }}
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
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
        >
            {Icon && (
                <Icon
                    width={size / 2}
                    height={size / 2}
                    fill="var(--icotex-white)"
                />
            )}
        </motion.button>
    );
});

export default IconButton;
