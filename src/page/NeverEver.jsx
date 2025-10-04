// src/screens/NeverEver.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import IconButton from "../components/IconButton";
import SettingsIcon from "../icons/Settings.svg?react";
import CategoryCard from "../components/CategoryCard";
import PrimaryButton from "../components/PrimaryButton";
import IconPrimaryButton from "../components/IconPrimaryButton";
import bg1 from "../assets/bg1.png";
import { useCategories } from "../hooks/useCategories";
import { getQuestionsByCategory } from "../api";
import LockedCategorySheet from "../components/LockedCategorySheet";
import { hasOnboarded } from "../utils/onboarding";

function NeverEver() {
    const { categories, loading } = useCategories();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [lockedSheet, setLockedSheet] = useState({
        open: false,
        category: null,
        phrases: [],
    });
    const navigate = useNavigate();

    const toggleCategory = (title) => {
        setSelectedCategories((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const openLockedCategory = async (cat) => {
        try {
            const data = await getQuestionsByCategory(cat.title);
            setLockedSheet({
                open: true,
                category: cat,
                phrases: (Array.isArray(data) ? data : [])
                    .map((q) => q.text)
                    .slice(0, 3),
            });
        } catch (err) {
            console.error("Ошибка загрузки вопросов:", err);
            setLockedSheet({ open: true, category: cat, phrases: [] });
        }
    };

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
                Загружаем категории...
            </div>
        );
    }

    const safeCategories = Array.isArray(categories) ? categories : [];
    const half = Math.ceil(safeCategories.length / 2);
    const topRow = safeCategories.slice(0, half);
    const bottomRow = safeCategories.slice(half);

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

            {/* Иконка Settings */}
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

            {/* Контент */}
            <div
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
                {/* Заголовок */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
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
                        Я никогда НЕ
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
                        выбери одну или несколько категорий для игры
                    </motion.p>
                </div>

                {/* Горизонтальная карусель 2 ряда */}
                <div
                    style={{
                        display: "flex",
                        position: "absolute",
                        top: "55%",
                        flexDirection: "row",
                        overflowX: "auto",
                        padding: "16px 16px",
                        gap: "16px",
                        width: "100%",
                        boxSizing: "border-box",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        transform: "translateY(-50%)",
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
                                onClick={() =>
                                    cat.locked
                                        ? openLockedCategory(cat)
                                        : toggleCategory(cat.title)
                                }
                            />

                            {bottomRow[i] && (
                                <CategoryCard
                                    title={bottomRow[i].title}
                                    locked={bottomRow[i].locked}
                                    adult={bottomRow[i].adult}
                                    riveFile={bottomRow[i].riveFile}
                                    selected={selectedCategories.includes(bottomRow[i].title)}
                                    onClick={() =>
                                        bottomRow[i].locked
                                            ? openLockedCategory(bottomRow[i])
                                            : toggleCategory(bottomRow[i].title)
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Кнопки снизу */}
            <div
                style={{
                    position: "absolute",
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))",
                    left: 16,
                    right: 16,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                }}
            >
                <IconPrimaryButton onClick={() => navigate("/", { replace: true })} />
                {selectedCategories.length === 0 ? (
                    <PrimaryButton textColor="var(--icotex-white-alfa)" disabled>
                        Выберите категории
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        textColor="var(--icotex-white)"
                        onClick={() => {
                            if (hasOnboarded()) {
                                navigate("/game", {
                                    state: { categories: selectedCategories },
                                });
                            } else {
                                navigate("/onboarding", {
                                    state: { categories: selectedCategories, from: "/neverever" },
                                });
                            }
                        }}
                        description={`Выбрано категорий ${selectedCategories.length}`}
                    >
                        Играть
                    </PrimaryButton>
                )}
            </div>

            {/* BottomSheet для заблокированных */}
            <LockedCategorySheet
                open={lockedSheet.open}
                onClose={() =>
                    setLockedSheet({ open: false, category: null, phrases: [] })
                }
                categoryTitle={lockedSheet.category?.title}
                riveFile={lockedSheet.category?.riveFile}
                phrases={lockedSheet.phrases}
                price="199₽"
            />
        </div>
    );
}

export default NeverEver;
