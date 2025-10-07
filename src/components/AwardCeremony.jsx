import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import twemoji from "twemoji";

import lightImg from "../assets/light.png";
import bronzeImg from "../assets/bronze.svg";
import silverImg from "../assets/silver.svg";
import goldImg from "../assets/gold.svg";
import emptyImg from "../assets/empty.svg";
import WinnerAskIcon from "../icons/winnerask.svg?react";
import { theme } from "../theme";
import PrimaryButton from "./PrimaryButton";

export default function AwardCeremony({ winners = [], onFinish }) {
    const ordered = useMemo(() => {
        const copy = [...winners];
        copy.sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0));
        return copy.slice(0, 3);
    }, [winners]);

    const texts = ["3-е место", "2-е место", "Победитель"];
    const medals = [bronzeImg, silverImg, goldImg];

    const [step, setStep] = useState(0);
    const [emojiRevealed, setEmojiRevealed] = useState(false);
    const [placed, setPlaced] = useState([]);
    const [animating, setAnimating] = useState(false);

    const currentWinner = ordered[step];
    const showCurrent = !placed.includes(step);

    // shake анимация медали
    const shakeAnimation = {
        rotate: [-3, 3, -3],
        transition: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
    };

    // вращение света
    const lightAnimation = {
        rotate: 360,
        transition: { repeat: Infinity, duration: 40, ease: "linear" },
    };

    const emojiHTML = twemoji.parse(currentWinner?.emoji || "🙂", {
        folder: "svg",
        ext: ".svg",
    });

    // конфетти и хаптик
    useEffect(() => {
        if (!emojiRevealed) return;
        const levels = ["medium", "heavy", "rigid"];
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(levels[step]);
        const power = [80, 150, 300][step];
        const spread = [60, 90, 120][step];
        confetti({ particleCount: power, spread, origin: { y: 0.6 } });
    }, [emojiRevealed, step]);

    // 🕒 держим текст "3-е место" дольше перед reveal emoji
    useEffect(() => {
        setEmojiRevealed(false);
        const t = setTimeout(() => setEmojiRevealed(true), 2500); // ← увеличено с 1200
        return () => clearTimeout(t);
    }, [step]);

    const handleContinue = () => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setPlaced((p) => [...p, step]);
            setAnimating(false);
            setEmojiRevealed(false);
            if (step < 2) setStep((s) => s + 1);
            else onFinish?.();
        }, 1000);
    };

    // яркость света
    const lightOpacity = [0.4, 0.6, 0.8][step];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={overlayStyle}
        >
            {/* === Центральная карточка === */}
            <div style={centerFixedContainer}>
                <AnimatePresence mode="wait">
                    {showCurrent && (
                        <motion.div
                            key={`card-${step}`}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 12,
                                duration: 0.8,
                            }}
                            style={centerWrapper}
                        >
                            {/* === Light под медалью === */}
                            <motion.div
                                key={`light-${step}`}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%) scale(0.9)", // уменьшено на 10%
                                    zIndex: 0,
                                }}
                            >
                                <motion.img
                                    src={lightImg}
                                    alt="light"
                                    style={lightBehindStyle}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: lightOpacity, rotate: 360 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        opacity: { duration: 0.6 },
                                        rotate: { repeat: Infinity, duration: 40, ease: "linear" },
                                    }}
                                />
                            </motion.div>

                            {/* === Медаль и эмоджи === */}
                            <motion.img
                                src={medals[step]}
                                alt="medal"
                                style={medalStyle}
                                animate={shakeAnimation}
                            />
                            <motion.div style={winnerContainer} animate={shakeAnimation}>
                                {!emojiRevealed ? (
                                    <WinnerAskIcon style={{ width: 46, height: 46 }} />
                                ) : (
                                    <motion.div
                                        dangerouslySetInnerHTML={{ __html: emojiHTML }}
                                        style={{ width: 46, height: 46 }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    />
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* === Текст под карточкой === */}
            <div style={textContainer}>
                <AnimatePresence mode="wait">
                    {showCurrent && (
                        <motion.div
                            key={`text-${step}-${emojiRevealed ? "name" : "place"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, delay: 0.15 }} // чуть дольше
                            style={absoluteTextWrapper}
                        >
                            {!emojiRevealed ? (
                                <div style={placeText}>{texts[step]}</div>
                            ) : (
                                <>
                                    <div style={nameText}>{currentWinner?.name || "Игрок"}</div>
                                    <div style={scoreText}>{(currentWinner?.score ?? 0)} очков</div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* === Нижняя зона === */}
            <div style={bottomContainer}>
                <div style={slotsContainer}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} style={slotWrapper}>
                            {placed.includes(i) ? (
                                <motion.div
                                    key={`placed-${i}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    style={{ position: "relative" }}
                                >
                                    <img src={medals[i]} alt="medal-mini" style={slotMedalStyle} />
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: twemoji.parse(ordered[i]?.emoji || "🙂", {
                                                folder: "svg",
                                                ext: ".svg",
                                            }),
                                        }}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    />
                                </motion.div>
                            ) : (
                                <img src={emptyImg} alt="empty" style={slotEmptyStyle} />
                            )}
                        </div>
                    ))}
                </div>

                <div style={buttonWrapper}>
                    <PrimaryButton textColor={theme.icotex.white} onClick={handleContinue}>
                        Продолжить
                    </PrimaryButton>
                </div>
            </div>
        </motion.div>
    );
}

/* ======= Стили ======= */
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
};

/* === Центр === */
const centerFixedContainer = {
    position: "relative",
    width: "100%",
    height: 240,
    marginTop: "calc(-60px - 24vh)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const centerWrapper = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    zIndex: 2,
};

const lightBehindStyle = {
    width: 300,
    height: 300,
    opacity: 0.9,
    pointerEvents: "none",
};

const medalStyle = { width: 135, height: 182, position: "absolute", zIndex: 1 };
const winnerContainer = {
    position: "absolute",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 135,
    height: 182,
};

/* === Текст под карточкой === */
const textContainer = {
    position: "relative",
    height: 72,
    width: "100%",
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
};

const absoluteTextWrapper = {
    position: "absolute",
    top: 0,
    transform: "translateX(-50%)",
    textAlign: "center",
};

const placeText = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 36,
    color: "var(--icotex-white)",
};

const nameText = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 36,
    color: "var(--icotex-white)",
    lineHeight: 1.1,
};

const scoreText = {
    marginTop: 4,
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: "var(--icotex-white)",
};

/* === Низ === */
const bottomContainer = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "calc(env(--tg-content-safe-area-inset-bottom, 0px) + 24px)",
    boxSizing: "border-box",
};

const slotsContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 24,
    marginBottom: 24,
};

const slotWrapper = {
    position: "relative",
    width: 88,
    height: 119,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const slotEmptyStyle = { width: 88, height: 119, opacity: 0.9 };
const slotMedalStyle = { width: 88, height: 119 };
const buttonWrapper = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
};
