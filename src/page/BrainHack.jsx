import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import PrimaryButton from "../components/PrimaryButton";
import IconPrimaryButton from "../components/IconPrimaryButton";
import PlayerCard from "../components/PlayerCard";
import bg from "../assets/bgBrainHack.png";
import { theme } from "../theme";

function Mozgolomka() {
    const navigate = useNavigate();

    // Список игроков
    const [players, setPlayers] = useState([
        { id: 1, state: "active" }, // стартовый игрок
    ]);

    const maxPlayers = 4;

    const handleAddPlayer = () => {
        if (players.length < maxPlayers) {
            const newPlayer = {
                id: Date.now(),
                state: "active",
            };
            // Добавляем игрока перед последним элементом (до Add)
            setPlayers((prev) => {
                const newList = [...prev];
                newList.splice(prev.length, 0, newPlayer);
                return newList;
            });
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

    // Проверяем, достигнут ли лимит
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
                    left: 0,
                    width: "100%",
                    height: "auto",
                    zIndex: 0,
                    opacity: 0.6,
                }}
            />

            {/* Иконка Settings */}
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

            {/* Контент */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    paddingTop:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 110px)",
                    boxSizing: "border-box",
                }}
            >
                {/* Заголовок */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
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
                            fontWeight: 400,
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
                            fontWeight: 400,
                            color: theme.icotex.info,
                            marginTop: 4,
                        }}
                    >
                        Больше игроков и игровых карточек доступно с Премиум
                    </motion.p>
                </div>

                {/* Горизонтальная карусель игроков */}
                <div
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

                    {/* ADD / PREMIUM */}
                    {!isMaxPlayers ? (
                        <PlayerCard
                            id="add-player"
                            state="add"
                            playerNumber={players.length + 1}
                            onAdd={handleAddPlayer}
                        />
                    ) : (
                        <PlayerCard id="premium-card" state="premium" onOpenPremium={handleOpenPremium} />
                    )}
                </div>
            </div>

            {/* Кнопки снизу */}
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
