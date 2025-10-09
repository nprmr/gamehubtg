import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ без AnimatePresence
import { useNavigate } from "react-router-dom";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import PrimaryButton from "../components/PrimaryButton";
import IconPrimaryButton from "../components/IconPrimaryButton";
import PlayerCard from "../components/PlayerCard";
import bg from "../assets/bgBrainHack.png";
import { emojiMap } from "../data/emojiMap";
import { theme } from "../theme";

function BrainHack() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([
        {
            id: 1,
            state: "active",
            emojiData: emojiMap[Math.floor(Math.random() * emojiMap.length)],
        },
        {
            id: 2,
            state: "active",
            emojiData: emojiMap[Math.floor(Math.random() * emojiMap.length)],
        },
    ]);

    const [cardWidth, setCardWidth] = useState(260);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [activeIndex, setActiveIndex] = useState(0);
    const firstItemRef = useRef(null);

    const GAP = 16;
    const SIDE_PADDING = 16;
    const maxPlayers = 5;

    useEffect(() => {
        const measure = () => {
            if (firstItemRef.current) {
                const w = firstItemRef.current.getBoundingClientRect().width;
                if (w) setCardWidth(Math.round(w));
            }
            setViewportWidth(window.innerWidth);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // ✅ Добавление игрока
    const handleAddPlayer = () => {
        if (players.length < maxPlayers) {
            const usedEmojis = players.map((p) => p.emojiData?.emoji);
            const availableEmojis = emojiMap.filter(
                (e) => !usedEmojis.includes(e.emoji)
            );
            const pool = availableEmojis.length > 0 ? availableEmojis : emojiMap;
            const newEmoji = pool[Math.floor(Math.random() * pool.length)];

            const newPlayer = {
                id: Date.now(),
                state: "active",
                emojiData: newEmoji,
            };

            setPlayers((prev) => {
                const updated = [...prev, newPlayer];
                setTimeout(() => setActiveIndex(updated.length - 1), 50);
                return updated;
            });
        }
    };

    const handleUpdatePlayer = (id, updatedData) => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
        );
    };

    // 🗑️ Удаление игрока (с защитой)
    const handleRemovePlayer = (id) => {
        setPlayers((prev) => {
            const idx = prev.findIndex((p) => p.id === id);

            // ❌ нельзя удалять первых двух
            if (idx > -1 && idx < 2) {
                window.Telegram?.WebApp?.showPopup?.({
                    title: "Нельзя удалить",
                    message: "Первые два игрока удалить нельзя.",
                    buttons: [{ id: "ok", type: "close", text: "Ок" }],
                });
                return prev;
            }

            const updated = prev.filter((p) => p.id !== id);
            const newIndex = Math.max(0, Math.min(activeIndex, updated.length - 1));
            setTimeout(() => setActiveIndex(newIndex), 50);
            return updated;
        });
    };

    const handleOpenPremium = () => {
        window.Telegram?.WebApp?.showPopup({
            title: "Премиум",
            message:
                "Добавьте больше игроков и получите доступ к новым карточкам с премиум-аккаунтом!",
            buttons: [{ id: "ok", type: "close", text: "Ок" }],
        });
    };

    // ✅ убрали лишний haptic — он уже внутри PrimaryButton
    const handlePlay = () => {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        navigate("/brainhackgame", { state: { players: shuffled } });
    };

    const isMaxPlayers = players.length >= maxPlayers;

    const step = cardWidth + GAP;
    const totalCards = players.length + 1;
    const totalWidth =
        totalCards * cardWidth + (totalCards - 1) * GAP + SIDE_PADDING * 2;

    const minX = Math.min(0, viewportWidth - totalWidth + SIDE_PADDING);
    const maxX = SIDE_PADDING;

    const getXForIndex = (i) => {
        const base = -(i * step) + SIDE_PADDING;
        const lastIndex = totalCards - 1;
        const maxScroll = viewportWidth - totalWidth + SIDE_PADDING;
        if (i === lastIndex && base < maxScroll) return maxScroll;
        return base;
    };

    const goTo = (i) => {
        const clamped = Math.max(0, Math.min(i, totalCards - 1));
        setActiveIndex(clamped);
    };

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
            {/* фон */}
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

            {/* кнопка настроек */}
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

            {/* контент */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    paddingTop:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 110px)",
                }}
            >
                {/* заголовки */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <h1
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: theme.icotex.white,
                            marginBottom: 8,
                            marginLeft: 16,
                            marginRight: 16,
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
                            lineHeight: 1.4,
                            marginLeft: 16,
                            marginRight: 16,
                        }}
                    >
                        Можно добавить до 5 игроков
                    </p>

                    <p
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            color: theme.icotex.info,
                            marginTop: 4,
                            marginLeft: 16,
                            marginRight: 16,
                            width: "-webkit-fit-content",
                        }}
                    >
                        Больше игроков и игровых карточек доступно с Премиум
                    </p>
                </div>

                {/* === Карусель === */}
                <div
                    style={{
                        position: "absolute",
                        top: "55%",
                        left: 0,
                        right: 0,
                        transform: "translateY(-50%)",
                        display: "flex",
                        overflow: "hidden",
                        touchAction: "pan-y",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            gap: `${GAP}px`,
                            cursor: "grab",
                            paddingRight: SIDE_PADDING,
                        }}
                        drag="x"
                        dragConstraints={{ left: minX, right: maxX }}
                        dragElastic={0.08}
                        dragMomentum={false}
                        animate={{ x: getXForIndex(activeIndex) }}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                        onDragEnd={(_, info) => {
                            const { offset, velocity } = info;
                            const dx = offset.x;
                            const vx = velocity.x;
                            const swipePower = Math.abs(dx) * 0.4 + Math.abs(vx) * 20;
                            const threshold = step * 0.25;

                            if (Math.abs(dx) > threshold || swipePower > 300) {
                                if (dx < 0) goTo(activeIndex + 1);
                                else goTo(activeIndex - 1);
                            } else {
                                goTo(activeIndex);
                            }
                        }}
                    >
                        {players.map((player, i) => (
                            <div
                                key={player.id}
                                ref={i === 0 ? firstItemRef : undefined}
                                style={{ flex: "0 0 auto" }}
                            >
                                <PlayerCard
                                    id={player.id}
                                    state={player.state}
                                    playerNumber={i + 1}
                                    emojiData={player.emojiData}
                                    onUpdate={(data) => handleUpdatePlayer(player.id, data)}
                                    onRemove={() => handleRemovePlayer(player.id)}
                                    canRemove={i >= 2}
                                />
                            </div>
                        ))}

                        {!isMaxPlayers ? (
                            <div style={{ flex: "0 0 auto" }}>
                                <PlayerCard
                                    id="add-player"
                                    state="add"
                                    playerNumber={players.length + 1}
                                    onAdd={handleAddPlayer}
                                />
                            </div>
                        ) : (
                            <div style={{ flex: "0 0 auto" }}>
                                <PlayerCard
                                    id="premium-card"
                                    state="premium"
                                    onOpenPremium={handleOpenPremium}
                                />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* нижние кнопки */}
            <div
                style={{
                    position: "fixed",
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)))",
                    left: 16,
                    right: 16,
                    zIndex: 100,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    pointerEvents: "auto",
                }}
            >
                <IconPrimaryButton onClick={() => navigate("/", { replace: true })} />
                <PrimaryButton textColor={theme.icotex.white} onClick={handlePlay}>
                    Играть
                </PrimaryButton>
            </div>
        </div>
    );
}

export default BrainHack;
