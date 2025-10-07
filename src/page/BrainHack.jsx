import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import PrimaryButton from "../components/PrimaryButton";
import IconPrimaryButton from "../components/IconPrimaryButton";
import PlayerCard from "../components/PlayerCard";
import bg from "../assets/bgBrainHack.png";
import { theme } from "../theme";

function Mozgolomka() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([{ id: 1, state: "active" }]);
    const [cardWidth, setCardWidth] = useState(260);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [activeIndex, setActiveIndex] = useState(0);
    const firstItemRef = useRef(null);

    const GAP = 16;
    const maxPlayers = 4;

    // === motion value для плавного скролла ===
    const x = useMotionValue(16);

    // измеряем ширину карточки
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

    const handleAddPlayer = () => {
        if (players.length < maxPlayers) {
            const newPlayer = { id: Date.now(), state: "active" };
            setPlayers((prev) => [...prev, newPlayer]);
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

    const step = cardWidth + GAP;

    // расчёт позиции (первая карточка слева)
    const getXForIndex = (i) => -(i * step) + 16;

    const totalWidth = players.length * step;
    const minX = Math.min(0, viewportWidth - totalWidth - 32);
    const maxX = 32;

    // плавное смещение при смене activeIndex
    useEffect(() => {
        const controls = animate(x, getXForIndex(activeIndex), {
            type: "spring",
            stiffness: 250,
            damping: 35,
        });
        return controls.stop;
    }, [activeIndex, cardWidth, viewportWidth]);

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
                            x,
                            cursor: "grab",
                        }}
                        drag="x"
                        dragConstraints={{ left: minX, right: maxX }}
                        dragElastic={0.15}
                        dragMomentum={false}
                        onDragEnd={(_, info) => {
                            const dx = info.offset.x;
                            const vx = info.velocity.x;
                            const swipePower = Math.abs(dx) * 0.5 + Math.abs(vx) * 20;
                            const passed = Math.abs(dx) > step * 0.25 || swipePower > 300;

                            if (passed) {
                                if (dx < 0)
                                    setActiveIndex((prev) =>
                                        Math.min(prev + 1, players.length - 1)
                                    );
                                else
                                    setActiveIndex((prev) =>
                                        Math.max(prev - 1, 0)
                                    );
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
                                    id={`player-${player.id}`}
                                    state={player.state}
                                    playerNumber={i + 1}
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
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 16px)",
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
