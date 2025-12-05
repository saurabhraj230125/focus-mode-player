import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Player from "./pages/Player";
import Docs from "./pages/Docs";
import Navbar from "./components/Navbar";
import Watermark from "./components/Watermark";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
        <Watermark />
      </div>
    </BrowserRouter>
  );
}

export default App;
