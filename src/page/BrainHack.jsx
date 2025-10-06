import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import IconPrimaryButton from "../components/IconPrimaryButton";
import PrimaryButton from "../components/PrimaryButton";
import bg from "../assets/bgBrainHack.png";
import { theme } from "../theme";

export default function Mozgolomka() {
    const navigate = useNavigate();

    const [players, setPlayers] = useState([{ id: 1, state: "active" }]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const maxPlayers = 4;

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        const handleViewport = () => {
            const diff = window.innerHeight - tg.viewportStableHeight;
            setKeyboardHeight(diff > 0 ? diff : 0);
        };

        tg.onEvent("viewportChanged", handleViewport);
        handleViewport(); // инициализация
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

    // Сдвигаем контент вверх при поднятии клавиатуры, но не ограничиваем высоту
    const contentShift = keyboardHeight > 0 ? -(keyboardHeight - 16) : 0;

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                backgroundColor: theme.surface.main,
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
                    opacity: 0.6,
                    zIndex: 0,
                }}
            />

            {/* Кнопка настроек */}
            <div
                style={{
                    position: "absolute",
                    top:
                        "calc(max(var(--tg-content-safe-area-inset-top,0px), var(--tg-safe-area-inset-top,0px)) + 48px)",
                    right:
                        "calc(max(var(--tg-content-safe-area-inset-right,0px), var(--tg-safe-area-inset-right,0px)) + 16px)",
                    zIndex: 10,
                }}
            >
                <IconButton icon={SettingsIcon} />
            </div>

            {/* Контент (двигается через transform, не обрезается!) */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    transform: `translateY(${contentShift}px)`,
                    transition: "transform 0.3s ease",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            >
                {/* Заголовки */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop:
                            "calc(max(var(--tg-content-safe-area-inset-top,0px), var(--tg-safe-area-inset-top,0px)) + 100px)",
                        marginBottom: 24,
                        pointerEvents: "auto",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: theme.icotex.white,
                            marginBottom: 8,
                        }}
                    >
                        Мозголомка
                    </h1>

                    <p
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            color: theme.icotex.low,
                            margin: 0,
                        }}
                    >
                        Можно добавить до 4 игроков
                    </p>

                    <p
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            color: theme.icotex.info,
                            marginTop: 4,
                        }}
                    >
                        Больше игроков и игровых карточек доступно с Премиум
                    </p>
                </div>

                {/* Карусель */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        overflowX: "auto",
                        gap: 8,
                        padding: "16px 24px 120px 24px", // 120px отступ, чтобы не пересекалось с кнопками
                        justifyContent: "center",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
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
                </div>
            </div>

            {/* Кнопки — фиксированы, не двигаются, клавиатура над ними */}
            <div
                style={{
                    position: "fixed",
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom,0px), var(--tg-safe-area-inset-bottom,0px)) + 16px)",
                    left: 16,
                    right: 16,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    zIndex: 100,
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
