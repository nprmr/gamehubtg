import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../components/PrimaryButton.jsx";
import IconPrimaryButton from "../components/IconPrimaryButton.jsx";
import brainplayerBG from "../assets/brainplayerBG.png";
import { theme } from "../theme.js";

export default function BrainHackGame() {
    const navigate = useNavigate();
    const location = useLocation();

    // 👇 Берём игроков, уже перемешанных на предыдущем экране
    const players = location.state?.players || [];

    // 👇 Индекс текущего игрока
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentPlayer = players[currentIndex];

    // === переходы ===
    const handleNext = () => {
        if (currentIndex < players.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            // все сходили — переход к игре / следующему экрану
            navigate("/game", { replace: true, state: { players } });
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
        else navigate(-1);
    };

    return (
        <AnimatePresence>
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
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
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
                        }}
                    />

                    {/* Контент игрока */}
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
                            {/* Эмоджи игрока */}
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

                            {/* Имя игрока */}
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

                            {/* подпись */}
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

                    {/* Кнопки */}
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
                            gap: 8,
                        }}
                    >
                        <IconPrimaryButton onClick={handleBack} />
                        <PrimaryButton textColor={theme.icotex.white} onClick={handleNext}>
                            {currentIndex < players.length - 1 ? "Дальше" : "Начать"}
                        </PrimaryButton>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
