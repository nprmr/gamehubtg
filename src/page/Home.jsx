import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import GameCard from "../components/GameCard";
import PrimaryButton from "../components/PrimaryButton";
import { getGames } from "../api";

function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(300);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const GAP = 16;
    const navigate = useNavigate();
    const firstItemRef = useRef(null);

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

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getGames();
                if (alive) setGames(data);
            } catch (e) {
                if (alive) setError(e?.message || "Failed to load");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const maxIndex = Math.max(0, games.length - 1);
    const clamp = (n) => Math.max(0, Math.min(maxIndex, n));
    const goTo = (i) => setActiveIndex(clamp(i));
    const step = cardWidth + GAP;

    // первая карточка всегда стартует с 16px слева
    const getXForIndex = (i) => {
        if (i === 0) return 16;
        if (i === maxIndex) {
            const centerOfCard = i * step + cardWidth / 2;
            const viewportCenter = viewportWidth / 2;
            return viewportCenter - centerOfCard;
        }
        const centerOfCard = i * step + cardWidth / 2;
        const viewportCenter = viewportWidth / 2;
        return viewportCenter - centerOfCard;
    };

    const minX = getXForIndex(maxIndex);
    const maxX = 16;

    if (loading) {
        return (
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "var(--surface-main)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--icotex-white)",
                    fontFamily: "Gilroy, sans-serif",
                }}
            >
                Загружаем игры...
            </div>
        );
    }
    if (error) return <div style={{ color: "tomato", padding: 24 }}>Ошибка: {error}</div>;

    const active = games[activeIndex];

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "var(--surface-main)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* фон */}
            <AnimatePresence mode="wait">
                {active?.bg && (
                    <motion.img
                        key={activeIndex}
                        src={active.bg}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "auto",
                            zIndex: 0,
                        }}
                    />
                )}
            </AnimatePresence>

            {/* основной контейнер */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    // ✅ берём БОЛЬШЕЕ из content-safe и системного safe, чтобы точно уйти ниже бара TG
                    paddingTop:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 20px)",
                    boxSizing: "border-box",
                }}
            >
                {/* верхняя панель с иконкой */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        // ✅ справа тоже используем максимум
                        paddingRight:
                            "calc(max(var(--tg-content-safe-area-inset-right, 0px), var(--tg-safe-area-inset-right, 0px)) + 16px)",
                        marginBottom: 24,
                    }}
                >
                    <IconButton icon={SettingsIcon} />
                </div>

                {/* заголовок */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <motion.h1
                        layoutId="title"
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: "var(--icotex-white)",
                            marginBottom: 8,
                        }}
                    >
                        Выбор игры
                    </motion.h1>
                    <motion.p
                        layoutId="subtitle"
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 14,
                            fontWeight: 400,
                            color: "var(--icotex-low)",
                            margin: 0,
                            lineHeight: 1.4,
                        }}
                    >
                        наши игры рассчитаны <br /> на компании от 2 до 24 человек
                    </motion.p>
                </div>

                {/* свайп-карточки */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                        overflow: "hidden",
                        touchAction: "pan-y",
                        marginBottom: 24,
                    }}
                >
                    <motion.div
                        style={{ display: "flex", gap: `${GAP}px` }}
                        drag="x"
                        dragConstraints={{ left: minX, right: maxX }}
                        dragElastic={0.05}
                        dragMomentum={false}
                        animate={{ x: getXForIndex(activeIndex) }}
                        transition={{ type: "spring", stiffness: 250, damping: 35 }}
                        onDragEnd={(_, info) => {
                            const { offset, velocity } = info;
                            const dx = offset.x;
                            const vx = velocity.x;
                            const swipePower = Math.abs(dx) * 0.5 + Math.abs(vx) * 20;
                            const passed = Math.abs(dx) > step * 0.25 || swipePower > 300;
                            if (passed) {
                                if (dx < 0) goTo(activeIndex + 1);
                                else goTo(activeIndex - 1);
                            } else {
                                goTo(activeIndex);
                            }
                        }}
                    >
                        {games.map((g, i) => (
                            <div key={g.id} ref={i === 0 ? firstItemRef : undefined} style={{ flex: "0 0 auto" }}>
                                {i === 0 ? (
                                    <motion.div layoutId="gamecard" transition={{ duration: 0.6, ease: "easeInOut" }}>
                                        <GameCard
                                            label={g.label}
                                            title={g.title}
                                            subtitle={g.subtitle}
                                            players={g.players}
                                            categories={g.categories}
                                        />
                                    </motion.div>
                                ) : (
                                    <GameCard
                                        label={g.label}
                                        title={g.title}
                                        subtitle={g.subtitle}
                                        riveAnimation={g.riveAnimation}
                                    />
                                )}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* фиксированная нижняя кнопка */}
            <div
                style={{
                    position: "absolute",
                    // ✅ максимум из content-safe и системного safe, затем +24px
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 24px)",
                    left: 16,
                    right: 16,
                    zIndex: 10,
                }}
            >
                {active?.id !== "neverever" ? (
                    <PrimaryButton textColor="var(--icotex-white-alfa)" disabled withMargin>
                        Игра в разработке
                    </PrimaryButton>
                ) : (
                    <PrimaryButton textColor="var(--icotex-white)" onClick={() => navigate("/neverever")} withMargin>
                        Начать игру
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
}

export default Home;
