// screens/OnboardingScreen.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    useRive,
    useStateMachineInput,
    Layout,
    Fit,
    Alignment,
} from "@rive-app/react-canvas";
import PrimaryButton from "../components/PrimaryButton.jsx";
import IconPrimaryButton from "../components/IconPrimaryButton.jsx";
import OnboardingStep from "../components/OnboardingStep.jsx";
import onboardingBG from "../assets/onboardingBG.png";
import { setOnboarded } from "../utils/onboarding";

function OnboardingScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories = [], from } = location.state || {};

    const [step, setStep] = useState(1);

    // === Rive шаг 1 ===
    const { rive: rive1, RiveComponent: Rive1 } = useRive({
        src: "/rive/ineverever.riv",
        stateMachines: "State Machine 1",
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });
    const trigger = useStateMachineInput(rive1, "State Machine 1", "Activation");

    // === Rive шаг 2 ===
    const { rive: rive2, RiveComponent: Rive2 } = useRive({
        src: "/rive/inevereverrules.riv",
        stateMachines: "State Machine 1",
        autoplay: false,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    // === Варианты анимаций ===
    const rive1Variants = {
        hidden: { x: "-100vw", rotate: -90, opacity: 0, scale: 0.8 },
        visible: {
            x: 0,
            rotate: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 15 },
        },
        exit: {
            x: "-100vw",
            rotate: -60,
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
    };

    const rive2Variants = {
        enter: { x: "100vw", opacity: 0, scale: 0.95 },
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 15 },
        },
        exit: {
            x: "100vw",
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
    };

    // Заголовок + блок шага — bounce-появление, без сдвига при выходе
    const textVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: 0.3,
                type: "spring",
                bounce: 0.6,
                stiffness: 120,
                damping: 10,
            },
        },
        exit: { opacity: 0, transition: { duration: 0.2 } }, // не двигаем внешний контейнер
    };

    const buttonsVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.6, duration: 0.4, ease: "easeOut" },
        },
    };

    // === Обработчики ===
    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else {
            setOnboarded();
            if (from === "/neverever" || from === "/game") {
                navigate("/game", { replace: true, state: { categories } });
            } else {
                navigate("/neverever", { replace: true });
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigate("/", { replace: true });
        }
    };

    // Хаптик (soft) при клике по первой Rive
    const handleSoftHaptic = () => {
        if (window?.Telegram?.WebApp?.HapticFeedback) {
            try {
                window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
            } catch (e) {
                console.warn("Haptic feedback failed:", e);
            }
        }
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "var(--surface-main)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Фон без анимации */}
            <img
                src={onboardingBG}
                alt="background"
                style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "120%",
                    height: "auto",
                    objectFit: "cover",
                    objectPosition: "top center",
                    zIndex: 0,
                }}
            />

            {/* Контент */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    boxSizing: "border-box",
                    paddingTop:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
                    paddingBottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 88px)",
                }}
            >
                {/* ВАЖНО: убрали initial={false}, чтобы была анимация при первом монтировании */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <motion.div
                                variants={rive1Variants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    willChange: "transform, opacity",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        maxWidth: 256,
                                        aspectRatio: "1/1",
                                    }}
                                >
                                    <Rive1
                                        style={{ width: "100%", height: "100%" }}
                                        onClick={() => {
                                            handleSoftHaptic();
                                            trigger?.fire();
                                        }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                key="text1"
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{
                                    marginBottom: 20,
                                    padding: "0 16px",
                                    textAlign: "center",
                                }}
                            >
                                <h1
                                    style={{
                                        fontFamily: "Gilroy, sans-serif",
                                        fontSize: 24,
                                        fontWeight: 700,
                                        color: "var(--icotex-white)",
                                        margin: 0,
                                        marginBottom: 20,
                                    }}
                                >
                                    Добро пожаловать <br /> в Я никогда НЕ:
                                </h1>
                                <OnboardingStep
                                    number={1}
                                    title="Цель игры"
                                    subtitle="Веселиться и узнавать друг друга. Здесь нет победы или проигрыша!"
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <motion.div
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={rive2Variants}
                                onAnimationComplete={() => rive2?.play()}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 40,
                                    willChange: "transform, opacity",
                                }}
                            >
                                <div
                                    style={{
                                        width: "clamp(240px, 95%, 600px)",
                                        aspectRatio: "1/1",
                                    }}
                                >
                                    <Rive2 style={{ width: "100%", height: "100%" }} />
                                </div>
                            </motion.div>

                            <motion.div
                                key="text2"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={textVariants}
                                style={{
                                    marginBottom: 20,
                                    padding: "0 16px",
                                    textAlign: "center",
                                }}
                            >
                                <OnboardingStep
                                    number={2}
                                    title="Ход игры"
                                    subtitle={
                                        <>
                                            Игрок читает фразу “Я никогда НЕ:...” <br /> <br />
                                            Кто это делал – реагирует (пьет, поднимает руку или
                                            выполняет любое другое действие)
                                        </>
                                    }
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Кнопки */}
            <motion.div
                variants={buttonsVariants}
                initial="hidden"
                animate="visible"
                style={{
                    position: "absolute",
                    bottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)))",
                    left: 16,
                    right: 16,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                }}
            >
                <IconPrimaryButton
                    onClick={handleBack}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                />
                <PrimaryButton textColor="var(--icotex-white)" onClick={handleNext}>
                    {step === 1 ? "Дальше" : "Играть"}
                </PrimaryButton>
            </motion.div>
        </div>
    );
}

export default OnboardingScreen;
