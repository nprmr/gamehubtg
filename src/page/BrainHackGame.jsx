import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "../components/IconButton";
import PrimaryButton from "../components/PrimaryButton";
import FaqIcon from "../icons/faq.svg?react";
import ArrowBackIcon from "../icons/arrowback.svg?react";
import brainplayerBG from "../assets/brainplayerBG.png";
import { theme } from "../theme.js";
import WhoGuessed from "../components/WhoGuessed";
import BottomSheet from "../components/BottomSheet";
import AwardCeremony from "../components/AwardCeremony";

export default function BrainHackGame({ onShowOnboarding }) {
    const location = useLocation();
    const navigate = useNavigate();
    const players = location.state?.players || [];

    const [phase, setPhase] = useState("player"); // "player" | "game" | "award"
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [layoutOffsets, setLayoutOffsets] = useState({ top: 100, bottom: 24 });
    const [showWhoGuessed, setShowWhoGuessed] = useState(false);
    const [showSheet, setShowSheet] = useState(false);

    const TOTAL_ROUNDS = 1;
    const [round, setRound] = useState(1);

    // Счёт игроков
    const [scores, setScores] = useState(() => players.map(() => 0));

    const currentPlayer = players[currentIndex];

    // 💥 Вибрация
    function hapticSoft() {
        const H = window.Telegram?.WebApp?.HapticFeedback;
        if (!H) return;
        H.impactOccurred("soft");
    }

    // ⚙️ Layout адаптация
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        const updateLayout = () => {
            const fullscreen = tg.isExpanded;
            setLayoutOffsets(fullscreen ? { top: 168, bottom: 24 } : { top: 88, bottom: 24 });
        };

        tg.onEvent?.("viewportChanged", updateLayout);
        updateLayout();

        return () => tg.offEvent?.("viewportChanged", updateLayout);
    }, []);

    // 👇 Предзагрузка фона
    useEffect(() => {
        const img = new Image();
        img.src = brainplayerBG;
        img.onload = () => {
            setIsLoaded(true);
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
        };
    }, []);

    const localQuestions = [
        [
            "У меня есть скрытый талант, о котором никто не знает",
            "Я когда-то притворялся кем-то другим ради выгоды",
            "Я люблю делать что-то странное, когда никто не видит",
            "Я когда-то врал, чтобы произвести впечатление",
        ],
        [
            "Я когда-то завалил важное дело и никому не сказал",
            "Я смеюсь над своими шутками громче всех",
            "У меня есть нелепый страх, о котором никто не знает",
            "Я говорил что-то, о чём потом сильно пожалел",
        ],
    ];

    // динамически разные вопросы каждому игроку
    const currentQuestions = localQuestions[(round + currentIndex) % localQuestions.length];

    // переходы
    const handleBackClick = () => {
        hapticSoft();
        setShowSheet(true);
    };

    const handleScoresUpdate = ({ guessedBy, nobodyGuessed, awardedTo }) => {
        setScores((prev) => {
            const updated = [...prev];
            if (nobodyGuessed && awardedTo != null) {
                updated[awardedTo] += players.length - 1;
            } else if (players.length >= 3 && guessedBy.length === 1) {
                const guessedPlayer = guessedBy[0];
                updated[guessedPlayer] += 1;
                if (awardedTo != null) updated[awardedTo] += players.length - 2;
            } else {
                guessedBy.forEach((i) => {
                    updated[i] += 1;
                });
            }
            return updated;
        });

        // переход к следующему игроку или раунду
        if (currentIndex < players.length - 1) {
            setCurrentIndex((i) => i + 1);
            setPhase("player");
        } else {
            setCurrentIndex(0);
            if (round < TOTAL_ROUNDS) {
                setRound((r) => r + 1);
                setPhase("player");
            } else {
                // конец игры → переход к награждению
                setTimeout(() => setPhase("award"), 800);
            }
        }
    };

    // ✅ Исправлено: теперь передаём ВСЕХ игроков, а не только топ-3
    const winners = [...players]
        .map((p, i) => ({
            name: p.emojiData?.name || "Игрок",
            emoji: p.emojiData?.emoji || "🙂",
            score: scores[i],
        }))
        .sort((a, b) => b.score - a.score);

    if (!isLoaded) {
        return (
            <div
                style={{
                    backgroundColor: theme.surface.main,
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                }}
            />
        );
    }

    const backIconStyle = {
        position: "absolute",
        top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
        left: "16px",
        zIndex: 100,
    };

    const faqIconStyle = {
        position: "absolute",
        top: "calc(max(var(--tg-content-safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px)) + 48px)",
        right: "16px",
        zIndex: 100,
    };

    return (
        <>
            {/* ======= Основные фазы ======= */}
            <AnimatePresence mode="wait">
                {phase === "player" && (
                    <motion.div
                        key="player-phase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={overlayStyle}
                    >
                        <div style={backgroundContainer}>
                            <img src={brainplayerBG} alt="background" style={playerBackgroundStyle} />
                        </div>

                        {/* Верхние кнопки */}
                        <div style={backIconStyle}>
                            <IconButton icon={ArrowBackIcon} onClick={handleBackClick} />
                        </div>
                        <div style={faqIconStyle}>
                            <IconButton icon={FaqIcon} onClick={onShowOnboarding} />
                        </div>

                        {/* Контент */}
                        <div
                            style={{
                                ...safeAreaContainer,
                                paddingBottom: `calc(env(--tg-content-safe-area-inset-bottom, 0px) + ${layoutOffsets.bottom}px)`,
                            }}
                        >
                            <div style={centerContent}>
                                <div style={{ fontSize: 128 }}>
                                    {currentPlayer?.emojiData?.emoji || "🙂"}
                                </div>
                                <div style={nameStyle}>
                                    {currentPlayer?.emojiData?.name || "Игрок"}
                                </div>
                                <div style={subtextStyle}>твой ход</div>
                            </div>

                            <div style={buttonWrapperStyle}>
                                <PrimaryButton
                                    textColor={theme.icotex.white}
                                    onClick={() => {
                                        hapticSoft();
                                        setPhase("game");
                                    }}
                                >
                                    Начать
                                </PrimaryButton>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === "game" && (
                    <motion.div
                        key="game-phase"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35 }}
                        style={gameWrapperStyle}
                    >
                        <div style={backIconStyle}>
                            <IconButton icon={ArrowBackIcon} onClick={handleBackClick} />
                        </div>
                        <div style={faqIconStyle}>
                            <IconButton icon={FaqIcon} onClick={onShowOnboarding} />
                        </div>

                        {/* Контент */}
                        <div
                            style={{
                                ...safeAreaContainer,
                                paddingTop: `calc(env(--tg-content-safe-area-inset-top, 0px) + ${layoutOffsets.top}px)`,
                                paddingBottom: `calc(env(--tg-content-safe-area-inset-bottom, 0px) + ${layoutOffsets.bottom}px)`,
                            }}
                        >
                            <div style={titleBlockStyle}>
                                <h1 style={titleStyle}>Раунд {round} из {TOTAL_ROUNDS}</h1>
                                <div style={subtitleStyle}>Прочитай или придумай один из фактов</div>
                            </div>

                            <motion.div
                                key={round}
                                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={cardOuterStyle}
                            >
                                <div style={cardStyle}>
                                    <div style={questionsContainerStyle}>
                                        {currentQuestions.map((q, i) => (
                                            <div key={i} style={questionBlockStyle}>
                                                <p style={questionTextStyle}>{q}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <div style={buttonWrapperStyle}>
                                <PrimaryButton
                                    textColor={theme.icotex.white}
                                    onClick={() => {
                                        hapticSoft();
                                        setShowWhoGuessed(true);
                                    }}
                                >
                                    {round < TOTAL_ROUNDS ? "Подсчитать очки" : "Завершить игру"}
                                </PrimaryButton>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === "award" && (
                    <AwardCeremony
                        winners={winners}
                        onFinish={() => navigate("/brainhack", { replace: true })}
                    />
                )}
            </AnimatePresence>

            {/* ======= ВНЕ фазы ======= */}
            <WhoGuessed
                open={showWhoGuessed}
                onClose={() => setShowWhoGuessed(false)}
                players={players}
                currentPlayerIndex={currentIndex}
                onSubmit={handleScoresUpdate}
            />

            <div style={{ position: "fixed", zIndex: 10000 }}>
                <BottomSheet
                    open={showSheet}
                    onClose={() => setShowSheet(false)}
                    onConfirm={() => navigate("/brainhack", { replace: true })}
                    riveFile="/rive/tv.riv"
                    stateMachine="State Machine 1"
                    trigger="clickActivation"
                />
            </div>
        </>
    );
}

/* ===== Стили ===== */
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
    backdropFilter: "blur(8px)",
    zIndex: 9999,
    overflow: "hidden",
};

const backgroundContainer = {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
};

const playerBackgroundStyle = {
    width: "120%",
    height: "auto",
    objectFit: "contain",
    opacity: 0.9,
};

const safeAreaContainer = {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingLeft: "16px",
    paddingRight: "16px",
    boxSizing: "border-box",
};

const centerContent = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
};

const nameStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 32,
    color: theme.icotex.white,
    marginBottom: 4,
};

const subtextStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 400,
    fontSize: 18,
    color: theme.icotex.white,
    opacity: 0.9,
};

const buttonWrapperStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
};

const gameWrapperStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
    position: "relative",
    overflow: "hidden",
};

const titleBlockStyle = { textAlign: "center" };
const titleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--icotex-white)",
    margin: 0,
    marginBottom: 8,
};
const subtitleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 16,
    color: "var(--icotex-low)",
};
const cardOuterStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
};
const cardStyle = {
    backgroundColor: "var(--surface-zero)",
    borderRadius: 32,
    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
    width: "100%",
    padding: "24px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
};
const questionsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
};
const questionBlockStyle = {
    backgroundColor: "var(--surface-light)",
    borderRadius: 20,
    padding: "12px 16px",
};
const questionTextStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "var(--icotex-normal)",
    margin: 0,
    lineHeight: 1.4,
};
