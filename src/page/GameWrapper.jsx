// src/screens/GameWrapper.js
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
            navigate("/onboarding", { state: { categories } });
        }
    }, [navigate, categories]);

    return <GameScreen />;
}

export default GameWrapper;
