import React from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import FlatButton from "./FlatButton";
import SecondaryButton from "./SecondaryButton";
import RivePlayer from "./RivePlayer";

export default function BottomSheet({
                                        open,
                                        onClose,
                                        onConfirm,
                                        riveFile = "/rive/tv.riv",
                                        stateMachine = "State Machine 1",
                                        trigger = "clickActivation",
                                    }) {
    const controls = useDragControls();

    const handleDragEnd = (_e, info) => {
        const draggedDownEnough = info.offset.y > 100 || info.velocity.y > 600;
        if (draggedDownEnough) onClose?.();
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
                        dragListener={false}             // тянем только за хэндл
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "var(--surface-zero)",
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 16,                    // общий отступ 16px
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

                        {/* Rive 128x128 */}
                        <div style={{ width: 128, height: 128, marginBottom: 16 }}>
                            <RivePlayer
                                src={riveFile}
                                stateMachine={stateMachine}
                                trigger="clickTrigger"
                                clickToTrigger
                            />
                        </div>

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

                        {/* Кнопки — gap ровно 8px */}
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
