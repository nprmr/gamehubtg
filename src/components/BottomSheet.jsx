import React, { useEffect, useRef } from "react";
import {
    motion,
    AnimatePresence,
    useDragControls,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";
import { Rive } from "@rive-app/canvas";
import FlatButton from "./FlatButton";
import SecondaryButton from "./SecondaryButton";

export default function BottomSheet({
                                        open,
                                        onClose,
                                        onConfirm,
                                        riveFile = "/rive/tv.riv",
                                        stateMachine = "State Machine 1",
                                        trigger = "clickActivation",
                                        size = 128,
                                    }) {
    const controls = useDragControls();
    const canvasRef = useRef(null);
    const riveRef = useRef(null);
    const triggerInputRef = useRef(null);

    const y = useMotionValue(0);
    const overlayOpacity = useTransform(y, [0, 300], [0.5, 0]);

    const handleDragEnd = (_e, info) => {
        const draggedDownEnough = info.offset.y > 120 || info.velocity.y > 600;
        if (draggedDownEnough) {
            animate(y, window.innerHeight, {
                type: "spring",
                stiffness: 200,
                damping: 30,
                onComplete: onClose,
            });
        } else {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    useEffect(() => {
        if (!canvasRef.current || !open) return;

        const ratio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        canvas.width = size * ratio;
        canvas.height = size * ratio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        const rive = new Rive({
            src: riveFile,
            canvas,
            autoplay: true,
            stateMachines: stateMachine,
            fit: "cover",
            onLoad: () => {
                const inputs = rive.stateMachineInputs(stateMachine);
                if (inputs) {
                    triggerInputRef.current = inputs.find((i) => i.name === trigger);
                }
            },
        });

        try {
            rive.renderer.clearColor = [0, 0, 0, 0];
        } catch (e) {
            console.warn("clearColor не поддержан:", e);
        }

        riveRef.current = rive;
        return () => rive.cleanup();
    }, [riveFile, stateMachine, trigger, open, size]);

    // 👇 клик по canvas → триггер + мягкий хаптик
    const handleClick = () => {
        if (!triggerInputRef.current) return;

        try {
            // Телеграм хаптик
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("soft");

            if (typeof triggerInputRef.current.value === "boolean") {
                triggerInputRef.current.value = !triggerInputRef.current.value;
            } else if (triggerInputRef.current.fire) {
                triggerInputRef.current.fire();
            }
        } catch (e) {
            console.warn("Ошибка при handleClick:", e);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 100,
                            opacity: overlayOpacity,
                        }}
                        onClick={onClose}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ y: window.innerHeight }}
                        animate={{ y: 0 }}
                        exit={{ y: window.innerHeight }}
                        transition={{ type: "spring", stiffness: 120, damping: 22 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: window.innerHeight }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={handleDragEnd}
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "var(--surface-zero)",
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 16,
                            zIndex: 101,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            touchAction: "none",
                            transformOrigin: "bottom center",
                            y,
                        }}
                    >
                        <div
                            onPointerDown={(e) => controls.start(e)}
                            style={{
                                width: 48,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "var(--icotex-low)",
                                marginBottom: 16,
                                cursor: "grab",
                            }}
                        />

                        <canvas
                            ref={canvasRef}
                            onClick={handleClick}
                            style={{
                                width: size,
                                height: size,
                                marginBottom: 16,
                                display: "block",
                                background: "transparent",
                                outline: "none",
                                userSelect: "none",
                                WebkitTapHighlightColor: "transparent",
                                cursor: "pointer",
                            }}
                        />

                        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                            Завершить игру?
                        </h2>
                        <p style={{ fontSize: 14, marginBottom: 20, textAlign: "center" }}>
                            В следующий раз игру придется начать заново
                        </p>

                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                            <FlatButton onClick={onConfirm}>Завершить</FlatButton>
                            <SecondaryButton onClick={onClose}>Отменить</SecondaryButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
