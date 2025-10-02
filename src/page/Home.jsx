import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import GameCard from "../components/GameCard";
import PrimaryButton from "../components/PrimaryButton";
import { getGames } from "../api";

import {
    viewport,
    viewportSafeAreaInsets,
    viewportContentSafeAreaInsets,
} from "@telegram-apps/sdk";

function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(300);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Safe Area с учётом телеграм-панелей (content safe area) + fallback
    const [safeArea, setSafeArea] = useState(() => {
        const c = viewportContentSafeAreaInsets?.() || {};
        const d = viewportSafeAreaInsets?.() || {};
        return {
            top: c.top || d.top || 16,
            bottom: c.bottom || d.bottom || 16,
            left: c.left || d.left || 0,
            right: c.right || d.right || 0,
        };
    });

    const GAP = 16;
    const navigate = useNavigate();
    const firstItemRef = useRef(null);

    // Хелпер: обновление инсетoв и размеров
    const updateSafeAreaAndSize = () => {
        const c = viewportContentSafeAreaInsets?.() || {};
        const d = viewportSafeAreaInsets?.() || {};
        setSafeArea({
            top: c.top || d.top || 16,
            bottom: c.bottom || d.bottom || 16,
            left: c.left || d.left || 0,
            right: c.right || d.right || 0,
        });

        if (firstItemRef.current) {
            const w = firstItemRef.current.getBoundingClientRect().width;
            if (w) setCardWidth(Math.round(w));
        }
        setViewportWidth(window.innerWidth);
    };

    // Монтируем viewport, биндём CSS-переменные и подписываемся на события
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                // В 3.x это важно: сначала смонтироваться
                await viewport.mount?.();
                // Привяжем CSS-переменные: --tg-viewport-height / --tg-viewport-stable-height
                viewport.bindCssVars?.();
            } catch (e) {
                // noop
            } finally {
                if (!cancelled) updateSafeAreaAndSize();
            }
        })();

        const offContent = viewport.on?.("content_safe_area_changed", updateSafeAreaAndSize);
        const offDevice = viewport.on?.("safe_area_changed", updateSafeAreaAndSize);
        const offFs = viewport.on?.("fullscreen_changed", updateSafeAreaAndSize);

        // На старых клиентов подстрахуемся событием WebApp
        window.Telegram?.WebApp?.onEvent?.("viewportChanged", updateSafeAreaAndSize);
        window.addEventListener("resize", updateSafeAreaAndSize);

        return () => {
            cancelled = true;
            offContent && offContent();
            offDevice && offDevice();
            offFs && offFs();
            window.Telegram?.WebApp?.offEvent?.("viewportChanged", updateSafeAreaAndSize);
            window.removeEventListener("resize", updateSafeAreaAndSize);
        };
    }, []);

    // (опционально) можно попытаться запросить фуллскрин при первом заходе
    // useEffect(() => {
    //   window.Telegram?.WebApp?.requestFullscreen?.();
    // }, []);

    // загрузка игр
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

    // helpers
    const maxIndex = Math.max(0, games.length - 1);
    const clamp = (n) => Math.max(0, Math.min(maxIndex, n));
    const goTo = (i) => setActiveIndex(clamp(i));
    const step = cardWidth + GAP;

    const getXForIndex = (i) => {
        const centerOfCard = i * step + cardWidth / 2;
        const viewportCenter = viewportWidth / 2;
        return viewportCenter - centerOfCard;
    };

    const minX = getXForIndex(maxIndex);
    const maxX = 16;

    // состояния загрузки
    if (loading) {
        return (
            <div
                style={{
                    width: "100vw",
                    height: "var(--tg-viewport-stable-height, 100dvh)", // ✅ корректная высота
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
    if (error)
        return (
            <div style={{ color: "tomato", padding: 24 }}>Ошибка: {error}</div>
        );

    const active = games[activeIndex];

    return (
        <div
            style={{
                width: "100vw",
                height: "var(--tg-viewport-stable-height, 100dvh)", // ✅ вместо 100vh
                backgroundColor: "var(--surface-main)",
                position: "relative",
                overflow: "hidden",
                paddingTop: safeArea.top,
                paddingBottom: safeArea.bottom,
                paddingLeft: safeArea.left,
                paddingRight: safeArea.right,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
            }}
        >
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

            {/* Кнопка настроек */}
            <div
                style={{
                    position: "absolute",
                    top: safeArea.top + 16,
                    right: safeArea.right + 16,
                    zIndex: 10,
                }}
            >
                <IconButton icon={SettingsIcon} />
            </div>

            {/* Контент */}
            <div
                style={{
                    flex: 1,
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "24px 0",
                }}
            >
                <div style={{ textAlign: "center" }}>
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

                {/* Свайп-карусель */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        touchAction: "pan-y",
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
                            const swipePower =
                                Math.abs(dx) * 0.5 + Math.abs(vx) * 20;
                            const passed =
                                Math.abs(dx) > step * 0.25 || swipePower > 300;
                            if (passed) {
                                if (dx < 0) goTo(activeIndex + 1);
                                else goTo(activeIndex - 1);
                            } else {
                                goTo(activeIndex);
                            }
                        }}
                    >
                        {games.map((g, i) => (
                            <div
                                key={g.id}
                                ref={i === 0 ? firstItemRef : undefined}
                                style={{ flex: "0 0 auto" }}
                            >
                                {i === 0 ? (
                                    <motion.div
                                        layoutId="gamecard"
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeInOut",
                                        }}
                                    >
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

                {/* Кнопка снизу */}
                <div
                    style={{
                        width: "-webkit-fill-available",
                        padding: "0 16px",
                    }}
                >
                    {active?.id !== "neverever" ? (
                        <PrimaryButton
                            textColor="var(--icotex-white-alfa)"
                            disabled
                            withMargin
                        >
                            Игра в разработке
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            textColor="var(--icotex-white)"
                            onClick={() => navigate("/neverever")}
                            withMargin
                        >
                            Начать игру
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
