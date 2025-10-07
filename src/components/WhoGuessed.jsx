import React, { useEffect, useRef } from "react";
import {
    motion,
    AnimatePresence,
    useDragControls,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";
import twemoji from "twemoji";
import SecondaryButton from "./SecondaryButton";

export default function WhoGuessed({ open, onClose, players = [] }) {
    const controls = useDragControls();
    const y = useMotionValue(0);
    const overlayOpacity = useTransform(y, [0, 300], [0.5, 0]);
    const containerRef = useRef(null);

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

    // 👇 Конвертируем emoji → Twemoji (SVG)
    useEffect(() => {
        if (open && containerRef.current) {
            twemoji.parse(containerRef.current, {
                folder: "svg",
                ext: ".svg",
            });
        }
    }, [open, players]);

    return (
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
                            zIndex: 100,
                            opacity: overlayOpacity,
                        }}
                        onClick={onClose}
                    />

                    {/* bottom sheet */}
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
                        {/* drag handle */}
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

                        {/* title */}
                        <h2
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                fontFamily: "Gilroy, sans-serif",
                                marginBottom: 32,
                            }}
                        >
                            Кто угадал
                        </h2>

                        {/* контейнер игроков + блок "никто не угадал" */}
                        <div
                            ref={containerRef}
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                padding: "0 16px",
                                marginBottom: 32,
                            }}
                        >
                            {/* игроки */}
                            {players.length > 0 &&
                                players.map((player, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            background: "var(--surface-light)",
                                            borderRadius: 20,
                                            padding: "16px 24px",
                                        }}
                                    >
                    <span
                        className="emoji"
                        style={{
                            fontSize: 24,
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                      {player.emojiData?.emoji || "🙂"}
                    </span>
                                        <span
                                            style={{
                                                fontFamily: "Gilroy, sans-serif",
                                                fontWeight: 700,
                                                fontSize: 24,
                                                color: "var(--icotex-normal)",
                                            }}
                                        >
                      {player.emojiData?.name || player.name || "Игрок"}
                    </span>
                                    </motion.div>
                                ))}

                            {/* блок "никто не угадал" — с Twemoji крестиком */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: players.length * 0.05 + 0.1 }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    background: "var(--surface-light)",
                                    borderRadius: 20,
                                    padding: "16px 24px",
                                }}
                            >
                <span
                    className="emoji"
                    style={{
                        fontSize: 24,
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                  ❌
                </span>
                                <span
                                    style={{
                                        fontFamily: "Gilroy, sans-serif",
                                        fontWeight: 700,
                                        fontSize: 24,
                                        color: "var(--icotex-normal)",
                                    }}
                                >
                  Никто не угадал
                </span>
                            </motion.div>
                        </div>

                        {/* button */}
                        <SecondaryButton onClick={onClose}>Следующий игрок</SecondaryButton>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
