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
    const [direction, setDirection] = useState(1);

    // === Rive шаг 1 ===
    const { rive: rive1, RiveComponent: Rive1 } = useRive({
        src: "/rive/ineverever.riv",
        stateMachines: "Activation",
        autoplay: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    });
    const trigger = useStateMachineInput(rive1, "Activation", "State Machine 1");

    // === Rive шаг 2 ===
    const { rive: rive2, RiveComponent: Rive2 } = useRive({
        src: "/rive/inevereverrules.riv",
        stateMachines: "State Machine 1",
        autoplay: false,
        layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    });

    const riveVariants = {
        enter: (dir) => ({
            x: dir > 0 ? "100vw" : "-100vw",
            rotate: dir > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: { x: 0, rotate: 0, opacity: 1 },
        exit: (dir) => ({
            x: dir > 0 ? "-100vw" : "100vw",
            rotate: dir > 0 ? -20 : 20,
            opacity: 0,
        }),
    };

    const textVariants = {
        enter: { opacity: 0, y: 40 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 40 },
    };

    const handleNext = () => {
        if (step === 1) {
            setDirection(1);
            setStep(2);
        } else {
            setOnboarded();

            console.log("Onboarding finished:", { from, categories });

            if (from === "/neverever") {
                navigate("/game", { replace: true, state: { categories } });
            } else if (from === "/game") {
                navigate("/game", { replace: true, state: { categories } });
            } else {
                navigate("/neverever", { replace: true });
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setDirection(-1);
            setStep(1);
        } else {
            navigate("/", { replace: true });
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
            {/* Фон */}
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
                <AnimatePresence mode="wait" initial={false}>
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
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <motion.div
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    variants={riveVariants}
                                    custom={direction}
                                    transition={{ duration: 0.7, ease: "easeInOut" }}
                                    style={{ width: "100%", maxWidth: 256, aspectRatio: "1/1" }}
                                >
                                    <Rive1
                                        style={{ width: "100%", height: "100%" }}
                                        onClick={() => trigger?.fire()}
                                    />
                                </motion.div>
                            </div>
                            <motion.div
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={textVariants}
                                transition={{ duration: 0.5 }}
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
                                variants={riveVariants}
                                custom={direction}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                onAnimationComplete={() => rive2?.play()}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 40,
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
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={textVariants}
                                transition={{ duration: 0.6, delay: 0.2 }}
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
                                            Игрок читает фразу “Я никогда НЕ:...” <br />
                                            <br />
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
            <div
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
                <IconPrimaryButton onClick={handleBack} />
                <PrimaryButton textColor="var(--icotex-white)" onClick={handleNext}>
                    {step === 1 ? "Дальше" : "Играть"}
                </PrimaryButton>
            </div>
        </div>
    );
}

export default OnboardingScreen;
