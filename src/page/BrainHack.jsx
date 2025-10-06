import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import bg from "../assets/bgBrainHack.png";
import { theme } from "../theme";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import PrimaryButton from "../components/PrimaryButton";
import IconPrimaryButton from "../components/IconPrimaryButton";

function Mozgolomka() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([{ id: 1, state: "active" }]);
    const [keyboardShift, setKeyboardShift] = useState(0);
    const maxPlayers = 4;

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        const handleViewport = () => {
            const diff = window.innerHeight - tg.viewportStableHeight;
            // плавное ограничение, чтобы не прыгало резко
            setKeyboardShift(diff > 0 ? Math.min(diff, 300) : 0);
        };

        tg.onEvent("viewportChanged", handleViewport);
        return () => tg.offEvent("viewportChanged", handleViewport);
    }, []);

    const handleAddPlayer = () => {
        if (players.length < maxPlayers) {
            setPlayers((prev) => [...prev, { id: Date.now(), state: "active" }]);
        }
    };

    const handleOpenPremium = () => {
        window.Telegram?.WebApp?.showPopup({
            title: "Премиум",
            message:
                "Добавьте больше игроков и получите доступ к новым карточкам с премиум-аккаунтом!",
            buttons: [{ id: "ok", type: "close", text: "Ок" }],
        });
    };

    const isMaxPlayers = players.length >= maxPlayers;

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: theme.surface.main,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Фон */}
            <img
                src={bg}
                alt="background"
                style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    opacity: 0.6,
                    zIndex: 0,
                }}
            />

            {/* Кнопка настроек */}
            <div
                style={{
                    position: "absolute",
                    top:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
                    right:
                        "calc(max(var(--tg-content-safe-area-inset-right, 0px), var(--tg-safe-area-inset-right, 0px)) + 16px)",
                    zIndex: 10,
                }}
            >
                <IconButton icon={SettingsIcon} />
            </div>

            {/* Основной контент (заголовок + карусель) */}
            <motion.div
                animate={{ y: -keyboardShift * 0.5 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center", // центрирование по вертикали
                    zIndex: 1,
                    pointerEvents: "none", // чтобы фон не перехватывал клики
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 24,
                        pointerEvents: "auto",
                    }}
                >
                    <motion.h1
                        layoutId="title"
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: theme.icotex.white,
                            marginBottom: 8,
                        }}
                    >
                        Мозголомка
                    </motion.h1>

                    <motion.p
                        layoutId="subtitle"
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            color: theme.icotex.low,
                            margin: 0,
                            lineHeight: 1.4,
                        }}
                    >
                        Можно добавить до 4 игроков
                    </motion.p>

                    <motion.p
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            color: theme.icotex.info,
                            marginTop: 4,
                        }}
                    >
                        Больше игроков и игровых карточек доступно с Премиум
                    </motion.p>
                </div>

                {/* Карусель */}
                <motion.div
                    layout
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        overflowX: "auto",
                        gap: 8,
                        padding: "16px 24px",
                        width: "100%",
                        boxSizing: "border-box",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        justifyContent: "center",
                        pointerEvents: "auto",
                    }}
                >
                    {players.map((player, index) => (
                        <PlayerCard
                            key={player.id}
                            id={`player-${player.id}`}
                            state={player.state}
                            playerNumber={index + 1}
                        />
                    ))}

                    {!isMaxPlayers ? (
                        <PlayerCard
                            id="add-player"
                            state="add"
                            playerNumber={players.length + 1}
                            onAdd={handleAddPlayer}
                        />
                    ) : (
                        <PlayerCard
                            id="premium-card"
                            state="premium"
                            onOpenPremium={handleOpenPremium}
                        />
                    )}
                </motion.div>
            </motion.div>

            {/* Нижние кнопки */}
            <motion.div
                animate={{ y: -keyboardShift }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
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
                <IconPrimaryButton onClick={() => navigate("/", { replace: true })} />
                <PrimaryButton
                    textColor={theme.icotex.white}
                    onClick={() => navigate("/game", { state: { players } })}
                >
                    Играть
                </PrimaryButton>
            </motion.div>
        </div>
    );
}

export default Mozgolomka;
