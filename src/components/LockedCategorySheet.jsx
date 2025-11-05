import { useState, useEffect, forwardRef, useCallback, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";
import PlayerAddIcon from "../icons/addPlayer.svg?react";
import { emojiMap } from "../data/emojiMap";
import { theme } from "../theme";

const PlayerCard = forwardRef(function PlayerCard({
                                       id,
                                       state = "active", // "active" | "add" | "premium"
                                       playerNumber = 1,
                                       onAdd = () => {},
                                       onEditTitle = () => {},
                                       onOpenPremium = () => {},
                                   }, ref) {
    const [emojiData, setEmojiData] = useState(randomEmojiData());
    const hapticRef = useRef(false);

    function randomEmojiData() {
        return emojiMap[Math.floor(Math.random() * emojiMap.length)];
    }

    const handleEmojiClick = useCallback(() => {
        const newEmoji = randomEmojiData();
        setEmojiData(newEmoji);
    }, []);

    const handleTitleClick = useCallback(() => {
        const newTitle = prompt("Введите новый заголовок", emojiData.name);
        if (newTitle) {
            setEmojiData({ ...emojiData, name: newTitle });
            onEditTitle(newTitle);
        }
    }, [emojiData, onEditTitle]);

    const hapticStart = useCallback(() => {
        if (!hapticRef.current) {
            hapticRef.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
        }
    }, []);
    const hapticEnd = useCallback(() => {
        hapticRef.current = false;
    }, []);

    // 🎨 Общие стили
    const styles = {
        cardBase: {
            width: 260,
            height: 256,
            borderRadius: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: "0 0 auto",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            overflow: "hidden",
        },
        emoji: {
            fontSize: 128,
            marginTop: 24,
            lineHeight: 1.1,
            cursor: "pointer",
            userSelect: "none",
        },
        title: {
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
            marginLeft: 16,
            marginRight: 16,
            color: theme.icotex.normal,
            cursor: "pointer",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        subtitle: {
            fontSize: 16,
            color: theme.icotex.lowest,
            height: 20,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
        },
    };

    // 🟢 ACTIVE CARD
    if (state === "active") {
        return (
            <div
                id={id}
                style={{
                    ...styles.cardBase,
                    backgroundColor: theme.surface.zero,
                }}
            >
                <div style={styles.emoji} onClick={handleEmojiClick}>
                    {emojiData.emoji}
                </div>
                <div style={styles.title} onClick={handleTitleClick}>
                    {emojiData.name}
                </div>
                <div style={styles.subtitle}>Нажмите, чтобы изменить</div>
            </div>
        );
    }

    // 🟣 ADD CARD
    if (state === "add") {
        return (
            <div
                id={id}
                ref={ref}
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
                    cursor: "pointer",
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

                <div
                    style={{
                        ...styles.title,
                        fontSize: 24,
                        fontWeight: 700,
                        color: theme.icotex.white,
                        marginTop: 12,
                    }}
                >
                    Добавить
                </div>

                <div
                    style={{
                        ...styles.subtitle,
                        fontSize: 16,
                        color: theme.icotex.low,
                    }}
                >
                    Игрок {playerNumber}
                </div>
            </div>
        );
    }

    // 💎 PREMIUM CARD
    if (state === "premium") {
        // инициализация rive через hook (без падений)
        const { rive, RiveComponent } = useRive({
            src: "/rive/crystall.riv",
            stateMachines: "State Machine 1",
            autoplay: true,
        });

        // корректная очистка при размонтировании
        useEffect(() => {
            return () => {
                try {
                    rive?.stop();
                } catch {}
            };
        }, [rive]);

        return (
            <div
                id={id}
                ref={ref}
                onClick={onOpenPremium}
                onPointerDown={hapticStart}
                onPointerUp={hapticEnd}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onOpenPremium();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Открыть премиум"
                style={{
                    ...styles.cardBase,
                    backgroundColor: theme.surface.normalAlfa,
                    backdropFilter: "blur(20px)",
                    cursor: "pointer",
                }}
            >
                <div
                    style={{
                        width: 128,
                        height: 128,
                        marginTop: 24,
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <RiveComponent
                        style={{
                            width: "100%",
                            height: "100%",
                            outline: "none",
                            userSelect: "none",
                        }}
                    />
                </div>

                <div
                    style={{
                        ...styles.title,
                        fontSize: 24,
                        fontWeight: 700,
                        color: theme.icotex.white,
                        marginTop: 8,
                    }}
                >
                    Хотите больше?
                </div>

                <div
                    style={{
                        ...styles.subtitle,
                        fontSize: 16,
                        color: theme.icotex.low,
                        textAlign: "center",
                        lineHeight: 1.4,
                        padding: "0 16px",
                    }}
                >
                    Оформите премиум, чтобы снять все ограничения
                </div>
            </div>
        );
    }

    return null;
});

export default PlayerCard;
