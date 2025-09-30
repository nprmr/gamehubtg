import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import Home from "./page/Home.jsx";
import NeverEver from "./page/NeverEver.jsx";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <LayoutGroup>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/neverever" element={<NeverEver />} />
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
