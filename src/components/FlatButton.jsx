import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../theme.css";

function FlatButton({
                        children,
                        onClick,
                        disabled = false,
                        description,
                    }) {
    const hapticTriggered = useRef(false);

    const handleClick = (e) => {
        if (disabled) return;
        onClick?.(e);
        // 👇 сбрасываем флаг после клика
        hapticTriggered.current = false;
    };

    const handlePressStart = () => {
        if (!disabled && !hapticTriggered.current) {
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
            disabled={disabled}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "64px",
                padding: "8px 16px",
                borderRadius: "20px",
                background: "var(--surface-light)",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Gilroy, sans-serif",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "transform 0.1s ease",
                boxSizing: "border-box",
                overflow: "hidden",
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                userSelect: "none",
            }}
            onMouseLeave={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseUp={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(1)")
            }
            onTouchEnd={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseDownCapture={(e) =>
                !disabled && (e.currentTarget.style.transform = "scale(0.985)")
            }
        >
      <span
          style={{
              fontSize: "20px",
              fontWeight: "600",
              color: disabled ? "var(--icotex-low)" : "var(--icotex-normal)",
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
                            color: "var(--icotex-lowest)",
                            marginTop: "2px",
                            lineHeight: 1.2,
                        }}
                    >
                        {description}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}

export default FlatButton;
