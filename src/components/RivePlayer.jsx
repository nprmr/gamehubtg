import React from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RivePlayer({
                                       src,
                                       stateMachine = "State Machine 1",
                                       trigger,
                                       clickToTrigger = true,
                                       style,
                                   }) {
    const { rive, RiveComponent } = useRive({
        src,
        stateMachines: stateMachine,
        autoplay: true,
    });

    const triggerInput = useStateMachineInput(rive, stateMachine, trigger);

    const handleClick = () => {
        if (triggerInput) triggerInput.fire();
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
