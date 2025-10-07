import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../components/PrimaryButton.jsx";
import IconButton from "../components/IconButton";
import FaqIcon from "../icons/faq.svg?react";
import ArrowBackIcon from "../icons/arrowback.svg?react";
import brainplayerBG from "../assets/brainplayerBG.png";
import { theme } from "../theme.js";

export default function BrainHackGame({ onShowOnboarding }) {
    const navigate = useNavigate();
    const location = useLocation();

    const players = location.state?.players || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const currentPlayer = players[currentIndex];

    // 🎵 Вибро-паттерн “Туг–Туг … Туг”
    function hapticTugTugPauseTug() {
        const H = window.Telegram?.WebApp?.HapticFeedback;
        if (!H) return;

        const pattern = [
            { type: "medium", delay: 0 },
            { type: "medium", delay: 150 },
            { type: "heavy", delay: 600 },
        ];

        pattern.forEach(({ type, delay }) => {
            setTimeout(() => H.impactOccurred(type), delay);
        });
    }

    // 👇 Предзагрузка фона и запуск вибрации
    useEffect(() => {
        const img = new Image();
        img.src = brainplayerBG;
        img.onload = () => {
            setIsLoaded(true);
            hapticTugTugPauseTug(); // 🚀 вибрация при открытии экрана
        };
    }, []);

    if (!isLoaded) {
        // Пока фон не загружен — просто фон-заглушка
        return (
            <div
                style={{
                    backgroundColor: theme.surface.main,
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                }}
            />
        );
    }

    const backIconStyle = {
        position: "absolute",
        top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
        left: "16px",
        zIndex: 100,
    };

    const faqIconStyle = {
        position: "absolute",
        top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
        right: "16px",
        zIndex: 100,
    };

    const handleNext = () => {
        if (currentIndex < players.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            navigate("/game", { replace: true, state: { players } });
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
        else navigate(-1);
    };

    return (
        <AnimatePresence mode="sync">
            <motion.div
                key="player-turn-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(8px)",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <motion.div
                    key="player-turn-container"
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.98, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        backgroundColor: theme.surface.main,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* фон */}
                    <img
                        src={brainplayerBG}
                        alt="background"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "120%",
                            height: "auto",
                            objectFit: "cover",
                            zIndex: 0,
                            opacity: 0.8,
                            transition: "opacity 0.3s ease",
                        }}
                    />

                    {/* верхние кнопки */}
                    <div style={backIconStyle}>
                        <IconButton icon={ArrowBackIcon} onClick={handleBack} />
                    </div>
                    <div style={faqIconStyle}>
                        <IconButton icon={FaqIcon} onClick={onShowOnboarding} />
                    </div>

                    {/* контент игрока */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <motion.div
                            key={currentPlayer?.id}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ type: "spring", stiffness: 120, damping: 15 }}
                            style={{ textAlign: "center" }}
                        >
                            <div
                                style={{
                                    fontSize: 128,
                                    lineHeight: "128px",
                                    marginBottom: 32,
                                    userSelect: "none",
                                }}
                            >
                                {currentPlayer?.emojiData?.emoji || "🙂"}
                            </div>

                            <div
                                style={{
                                    fontFamily: "Gilroy, sans-serif",
                                    fontWeight: 700,
                                    fontSize: 32,
                                    color: theme.icotex.white,
                                    marginBottom: 4,
                                }}
                            >
                                {currentPlayer?.emojiData?.name || "Игрок"}
                            </div>

                            <div
                                style={{
                                    fontFamily: "Gilroy, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 18,
                                    color: theme.icotex.white,
                                    opacity: 0.9,
                                }}
                            >
                                твой ход
                            </div>
                        </motion.div>
                    </div>

                    {/* нижняя кнопка */}
                    <div
                        style={{
                            position: "absolute",
                            bottom:
                                "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 16px)",
                            left: 16,
                            right: 16,
                            zIndex: 10,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <PrimaryButton textColor={theme.icotex.white} onClick={handleNext}>
                            Начать
                        </PrimaryButton>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
