// AwardCeremony.jsx (patched)
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import twemoji from "twemoji";

import lightImg from "../assets/light.png";
import bronzeImg from "../assets/bronze.svg";
import silverImg from "../assets/silver.svg";
import goldImg from "../assets/gold.svg";
import emptyImg from "../assets/empty.svg";
import winnerAskImg from "../icons/winnerask.svg";

import { theme } from "../theme";
import PrimaryButton from "./PrimaryButton";
import FlatButton from "./FlatButton";

export default function AwardCeremony({ winners = [], onFinish, onRestart }) {
    const totalPlayers = winners.length;

    const ordered = useMemo(() => {
        const copy = [...winners].sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0));
        const topCount = Math.min(copy.length, 3);
        return copy.slice(-topCount);
    }, [winners]);

    const hasExtraPlayers = totalPlayers > 3;
    const medals =
        totalPlayers === 2 ? [silverImg, goldImg] : [bronzeImg, silverImg, goldImg];
    const texts =
        totalPlayers === 2
            ? ["2-е место", "Победитель"]
            : ["3-е место", "2-е место", "Победитель"];

    const [step, setStep] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [placed, setPlaced] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [final, setFinal] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [viewportHeight, setViewportHeight] = useState(
        typeof window !== "undefined" ? window.innerHeight : 800
    );
    const [showMedal, setShowMedal] = useState(true);
    const [safeAreaTop, setSafeAreaTop] = useState(0);
    const [safeAreaBottom, setSafeAreaBottom] = useState(0);
    const [isTelegram, setIsTelegram] = useState(false);

    const currentWinner = ordered[step] ?? { name: "Игрок", emoji: "🙂", score: 0 };

    // 👉 HAPTIC helper for Telegram Mini App (no-op elsewhere)
    const haptic = (type = "light") => {
        try {
            const hf = window?.Telegram?.WebApp?.HapticFeedback;
            hf?.impactOccurred?.(type);
        } catch (_) {}
    };

    // 📱 адаптация Telegram viewport + safe area + признак Telegram
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        setIsTelegram(Boolean(tg));

        const updateViewport = () => {
            setViewportHeight(tg?.viewportHeight || window.innerHeight);
        };

        const updateSafeArea = () => {
            const topCSS = parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--tg-content-safe-area-inset-top")
                    ?.trim() || "0",
                10
            );
            const bottomCSS = parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--tg-content-safe-area-inset-bottom")
                    ?.trim() || "0",
                10
            );
            setSafeAreaTop(tg?.safeAreaInsetTop ?? topCSS ?? 0);
            setSafeAreaBottom(tg?.safeAreaInsetBottom ?? bottomCSS ?? 0);
        };

        updateViewport();
        updateSafeArea();

        tg?.onEvent?.("viewportChanged", updateViewport);
        return () => tg?.offEvent?.("viewportChanged", updateViewport);
    }, []);

    // ✨ Эффекты на каждом шаге
    useEffect(() => {
        setRevealed(false);
        const t = setTimeout(() => {
            setRevealed(true);
            const power = [80, 150, 300][step] || 150;
            const spread = [60, 90, 120][step] || 100;
            // fire confetti + haptic per shot
            confetti({ particleCount: power, spread, origin: { y: 0.6 } });
            haptic(["light", "medium", "heavy"][step] || "medium");
        }, 1200);
        return () => clearTimeout(t);
    }, [step]);

    const handleContinue = () => {
        if (animating) return;
        setAnimating(true);
        setShowMedal(false);

        setTimeout(() => setPlaced((p) => [...p, step]), 600);

        setTimeout(() => {
            setAnimating(false);
            if (step < medals.length - 1) {
                setStep((s) => s + 1);
                setShowMedal(true);
            } else {
                setTimeout(() => setFinal(true), 600);
                setButtonsVisible(false);
                setRevealed(false);
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

    // 🎉 Финальное конфетти (каждый залп + хаптик)
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
                    haptic(["light", "medium", "heavy"][i] || "medium");
                }, i * 300);
            });
        }
    }, [final]);

    const renderEmoji = (emoji, small = false, sizeOverride, absolute = false) => (
        <div
            style={{
                width: sizeOverride || (small ? 32 : 46),
                height: sizeOverride || (small ? 32 : 46),
                ...(absolute
                    ? {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }
                    : {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }),
            }}
            dangerouslySetInnerHTML={{
                __html: twemoji.parse(emoji || "🙂", { folder: "svg", ext: ".svg" }),
            }}
        />
    );

    const safeTopOffset = Math.max(safeAreaTop, viewportHeight < 700 ? 64 : 48) + 120;

    return (
        <motion.div
            style={{
                ...overlay,
                paddingBottom: `calc(${safeAreaBottom}px + 96px)`,
            }}
        >
            {!final && (
                <div style={{ ...centerContainer, paddingTop: `${safeTopOffset}px` }}>
                    {showMedal && (
                        <motion.img
                            src={lightImg}
                            alt="light"
                            style={lightStyle}
                            animate={{ rotate: 360, opacity: 0.85 }}
                            initial={{ opacity: 0 }}
                            transition={{
                                rotate: { repeat: Infinity, duration: 60, ease: "linear" },
                                opacity: { duration: 0.2 },
                            }}
                        />
                    )}

                    <AnimatePresence mode="wait">
                        {showMedal && (
                            <motion.div
                                style={centerMedal}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{
                                    scale: 0.8,
                                    opacity: 0,
                                    transition: { duration: 0.4, ease: "easeOut" },
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <motion.img
                                    key={`medal-${step}`}
                                    src={medals[step]}
                                    alt="medal"
                                    style={medal}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.8,
                                        transition: { duration: 0.4, ease: "easeOut" },
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    decoding="async"
                                    fetchpriority="high"
                                />

                                <AnimatePresence mode="wait">
                                    {!revealed ? (
                                        <motion.img
                                            key="ask"
                                            src={winnerAskImg}
                                            alt="waiting"
                                            style={waitingEmoji}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{
                                                opacity: 0,
                                                transition: { duration: 0.3 },
                                            }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                        />
                                    ) : (
                                        <motion.div
                                            key="emoji"
                                            style={emojiWrapper}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: [0, 1.3, 1],
                                                opacity: [0, 1, 1],
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            exit={{
                                                scale: 0.8,
                                                opacity: 0,
                                                transition: {
                                                    duration: 0.4,
                                                    ease: "easeOut",
                                                },
                                            }}
                                        >
                                            {renderEmoji(currentWinner?.emoji || "🙂", false, 46, true)}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {!final && showMedal && (
                <div style={textZone}>
                    {!revealed ? (
                        <div style={placeText}>{texts[step]}</div>
                    ) : (
                        <>
                            <div style={nameText}>{currentWinner?.name}</div>
                            <div style={scoreText}>{currentWinner?.score} очков</div>
                        </>
                    )}
                </div>
            )}

            <motion.div
                layout
                style={{
                    ...awardsContainer,
                    // 👇 динамический отступ снизу:
                    paddingBottom: final
                        ? `calc(${safeAreaBottom}px + 260px)` // при финале — больше воздуха
                        : `calc(${safeAreaBottom}px + 60px)`, // в начале — меньше
                }}
                animate={
                    final
                        ? {
                            y: -Math.min(viewportHeight * 0.18, 60), // чуть меньше подъём
                            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                        }
                        : {
                            y: -10, // минимальный сдвиг вверх, чтобы визуально центрировать
                            transition: { duration: 0.8, ease: "easeOut" },
                        }
                }
            >
                <div style={growSpacer} />

                <motion.div
                    layout
                    style={{
                        ...slotContainer(final),
                        justifyContent: totalPlayers === 2 ? "center" : "space-between",
                    }}
                >
                    {ordered.map((w, i) => (
                        <motion.div key={i} style={slot(final)}>
                            {placed.includes(i) ? (
                                <motion.div
                                    key={`placed-${i}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.3, 1] }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    style={{ position: "relative" }}
                                >
                                    <img src={medals[i]} alt="m" style={slotMedal} />
                                    {renderEmoji(w.emoji, true, null, true)}
                                </motion.div>
                            ) : (
                                <img src={emptyImg} alt="empty" style={slotEmpty} />
                            )}
                            {final && (
                                <>
                                    <div style={finalName(isTelegram)}>{w.name}</div>
                                    <div style={finalScore(isTelegram)}>{w.score} очков</div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
                <AnimatePresence mode="wait">
                    {final && hasExtraPlayers && (
                        <motion.div
                            key="extra"
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 60 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            style={extraZone}
                        >
                            <div style={extraTitle(isTelegram)}>Игроки не вошедшие в топ</div>
                            <div style={extraList}>
                                {[...winners]
                                    .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))
                                    .slice(3)
                                    .map((w, i) => (
                                        <div key={i} style={extraPlayerCard}>
                                            <div style={extraEmojiBox}>
                                                {renderEmoji(w.emoji, false, 24, false)}
                                            </div>
                                            <div style={extraPlayerInfo}>
                                                <div style={extraName(isTelegram)}>{w.name}</div>
                                                <div style={extraScore(isTelegram)}>{w.score} очков</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div
                style={{
                    ...fixedButtons,
                    paddingBottom: `calc(${safeAreaBottom}px + 24px)`,
                }}
            >
                <AnimatePresence mode="wait">
                    {buttonsVisible ? (
                        <motion.div key="main-buttons" style={buttonZone}>
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
                                transition={{ duration: 0.6, delay: 0.2 }}
                                style={finalButtons}
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

/* === стили === */
const overlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100dvh", backgroundColor: "var(--surface-main)", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" };
const centerContainer = { position: "relative", width: "100%", minHeight: 260, display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.4s ease" };
// 🔧 FIX #1: добавить top/left 50% чтобы избежать моргания у левого края до применения transform
const lightStyle = { position: "absolute", width: 260, height: 260, transform: "translate(-50%, -50%)", opacity: 0.85, willChange: "transform, opacity", contain: "paint layout" };
const centerMedal = { position: "absolute", width: 200, height: 200, transform: "translate(-50%, -50%)", display: "flex", justifyContent: "center", alignItems: "center", willChange: "transform, opacity" };
const waitingEmoji = { position: "absolute", width: 46, height: 46, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
const emojiWrapper = { position: "absolute", width: 46, height: 46, transform: "translate(-50%, -50%)" };
const medal = { width: 140, height: 180 };
const textZone = { height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" };
const placeText = { fontSize: 36, fontWeight: 700, color: "white" };
const nameText = { fontSize: 32, fontWeight: 700, color: "white" };
const scoreText = { fontSize: 22, color: "var(--icotex-lowest)" };
const awardsContainer = { flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-end", overflowY: "visible", padding: "0 16px", boxSizing: "border-box", minHeight: 0 };
const growSpacer = { flex: 1 };
// 🔧 FIX #3: на финале выравниваем по верхнему краю, чтобы карточка с переносом имени не "вскакивала" одна
const slotContainer = (isFinal) => ({ display: "flex", justifyContent: "space-evenly", alignItems: isFinal ? "flex-start" : "flex-end", gap: 24, width: "100%", marginBottom: 24 });
// даём авто-высоту, но фиксируем минимальную
const slot = (isFinal) => ({ position: "relative", width: 88, minHeight: 120, height: isFinal ? "auto" : 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: isFinal ? "flex-start" : "center" });
const slotEmpty = { width: 88, height: 119, opacity: 0.9 };
const slotMedal = { width: 88, height: 119 };
const fixedButtons = { position: "fixed", left: 0, right: 0, bottom: 0, width: "100%", background: "var(--surface-main)", padding: "16px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 8, zIndex: 20 };
const buttonZone = { display: "flex", flexDirection: "column", width: "100%", alignItems: "center" };
const finalButtons = { width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 8 };
// 🔤 Шрифты для финального списка и "игроки, не вошедшие в топ": в Telegram не используем Gilroy
const finalName = (isTg) => ({ fontSize: 14, fontWeight: 700, color: "white", textAlign: "center", ...(isTg ? {} : { fontFamily: "Gilroy" }) });
const finalScore = (isTg) => ({ fontSize: 12, fontWeight: 500, color: "var(--icotex-lowest)", textAlign: "center", ...(isTg ? {} : { fontFamily: "Gilroy" }) });
const extraZone = { marginTop: 32, width: "100%", boxSizing: "border-box" };
const extraTitle = (isTg) => ({ fontSize: 24, fontWeight: 700, color: "var(--icotex-white)", textAlign: "center", ...(isTg ? {} : { fontFamily: "Gilroy" }) });
const extraList = { marginTop: 16, display: "flex", flexDirection: "column", gap: 12, width: "100%" };
const extraPlayerCard = { display: "flex", alignItems: "center", background: "var(--surface-normal-alfa)", borderRadius: 20, backdropFilter: "blur(20px)", height: 56, width: "100%", boxSizing: "border-box" };
const extraEmojiBox = { position: "relative", width: 56, height: 56, background: "var(--surface-normal-alfa)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" };
const extraPlayerInfo = { display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 12, textAlign: "left" };
const extraName = (isTg) => ({ fontSize: 16, fontWeight: 700, color: "var(--icotex-white)", ...(isTg ? {} : { fontFamily: "Gilroy" }) });
const extraScore = (isTg) => ({ marginTop: 4, fontSize: 12, fontWeight: 400, color: "var(--icotex-low)", ...(isTg ? {} : { fontFamily: "Gilroy" }) });
