import { useEffect, forwardRef, useRef, useCallback } from "react";
import { useRive } from "@rive-app/react-canvas";

const PremiumCard = forwardRef(function PremiumCard({ id, onOpenPremium, theme, styles, className }, ref) {
    const { rive, RiveComponent } = useRive({
        src: "/rive/crystall.riv",
        stateMachines: "State Machine 1",
        autoplay: true,
    });

    const hapticRef = useRef(false);
    const hapticStart = useCallback(() => {
        if (!hapticRef.current) {
            hapticRef.current = true;
            window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
        }
    }, []);
    const hapticEnd = useCallback(() => { hapticRef.current = false; }, []);

    useEffect(() => {
        return () => {
            rive?.stop?.();
        };
    }, [rive]);

    return (
        <div
            id={id}
            ref={ref}
            className={className}
            onClick={onOpenPremium}
            onPointerDown={hapticStart}
            onPointerUp={hapticEnd}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenPremium?.();
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {RiveComponent && (
                    <RiveComponent
                        style={{
                            width: "100%",
                            height: "100%",
                            outline: "none",
                            userSelect: "none",
                        }}
                    />
                )}
            </div>

            <div
                style={{
                    ...styles.title,
                    color: theme.icotex.white,
                    marginTop: 16,
                }}
            >
                Хотите больше?
            </div>

            <div
                style={{
                    ...styles.subtitle,
                    color: theme.icotex.low,
                    textAlign: "center",
                    lineHeight: 1.4,
                    padding: "0 16px",
                    height: "auto",
                }}
            >
                Оформите премиум
            </div>
        </div>
    );
});

export default PremiumCard;
