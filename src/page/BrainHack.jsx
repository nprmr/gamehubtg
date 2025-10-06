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
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const maxPlayers = 4;

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        const handleViewport = () => {
            const diff = window.innerHeight - tg.viewportStableHeight;
            setKeyboardHeight(diff > 0 ? diff : 0);
            setViewportHeight(tg.viewportStableHeight);
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

    // Контент поднимается, чтобы нижний край был в 12–16px над клавиатурой
    const contentShift =
        keyboardHeight > 0 ? keyboardHeight - 16 : 0;

    return (
        <div
            style={{
                width: "100vw",
                height: `${viewportHeight}px`, // контент адаптируется к уменьшенному viewport
                backgroundColor: theme.surface.main,
                position: "relative",
                overflow: "hidden",
                transition: "height 0.25s ease",
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

            {/* Контент (двигается только он) */}
            <motion.div
                animate={{ y: -contentShift }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24, pointerEvents: "auto" }}>
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

            {/* Нижние кнопки — зафиксированы по window.innerHeight, не двигаются */}
            <div
                style={{
                    position: "fixed",
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 16px)",
                    left: 16,
                    right: 16,
                    zIndex: 20,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    pointerEvents: "auto",
                }}
            >
                <IconPrimaryButton onClick={() => navigate("/", { replace: true })} />
                <PrimaryButton
                    textColor={theme.icotex.white}
                    onClick={() => navigate("/game", { state: { players } })}
                >
                    Играть
                </PrimaryButton>
            </div>
        </div>
    );
}

export default Mozgolomka;
