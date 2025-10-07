import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "../components/IconButton";
import PrimaryButton from "../components/PrimaryButton";
import FaqIcon from "../icons/faq.svg?react";
import ArrowBackIcon from "../icons/arrowback.svg?react";
import brainplayerBG from "../assets/brainplayerBG.png";
import { theme } from "../theme.js";

export default function BrainHackGame({ onShowOnboarding }) {
    const location = useLocation();
    const players = location.state?.players || [];

    const [phase, setPhase] = useState("player");
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [safeOffsets, setSafeOffsets] = useState({ top: 0, bottom: 0 });

    const currentPlayer = players[currentIndex];

    // 💥 вибрация
    function hapticTugTugPauseTug() {
        const H = window.Telegram?.WebApp?.HapticFeedback;
        if (!H) return;
        const pattern = [
            { type: "medium", delay: 0 },
            { type: "medium", delay: 150 },
            { type: "heavy", delay: 600 },
        ];
        pattern.forEach(({ type, delay }) =>
            setTimeout(() => H.impactOccurred(type), delay)
        );
    }

    // 📱 безопасные отступы через Telegram API
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg?.viewportHeight) {
            const diff = tg.viewportHeight - tg.viewportStableHeight;
            const top = tg.safeAreaInsetTop || 0;
            const bottom = tg.safeAreaInsetBottom || diff || 0;
            setSafeOffsets({ top, bottom });
        }
        // обновлять при resize
        const handleResize = () => {
            const tg = window.Telegram?.WebApp;
            if (tg?.viewportHeight) {
                const diff = tg.viewportHeight - tg.viewportStableHeight;
                const top = tg.safeAreaInsetTop || 0;
                const bottom = tg.safeAreaInsetBottom || diff || 0;
                setSafeOffsets({ top, bottom });
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 👇 предзагрузка фона
    useEffect(() => {
        const img = new Image();
        img.src = brainplayerBG;
        img.onload = () => {
            setIsLoaded(true);
            hapticTugTugPauseTug();
        };
    }, []);

    // ====== данные для раундов ======
    const TOTAL_ROUNDS = 15;
    const [round, setRound] = useState(1);
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
    const currentQuestions = localQuestions[(round - 1) % localQuestions.length];

    const handleNextRound = () => {
        if (round < TOTAL_ROUNDS) {
            setRound((prev) => prev + 1);
            hapticTugTugPauseTug();
        } else {
            alert("Игра завершена!");
        }
    };

    if (!isLoaded)
        return (
            <div
                style={{
                    backgroundColor: theme.surface.main,
                    width: "100vw",
                    height: "100vh",
                }}
            />
        );

    const backIconStyle = {
        position: "absolute",
        top: `${safeOffsets.top + 48}px`,
        left: "16px",
        zIndex: 100,
    };

    const faqIconStyle = {
        position: "absolute",
        top: `${safeOffsets.top + 48}px`,
        right: "16px",
        zIndex: 100,
    };

    return (
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
                        <img
                            src={brainplayerBG}
                            alt="background"
                            style={playerBackgroundStyle}
                        />
                    </div>

                    <div style={backIconStyle}>
                        <IconButton icon={ArrowBackIcon} onClick={() => {}} />
                    </div>
                    <div style={faqIconStyle}>
                        <IconButton icon={FaqIcon} onClick={onShowOnboarding} />
                    </div>

                    <div
                        style={{
                            ...safeAreaContainer,
                            paddingTop: safeOffsets.top + 116,
                            paddingBottom: safeOffsets.bottom + 24,
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
                                    hapticTugTugPauseTug();
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
                        <IconButton
                            icon={ArrowBackIcon}
                            onClick={() => setPhase("player")}
                        />
                    </div>
                    <div style={faqIconStyle}>
                        <IconButton icon={FaqIcon} onClick={onShowOnboarding} />
                    </div>

                    <div
                        style={{
                            ...safeAreaContainer,
                            paddingTop: safeOffsets.top + 116,
                            paddingBottom: safeOffsets.bottom + 40,
                        }}
                    >
                        <div style={titleBlockStyle}>
                            <h1 style={titleStyle}>
                                Раунд {round} из {TOTAL_ROUNDS}
                            </h1>
                            <div style={subtitleStyle}>
                                Прочитай или придумай один из фактов
                            </div>
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
                                onClick={handleNextRound}
                            >
                                {round < TOTAL_ROUNDS
                                    ? "Подсчитать очки"
                                    : "Завершить игру"}
                            </PrimaryButton>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ===== стили ===== */

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "var(--surface-main)",
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
    paddingLeft: 16,
    paddingRight: 16,
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

const titleBlockStyle = {
    textAlign: "center",
    marginBottom: 24,
};

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
