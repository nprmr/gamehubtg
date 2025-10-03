import React, { useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import FlatButton from "./FlatButton";
import SecondaryButton from "./SecondaryButton";

export default function LockedCategorySheet({
                                                open,
                                                onClose,
                                                categoryTitle,
                                                riveFile,
                                                phrases = [],
                                                price = "199₽",
                                                delay = 600,
                                            }) {
    // инициализация rive
    const { rive, RiveComponent } = useRive({
        src: riveFile,
        stateMachines: "State Machine 1",
        autoplay: true, // включаем рендер-цикл сразу
    });

    const activation = useStateMachineInput(
        rive,
        "State Machine 1",
        "Activation",
        false
    );

    useEffect(() => {
        if (!activation || !rive) return;

        let timer;
        if (open) {
            activation.value = false; // начинаем с первого кадра
            rive.play(); // запустить анимацию

            // включаем активацию state machine после задержки
            timer = setTimeout(() => {
                activation.value = true;
            }, delay);
        } else {
            activation.value = false;
            rive.pause(); // можно при закрытии останавливать цикл
        }

        return () => {
            if (timer) clearTimeout(timer);
            rive?.stop();
        };
    }, [open, activation, rive, delay]);

    // motion values
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
                        {/* Drag handle */}
                        <div
                            style={{
                                width: 48,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "var(--icotex-low)",
                                marginBottom: 16,
                                cursor: "grab",
                            }}
                        />

                        {/* Rive */}
                        <div style={{ width: 128, height: 128, marginBottom: 16 }}>
                            <RiveComponent
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    outline: "none",
                                    userSelect: "none",
                                }}
                            />
                        </div>

                        {/* Заголовок */}
                        <h2
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                marginBottom: 8,
                                textAlign: "center",
                            }}
                        >
                            {categoryTitle}
                        </h2>

                        <p style={{ fontSize: 14, marginBottom: 8, textAlign: "center" }}>
                            Примеры фраз
                        </p>

                        {/* Примеры */}
                        <div
                            style={{
                                background: "var(--surface-light)",
                                borderRadius: 20,
                                width: "100%",
                                padding: 16,
                                marginBottom: 20,
                                boxSizing: "border-box",
                            }}
                        >
                            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                                Я никогда не:
                            </p>
                            {phrases.slice(0, 3).map((phrase, idx) => (
                                <p
                                    key={idx}
                                    style={{
                                        fontSize: 14,
                                        marginBottom: 4,
                                        color: "var(--icotex-lowest)",
                                    }}
                                >
                                    – {phrase}
                                </p>
                            ))}
                        </div>

                        {/* Кнопки */}
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            <FlatButton description="покупка сохранится навсегда">
                                Купить за {price}
                            </FlatButton>
                            <SecondaryButton description="ежемесячная подписка">
                                Премиум за 399₽
                            </SecondaryButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
