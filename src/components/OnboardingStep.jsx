import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const stepWrapper = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "var(--surface-light)",
    borderRadius: 20,
    padding: 12,
    gap: 12,
    overflow: "hidden", // важно, чтобы старый шаг не вылезал
};

const numberBlock = {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "var(--surface-main)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: "var(--icotex-white)",
    flexShrink: 0,
};

const textBlock = {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    gap: 0,
    overflow: "hidden",
};

const titleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    textAlign: "left",
    color: "var(--icotex-normal)",
    margin: 0,
};

const subtitleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 14,
    fontWeight: 400,
    color: "var(--icotex-lowest)",
    margin: 0,
};

const numberVariants = {
    enter: { y: 40, opacity: 0 },
    center: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 120, damping: 14 },
    },
    exit: { y: -40, opacity: 0, transition: { duration: 0.3 } },
};

const textVariants = {
    enter: { y: 40, opacity: 0 },
    center: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 120, damping: 14 },
    },
    exit: { y: -40, opacity: 0, transition: { duration: 0.3 } },
};

function OnboardingStep({ number, title, subtitle }) {
    return (
        <div style={stepWrapper}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={number}
                    variants={numberVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={numberBlock}
                >
                    {number}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={title}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={textBlock}
                >
                    <p style={titleStyle}>{title}</p>
                    <p style={subtitleStyle}>{subtitle}</p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default OnboardingStep;
