import React, { useRef, useCallback, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../theme.css";

const PrimaryButton = forwardRef(function PrimaryButton({
                           children,
                           textColor = "var(--icotex-white)",
                           onClick,
                           disabled = false,
                           description,
                           type = "button",
                           className,
                           withMargin = false,
                       }, ref) {
    const hapticTriggered = useRef(false);

    const handleClick = useCallback((e) => {
        if (disabled) return;
        onClick?.(e);
        hapticTriggered.current = false;
    }, [disabled, onClick]);

    const handlePressStart = useCallback(() => {
        if (!disabled && !hapticTriggered.current) {
            hapticTriggered.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
        }
    }, [disabled]);

    const handlePressEnd = useCallback(() => {
        hapticTriggered.current = false;
    }, []);

    return (
        <motion.button
            ref={ref}
            onClick={handleClick}
            onPointerDown={handlePressStart}
            onPointerUp={handlePressEnd}
            disabled={disabled}
            type={type}
            className={className}
            whileTap={disabled ? undefined : { scale: 0.985 }}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "64px",
                padding: "8px 16px",
                borderRadius: "20px",
                background: disabled
                    ? "var(--surface-normal-alfa)"
                    : "var(--surface-normal-alfa)",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Gilroy, sans-serif",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                marginBottom: withMargin ? "24px" : "0",
                boxSizing: "border-box",
                overflow: "hidden",
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
        >
      <span
          style={{
              fontSize: "20px",
              fontWeight: "600",
              color: disabled ? "var(--icotex-white-alfa)" : textColor,
              lineHeight: 1,
          }}
      >
        {children}
      </span>

            <AnimatePresence>
                {description && (
                    <motion.span
                        key="desc"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            color: "var(--icotex-white-alfa)",
                            marginTop: "2px",
                            lineHeight: 1.2,
                        }}
                    >
                        {description}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
});

export default PrimaryButton;
