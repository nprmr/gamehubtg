import React, { useEffect, useRef } from "react";
import { Rive } from "@rive-app/canvas";

function CategoryRive({ riveFile, stateMachine = "State Machine 1" }) {
    const canvasRef = useRef(null);
    const riveRef = useRef(null);
    const roRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !riveFile) return;

        const applyCanvasSize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const desiredW = Math.max(1, Math.floor(rect.width * dpr));
            const desiredH = Math.max(1, Math.floor(rect.height * dpr));
            if (canvas.width !== desiredW) canvas.width = desiredW;
            if (canvas.height !== desiredH) canvas.height = desiredH;
            try {
                riveRef.current?.resizeDrawingSurfaceToCanvas?.();
            } catch (_) {}
        };

        // cleanup previous rive instance
        if (riveRef.current) {
            try { riveRef.current.cleanup(); } catch (_) {}
            riveRef.current = null;
        }

        // init rive
        const r = new Rive({
            src: riveFile,
            canvas,
            stateMachines: stateMachine ? [stateMachine] : [],
            autoplay: true,
            fit: "contain",
            onLoad: () => {
                applyCanvasSize();
                try {
                    if (r.renderer) r.renderer.clearColor = [0, 0, 0, 0];
                } catch (_) {}
                if (stateMachine) {
                    r.play(stateMachine);
                }
            },
        });
        riveRef.current = r;

        // observe size changes
        try {
            roRef.current = new ResizeObserver(() => applyCanvasSize());
            roRef.current.observe(canvas);
        } catch (_) {
            // fallback: resize on window events
            window.addEventListener("resize", applyCanvasSize);
        }

        // react to DPR changes by listening to resize as well
        window.addEventListener("orientationchange", applyCanvasSize);

        return () => {
            try { roRef.current?.disconnect?.(); } catch (_) {}
            window.removeEventListener("resize", applyCanvasSize);
            window.removeEventListener("orientationchange", applyCanvasSize);
            try { riveRef.current?.cleanup(); } catch (_) {}
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
                background: "transparent",
                touchAction: "none",
            }}
        />
    );
}

export default CategoryRive;
