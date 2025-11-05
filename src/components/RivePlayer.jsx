import React, { useEffect, useRef, useCallback } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RivePlayer({
                                       src,
                                       stateMachine = "State Machine 1",
                                       trigger,
                                       clickToTrigger = true,
                                       autoTrigger = false,
                                       style,
                                       width = 128,   // дефолтный размер
                                       height = 128,  // дефолтный размер
                                       background = "transparent", // можно задать фон
                                       className,
                                       ariaLabel,
                                   }) {
    const { rive, RiveComponent } = useRive({
        src,
        stateMachines: stateMachine,
        autoplay: true,
    });

    const triggerInput = useStateMachineInput(rive, stateMachine, trigger);
    const containerRef = useRef(null);

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
    const handleClick = useCallback(() => {
        if (!triggerInput) return;

        try {
            if (typeof triggerInput.value === "boolean") {
                triggerInput.value = !triggerInput.value;
            } else if (triggerInput.fire) {
                triggerInput.fire();
            }
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
        } catch (e) {
            console.warn("Ошибка при handleClick:", e);
        }
    }, [triggerInput]);

    // 🔹 Фикс размеров + clearColor для Telegram WebApp
    useEffect(() => {
        const container = containerRef.current;
        const canvas = container?.querySelector?.("canvas");
        if (canvas) {
            canvas.setAttribute("width", String(width));
            canvas.setAttribute("height", String(height));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.style.display = "block";
            canvas.style.background = background;
        }

        if (rive && rive.renderer) {
            // Прозрачный фон вместо черного
            try {
                rive.renderer.clearColor = [0, 0, 0, 0]; // RGBA → прозрачный
            } catch (e) {
                console.warn("Не удалось выставить clearColor:", e);
            }
        }
    }, [width, height, rive, background]);

    return (
        <div
            ref={containerRef}
            className={className}
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
                aria-label={ariaLabel}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    cursor: clickToTrigger ? "pointer" : "default",
                    pointerEvents: "auto",
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",
                    WebkitFocusRingColor: "transparent",
                    background, // фон canvas
                    ...style,
                }}
            />
        </div>
    );
}
