import { useEffect } from "react";
import { useRive } from "@rive-app/react-canvas";

export default function PremiumCard({ id, onOpenPremium, theme, styles }) {
    const { rive, RiveComponent } = useRive({
        src: "/rive/crystall.riv",
        stateMachines: "State Machine 1",
        autoplay: true,
    });

    useEffect(() => {
        return () => {
            rive?.stop?.();
        };
    }, [rive]);

    return (
        <div
            id={id}
            onClick={onOpenPremium}
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
}
