import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Fav from "./components/Fav";
import Trending from "./components/Trending";
import Funny from "./components/Funny";
import Sports from "./components/Sports";
import Anime from "./components/Anime";
import SoundGifsPage from "./components/SoundGifsPage";
import LeaderboardPage from "./components/LeaderboardPage";
import MemesPage from "./components/MemesPage";
import CartoonsPage from "./components/CartoonsPage";
import ApiLimitExceededPage from "./components/ApiLimitExceededPage";
const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/favorites" element={<Fav darkMode={darkMode} />} />
        <Route path="/trending" element={<Trending darkMode={darkMode} />} />
        <Route path="/funny" element={<Funny darkMode={darkMode} />} />
        <Route path="/sports" element={<Sports darkMode={darkMode} />} />
        <Route path="/anime" element={<Anime darkMode={darkMode} />} />
        <Route path="/SoundGifsPage" element={<SoundGifsPage darkMode={darkMode} />} />
        <Route path="/leaderboard" element={<LeaderboardPage darkMode={darkMode} />} />
        <Route path="/CartoonsPage" element={<CartoonsPage darkMode={darkMode} />} />
        <Route path="/MemesPage" element={<MemesPage darkMode={darkMode} />} />
        <Route path="/ApiLimitExceededPage" element={<ApiLimitExceededPage darkMode={darkMode} />} />
      </Routes>
    </Router>
  );
};

export default App;
