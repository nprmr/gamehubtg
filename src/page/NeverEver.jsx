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
import { getQuestionsByCategory } from "../api"; // ✅ используем API-слой
import LockedCategorySheet from "../components/LockedCategorySheet";

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

    // 🔹 Открытие шита для заблокированной категории
    const openLockedCategory = async (cat) => {
        try {
            const data = await getQuestionsByCategory(cat.title); // ✅ теперь через API (моки/реал)
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

    // ✅ защита от undefined
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

            {/* Кнопка Settings */}
            <div
                style={{ position: "fixed", top: "16px", right: "16px", zIndex: 10 }}
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

                {/* Горизонтальная карусель */}
                <motion.div
                    initial={{ gap: "0px" }}
                    animate={{ gap: "16px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        overflowX: "auto",
                        padding: "16px 16px",
                        width: "100%",
                        boxSizing: "border-box",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {topRow.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                            initial={{ x: -10 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
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
                                    selected={selectedCategories.includes(
                                        bottomRow[i].title
                                    )}
                                    onClick={() =>
                                        bottomRow[i].locked
                                            ? openLockedCategory(bottomRow[i])
                                            : toggleCategory(bottomRow[i].title)
                                    }
                                />
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Кнопки снизу */}
                <motion.div
                    initial={{ gap: "0px" }}
                    animate={{ gap: "8px" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        padding: "0 16px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Кнопка-стрелка */}
                    <motion.div
                        initial={{ x: 40 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <IconPrimaryButton
                            onClick={() => navigate("/", { replace: true })}
                        />
                    </motion.div>

                    {/* Основная кнопка */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "calc(100% - 72px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {selectedCategories.length === 0 ? (
                            <PrimaryButton textColor="var(--icotex-white-alfa)" disabled>
                                Выберите категории
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton
                                textColor="var(--icotex-white)"
                                onClick={() =>
                                    navigate("/game", {
                                        state: { categories: selectedCategories },
                                    })
                                }
                                description={`Выбрано категорий ${selectedCategories.length}`}
                            >
                                Играть
                            </PrimaryButton>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* 👇 BottomSheet для заблокированных */}
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
