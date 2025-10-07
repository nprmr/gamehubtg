import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import Home from "./page/Home.jsx";
import NeverEver from "./page/NeverEver.jsx";
import GameWrapper from "./page/GameWrapper.jsx"; // ✅ обертка
import OnboardingScreen from "./page/OnboardingScreen.jsx"; // ✅ экран онбординга
import BrainHack from "./page/BrainHack.jsx";
import BrainHackGame from "./page/BrainHackGame.jsx"

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <LayoutGroup>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/neverever" element={<NeverEver />} />
                    <Route path="/game" element={<GameWrapper />} /> {/* теперь через обертку */}
                    <Route path="/onboarding" element={<OnboardingScreen />} /> {/* экран онбординга */}
                    <Route path="/brainhack" element={<BrainHack />} />
                    <Route path="/brainhackgame" element={<BrainHackGame />} />
                </Routes>
            </AnimatePresence>
        </LayoutGroup>
    );
}

function App() {
    return (
        <Router>
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
