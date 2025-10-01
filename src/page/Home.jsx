import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import GameCard from "../components/GameCard";
import PrimaryButton from "../components/PrimaryButton";

import bg1 from "../assets/bg1.png";
import bg2 from "../assets/bg2.png";

function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(300);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const GAP = 16;
    const navigate = useNavigate();

    const firstItemRef = useRef(null);

    const images = [bg1, bg2];

    const cards = [
        <motion.div
            key={0}
            layoutId="gamecard"
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <GameCard
                label="1/4"
                title="Я никогда НЕ"
                subtitle="Игроки говорят «Я никогда не…», остальные отмечают, если делали это"
                players="2+"
                categories="14"
            />
        </motion.div>,
        <GameCard
            key={1}
            label="2/4"
            title="Мозголомка"
            subtitle="Читай карточку и заставь друзей гадать – правда это, выдумка или твоя фантазия!"
            riveAnimation="/rive/clock.riv"
        />,
    ];

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

    const maxIndex = cards.length - 1;
    const clamp = (n) => Math.max(0, Math.min(maxIndex, n));
    const goTo = (i) => setActiveIndex(clamp(i));

    const step = cardWidth + GAP;

    // вычисляем X так, чтобы крайние карточки имели разное поведение
    const getXForIndex = (i) => {
        if (i === 0) {
            // первая карточка: фиксированный отступ 16px
            return 16;
        }
        if (i === maxIndex) {
            // последняя карточка: центрируем
            const centerOfCard = i * step + cardWidth / 2;
            const viewportCenter = viewportWidth / 2;
            return viewportCenter - centerOfCard;
        }
        // промежуточные: центрируем
        const centerOfCard = i * step + cardWidth / 2;
        const viewportCenter = viewportWidth / 2;
        return viewportCenter - centerOfCard;
    };

    // ограничения: первая = 16px слева, последняя = центр
    const minX = getXForIndex(maxIndex);
    const maxX = 16;

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
            {/* Фон */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={activeIndex}
                    src={images[activeIndex]}
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
            </AnimatePresence>

            {/* Кнопка Settings */}
            <div
                style={{
                    position: "fixed",
                    top: "16px",
                    right: "16px",
                    zIndex: 10,
                }}
            >
                <IconButton icon={SettingsIcon} />
            </div>

            {/* VStack */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    paddingTop: "120px",
                    paddingBottom: "24px",
                    boxSizing: "border-box",
                }}
            >
                {/* Заголовок */}
                <div style={{ textAlign: "center" }}>
                    <motion.h1
                        layoutId="title"
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "var(--icotex-white)",
                            marginBottom: "8px",
                        }}
                    >
                        Выбор игры
                    </motion.h1>
                    <motion.p
                        layoutId="subtitle"
                        style={{
                            fontFamily: "Gilroy, sans-serif",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--icotex-low)",
                            margin: 0,
                            lineHeight: "1.4",
                        }}
                    >
                        наши игры рассчитаны <br /> на компании от 2 до 24 человек
                    </motion.p>
                </div>

                {/* Карусель */}
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
                        style={{
                            display: "flex",
                            gap: `${GAP}px`,
                        }}
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
                        {cards.map((card, i) => (
                            <div
                                key={i}
                                ref={i === 0 ? firstItemRef : undefined}
                                style={{
                                    flex: "0 0 auto",
                                }}
                            >
                                {card}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Кнопка снизу */}
                <div style={{ width: "-webkit-fill-available", padding: "0 16px" }}>
                    {activeIndex === 1 ? (
                        <PrimaryButton textColor="var(--icotex-white-alfa)" disabled withMargin>
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
