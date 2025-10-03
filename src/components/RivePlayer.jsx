import React, { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RivePlayer({
                                       src,
                                       stateMachine = "State Machine 1",
                                       trigger,
                                       clickToTrigger = true,
                                       autoTrigger = false,
                                       style,
                                       width = 128,   // 👈 дефолтный размер
                                       height = 128,  // 👈 дефолтный размер
                                   }) {
    const { rive, RiveComponent } = useRive({
        src,
        stateMachines: stateMachine,
        autoplay: true,
    });

    const triggerInput = useStateMachineInput(rive, stateMachine, trigger);

    // 🔹 Автозапуск для bool input
    useEffect(() => {
        if (!autoTrigger || !triggerInput) return;

        if (typeof triggerInput.value === "boolean") {
            try {
                triggerInput.value = true;
            } catch (e) {
                console.warn("Не удалось установить true:", e);
            }

            return () => {
                try {
                    if (triggerInput && typeof triggerInput.value === "boolean") {
                        triggerInput.value = false;
                    }
                } catch (e) {
                    console.warn("Не удалось сбросить:", e);
                }
            };
        }
    }, [autoTrigger, triggerInput]);

    // 🔹 Клик-триггер
    const handleClick = () => {
        if (!triggerInput) return;

        try {
            if (typeof triggerInput.value === "boolean") {
                triggerInput.value = !triggerInput.value;
            } else if (triggerInput.fire) {
                triggerInput.fire();
            }
        } catch (e) {
            console.warn("Ошибка при handleClick:", e);
        }
    };

    // 🔹 Фикс размеров для Telegram WebApp (canvas 128x19)
    useEffect(() => {
        const canvas = document.querySelector(".rive-container canvas");
        if (canvas) {
            canvas.setAttribute("width", String(width));
            canvas.setAttribute("height", String(height));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.style.display = "block";
        }
    }, [width, height]);

    return (
        <div
            style={{
                width,
                height,
                display: "block",
                userSelect: "none",
            }}
        >
            <RiveComponent
                className="rive-container"
                tabIndex={-1} // убираем фокусировку
                onClick={clickToTrigger ? handleClick : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    cursor: clickToTrigger ? "pointer" : "default",
                    pointerEvents: "auto",
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",
                    WebkitFocusRingColor: "transparent",
                    ...style,
                }}
            />
        </div>
    );
}
