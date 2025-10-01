import React, { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RivePlayer({
                                       src,
                                       stateMachine = "State Machine 1",
                                       trigger,
                                       clickToTrigger = true,
                                       autoTrigger = false,
                                       style,
                                   }) {
    const { rive, RiveComponent } = useRive({
        src,
        stateMachines: stateMachine,
        autoplay: true,
    });

    const triggerInput = useStateMachineInput(rive, stateMachine, trigger);

    // 🔹 Автозапуск для bool input
    useEffect(() => {
        if (!autoTrigger) return;
        if (!triggerInput) return; // 👈 защита

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

    const handleClick = () => {
        if (!triggerInput) return; // 👈 защита

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

    return (
        <RiveComponent
            onClick={clickToTrigger ? handleClick : undefined}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                cursor: clickToTrigger ? "pointer" : "default",
                pointerEvents: "auto",
                ...style,
            }}
        />
    );
}
