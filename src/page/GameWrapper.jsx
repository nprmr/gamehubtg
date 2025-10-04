import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameScreen from "./GameScreen";
import { hasOnboarded } from "../utils/onboarding";

function GameWrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const { categories } = location.state || { categories: [] };

    useEffect(() => {
        if (!hasOnboarded()) {
            if (categories.length > 0) {
                navigate("/onboarding", { state: { categories, from: "/game" } });
            } else {
                // если категорий нет — отправляем на экран выбора
                navigate("/neverever", { replace: true });
            }
        }
    }, [navigate, categories]);

    console.log("GameWrapper categories:", categories);

    return <GameScreen />;
}

export default GameWrapper;
