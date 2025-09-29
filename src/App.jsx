import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/Home.jsx";
import NeverEver from "./page/NeverEver.jsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Главная страница */}
                <Route path="/" element={<Home />} />

                {/* Страница игры */}
                <Route path="/neverever" element={<NeverEver />} />
            </Routes>
        </Router>
    );
}

export default App;