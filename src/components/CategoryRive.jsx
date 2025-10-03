import React, { useEffect, useRef } from "react";
import { Rive } from "@rive-app/canvas";

function CategoryRive({ riveFile, stateMachine = "State Machine 1" }) {
    const canvasRef = useRef(null);
    const riveRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !riveFile) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Подгоняем внутренние размеры canvas под CSS-размер
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;

        if (riveRef.current) {
            riveRef.current.cleanup();
            riveRef.current = null;
        }

        riveRef.current = new Rive({
            src: riveFile,
            canvas,
            stateMachines: stateMachine ? [stateMachine] : [],
            autoplay: true,
            fit: "contain", // или "cover", если нужно обрезать
            onLoad: () => {
                if (stateMachine) {
                    riveRef.current?.play(stateMachine);
                }
            },
        });

        return () => {
            riveRef.current?.cleanup();
            riveRef.current = null;
        };
    }, [riveFile, stateMachine]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",     // CSS-ширина
                height: "100%",    // CSS-высота
                display: "block",
            }}
        />
    );
}

export default CategoryRive;
