import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate,
    useDragControls,
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
                                        trigger = "clickTrigger",
                                        size = 128,
                                    }) {
    const y = useMotionValue(0);
    const overlayOpacity = useTransform(y, [0, 300], [0.5, 0]);

    const canvasRef = useRef(null);
    const riveRef = useRef(null);
    const triggerInputRef = useRef(null);
    const controls = useDragControls();

    // ---------- helpers ----------
    const pickInput = (inputs, expectedName) => {
        if (!inputs || !inputs.length) return null;
        let chosen = inputs.find((i) => i?.name === expectedName);
        if (chosen) return chosen;
        chosen = inputs.find(
            (i) => i?.name?.toLowerCase?.() === expectedName?.toLowerCase?.()
        );
        if (chosen) return chosen;
        chosen = inputs.find((i) => typeof i?.fire === "function");
        if (chosen) return chosen;
        chosen = inputs.find((i) => typeof i?.value === "boolean");
        return chosen || null;
    };

    const setTriggerFromRive = (rive, expectedName) => {
        try {
            const inputs = rive.stateMachineInputs(stateMachine) || [];
            triggerInputRef.current = pickInput(inputs, expectedName);
        } catch {
            triggerInputRef.current = null;
        }
    };

    const ensureTriggerOnce = () => {
        if (!riveRef.current || triggerInputRef.current) return;
        setTriggerFromRive(riveRef.current, trigger);
    };

    const fireRive = () => {
        if (!triggerInputRef.current) ensureTriggerOnce();
        const input = triggerInputRef.current;
        if (!input) return;

        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("soft");

        if (typeof input.fire === "function") {
            input.fire();
        } else if (typeof input.value === "boolean") {
            input.value = true;
            setTimeout(() => (input.value = false), 200);
        }
    };

    const handleDragEnd = (_e, info) => {
        const draggedDownEnough = info.offset.y > 120 || info.velocity.y > 600;
        if (draggedDownEnough) {
            animate(y, typeof window !== "undefined" ? window.innerHeight : 1000, {
                type: "spring",
                stiffness: 200,
                damping: 30,
                onComplete: onClose,
            });
        } else {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    // ---------- Rive init ----------
    useEffect(() => {
        if (!open || !canvasRef.current) return;
        if (riveRef.current) {
            riveRef.current.play();
            return;
        }

        const canvas = canvasRef.current;
        const ratio = window.devicePixelRatio || 1;
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
            onLoad: () => setTriggerFromRive(rive, trigger),
        });

        try {
            if (rive.renderer) rive.renderer.clearColor = [0, 0, 0, 0];
        } catch {}

        riveRef.current = rive;

        return () => {
            try {
                rive.cleanup();
            } catch {}
            riveRef.current = null;
            triggerInputRef.current = null;
        };
    }, [open, riveFile, stateMachine, trigger, size]);

    // при закрытии просто пауза
    useEffect(() => {
        if (!open && riveRef.current) {
            riveRef.current.pause();
        }
    }, [open]);

    const sheet = (
        <AnimatePresence>
            {open && (
                <>
                    {/* overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 2147483646,
                            opacity: overlayOpacity,
                            pointerEvents: "auto",
                        }}
                        onClick={onClose}
                    />

                    {/* sheet */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{
                            y: typeof window !== "undefined" ? window.innerHeight : 0,
                        }}
                        animate={{ y: 0 }}
                        exit={{
                            y: typeof window !== "undefined" ? window.innerHeight : 0,
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 22 }}
                        drag="y"
                        dragListener={false}
                        dragControls={controls}
                        dragConstraints={{
                            top: 0,
                            bottom: typeof window !== "undefined" ? window.innerHeight : 0,
                        }}
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
                            zIndex: 2147483647,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            transformOrigin: "bottom center",
                            isolation: "isolate",
                            y,
                        }}
                    >
                        <div
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                controls.start(e);
                            }}
                            style={{
                                width: 48,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "var(--icotex-low)",
                                marginBottom: 16,
                                cursor: "grab",
                                touchAction: "none",
                            }}
                        />

                        <canvas
                            ref={canvasRef}
                            tabIndex={-1}
                            onPointerUp={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                fireRive();
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                fireRive();
                            }}
                            style={{
                                width: size,
                                height: size,
                                marginBottom: 16,
                                display: "block",
                                background: "transparent",
                                cursor: "pointer",
                                pointerEvents: "auto",
                                userSelect: "none",
                                touchAction: "none",
                                outline: "none",
                                WebkitTapHighlightColor: "transparent",
                                position: "relative",
                                zIndex: 2,
                            }}
                        />

                        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                            Завершить игру?
                        </h2>
                        <p
                            style={{
                                fontSize: 14,
                                marginBottom: 20,
                                textAlign: "center",
                                lineHeight: 1.4,
                            }}
                        >
                            В следующий раз игру придется начать заново
                        </p>

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

    return ReactDOM.createPortal(sheet, document.body);
}
