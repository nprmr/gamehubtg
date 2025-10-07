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
                                       onOpenPremium = () => {},
                                   }) {
    const [emojiData, setEmojiData] = useState(randomEmojiData());
    const emojiRef = useRef(null);

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

    const handleCardClick = () => {
        setEmojiData(randomEmojiData());
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
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            overflow: "hidden",
            userSelect: "none",
            cursor: "pointer",
        },
        emoji: {
            width: 128,
            height: 128,
            fontSize: 120,
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
    };

    if (state === "active") {
        return (
            <div
                id={id}
                style={{
                    ...styles.cardBase,
                    backgroundColor: theme.surface.zero,
                }}
                onClick={handleCardClick}
            >
                <div style={styles.emoji} ref={emojiRef}>
                    {emojiData.emoji}
                </div>

                <div style={styles.title}>{emojiData.name}</div>

                <div style={styles.subtitle}>Тапните, чтобы сменить</div>
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
