import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PlayerCard from "../components/PlayerCard";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import IconPrimaryButton from "../components/IconPrimaryButton";
import PrimaryButton from "../components/PrimaryButton";
import bg from "../assets/bgBrainHack.png";
import { theme } from "../theme";

/**
 * КЛЮЧЕВАЯ ИДЕЯ:
 * - root имеет фикс. высоту равную window.innerHeight (только при mount) → кнопки не двигаются
 * - contentWindow ограничен снизу до keyboardTop (viewportStableHeight) → карусель всегда над клавиатурой
 * - карусель прижимаем к низу contentWindow с отступом 16px → нужная дистанция
 */

function Mozgolomka() {
    const navigate = useNavigate();

    // --- модель
    const [players, setPlayers] = useState([{ id: 1, state: "active" }]);
    const maxPlayers = 4;

    // --- метрики вьюпорта / клавиатуры
    const [initialHeight] = useState(() => window.innerHeight); // фиксируется один раз
    const [stableHeight, setStableHeight] = useState(() => window.innerHeight); // меняется при клавиатуре
    const keyboardHeight = Math.max(0, initialHeight - stableHeight);

    // подписка на Telegram viewport + fallback на VisualViewport
    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        const updateFromTG = () => {
            const stable = tg?.viewportStableHeight || window.innerHeight;
            setStableHeight(stable);
        };

        const updateFromVV = () => {
            // Fallback для случаев без Telegram API
            const vv = window.visualViewport;
            if (!vv) return;
            // visualViewport.height — видимая высота; keyboardHeight ≈ initial - vv.height
            const approxStable = initialHeight - Math.max(0, initialHeight - Math.round(vv.height));
            setStableHeight(approxStable);
        };

        // первичная инициализация
        updateFromTG();
        // telegram
        tg?.onEvent("viewportChanged", updateFromTG);
        // fallback
        window.visualViewport?.addEventListener("resize", updateFromVV);

        return () => {
            tg?.offEvent("viewportChanged", updateFromTG);
            window.visualViewport?.removeEventListener("resize", updateFromVV);
        };
    }, [initialHeight]);

    // коллбеки
    const handleAddPlayer = () => {
        if (players.length >= maxPlayers) return;
        setPlayers((prev) => [...prev, { id: Date.now(), state: "active" }]);
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

    // CSS-переменные для безопасных отступов Telegram
    const SAFE_TOP =
        "max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px))";
    const SAFE_RIGHT =
        "max(var(--tg-content-safe-area-inset-right, 0px), var(--tg-safe-area-inset-right, 0px))";
    const SAFE_BOTTOM =
        "max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))";
    const SAFE_LEFT =
        "max(var(--tg-content-safe-area-inset-left, 0px), var(--tg-safe-area-inset-left, 0px))";

    // Высота окна контента (не двигаем root!), его нижняя грань — над клавиатурой:
    // contentBottomOffset = safe-bottom + keyboardHeight
    const contentBottomCss = `calc(${SAFE_BOTTOM} + ${keyboardHeight}px)`;

    return (
        <div
            // ROOT: фиксированная высота = высота экрана при монтировании (не меняется)
            style={{
                position: "relative",
                width: "100vw",
                height: `${initialHeight}px`,
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
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.6,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            {/* Кнопка настроек (фиксировано относительно root, НЕ двигается) */}
            <div
                style={{
                    position: "absolute",
                    top: `calc(${SAFE_TOP} + 48px)`,
                    right: `calc(${SAFE_RIGHT} + 16px)`,
                    zIndex: 3,
                }}
            >
                <IconButton icon={SettingsIcon} />
            </div>

            {/* CONTENT WINDOW: окно видимого контента.
          Верх — ниже safe-top, низ — над клавиатурой (safe-bottom + keyboardHeight).
          Здесь НЕТ трансформов — только геометрия → нет «скачков».
      */}
            <div
                style={{
                    position: "absolute",
                    top: `calc(${SAFE_TOP} + 110px)`,
                    left: `calc(${SAFE_LEFT})`,
                    right: `calc(${SAFE_RIGHT})`,
                    bottom: contentBottomCss,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    // не даём содержимому вылезать: нижняя грань — ровно поверхность над клавиатурой
                    overflow: "hidden",
                    zIndex: 1,
                }}
            >
                {/* Заголовки — прижаты к верху content-window */}
                <div style={{ textAlign: "center", padding: "0 16px" }}>
                    <h1
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: theme.icotex.white,
                            margin: "0 0 8px 0",
                        }}
                    >
                        Мозголомка
                    </h1>
                    <p
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
                    </p>
                    <p
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            fontWeight: 400,
                            color: theme.icotex.info,
                            margin: "4px 0 0 0",
                        }}
                    >
                        Больше игроков и игровых карточек доступно с Премиум
                    </p>
                </div>

                {/* КАРУСЕЛЬ-БЛОК — прижат к НИЗУ окна контента (над клавиатурой) */}
                <div
                    style={{
                        marginTop: "auto", // ключ: толкаем карусель к низу видимого окна
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "16px 24px",
                        // отступ 16px от нижней грани окна контента ⇒ будет 16px над клавиатурой
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 8,
                            overflowX: "auto",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            justifyContent: "center",
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
            </div>

            {/* НИЖНИЕ КНОПКИ — ВНЕ контентного окна, НЕ ДВИГАЮТСЯ.
          Привязаны к root (initialHeight), клавиатура их ПЕРЕКРЫВАЕТ.
      */}
            <div
                style={{
                    position: "absolute",
                    left: `calc(${SAFE_LEFT} + 16px)`,
                    right: `calc(${SAFE_RIGHT} + 16px)`,
                    bottom: `calc(${SAFE_BOTTOM} + 16px)`,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    zIndex: 2, // выше контента, но клавиатура всё равно поверх
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
