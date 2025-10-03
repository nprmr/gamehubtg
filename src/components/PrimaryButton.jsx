import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../theme.css";

function PrimaryButton({
                           children,
                           textColor = "var(--icotex-white)",
                           onClick,
                           disabled = false,
                           description,
                       }) {
    // Обертка для клика с хаптиком
    const handleClick = (e) => {
        if (disabled) return;
        // Хаптик medium
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");

        onClick?.(e);
    };

    return (
        <button
            onClick={handleClick}
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
                background: disabled
                    ? "var(--surface-normal-alfa)"
                    : "var(--surface-normal-alfa)",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Gilroy, sans-serif",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "transform 0.1s ease",
                marginBottom: "24px",
                boxSizing: "border-box",
                overflow: "hidden",
                outline: "none",
                boxShadow: "none"
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
        </button>
    );
}

export default PrimaryButton;
