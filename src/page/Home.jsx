import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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
    const headerRef = useRef(null);
    const carouselBoxRef = useRef(null);
    const buttonRef = useRef(null);
    const [yOffset, setYOffset] = useState(0);

    // ------------------------ размеры карточки и вьюпорта ------------------------
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

    // ------------------------ загрузка игр --------------------------------------
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

    // ------------------------ карусель: расчёт X --------------------------------
    const maxIndex = Math.max(0, games.length - 1);
    const clamp = (n) => Math.max(0, Math.min(maxIndex, n));
    const goTo = (i) => setActiveIndex(clamp(i));
    const step = cardWidth + GAP;

    const getXForIndex = (i) => {
        if (i === 0) return 16;
        const centerOfCard = i * step + cardWidth / 2;
        const viewportCenter = viewportWidth / 2;
        return viewportCenter - centerOfCard;
    };

    const minX = getXForIndex(maxIndex);
    const maxX = 16;

    // ------------------------ точное вертикальное центрирование -----------------
    const recomputeCentering = () => {
        if (!headerRef.current || !carouselBoxRef.current || !buttonRef.current) return;

        const headerRect = headerRef.current.getBoundingClientRect();
        const carouselRect = carouselBoxRef.current.getBoundingClientRect();
        const buttonRect = buttonRef.current.getBoundingClientRect();

        const topBoundary = headerRect.bottom;
        const bottomBoundary = buttonRect.top;
        const targetCenterY = (topBoundary + bottomBoundary) / 2;
        const carouselCenterY = carouselRect.top + carouselRect.height / 2;

        const delta = Math.round(targetCenterY - carouselCenterY);
        setYOffset(delta);
    };

    useLayoutEffect(() => {
        recomputeCentering();
        const onResize = () => recomputeCentering();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [games, viewportWidth, activeIndex]);

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
                    <img
                        key={activeIndex}
                        src={active.bg}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "auto",
                            zIndex: 0,
                        }}
                        alt="background"
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
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    paddingTop:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
                }}
            >
                {/* верхняя панель с иконкой */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        paddingRight:
                            "calc(max(var(--tg-content-safe-area-inset-right, 0px), var(--tg-safe-area-inset-right, 0px)) + 32px)",
                        marginBottom: 24,
                    }}
                >
                    <IconButton icon={SettingsIcon} />
                </div>

                {/* заголовок */}
                <div ref={headerRef} style={{ textAlign: "center", marginBottom: 0 }}>
                    <h1
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: "var(--icotex-white)",
                            marginBottom: 8,
                        }}
                    >
                        Выбор игры
                    </h1>
                    <p
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
                    </p>
                </div>

                {/* КАРУСЕЛЬ */}
                <div
                    ref={carouselBoxRef}
                    style={{
                        transform: `translateY(${yOffset}px)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                        overflow: "hidden",
                        touchAction: "pan-y",
                        marginTop: 16,
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{ display: "flex", gap: `${GAP}px`, transform: `translateX(${getXForIndex(activeIndex)}px)` }}
                    >
                        {games.map((g, i) => (
                            <div key={g.id} ref={i === 0 ? firstItemRef : undefined} style={{ flex: "0 0 auto" }}>
                                <GameCard
                                    label={g.label}
                                    title={g.title}
                                    subtitle={g.subtitle}
                                    players={g.players}
                                    categories={g.categories}
                                    riveAnimation={g.riveAnimation}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* фиксированная нижняя кнопка */}
            <div
                ref={buttonRef}
                style={{
                    position: "fixed",
                    left: 16,
                    right: 16,
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 24px)",
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
