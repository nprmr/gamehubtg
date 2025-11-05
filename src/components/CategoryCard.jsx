import React, { useEffect, useMemo, useCallback } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import "../theme.css";

// импорт иконок из src/icons
import lockIcon from "../icons/lock.png";
import adultIcon from "../icons/adult.png";

/**
 * Компонент карточки категории
 *
 * Props:
 * - title: string
 * - riveFile: string (например "http://localhost:4000/rive/family.riv")
 * - locked?: boolean (если категория платная)
 * - adult?: boolean (если 18+)
 * - selected?: boolean (выбрана ли категория)
 * - onClick?: () => void
 * - badgeIcons?: { lock?: string; adult?: string } // кастомные иконки
 */
function CategoryCard({
                          title,
                          riveFile,
                          locked = false,
                          adult = false,
                          selected = false,
                          onClick,
                          badgeIcons = {},
                      }) {
    const STATE_MACHINE_NAME = "State Machine 1";

    // подключаем rive-анимацию
    const { rive, RiveComponent } = useRive({
        src: riveFile,
        stateMachines: [STATE_MACHINE_NAME],
        autoplay: true,
    });

    // достаём input Activation (boolean или trigger)
    const activationInput = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        "Activation"
    );

    // 🔹 фикс: при маунте выставляем false, чтобы не проигрывалось сразу
    useEffect(() => {
        if (activationInput && typeof activationInput.value === "boolean") {
            activationInput.value = false;
        }
    }, [activationInput]);

    const handleClick = useCallback(() => {
        // 👉 теперь не блокируем клик, а просто отдаём наружу
        if (onClick) {
            onClick();
        }

        // анимацию триггерим только для открытых категорий
        if (!locked && activationInput) {
            if (typeof activationInput.value === "boolean") {
                activationInput.value = !activationInput.value; // toggle для bool
            } else if (activationInput.fire) {
                activationInput.fire(); // fallback если вдруг trigger
            }
        }
    }, [onClick, locked, activationInput]);

    const handleKeyDown = useCallback((e) => {
        if (locked) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    }, [locked, handleClick]);

    // иконки (по умолчанию — из /icons)
    const adultIconSrc = badgeIcons.adult || adultIcon;
    const lockIconSrc = badgeIcons.lock || lockIcon;

    const badges = useMemo(() => ([
        adult ? { key: "adult", src: adultIconSrc, alt: "18+" } : null,
        locked ? { key: "lock", src: lockIconSrc, alt: "locked" } : null,
    ].filter(Boolean)), [adult, locked, adultIconSrc, lockIconSrc]);

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={locked ? -1 : 0}
            aria-pressed={selected}
            aria-disabled={locked}
            style={{
                width: "156px",
                height: "172px",
                padding: "16px 8px 0px 8px",
                gap: "12px",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                background: selected
                    ? "var(--icotex-white)"
                    : "var(--surface-normal-alfa)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                cursor: locked ? "not-allowed" : "pointer",
                position: "relative",
                transition: "transform 0.2s ease",
                outline: "none",
            }}
        >
            {/* Rive 92x92 */}
            <div
                style={{
                    width: "92px",
                    height: "92px",
                    opacity: locked ? 0.44 : 1,
                    marginBottom: "8px",
                }}
            >
                {riveFile ? (
                    <RiveComponent style={{ width: "100%", height: "100%" }} />
                ) : null}
            </div>

            {/* Заголовок */}
            <div
                style={{
                    height: "44px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        fontFamily: "Gilroy, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: locked
                            ? "var(--icotex-white-alfa)"
                            : selected
                                ? "var(--icotex-normal)"
                                : "var(--icotex-white)",
                        lineHeight: 1.2,
                        margin: 0,
                    }}
                >
                    {title}
                </p>
            </div>

            {/* бейджи adult / lock */}
            {badges.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "-16px",
                        right: "-12px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {badges.map((b, idx) => (
                        <img
                            key={b.key}
                            src={b.src}
                            alt={b.alt}
                            style={{
                                width: "44px",
                                height: "44px",
                                marginLeft: idx === 0 ? 0 : "-8px", // отрицательный gap
                            }}
                            draggable="false"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryCard;
