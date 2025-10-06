import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import IconButton from "../components/IconButton";
import PrimaryButton from "../components/PrimaryButton";
import BottomSheet from "../components/BottomSheet";
import CategoryRive from "../components/CategoryRive";
import FaqIcon from "../icons/faq.svg?react";
import ArrowBackIcon from "../icons/arrowback.svg?react";
import { getQuestionsByCategories } from "../api";

function GameScreen({ onShowOnboarding }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { categories } = location.state || { categories: [] };

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSheet, setShowSheet] = useState(false);
    const [leavingCards, setLeavingCards] = useState([]);
    const [isCooldown, setIsCooldown] = useState(false);

    const COOLDOWN_MS = 120;
    const SWIPE_GOAL = 220;
    const THRESHOLD_OFFSET = 140;
    const THRESHOLD_VELOCITY = 500;

    const x = useMotionValue(0);
    const activeRotate = useTransform(x, [-SWIPE_GOAL, 0], [-18, 0], { clamp: true });
    const controls = useAnimation();
    const scaleNext = useTransform(x, [-SWIPE_GOAL, 0], [1, 0.94], { clamp: false });

    useEffect(() => {
        if (categories.length > 0) {
            (async () => {
                try {
                    const data = await getQuestionsByCategories(categories);
                    const withIds = data.map((q, i) => ({ id: q.id ?? i, ...q }));
                    const shuffled = [...withIds].sort(() => Math.random() - 0.5);
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

    const rotateFromX = (val) => {
        const clamped = Math.max(-SWIPE_GOAL, Math.min(0, val || 0));
        return (clamped / SWIPE_GOAL) * 18;
    };

    const screenWidth = useMemo(
        () => (typeof window !== "undefined" ? window.innerWidth : 400),
        []
    );

    const total = questions.length;
    const currentQuestion = questions[currentIndex];
    const nextQuestion = total ? questions[(currentIndex + 1) % total] : undefined;

    const spawnGhostAndAdvance = (startX = 0) => {
        if (isCooldown || !currentQuestion) return;
        setIsCooldown(true);

        setLeavingCards((prev) => [
            ...prev,
            {
                id: `${currentQuestion.id}-${Date.now()}`,
                qid: currentQuestion.id,
                text: currentQuestion.text,
                riveFile: currentQuestion.riveFile,
                stateMachine: currentQuestion.stateMachine,
                startX,
                startRotate: rotateFromX(startX),
                toX: -screenWidth - 120,
            },
        ]);

        controls.stop();
        x.set(0);
        controls.set({ x: 0, rotate: 0, scale: 1, opacity: 1 });

        setCurrentIndex((prev) => (prev + 1) % total);
        setTimeout(() => setIsCooldown(false), COOLDOWN_MS);
    };

    const onActiveDragEnd = (_e, { offset, velocity }) => {
        if (isCooldown) return;
        if (offset.x < -THRESHOLD_OFFSET || velocity.x < -THRESHOLD_VELOCITY) {
            spawnGhostAndAdvance(x.get());
        } else {
            controls.start({
                x: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                transition: { type: "spring", stiffness: 220, damping: 22 },
            });
        }
    };

    const onNextClick = () => {
        if (isCooldown) return;
        spawnGhostAndAdvance(0);
    };

    if (loading) return <div style={centerStyle}>Загружаем вопросы...</div>;
    if (!total) return <div style={centerStyle}>Нет вопросов для выбранных категорий</div>;

    return (
        <div style={wrapperStyle}>
            {/* Назад */}
            <div style={backIconStyle}>
                <IconButton icon={ArrowBackIcon} onClick={() => setShowSheet(true)} />
            </div>

            {/* FAQ → открывает онбординг как модалку */}
            <div style={faqIconStyle}>
                <IconButton icon={FaqIcon} onClick={onShowOnboarding} />
            </div>

            {/* Заголовок */}
            <div style={titleBlockStyle}>
                <h1 style={titleStyle}>Я никогда не:</h1>
                <div style={subtitleStyle}>{currentQuestion.category}</div>
            </div>

            {/* Карточки */}
            <div style={layersRootStyle}>
                {nextQuestion && (
                    <motion.div style={{ ...nextLayerStyle, scale: scaleNext }}>
                        <div style={cardBaseStyle}>
                            <p style={nextTextStyle}>{nextQuestion.text}</p>
                            <div style={riveContainerStyle}>
                                <CategoryRive
                                    riveFile={nextQuestion.riveFile}
                                    stateMachine={nextQuestion.stateMachine}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    drag="x"
                    dragElastic={1}
                    dragMomentum={false}
                    animate={controls}
                    style={{ ...activeLayerStyle, x, rotate: activeRotate }}
                    initial={false}
                    whileDrag={{ scale: 0.985, cursor: "grabbing" }}
                    onDragEnd={onActiveDragEnd}
                >
                    <div style={cardBaseStyle}>
                        <p style={activeTextStyle}>{currentQuestion.text}</p>
                        <div style={riveContainerStyle}>
                            <CategoryRive
                                riveFile={currentQuestion.riveFile}
                                stateMachine={currentQuestion.stateMachine}
                            />
                        </div>
                    </div>
                </motion.div>

                {leavingCards.map((g) => (
                    <motion.div
                        key={g.id}
                        initial={{ x: g.startX, rotate: g.startRotate, opacity: 1, scale: 1 }}
                        animate={{
                            x: g.toX,
                            rotate: -20,
                            opacity: 0,
                            scale: 0.92,
                            transition: { type: "spring", stiffness: 150, damping: 26, mass: 0.9 },
                        }}
                        onAnimationComplete={() =>
                            setLeavingCards((prev) => prev.filter((c) => c.id !== g.id))
                        }
                        style={ghostLayerStyle}
                    >
                        <div style={cardBaseStyle}>
                            <p style={activeTextStyle}>{g.text}</p>
                            <div style={riveContainerStyle}>
                                <CategoryRive
                                    riveFile={g.riveFile}
                                    stateMachine={g.stateMachine}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Кнопка */}
            <div style={buttonWrapperStyle}>
                <PrimaryButton textColor="var(--icotex-white)" onClick={onNextClick}>
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

/* ===== Стили ===== */
const wrapperStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
    position: "relative",
    overflow: "hidden",
    padding: "0 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
};

const backIconStyle = {
    position: "absolute",
    top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
    left: "16px",
    zIndex: 100,
};

const faqIconStyle = {
    position: "absolute",
    top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
    right: "16px",
    zIndex: 100,
};

const titleBlockStyle = {
    paddingTop: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 110px)",
    textAlign: "center",
};

const titleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 32,
    fontWeight: 700,
    color: "var(--icotex-white)",
    margin: 0,
    marginBottom: 8,
};

const subtitleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 14,
    color: "var(--icotex-low)",
};

const layersRootStyle = {
    position: "absolute",
    left: 16,
    right: 16,
    top: "55%",
    transform: "translateY(-50%)",
    height: 330,
    touchAction: "pan-y",
};

const nextLayerStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    isolation: "isolate",
};

const activeLayerStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    pointerEvents: "auto",
    cursor: "grab",
    willChange: "transform",
    transform: "translateZ(0)",
    isolation: "isolate",
};

const ghostLayerStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    pointerEvents: "none",
    transform: "translateZ(0)",
    isolation: "isolate",
};

const cardBaseStyle = {
    position: "absolute",
    inset: 0,
    backgroundColor: "var(--surface-zero)",
    borderRadius: 32,
    padding: 24,
    boxSizing: "border-box",
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
};

const activeTextStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: "var(--icotex-normal)",
    lineHeight: 1.4,
    margin: 0,
};

const nextTextStyle = { ...activeTextStyle, opacity: 0.9 };

const riveContainerStyle = {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 92,
    height: 92,
};

const buttonWrapperStyle = {
    position: "absolute",
    bottom: "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)))",
    left: 16,
    right: 16,
};

const centerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "var(--icotex-white)",
    fontFamily: "Gilroy, sans-serif",
};

export default GameScreen;
