import { useEffect, useRef, forwardRef, useCallback } from "react";
import PlayerAddIcon from "../icons/addPlayer.svg?react";
import CloseIcon from "../icons/close.svg?react"; // ✅ крестик
import { emojiMap } from "../data/emojiMap";
import { theme } from "../theme";
import PremiumCard from "./PremiumCard";
import twemoji from "twemoji";

const PlayerCard = forwardRef(function PlayerCard({
                                       id,
                                       state = "active",
                                       playerNumber = 1,
                                       emojiData,
                                       onAdd = () => {},
                                       onOpenPremium = () => {},
                                       onUpdate = () => {},
                                       onRemove = () => {},
                                       canRemove = true, // ✅ возможность удаления
                                       className,
                                   }, ref) {
    const emojiRef = useRef(null);
    const hapticRef = useRef(false);

    function randomEmojiData() {
        return emojiMap[Math.floor(Math.random() * emojiMap.length)];
    }

    useEffect(() => {
        if (emojiRef.current) {
            twemoji.parse(emojiRef.current, {
                folder: "svg",
                ext: ".svg",
                className: "emoji",
                attributes: () => ({
                    width: "128",
                    height: "128",
                    style: "display:block;object-fit:contain;",
                }),
            });
        }
    }, [emojiData]);

    const handleCardClick = useCallback(() => {
        const newEmoji = randomEmojiData();
        onUpdate({ emojiData: newEmoji });
    }, [onUpdate]);

    const handleKeyDown = useCallback((e) => {
        if (state !== "active") return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
        }
    }, [state, handleCardClick]);

    const hapticStart = useCallback(() => {
        if (!hapticRef.current) {
            hapticRef.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
        }
    }, []);
    const hapticEnd = useCallback(() => {
        hapticRef.current = false;
    }, []);

    const styles = {
        cardBase: {
            width: 260,
            height: 276,
            borderRadius: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            overflow: "hidden",
            userSelect: "none",
            cursor: "pointer",
        },
        emoji: {
            width: 128,
            height: 128,
            fontSize: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
            WebkitTapHighlightColor: "transparent",
        },
        title: {
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
            marginTop: 16,
            color: theme.icotex.normal,
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
        },
        subtitle: {
            fontSize: 16,
            color: theme.icotex.lowest,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 20,
        },
        closeButton: {
            position: "absolute",
            top: 16,
            right: 16,
            width: 24,
            height: 24,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
        },
        closeIcon: {
            width: 24,
            height: 24,
            fill: theme.icotex.white,
        },
    };

    // --- Активная карточка игрока ---
    if (state === "active") {
        return (
            <div
                id={id}
                ref={ref}
                className={className}
                style={{ ...styles.cardBase, backgroundColor: theme.surface.zero }}
                onClick={handleCardClick}
                onPointerDown={hapticStart}
                onPointerUp={hapticEnd}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Игрок ${emojiData?.name || "Игрок"}. Нажмите, чтобы сменить смайлик`}
            >
                {/* ✅ крестик показываем только если можно удалить */}
                {canRemove && (
                    <div
                        style={styles.closeButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(id);
                        }}
                        aria-label="Удалить игрока"
                    >
                        <CloseIcon style={styles.closeIcon} />
                    </div>
                )}

                <div style={styles.emoji} ref={emojiRef}>
                    {emojiData?.emoji || "🙂"}
                </div>

                <div style={styles.title}>{emojiData?.name || "Игрок"}</div>
                <div style={styles.subtitle}>Тапните, чтобы сменить</div>
            </div>
        );
    }

    // --- Карточка "Добавить игрока" ---
    if (state === "add") {
        return (
            <div
                id={id}
                ref={ref}
                className={className}
                onClick={onAdd}
                onPointerDown={hapticStart}
                onPointerUp={hapticEnd}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onAdd();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Добавить игрока ${playerNumber}`}
                style={{
                    ...styles.cardBase,
                    backgroundColor: theme.surface.normalAlfa,
                    backdropFilter: "blur(20px)",
                }}
            >
                <div
                    style={{
                        width: 128,
                        height: 128,
                        marginTop: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PlayerAddIcon
                        style={{
                            width: "128px",
                            height: "128px",
                            display: "block",
                            flexShrink: 0,
                        }}
                    />
                </div>

                <div style={{ ...styles.title, color: theme.icotex.white, marginTop: 16 }}>
                    Добавить
                </div>

                <div style={{ ...styles.subtitle, color: theme.icotex.low }}>
                    Игрок {playerNumber}
                </div>
            </div>
        );
    }

    // --- Премиум-карточка ---
    if (state === "premium") {
        return (
            <PremiumCard
                id={id}
                onOpenPremium={onOpenPremium}
                theme={theme}
                styles={styles}
            />
        );
    }

    return null;
});

export default PlayerCard;
