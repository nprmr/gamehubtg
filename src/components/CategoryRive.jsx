import React from "react";
import { useRive } from "@rive-app/react-canvas";

function CategoryRive({ riveFile }) {
    const { RiveComponent } = useRive({
        src: riveFile,
        stateMachines: ["State Machine 1"],
        autoplay: true,
    });

    if (!riveFile) return null;

    return <RiveComponent style={{ width: "100%", height: "100%" }} />;
}

export default CategoryRive;
