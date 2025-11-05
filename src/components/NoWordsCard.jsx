import { useRive } from "@rive-app/react-canvas";
import FlatButton from "../components/FlatButton";

export default function NoWordsCard({ onChangeCategory, className }) {
    const { RiveComponent } = useRive({
        src: "/rive/nowords.riv",
        stateMachines: "State Machine 1", // 👈 правильное имя
        autoplay: true,
    });

    return (
        <div
            className={className}
            style={{
                width: "100%",
                backgroundColor: "var(--surface-normal-alfa)",
                borderRadius: 24,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ width: 128, height: 128, marginBottom: 8 }} aria-hidden="true">
                <RiveComponent />
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--icotex-white)", margin: "0 0 4px" }}>
                Слова закончились
            </h2>
            <p style={{ fontSize: 14, fontWeight: 400, color: "var(--icotex-low)", margin: "0 0 20px" }}>
                Измени категорию или выбери другую игру
            </p>
            <FlatButton onClick={onChangeCategory}>
                Изменить категорию
            </FlatButton>
        </div>
    );
}
