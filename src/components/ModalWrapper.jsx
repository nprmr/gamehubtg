// components/ModalWrapper.jsx
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModalWrapper = ({ isOpen, onClose, children }) => {
    const contentRef = useRef(null);

    // lock body scroll + Escape close
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [isOpen, onClose]);

    // move focus into modal for accessibility (best-effort)
    useEffect(() => {
        if (isOpen) {
            // slight delay to ensure presence
            const t = setTimeout(() => contentRef.current?.focus?.(), 0);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="onboarding-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        backdropFilter: "blur(8px)",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "var(--surface-main)",
                            overflow: "hidden",
                            borderRadius: 0, // fullscreen
                        }}
                        role="dialog"
                        aria-modal="true"
                        tabIndex={-1}
                        ref={contentRef}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalWrapper;
