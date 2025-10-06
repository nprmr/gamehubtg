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
                                       onStartEditing = () => {}, // 👈 новый проп
                                   }) {
    const [emojiData, setEmojiData] = useState(randomEmojiData());
    const [isEditing, setIsEditing] = useState(false);
    const [titleValue, setTitleValue] = useState(emojiData.name);
    const emojiRef = useRef(null);
    const inputRef = useRef(null);

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

    const handleEmojiClick = () => {
        setEmojiData(randomEmojiData());
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("soft");
    };

    const handleTitleClick = () => {
        onStartEditing(); // 👉 просим родителя центрировать карточку
        setIsEditing(true);

        // надёжный фокус после layout
        requestAnimationFrame(() => {
            inputRef.current?.focus({ preventScroll: true });
            setTimeout(() => {
                inputRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 200);
        });
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
            transition: "transform 0.2s ease, background 0.2s ease",
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
            overflow: "hidden",
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
        },
    };

    if (state === "active") {
        return (
            <div
                id={id}
                style={{
                    ...styles.cardBase,
                    backgroundColor: theme.surface.zero,
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
