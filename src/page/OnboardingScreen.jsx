import React from "react";
import { useNavigate } from "react-router-dom";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import PrimaryButton from "../components/PrimaryButton.jsx";
import IconPrimaryButton from "../components/IconPrimaryButton.jsx";
import OnboardingStep from "../components/OnboardingStep.jsx";

function OnboardingScreen() {
    const navigate = useNavigate();

    const finish = () => {
        const tg = window.Telegram.WebApp;
        const userId = tg?.initDataUnsafe?.user?.id;
        localStorage.setItem(`onboarded_${userId}`, "true");
        navigate("/game", { replace: true });
    };

    // === Rive ===
    const { rive, RiveComponent } = useRive({
        src: "/rive/ineverever.riv",   // путь до файла
        stateMachines: "State Machine 1",   // имя state machine в .riv
        autoplay: true,                // автозапуск
    });

    // триггер (например, State Machine Input = Trigger)
    const trigger = useStateMachineInput(rive, "State Machine 1", "Activation");

    const fireTrigger = () => {
        if (trigger) {
            trigger.fire();
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("soft");
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
            }}
        >
            {/* Фон */}
            <img
                src="src/assets/onboardingBG.png"
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    paddingTop:
                        "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
                    paddingBottom:
                        "calc(max(var(--tg-content-safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px)) + 88px)",
                }}
            >
                {/* Центральный контейнер для Rive */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        minHeight: 0,
                    }}
                >
                    <div
                        style={{
                            width: 256,
                            height: 256,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <RiveComponent
                            style={{ width: "100%", height: "100%" }}
                            onClick={fireTrigger}
                        />
                    </div>
                </div>

                {/* Текстовый блок */}
                <div style={{ textAlign: "center", marginBottom: 20, paddingLeft: 16, paddingRight: 16 }}>
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
                </div>
            </div>

            {/* Кнопки снизу */}
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
                <IconPrimaryButton onClick={() => navigate("/", { replace: true })} />
                <PrimaryButton textColor="var(--icotex-white)" onClick={finish}>
                    Дальше
                </PrimaryButton>
            </div>
        </div>
    );
}

export default OnboardingScreen;
