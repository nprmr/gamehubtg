import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../theme";
import SecondaryButton from "./SecondaryButton";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - players: Array<{ emojiData?: { emoji?: string; name?: string } }>
 * - currentPlayerIndex: number // индекс текущего игрока
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
    const canContinue = selectedPlayers.length > 0 || nobodyGuessed; // ✅ новое условие

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={overlayStyle}
                >
                    <motion.div
                        initial={{ y: 50 }}
                        animate={{ y: 0 }}
                        exit={{ y: 50 }}
                        transition={{ duration: 0.25 }}
                        style={containerStyle}
                    >
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

                                        {/* Индикатор +1 */}
                                        {selected && (
                                            <div style={plusIndicatorStyle}>
                                                <span style={plusTextStyle}>+1</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Кнопка "Никто не угадал" */}
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
                                disabled={!canContinue} // ✅ кнопка неактивна, если не выбрано
                            >
                                Следующий игрок
                            </SecondaryButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ======= СТИЛИ ======= */
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
};

const containerStyle = {
    width: "100%",
    backgroundColor: "var(--surface-zero)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: "24px 16px 32px",
    boxSizing: "border-box",
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
