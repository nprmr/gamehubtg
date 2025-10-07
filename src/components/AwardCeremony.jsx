import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import lightImg from "../assets/light.png";
import bronzeImg from "../assets/bronze.svg";
import silverImg from "../assets/silver.svg";
import goldImg from "../assets/gold.svg";
import emptyImg from "../assets/empty.svg";
import WinnerAskIcon from "../icons/winnerask.svg?react";
import { theme } from "../theme";
import PrimaryButton from "./PrimaryButton";

/**
 * winners: массив топ-3 игроков, каждый объект:
 *  { name: string, emoji: string, score: number }
 *  Порядок может быть любым — компонент сам упорядочит их как:
 *   0: бронза (3-е место), 1: серебро (2-е), 2: золото (победитель)
 */
export default function AwardCeremony({ winners = [], onFinish }) {
    // Упорядочиваем: бронза → серебро → золото по возрастанию очков
    const ordered = useMemo(() => {
        const copy = [...winners];
        copy.sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0));
        return copy.slice(0, 3);
    }, [winners]);

    const texts = ["3-е место", "2-е место", "Победитель"];
    const medals = [bronzeImg, silverImg, goldImg];

    const [step, setStep] = useState(0); // 0=bronze,1=silver,2=gold
    const [emojiRevealed, setEmojiRevealed] = useState(false);
    const [moving, setMoving] = useState(false);
    const [placed, setPlaced] = useState([]); // какие слоты уже заняты (индексы 0..2)

    const currentWinner = ordered[step];

    // 🔄 вращение light.png
    const lightAnimation = {
        rotate: 360,
        transition: { repeat: Infinity, duration: 20, ease: "linear" },
    };

    // ⚙️ тряска медали и верхнего слоя
    const shakeAnimation = {
        rotate: [-3, 3, -3],
        transition: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
    };

    // появление emoji -> хаптик + конфетти
    useEffect(() => {
        if (!emojiRevealed) return;
        const levels = ["medium", "heavy", "rigid"];
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(levels[step]);

        const power = [80, 150, 300][step];
        const spread = [60, 90, 120][step];
        confetti({ particleCount: power, spread, origin: { y: 0.6 } });
    }, [emojiRevealed, step]);

    // задержка перед reveal emoji
    useEffect(() => {
        setEmojiRevealed(false);
        const t = setTimeout(() => setEmojiRevealed(true), 1500);
        return () => clearTimeout(t);
    }, [step]);

    const handleContinue = () => {
        if (moving) return;
        setMoving(true);

        // имитируем анимацию «улёта» в левый/центр/правый slot
        setTimeout(() => {
            setPlaced((p) => [...p, step]);
            setMoving(false);
            setEmojiRevealed(false);

            if (step < 2) {
                setStep((s) => s + 1);
            } else {
                onFinish?.();
            }
        }, 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={overlayStyle}
        >
            {/* Фон: светящееся колесо */}
            <motion.img
                src={lightImg}
                alt="light"
                style={lightStyle}
                animate={lightAnimation}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
            />

            {/* Центральная сцена: медаль + слой (winnerask/emoji) */}
            <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
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
                        <WinnerAskIcon style={{ width: 96, height: 96 }} />
                    ) : (
                        <motion.span
                            style={emojiStyle}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            {currentWinner?.emoji || "🙂"}
                        </motion.span>
                    )}
                </motion.div>
            </motion.div>

            {/* Подписи под сценой:
          до emoji: текст места (3-е/2-е/Победитель),
          после emoji: имя (36 bold) и очки на 4px ниже (24 bold) */}
            <div style={{ marginTop: 32, textAlign: "center", zIndex: 3 }}>
                {!emojiRevealed ? (
                    <div style={placeText}>{texts[step]}</div>
                ) : (
                    <>
                        <div style={nameText}>{currentWinner?.name || "Игрок"}</div>
                        <div style={scoreText}>
                            {(currentWinner?.score ?? 0)} очков
                        </div>
                    </>
                )}
            </div>

            {/* Ряд из трёх слотов над кнопкой (на 24px выше кнопки) */}
            <div style={slotsContainer}>
                {[0, 1, 2].map((i) => (
                    <div key={i} style={slotWrapper}>
                        {placed.includes(i) ? (
                            <>
                                <motion.img
                                    src={medals[i]}
                                    alt="medal-mini"
                                    style={slotMedalStyle}
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.6 }}
                                />
                                <motion.span
                                    style={emojiSmall}
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {ordered[i]?.emoji || "🙂"}
                                </motion.span>
                            </>
                        ) : (
                            <img src={emptyImg} alt="empty" style={slotEmptyStyle} />
                        )}
                    </div>
                ))}
            </div>

            {/* Нижняя кнопка */}
            <div style={buttonWrapper}>
                <PrimaryButton textColor={theme.icotex.white} onClick={handleContinue}>
                    Продолжить
                </PrimaryButton>
            </div>
        </motion.div>
    );
}

/* ===== СТИЛИ ===== */
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

const medalStyle = {
    width: 135,
    height: 182,
    position: "absolute",
    zIndex: 1,
};

const winnerContainer = {
    position: "absolute",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 135,
    height: 182,
};

const emojiStyle = {
    fontSize: 96,
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
    fontSize: 36,                 // ✅ 36 bold
    color: "var(--icotex-white)", // ✅ icotex/white
    lineHeight: 1.1,
};

const scoreText = {
    marginTop: 4,                 // ✅ на 4px ниже
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 24,                 // ✅ 24 bold
    color: "var(--icotex-white)", // ✅ icotex/white
};

const slotsContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 24,          // ✅ расстояние 24px между слотами
    marginTop: 24,    // ✅ блок на 24px над кнопкой (см. buttonWrapper marginTop)
};

const slotWrapper = {
    position: "relative",
    width: 88,        // ✅ размер слотов 88x119
    height: 119,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const slotEmptyStyle = {
    width: 88,
    height: 119,
    opacity: 0.9,
};

const slotMedalStyle = {
    width: 88,
    height: 119,
    position: "absolute",
};

const emojiSmall = {
    position: "absolute",
    fontSize: 48,
};

const buttonWrapper = {
    marginTop: 24, // слоты расположены над кнопкой ровно на 24px
    zIndex: 10,
};
