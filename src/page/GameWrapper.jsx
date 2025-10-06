import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameScreen from "./GameScreen";
import OnboardingScreen from "./OnboardingScreen";
import { hasOnboarded } from "../utils/onboarding";

function GameWrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const { categories } = location.state || { categories: [] };
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (!hasOnboarded()) {
            if (categories.length > 0) {
                setShowOnboarding(true);
            } else {
                navigate("/neverever", { replace: true });
            }
        }
    }, [navigate, categories]);

    return (
        <>
            <GameScreen onShowOnboarding={() => setShowOnboarding(true)} />
            {showOnboarding && (
                <OnboardingScreen
                    asModal
                    from="/game"
                    categories={categories}
                    onClose={() => setShowOnboarding(false)}
                />
            )}
        </>
    );
}

export default GameWrapper;
