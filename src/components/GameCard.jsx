import React from "react";
import "../theme.css";
import { useRive } from "@rive-app/react-canvas";

function GameCard({ title, subtitle, label, players, categories, riveAnimation }) {
    // Хук вызывается всегда (ESLint не будет ругаться)
    const { RiveComponent } = useRive({
        src: riveAnimation || "", // если пусто, хук всё равно вызовется
        autoplay: true,
    });

    return (
        <div
            style={{
                width: "300px",
                height: "292px",
                padding: "4px",
                backgroundColor: "var(--surface-normal-alfa)",
                borderRadius: "32px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* Метка сверху */}
            {label && (
                <p
                    style={{
                        marginTop: "16px",
                        marginBottom: "24px",
                        fontFamily: "'Advent Pro', sans-serif",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "var(--icotex-white-alfa)",
                    }}
                >
                    {label}
                </p>
            )}

            {/* Заголовок */}
            <h2
                style={{
                    margin: 0,
                    fontFamily: "'Advent Pro', sans-serif",
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "var(--icotex-white)",
                    textAlign: "center",
                    padding: "0 8px",
                }}
            >
                {title}
            </h2>

            {/* Подзаголовок */}
            <p
                style={{
                    marginTop: "16px",
                    marginBottom: "24px",
                    fontFamily: "'Advent Pro', sans-serif",
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "var(--icotex-white)",
                    lineHeight: "1.4",
                    textAlign: "center",
                    padding: "0 12px",
                }}
            >
                {subtitle}
            </p>

            {/* Нижняя часть */}
            {riveAnimation ? (
                // ❌ Негативная карточка — анимация по центру
                <div
                    style={{
                        width: "92px",
                        height: "92px",
                        marginBottom: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <RiveComponent style={{ width: "100%", height: "100%" }} />
                </div>
            ) : (
                // ✅ Активная карточка — нижний блок растянут с отступами 4px
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "4px",
                        width: "100%",
                        padding: "0 4px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Левый блок */}
                    <div
                        style={{
                            flex: 1,
                            borderRadius: "24px",
                            backgroundColor: "var(--surface-zero-alfa)",
                            padding: "16px 16px 8px 16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
            <span
                style={{
                    fontFamily: "'Advent Pro', sans-serif",
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "var(--icotex-white)",
                }}
            >
              Игроков
            </span>
                        <span
                            style={{
                                marginTop: "8px",
                                fontFamily: "'Advent Pro', sans-serif",
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "var(--icotex-white)",
                            }}
                        >
              {players}
            </span>
                    </div>

                    {/* Правый блок */}
                    <div
                        style={{
                            flex: 1,
                            borderRadius: "24px",
                            backgroundColor: "var(--surface-zero-alfa)",
                            padding: "16px 16px 8px 16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
            <span
                style={{
                    fontFamily: "'Advent Pro', sans-serif",
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "var(--icotex-white)",
                }}
            >
              Категории
            </span>
                        <span
                            style={{
                                marginTop: "8px",
                                fontFamily: "'Advent Pro', sans-serif",
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "var(--icotex-white)",
                            }}
                        >
              {categories}
            </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameCard;
