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
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    // массив фонов
    const images = [bg1, bg2];

    // массив карточек
    const cards = [
        <GameCard
            key={0}
            label="1/4"
            title="Я никогда НЕ"
            subtitle="Игроки говорят «Я никогда не…», остальные отмечают, если делали это"
            players="2+"
            categories="14"
        />,
        <GameCard
            key={1}
            label="2/4"
            title="Мозголомка"
            subtitle="Читай карточку и заставь друзей гадать – правда это, выдумка или твоя фантазия!"
            riveAnimation="/rive/clock.riv"
        />,
    ];

    // следим за скроллом и вычисляем индекс карточки
    useEffect(() => {
        const handleScroll = () => {
            if (!carouselRef.current) return;
            const scrollLeft = carouselRef.current.scrollLeft;
            const cardWidth = 300 + 16; // ширина карточки + gap
            const index = Math.round(scrollLeft / cardWidth);
            setActiveIndex(index);
        };

        const ref = carouselRef.current;
        if (ref) ref.addEventListener("scroll", handleScroll);

        return () => {
            if (ref) ref.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
            {/* Фон с анимацией */}
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
                    paddingTop: "120px", // 40px от иконки
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
                    ref={carouselRef}
                    style={{
                        display: "flex",
                        gap: "16px",
                        overflowX: "auto",
                        scrollSnapType: "x mandatory",
                        padding: "0 16px",
                        width: "100%",
                        boxSizing: "border-box",
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE/Edge
                    }}
                >
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            layoutId={i === 0 ? "card" : undefined} // layoutId только у первой карточки
                            style={{
                                flex: "0 0 auto",
                                scrollSnapAlign: "center",
                            }}
                        >
                            {card}
                        </motion.div>
                    ))}
                </div>

                {/* Кнопка снизу */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {activeIndex === 1 ? (
                        <PrimaryButton textColor="var(--icotex-white-alfa)" disabled>
                            Игра в разработке
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            textColor="var(--icotex-white)"
                            onClick={() => navigate("/neverever")}
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
