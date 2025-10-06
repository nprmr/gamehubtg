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
                                       name = "",
                                       onAdd = () => {},
                                       onEditTitle = () => {},
                                       onOpenPremium = () => {},
                                   }) {
    const [emojiData, setEmojiData] = useState(randomEmojiData());
    const [titleValue, setTitleValue] = useState(name || emojiData.name);
    const [isEditing, setIsEditing] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const emojiRef = useRef(null);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    function randomEmojiData() {
        return emojiMap[Math.floor(Math.random() * emojiMap.length)];
    }

    // 🧠 обновляем имя при смене emoji
    useEffect(() => setTitleValue((prev) => prev || emojiData.name), [emojiData]);

    // 🖼️ emoji → SVG
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

    // 🎹 Отслеживаем подъем клавиатуры (VisualViewport)
    useEffect(() => {
        if (!window.visualViewport) return;
        const handleResize = () => {
            const diff = window.innerHeight - window.visualViewport.height;
            setKeyboardVisible(diff > 80);
            if (diff > 80 && isEditing) {
                containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        };
        window.visualViewport.addEventListener("resize", handleResize);
        return () => window.visualViewport.removeEventListener("resize", handleResize);
    }, [isEditing]);

    // 🎯 Обработка клика по эмоджи
    const handleEmojiClick = () => {
        setEmojiData(randomEmojiData());
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("soft");
    };

    // ✏️ Начало редактирования
    const handleTitleClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    };

    // ✅ Завершение редактирования
    const handleBlur = () => {
        setIsEditing(false);
        const cleanTitle = titleValue.trim() || emojiData.name;
        setTitleValue(cleanTitle);
        onEditTitle(id, cleanTitle);
    };

    // ⌨️ Обработка Enter
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
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            transform: isKeyboardVisible && isEditing ? "translateY(-20px)" : "none",
            transition: "transform 0.3s ease",
            backgroundColor: theme.surface.zero,
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
            color: theme.icotex.normal,
            position: "relative",
            width: "100%",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        subtitle: {
            fontSize: 16,
            color: theme.icotex.lowest,
            marginBottom: 24,
            transition: "opacity 0.3s ease",
            opacity: isEditing ? 0.2 : 1,
        },
        input: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            textAlign: "center",
            fontSize: 24,
            fontWeight: 700,
            color: theme.icotex.normal,
            opacity: isEditing ? 1 : 0,
            pointerEvents: isEditing ? "auto" : "none",
            transition: "opacity 0.25s ease",
        },
    };

    if (state === "active") {
        return (
            <div ref={containerRef} id={id} style={styles.cardBase}>
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
                        style={styles.input}
                    />
                    <span style={{ opacity: isEditing ? 0 : 1 }}>{titleValue}</span>
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
                    <PlayerAddIcon style={{ width: 128, height: 128 }} />
                </div>

                <div style={{ ...styles.title, color: theme.icotex.white }}>Добавить</div>
                <div style={{ ...styles.subtitle, color: theme.icotex.low }}>
                    Игрок {playerNumber}
                </div>
            </div>
        );
    }

    // 💎 PREMIUM CARD
    if (state === "premium") {
        return <PremiumCard id={id} onOpenPremium={onOpenPremium} theme={theme} styles={styles} />;
    }

    return null;
}
