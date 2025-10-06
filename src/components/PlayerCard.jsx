import { useState, useEffect, useRef } from "react";
import PlayerAddIcon from "../icons/addPlayer.svg?react";
import { emojiMap } from "../data/emojiMap";
import { theme } from "../theme";
import PremiumCard from "./PremiumCard";
import twemoji from "twemoji";

export default function PlayerCard({
                                       id,
                                       state = "active",
                                       playerNumber = 1,
                                       onAdd = () => {},
                                       onEditTitle = () => {},
                                       onOpenPremium = () => {},
                                       onStartEditing = () => {},
                                   }) {
    const [emojiData, setEmojiData] = useState(randomEmojiData());
    const [isEditing, setIsEditing] = useState(false);
    const [titleValue, setTitleValue] = useState(emojiData.name);
    const emojiRef = useRef(null);
    const inputRef = useRef(null);

    // 🎲 случайный emoji
    function randomEmojiData() {
        return emojiMap[Math.floor(Math.random() * emojiMap.length)];
    }

    // 🧠 при изменении emojiData обновляем name
    useEffect(() => {
        setTitleValue(emojiData.name);
    }, [emojiData]);

    // 🖼️ парсим emoji в SVG
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

    const handleEmojiClick = () => {
        const newEmoji = randomEmojiData();
        setEmojiData(newEmoji);
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("soft");
    };

    // ✏️ редактирование имени
    const handleTitleClick = (e) => {
        e.stopPropagation();
        onStartEditing();

        setIsEditing(true);
        // ✅ фокусим инпут сразу (в том же event loop — нужно для Telegram)
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        setEmojiData({ ...emojiData, name: titleValue });
        onEditTitle(titleValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
        }
    };

    // 🎨 стили
    const styles = {
        cardBase: {
            width: 260,
            height: 276,
            borderRadius: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: "0 0 auto",
            transition: "transform 0.25s ease, background 0.25s ease",
            boxSizing: "border-box",
            overflow: "hidden",
            userSelect: "none",
        },
        emoji: {
            width: "-webkit-fill-available",
            height: 128,
            fontSize: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
            cursor: "pointer",
            transition: "transform 0.3s ease",
        },
        title: {
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
            marginTop: 16,
            marginLeft: 16,
            marginRight: 16,
            color: theme.icotex.normal,
            cursor: "pointer",
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "-webkit-fill-available",
        },
        subtitle: {
            fontSize: 16,
            color: theme.icotex.lowest,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "-webkit-fill-available",
            height: 20,
            transition: "opacity 0.3s ease",
            opacity: isEditing ? 0.2 : 1,
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
                    transform: isEditing ? "translateY(-16px)" : "translateY(0)",
                }}
            >
                <div style={styles.emoji} ref={emojiRef} onClick={handleEmojiClick}>
                    {emojiData.emoji}
                </div>

                <div style={styles.title} onClick={!isEditing ? handleTitleClick : undefined}>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={titleValue}
                            onChange={(e) => setTitleValue(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                textAlign: "center",
                                color: theme.icotex.normal,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                width: "100%",
                                height: "100%",
                                caretColor: theme.icotex.white,
                                transition: "transform 0.3s ease",
                            }}
                        />
                    ) : (
                        <span>{titleValue}</span>
                    )}
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
                onClick={onAdd}
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
                        color: theme.icotex.white,
                        marginTop: 16,
                    }}
                >
                    Добавить
                </div>

                <div
                    style={{
                        ...styles.subtitle,
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
}
