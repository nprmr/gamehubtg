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
    // сортировка: бронза → серебро → золото
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

    // вращение светлого слоя
    const lightAnimation = {
        rotate: 360,
        transition: { repeat: Infinity, duration: 25, ease: "linear" },
    };

    // shake анимация медали
    const shakeAnimation = {
        rotate: [-3, 3, -3],
        transition: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
    };

    // Twemoji html
    const emojiHTML = twemoji.parse(currentWinner?.emoji || "🙂", {
        folder: "svg",
        ext: ".svg",
    });

    // при reveal — хаптик и конфетти
    useEffect(() => {
        if (!emojiRevealed) return;
        const levels = ["medium", "heavy", "rigid"];
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(levels[step]);
        const power = [80, 150, 300][step];
        const spread = [60, 90, 120][step];
        confetti({ particleCount: power, spread, origin: { y: 0.6 } });
    }, [emojiRevealed, step]);

    useEffect(() => {
        setEmojiRevealed(false);
        const t = setTimeout(() => setEmojiRevealed(true), 1200);
        return () => clearTimeout(t);
    }, [step]);

    const handleContinue = () => {
        if (animating) return;
        setAnimating(true);

        // 1️⃣ — анимация исчезновения основной карточки
        setTimeout(() => {
            // 2️⃣ — добавляем карточку в слот
            setPlaced((p) => [...p, step]);
            setAnimating(false);
            setEmojiRevealed(false);
            if (step < 2) setStep((s) => s + 1);
            else onFinish?.();
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={overlayStyle}
        >
            <motion.img
                src={lightImg}
                alt="light"
                style={lightStyle}
                animate={lightAnimation}
            />

            {/* === Центральная сцена === */}
            <AnimatePresence>
                {!placed.includes(step) && (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={
                            animating
                                ? { opacity: 0, scale: 0, transition: { duration: 1 } }
                                : { opacity: 1, scale: 1 }
                        }
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.4 }}
                        style={centerWrapper}
                    >
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
                                    style={{
                                        width: 46,
                                        height: 46,
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === Подписи === */}
            <div style={{ marginTop: 32, textAlign: "center", zIndex: 3 }}>
                {!emojiRevealed ? (
                    <div style={placeText}>{texts[step]}</div>
                ) : (
                    <>
                        <div style={nameText}>{currentWinner?.name || "Игрок"}</div>
                        <div style={scoreText}>{(currentWinner?.score ?? 0)} очков</div>
                    </>
                )}
            </div>

            {/* === Нижняя зона: слоты + кнопка === */}
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

const lightStyle = {
    width: 326,
    height: 326,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.9,
    zIndex: 0,
};

const centerWrapper = {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
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

const placeText = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 24,
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
