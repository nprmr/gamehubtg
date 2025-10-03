import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
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
                                        size = 128, // 👈 можно менять размер
                                    }) {
    const controls = useDragControls();
    const canvasRef = useRef(null);
    const riveRef = useRef(null);
    const triggerInputRef = useRef(null);

    const handleDragEnd = (_e, info) => {
        const draggedDownEnough = info.offset.y > 100 || info.velocity.y > 600;
        if (draggedDownEnough) onClose?.();
    };

    // инициализация rive
    useEffect(() => {
        if (!canvasRef.current || !open) return;

        const ratio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;

        // атрибуты canvas → high DPI
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

        // прозрачный фон вместо черного
        try {
            rive.renderer.clearColor = [0, 0, 0, 0];
        } catch (e) {
            console.warn("clearColor не поддержан:", e);
        }

        riveRef.current = rive;

        return () => {
            rive.cleanup();
        };
    }, [riveFile, stateMachine, trigger, open, size]);

    // клик по canvas → триггер
    const handleClick = () => {
        if (!triggerInputRef.current) return;

        try {
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
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 100,
                        }}
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 180, damping: 20 }}
                        drag="y"
                        dragControls={controls}
                        dragListener={true}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.7}
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
                        }}
                    >
                        {/* Drag handle */}
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

                        {/* Rive canvas */}
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

                        {/* Заголовок */}
                        <h2
                            style={{
                                fontFamily: "Gilroy, sans-serif",
                                fontSize: 24,
                                fontWeight: 700,
                                margin: 0,
                                marginBottom: 8,
                                color: "var(--icotex-normal)",
                                textAlign: "center",
                            }}
                        >
                            Завершить игру?
                        </h2>

                        {/* Подзаголовок */}
                        <p
                            style={{
                                fontFamily: "Gilroy, sans-serif",
                                fontSize: 14,
                                fontWeight: 400,
                                margin: 0,
                                marginBottom: 20,
                                color: "var(--icotex-normal)",
                                textAlign: "center",
                            }}
                        >
                            В следующий раз игру придется начать заново
                        </p>

                        {/* Кнопки */}
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            <FlatButton onClick={onConfirm}>Завершить</FlatButton>
                            <SecondaryButton onClick={onClose}>Отменить</SecondaryButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
