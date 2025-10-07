import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { AnimatePresence, LayoutGroup } from "framer-motion";

import Home from "./page/Home.jsx";
import NeverEver from "./page/NeverEver.jsx";
import GameWrapper from "./page/GameWrapper.jsx";
import OnboardingScreen from "./page/OnboardingScreen.jsx";
import BrainHack from "./page/BrainHack.jsx";
import BrainHackGame from "./page/BrainHackGame.jsx";

// === Глобальный контейнер для фона ===
function PageContainer({ children }) {
    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000", // ✅ постоянный фон для всех страниц
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
}

// === Анимированные маршруты ===
function AnimatedRoutes() {
    const location = useLocation();

    return (
        <LayoutGroup>
            {/* ✅ используем "sync", чтобы убрать белый кадр */}
            <AnimatePresence mode="sync">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <PageContainer>
                                <Home />
                            </PageContainer>
                        }
                    />
                    <Route
                        path="/neverever"
                        element={
                            <PageContainer>
                                <NeverEver />
                            </PageContainer>
                        }
                    />
                    <Route
                        path="/game"
                        element={
                            <PageContainer>
                                <GameWrapper />
                            </PageContainer>
                        }
                    />
                    <Route
                        path="/onboarding"
                        element={
                            <PageContainer>
                                <OnboardingScreen />
                            </PageContainer>
                        }
                    />
                    <Route
                        path="/brainhack"
                        element={
                            <PageContainer>
                                <BrainHack />
                            </PageContainer>
                        }
                    />
                    <Route
                        path="/brainhackgame"
                        element={
                            <PageContainer>
                                <BrainHackGame />
                            </PageContainer>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </LayoutGroup>
    );
}

// === Корневой компонент приложения ===
function App() {
    return (
        <Router>
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
