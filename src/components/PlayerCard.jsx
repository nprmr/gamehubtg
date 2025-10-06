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
    const [titleValue, setTitleValue] = useState(emojiData.name);
    const [isEditing, setIsEditing] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    const emojiRef = useRef(null);
    const inputRef = useRef(null);

    function randomEmojiData() {
        return emojiMap[Math.floor(Math.random() * emojiMap.length)];
    }

    // 🧠 обновляем title при смене emoji
    useEffect(() => {
        setTitleValue(emojiData.name);
    }, [emojiData]);

    // 🎨 emoji → SVG
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

    // 📱 отслеживаем клавиатуру через visualViewport
    useEffect(() => {
        if (!window.visualViewport) return;
        const handleResize = () => {
            const offset = window.innerHeight - window.visualViewport.height;
            setKeyboardOffset(offset > 0 ? offset / 2 : 0);
        };
        window.visualViewport.addEventListener("resize", handleResize);
        return () => window.visualViewport.removeEventListener("resize", handleResize);
    }, []);

    const handleEmojiClick = () => {
        setEmojiData(randomEmojiData());
        if (window.Telegram?.WebApp?.HapticFeedback) {
            try {
                window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
            } catch (e) {
                console.warn("HapticFeedback failed:", e);
            }
        }
    };

    const handleTitleClick = (e) => {
        e.stopPropagation();
        onStartEditing?.();
        setIsEditing(true);
        // фокус в том же событии (важно для Telegram)
        inputRef.current?.focus({ preventScroll: true });
    };

    const handleBlur = () => {
        setIsEditing(false);
        setKeyboardOffset(0);
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
            transition: "transform 0.3s ease",
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
            transition: "transform 0.2s ease",
        },
        title: {
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
            marginTop: 16,
            marginLeft: 16,
            marginRight: 16,
            color: theme.icotex.normal,
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "-webkit-fill-available",
            position: "relative",
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
                    transform: `translateY(-${keyboardOffset}px)`,
                }}
            >
                <div style={styles.emoji} ref={emojiRef} onClick={handleEmojiClick}>
                    {emojiData.emoji}
                </div>

                <div style={styles.title} onClick={!isEditing ? handleTitleClick : undefined}>
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
                            position: "absolute",
                            top: 0,
                            left: 0,
                            pointerEvents: isEditing ? "auto" : "none",
                            opacity: isEditing ? 1 : 0,
                            transition: "opacity 0.2s ease",
                        }}
                    />
                    {!isEditing && <span>{titleValue}</span>}
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
