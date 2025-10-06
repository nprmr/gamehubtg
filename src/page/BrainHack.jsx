import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

    const [players, setPlayers] = useState([{ id: 1, state: "active", name: "Игрок 1" }]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(260);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [keyboardShift, setKeyboardShift] = useState(0);
    const [editingId, setEditingId] = useState(null);

    const firstItemRef = useRef(null);
    const lastW = useRef(viewportWidth);

    const GAP = 16;
    const maxPlayers = 4;
    const isMaxPlayers = players.length >= maxPlayers;

    const items = [
        ...players.map((p) => ({ ...p, __kind: "player" })),
        isMaxPlayers
            ? { id: "premium-card", state: "premium", __kind: "premium" }
            : { id: "add-player", state: "add", __kind: "add" },
    ];

    const handleAddPlayer = () => {
        if (players.length < maxPlayers) {
            setPlayers((prev) => [
                ...prev,
                { id: Date.now(), state: "active", name: `Игрок ${prev.length + 1}` },
            ]);
        }
    };

    const handleEditTitle = (id, newTitle) => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, name: newTitle } : p))
        );
    };

    const handleOpenPremium = () => {
        window.Telegram?.WebApp?.showPopup({
            title: "Премиум",
            message:
                "Добавьте больше игроков и получите доступ к новым карточкам с премиум-аккаунтом!",
            buttons: [{ id: "ok", type: "close", text: "Ок" }],
        });
    };

    // 📏 отслеживаем изменения размеров
    useEffect(() => {
        const measure = () => {
            if (firstItemRef.current) {
                const w = Math.round(firstItemRef.current.getBoundingClientRect().width || 0);
                if (w && w !== cardWidth) setCardWidth(w);
            }

            const w = window.innerWidth;
            if (w !== lastW.current) {
                lastW.current = w;
                setViewportWidth(w);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [cardWidth]);

    // 📱 плавное поднятие при клавиатуре
    useEffect(() => {
        if (!window.visualViewport) return;
        const handleResize = () => {
            const diff = window.innerHeight - window.visualViewport.height;
            setKeyboardShift(diff > 0 ? diff / 2 : 0);
        };
        window.visualViewport.addEventListener("resize", handleResize);
        return () => window.visualViewport.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, items.length - 1);
    const clamp = (n) => Math.max(0, Math.min(maxIndex, n));
    const step = cardWidth + GAP;

    const getXForIndex = (i) => {
        if (i === 0) return 16;
        const centerOfCard = i * step + cardWidth / 2;
        const viewportCenter = viewportWidth / 2;
        return viewportCenter - centerOfCard;
    };

    const totalWidth = items.length * cardWidth + (items.length - 1) * GAP;
    const maxX = 16;
    const minX = Math.min(16, viewportWidth - totalWidth - 16);
    const spring = { type: "spring", stiffness: 250, damping: 35 };

    const handleStartEditing = (index, id) => {
        setActiveIndex(index);
        setEditingId(id);
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
            <AnimatePresence mode="wait">
                <motion.img
                    key="bg"
                    src={bg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    alt="background"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "auto",
                        zIndex: 0,
                    }}
                />
            </AnimatePresence>

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

            {/* 📦 Всё содержимое плавно поднимается вместе */}
            <motion.div
                animate={{ y: -keyboardShift }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
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

                {/* 🎠 Карусель игроков */}
                <div
                    style={{
                        position: "absolute",
                        top: "55%",
                        left: 0,
                        right: 0,
                        transform: "translateY(-50%)",
                        display: "flex",
                        overflow: "hidden",
                    }}
                >
                    <motion.div
                        style={{
                            display: "flex",
                            gap: `${GAP}px`,
                            touchAction: "pan-x",
                            willChange: "transform",
                        }}
                        drag="x"
                        dragConstraints={{
                            left: Number.isFinite(minX) ? minX : 0,
                            right: maxX,
                        }}
                        dragElastic={0.05}
                        dragMomentum={false}
                        drag={!editingId}
                        animate={{
                            x: getXForIndex(activeIndex),
                        }}
                        transition={spring}
                    >
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                ref={index === 0 ? firstItemRef : undefined}
                                style={{ flex: "0 0 auto" }}
                            >
                                <PlayerCard
                                    id={item.id}
                                    state={item.state}
                                    isEditing={editingId === item.id}
                                    playerNumber={
                                        item.__kind === "player" ? index + 1 : players.length + 1
                                    }
                                    onAdd={
                                        item.__kind === "add"
                                            ? () => {
                                                handleAddPlayer();
                                                setTimeout(() => setActiveIndex(items.length), 0);
                                            }
                                            : undefined
                                    }
                                    onEditTitle={(newTitle) => {
                                        handleEditTitle(item.id, newTitle);
                                        setEditingId(null);
                                    }}
                                    onStartEditing={() => handleStartEditing(index, item.id)}
                                    onOpenPremium={
                                        item.__kind === "premium" ? handleOpenPremium : undefined
                                    }
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* нижние кнопки */}
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
