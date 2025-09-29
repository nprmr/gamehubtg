import React, { useState } from "react";
import { motion } from "framer-motion";
import "../theme.css";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import CategoryCard from "../components/CategoryCard";

import bg1 from "../assets/bg1.png"; // фон как в Home

function NeverEver() {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const toggleCategory = (title) => {
        setSelectedCategories((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const categories = [
        { title: "Друзья и компании", riveFile: "/rive/fire.riv" },
        { title: "Детство", riveFile: "/rive/childhood.riv" },
        { title: "Семья", riveFile: "/rive/family.riv" },
        { title: "Здоровье и тело", riveFile: "/rive/heart.riv" },
        { title: "Алкогольные истории", riveFile: "/rive/alchohol.riv", locked: true, adult: true },
        { title: "Секс и интим", riveFile: "/rive/sex.riv", locked: true, adult: true },
        { title: "Фантазии и мечты", riveFile: "/rive/dream.riv", locked: true },
        { title: "Путешествия", riveFile: "/rive/travel.riv", locked: true },
        { title: "Страх и адреналин", riveFile: "/rive/fear.riv", locked: true },
        { title: "Отношения и свидания", riveFile: "/rive/date.riv", locked: true },
        { title: "Работа и учеба", riveFile: "/rive/work.riv", locked: true },
        { title: "Стыд и позор", riveFile: "/rive/shame.riv", locked: true },
        { title: "Интернет и соц. сети", riveFile: "/rive/phone.riv", locked: true },
        { title: "Игры и развлечения", riveFile: "/rive/game.riv", locked: true },
    ];

    const topRow = categories.slice(0, 7);
    const bottomRow = categories.slice(7);

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
            <img
                src={bg1}
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
                        Я никогда НЕ
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
                        выбери одну или несколько категорий для игры
                    </motion.p>
                </div>

                {/* Горизонтальная карусель 2 ряда */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        overflowX: "auto",
                        padding: "16px 16px",
                        gap: "16px",
                        width: "100%",
                        boxSizing: "border-box",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {topRow.map((cat, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <CategoryCard
                                title={cat.title}
                                locked={cat.locked}
                                adult={cat.adult}
                                riveFile={cat.riveFile}
                                selected={selectedCategories.includes(cat.title)}
                                onClick={() => !cat.locked && toggleCategory(cat.title)}
                            />
                            {bottomRow[i] && (
                                <CategoryCard
                                    title={bottomRow[i].title}
                                    locked={bottomRow[i].locked}
                                    adult={bottomRow[i].adult}
                                    riveFile={bottomRow[i].riveFile}
                                    selected={selectedCategories.includes(bottomRow[i].title)}
                                    onClick={() =>
                                        !bottomRow[i].locked &&
                                        toggleCategory(bottomRow[i].title)
                                    }
                                />
                            )}
                        </div>
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
                    <button
                        disabled={selectedCategories.length === 0}
                        style={{
                            width: "calc(100% - 32px)",
                            height: "64px",
                            margin: "0 16px 24px 16px",
                            borderRadius: "20px",
                            background: selectedCategories.length
                                ? "var(--icotex-accent)"
                                : "var(--surface-normal-alfa)",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "600",
                            border: "none",
                            cursor: selectedCategories.length ? "pointer" : "not-allowed",
                            opacity: selectedCategories.length ? 1 : 0.6,
                        }}
                    >
                        Продолжить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NeverEver;
