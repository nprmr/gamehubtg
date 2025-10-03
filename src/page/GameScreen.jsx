import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "../components/IconButton";
import PrimaryButton from "../components/PrimaryButton";
import CategoryRive from "../components/CategoryRive";
import BottomSheet from "../components/BottomSheet";
import FaqIcon from "../icons/faq.svg?react";
import ArrowBackIcon from "../icons/arrowback.svg?react";
import NoWordsCard from "../components/NoWordsCard";
import { getQuestionsByCategories } from "../api"; // ✅ используем API слой

function GameScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const { categories } = location.state || { categories: [] };

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSheet, setShowSheet] = useState(false);

    const dir = currentIndex % 2 === 0 ? 1 : -1;

    useEffect(() => {
        if (categories.length > 0) {
            (async () => {
                try {
                    const data = await getQuestionsByCategories(categories);
                    const shuffled = [...data].sort(() => Math.random() - 0.5);
                    setQuestions(shuffled);
                } catch (err) {
                    console.error("Ошибка загрузки вопросов:", err);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            setLoading(false);
        }
    }, [categories]);

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setCurrentIndex(questions.length);
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
                Загружаем вопросы...
            </div>
        );
    }
    if (questions.length === 0)
        return <div style={centerStyle}>Нет вопросов для выбранных категорий</div>;

    if (currentIndex >= questions.length) {
        return (
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "var(--surface-main)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 16px",
                    boxSizing: "border-box",
                }}
            >
                <NoWordsCard onChangeCategory={() => navigate("/neverever")} />
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "var(--surface-main)",
                position: "relative",
                overflow: "hidden",
                padding: "0 16px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Кнопка "Назад" слева */}
            <div
                style={{
                    position: "absolute",
                    top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
                    left: "16px",
                    zIndex: 10,
                }}
            >
                <IconButton icon={ArrowBackIcon} onClick={() => setShowSheet(true)} />
            </div>

            {/* Кнопка FAQ справа */}
            <div
                style={{
                    position: "absolute",
                    top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
                    right: "16px",
                    zIndex: 10,
                }}
            >
                <IconButton icon={FaqIcon} />
            </div>


            <div
                style={{
                    paddingTop: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 110px)",
                    textAlign: "center",
                }}
            >
            <motion.h1
                    layoutId="title"
                    style={{
                        fontFamily: "Gilroy, sans-serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: "var(--icotex-white)",
                        margin: 0,
                        marginBottom: 8,
                    }}
                >
                    Я никогда не:
                </motion.h1>

                {/* Подзаголовок с категорией */}
                {/* Подзаголовок с категорией */}
                <div style={{ minHeight: 22 }}>
                    {(() => {
                        const multipleCategories = new Set(questions.map(q => q.category)).size > 1;

                        // одна категория — без анимации
                        if (!multipleCategories) {
                            return (
                                <p
                                    style={{
                                        fontFamily: "Gilroy, sans-serif",
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: "var(--icotex-low)",
                                        margin: 0,
                                    }}
                                >
                                    {currentQuestion.category}
                                </p>
                            );
                        }

                        // несколько категорий — анимируем только при смене категории
                        return (
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.p
                                    key={currentQuestion.category}            // ← ключ по категории
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -8, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    style={{
                                        fontFamily: "Gilroy, sans-serif",
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: "var(--icotex-low)",
                                        margin: 0,
                                    }}
                                >
                                    {currentQuestion.category}
                                </motion.p>
                            </AnimatePresence>
                        );
                    })()}
                </div>
            </div>

            {/* Центральная карточка */}
            <div
                style={{
                    position: "absolute",
                    top: "55%",
                    left: 16,
                    right: 16,
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 330, // фиксированная высота, как у карточки
                }}
            >
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.div
                        key={currentIndex}
                        custom={dir}
                        initial={{ x: dir * -400, rotate: dir * 12, opacity: 0 }}
                        animate={{
                            x: 0,
                            rotate: 0,
                            opacity: 1,
                            transition: { type: "spring", stiffness: 120, damping: 22 },
                        }}
                        exit={{
                            x: dir * 400,
                            rotate: dir * 14,
                            opacity: 0,
                            transition: { type: "spring", stiffness: 120, damping: 20 },
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "var(--surface-zero)",
                            borderRadius: 32,
                            padding: 24,
                            boxSizing: "border-box",
                            display: "flex",
                            alignItems: "flex-start",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "Gilroy, sans-serif",
                                fontWeight: 700,
                                fontSize: 24,
                                color: "var(--icotex-normal)",
                                lineHeight: 1.4,
                                margin: 0,
                            }}
                        >
                            {currentQuestion.text}
                        </p>

                        <div
                            style={{
                                position: "absolute",
                                right: 24,
                                bottom: 24,
                                width: 92,
                                height: 92,
                            }}
                        >
                            <CategoryRive
                                riveFile={currentQuestion.riveFile}
                                stateMachine={currentQuestion.stateMachine}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))",
                    left: 16,
                    right: 16,
                }}
            >
                <PrimaryButton textColor="var(--icotex-white)" onClick={nextQuestion}>
                    Дальше
                </PrimaryButton>
            </div>

            {/* BottomSheet */}
            <BottomSheet
                open={showSheet}
                onClose={() => setShowSheet(false)}
                onConfirm={() => navigate("/neverever", { replace: true })}
                riveFile="/rive/tv.riv"
                stateMachine="State Machine 1"
                trigger="clickTrigger"
            />
        </div>
    );
}

const centerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "var(--icotex-white)",
};

export default GameScreen;
