import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import CinemaSeatBooking from "./Components/CinemaSeatBooking";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/book/:location/:movie" element={<CinemaSeatBooking />} />
            </Routes>
        </Router>
    );
}

export default App;
