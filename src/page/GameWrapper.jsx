import React, { useEffect, useState, useCallback } from "react";
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

    const handleShowOnboarding = useCallback(() => setShowOnboarding(true), []);
    const handleCloseOnboarding = useCallback(() => setShowOnboarding(false), []);

    return (
        <>
            <GameScreen onShowOnboarding={handleShowOnboarding} />
            {showOnboarding && (
                <OnboardingScreen
                    asModal
                    from="/game"
                    categories={categories}
                    onClose={handleCloseOnboarding}
                />
            )}
        </>
    );
}

export default GameWrapper;
