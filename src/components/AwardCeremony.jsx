import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import twemoji from "twemoji";

import lightImg from "../assets/light.png";
import bronzeImg from "../assets/bronze.svg";
import silverImg from "../assets/silver.svg";
import goldImg from "../assets/gold.svg";
import emptyImg from "../assets/empty.svg";

import { theme } from "../theme";
import PrimaryButton from "./PrimaryButton";
import FlatButton from "./FlatButton";

export default function AwardCeremony({ winners = [], onFinish, onRestart }) {
    const ordered = useMemo(() => {
        const copy = [...winners];
        copy.sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0));
        return copy.slice(0, 3);
    }, [winners]);

    const medals = [bronzeImg, silverImg, goldImg];
    const texts = ["3-е место", "2-е место", "Победитель"];

    const [step, setStep] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [placed, setPlaced] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [final, setFinal] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [showMedal, setShowMedal] = useState(true);

    const currentWinner = ordered[step] ?? { name: "Игрок", emoji: "🙂", score: 0 };

    useEffect(() => {
        if (window.Telegram?.WebApp?.viewportHeight) {
            setViewportHeight(window.Telegram.WebApp.viewportHeight);
        } else {
            setViewportHeight(window.innerHeight);
        }
    }, []);

    // Управление порядком показа текста и запуском конфетти один раз
    useEffect(() => {
        setRevealed(false);
        const t = setTimeout(() => {
            setRevealed(true);
            const power = [80, 150, 300][step];
            const spread = [60, 90, 120][step];
            confetti({ particleCount: power, spread, origin: { y: 0.6 } });
        }, 1200);
        return () => clearTimeout(t);
    }, [step]);

    const handleContinue = () => {
        if (animating) return;
        setAnimating(true);
        setShowMedal(false);

        // Добавляем медаль вниз
        setTimeout(() => {
            setPlaced((p) => [...p, step]);
        }, 600);

        // Следующий шаг
        setTimeout(() => {
            setAnimating(false);
            if (step < 2) {
                setStep((s) => s + 1);
                setShowMedal(true);
            } else {
                setButtonsVisible(false);
                setRevealed(false);
                setTimeout(() => setFinal(true), 1200);
            }
        }, 1000);
    };

    const handleRestart = () => {
        setStep(0);
        setRevealed(false);
        setPlaced([]);
        setAnimating(false);
        setFinal(false);
        setButtonsVisible(true);
        setShowMedal(true);
        onRestart?.();
    };

    // Финальное конфетти
    useEffect(() => {
        if (final) {
            ["light", "medium", "heavy"].forEach((_, i) => {
                setTimeout(() => {
                    confetti({
                        particleCount: 120 + i * 80,
                        spread: 100,
                        startVelocity: 40 + i * 10,
                        origin: { y: 0.6 - i * 0.1 },
                    });
                }, i * 300);
            });
        }
    }, [final]);

    const renderEmoji = (emoji) => (
        <div
            dangerouslySetInnerHTML={{
                __html: twemoji.parse(emoji || "🙂", {
                    folder: "svg",
                    ext: ".svg",
                }),
            }}
            style={{
                width: 46,
                height: 46,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
            }}
        />
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={overlay}
        >
            {/* === Центральная карточка === */}
            <div style={{ ...centerContainer, position: "relative" }}>
                {/* Свет */}
                <AnimatePresence>
                    {showMedal && !final && (
                        <motion.img
                            key={`light-${step}`}
                            src={lightImg}
                            alt="light"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transformOrigin: "center center",
                                width: 260,
                                height: 260,
                                opacity: 0.85,
                                zIndex: 0,
                                pointerEvents: "none",
                            }}
                            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                            animate={{
                                opacity: 0.85,
                                scale: 1,
                                x: "-50%",
                                y: "-50%",
                                rotate: 360,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                transition: { duration: 0.4 },
                            }}
                            transition={{
                                rotate: { repeat: Infinity, duration: 60, ease: "linear" },
                                opacity: { duration: 0.4 },
                                scale: { duration: 0.4 },
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Центральная медаль */}
                <AnimatePresence mode="wait">
                    {showMedal && !final && (
                        <motion.div
                            key={`center-${step}`}
                            initial={{ scale: 0.85, opacity: 0, x: "-50%", y: "-50%" }}
                            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 20,
                                duration: 0.6,
                            }}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: 200,
                                height: 200,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [-3, 3, -3] }}
                                transition={{
                                    duration: 0.4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    width: 200,
                                    height: 200,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img src={medals[step]} alt="medal" style={medal} />
                                {revealed && renderEmoji(currentWinner?.emoji)}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* === Текст под карточкой === */}
            {!final && showMedal && (
                <div style={textZone}>
                    <AnimatePresence mode="wait">
                        {!revealed ? (
                            <motion.div
                                key="place"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div style={placeText}>{texts[step]}</div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="name"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div style={nameText}>{currentWinner?.name}</div>
                                <div style={scoreText}>{currentWinner?.score} очков</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* === Нижние слоты === */}
            <div style={bottomZone}>
                <motion.div layout style={slotContainer}>
                    {ordered.map((w, i) => (
                        <motion.div
                            key={i}
                            style={slot}
                            animate={
                                final && placed.includes(i)
                                    ? {
                                        y: -viewportHeight / 2 + 60,
                                        scale: [1, 1.08, 1],
                                        opacity: 1,
                                        transition: {
                                            duration: 1.2,
                                            ease: [0.22, 1, 0.36, 1],
                                        },
                                    }
                                    : { y: 0, scale: 1, opacity: 1 }
                            }
                        >
                            {placed.includes(i) ? (
                                <motion.div
                                    key={`placed-${i}`}
                                    initial={{ scale: 0 }}
                                    animate={{
                                        scale: [0, 1.4, 1],
                                        transition: { duration: 0.6, ease: "easeOut" },
                                    }}
                                    style={{ position: "relative" }}
                                >
                                    <img src={medals[i]} alt="m" style={slotMedal} />
                                    {renderEmoji(w.emoji)}
                                </motion.div>
                            ) : (
                                <img src={emptyImg} alt="empty" style={slotEmpty} />
                            )}

                            {final && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                    style={{ marginTop: 8 }}
                                >
                                    <div style={finalName}>{w.name}</div>
                                    <div style={finalScore}>{w.score} очков</div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* === Кнопки === */}
                <AnimatePresence mode="wait">
                    {buttonsVisible ? (
                        <motion.div
                            key="main-buttons"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={buttonZone}
                        >
                            <PrimaryButton
                                onClick={handleContinue}
                                disabled={animating}
                                textColor={theme.icotex.white}
                            >
                                Продолжить
                            </PrimaryButton>
                        </motion.div>
                    ) : (
                        final && (
                            <motion.div
                                key="final-buttons"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                style={{ width: "-webkit-fill-available", display: "flex", flexDirection: "column", gap: 8, marginLeft: 16, marginRight: 16 }}
                            >
                                <FlatButton onClick={handleRestart}>Сыграть ещё раз</FlatButton>
                                <PrimaryButton textColor={theme.icotex.white} onClick={onFinish}>
                                    Все игры
                                </PrimaryButton>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/* === Стили === */
const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
};

const centerContainer = {
    position: "relative",
    width: "100%",
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
};

const medal = { width: 140, height: 180, zIndex: 1 };

const textZone = {
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    overflow: "hidden",
};

const placeText = {
    fontSize: 36,
    fontWeight: 700,
    color: "white",
};

const nameText = {
    fontSize: 32,
    fontWeight: 700,
    color: "white",
};

const scoreText = {
    fontSize: 22,
    textAlign: "center",
    fontWeight: 600,
    color: "var(--icotex-lowest)",
};

const bottomZone = {
    position: "absolute",
    bottom: "calc(env(--tg-content-safe-area-inset-bottom, 0px) + 24px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
};

const slotContainer = {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    alignItems: "flex-end",
};

const slot = {
    position: "relative",
    width: 88,
    height: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

const slotEmpty = { width: 88, height: 119, opacity: 0.9 };
const slotMedal = { width: 88, height: 119 };

const buttonZone = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "0 16px",
    boxSizing: "border-box",
    alignItems: "center",
};

const finalName = {
    fontSize: 14,
    fontWeight: 700,
    color: "white",
    textAlign: "center",
};

const finalScore = {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--icotex-lowest)",
    textAlign: "center",
};
