import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, animate, useTransform } from "framer-motion";
import { theme } from "../theme";
import SecondaryButton from "./SecondaryButton";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - players: Array<{ emojiData?: { emoji?: string; name?: string } }>
 * - currentPlayerIndex: number
 * - onSubmit: (payload: { guessedBy: number[], nobodyGuessed: boolean, awardedTo: number | null }) => void
 */
export default function WhoGuessed({
                                       open,
                                       onClose,
                                       players = [],
                                       currentPlayerIndex,
                                       onSubmit,
                                   }) {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [nobodyGuessed, setNobodyGuessed] = useState(false);

    const y = useMotionValue(0);
    const overlayOpacity = useTransform(y, [0, 300], [0.5, 0]);

    // Отображаем всех, кроме текущего игрока
    const displayedPlayers = useMemo(
        () =>
            players
                .map((p, index) => ({ player: p, index }))
                .filter(({ index }) => index !== currentPlayerIndex),
        [players, currentPlayerIndex]
    );

    // Сброс при закрытии
    useEffect(() => {
        if (!open) {
            setSelectedPlayers([]);
            setNobodyGuessed(false);
        }
    }, [open]);

    const togglePlayer = (index) => {
        setNobodyGuessed(false);
        setSelectedPlayers((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const handleNobody = () => {
        setSelectedPlayers([]);
        setNobodyGuessed(true);
    };

    const handleContinue = () => {
        onSubmit?.({
            guessedBy: selectedPlayers,
            nobodyGuessed,
            awardedTo: currentPlayerIndex,
        });
        onClose?.();
    };

    const totalCount = Math.max(players.length - 1, 0);
    const canContinue = selectedPlayers.length > 0 || nobodyGuessed;

    // 👇 свайп вниз для закрытия
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
                    {/* overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 9998,
                            opacity: overlayOpacity,
                        }}
                        onClick={onClose} // 👉 клик по фону закрывает
                    />

                    {/* bottom sheet */}
                    <motion.div
                        initial={{ y: window.innerHeight }}
                        animate={{ y: 0 }}
                        exit={{ y: window.innerHeight }}
                        transition={{ type: "spring", stiffness: 120, damping: 22 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: window.innerHeight }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={handleDragEnd}
                        style={{
                            ...containerStyle,
                            y,
                        }}
                    >
                        {/* верхняя полоска */}
                        <div
                            style={{
                                width: 48,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "var(--icotex-low)",
                                margin: "0 auto 16px",
                            }}
                        />

                        <h2 style={titleStyle}>Кто угадал?</h2>

                        <div style={playersListStyle}>
                            {displayedPlayers.map(({ player, index }) => {
                                const selected = selectedPlayers.includes(index);
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            ...playerBlockStyle,
                                            backgroundColor: selected
                                                ? "var(--surface-light)"
                                                : "var(--surface-light)",
                                        }}
                                        onClick={() => togglePlayer(index)}
                                    >
                                        <div style={playerInfoStyle}>
                                            <div style={emojiStyle}>
                                                {player?.emojiData?.emoji || "🙂"}
                                            </div>
                                            <div style={playerNameStyle}>
                                                {player?.emojiData?.name || "Игрок"}
                                            </div>
                                        </div>

                                        {selected && (
                                            <div style={plusIndicatorStyle}>
                                                <span style={plusTextStyle}>+1</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Никто не угадал */}
                            <div
                                style={{
                                    ...playerBlockStyle,
                                    backgroundColor: nobodyGuessed
                                        ? "var(--surface-light)"
                                        : "var(--surface-light)",
                                    marginTop: 8,
                                }}
                                onClick={handleNobody}
                            >
                                <div style={playerInfoStyle}>
                                    <div style={playerNameStyle}>Никто не угадал</div>
                                </div>

                                {nobodyGuessed && (
                                    <div style={plusIndicatorStyle}>
                                        <span style={plusTextStyle}>+{totalCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={buttonsContainer}>
                            <SecondaryButton
                                textColor={theme.icotex.white}
                                onClick={handleContinue}
                                disabled={!canContinue}
                            >
                                Следующий игрок
                            </SecondaryButton>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ======= СТИЛИ ======= */

const containerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "var(--surface-zero)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: "16px 16px 32px",
    boxSizing: "border-box",
    zIndex: 9999,
};

const titleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--icotex-normal)",
    textAlign: "center",
    marginBottom: 16,
};

const playersListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: "50vh",
    overflowY: "auto",
    paddingBottom: 16,
};

const playerBlockStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16,
    minHeight: 64,
    borderRadius: 20,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
};

const playerInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
};

const emojiStyle = {
    fontSize: 32,
};

const playerNameStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 600,
    fontSize: 18,
    color: "var(--icotex-normal)",
};

const plusIndicatorStyle = {
    position: "absolute",
    right: 24,
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "var(--surface-accent)",
    borderRadius: 12,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const plusTextStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "var(--icotex-white)",
};

const buttonsContainer = {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
};
