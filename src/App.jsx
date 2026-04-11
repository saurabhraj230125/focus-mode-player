import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Importing existing components for ImmersiveView
import { Timer } from './components/Timer.jsx';
import { TaskQueue } from './components/TaskQueue.jsx';
import { AudioMixer } from './components/AudioMixer.jsx';

// Importing Pages
import Home from './pages/Home.jsx';
import Analytics from './pages/Analytics.jsx';
import Docs from './pages/Docs.jsx';
import Player from './pages/Player.jsx';
import StudySession from './pages/StudySession.jsx';
import Weightage from './pages/Weightage.jsx';
import FocusmodeDashboard from './pages/FocusmodeDashboard.jsx';

const ImmersiveScene = ({ isFocusMode }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white transition-colors duration-1000 ease-in-out">
      <AnimatePresence>
        {isFocusMode ? (
          <motion.div
            key="focus-bg"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-[#FDFDFD] to-[#D4AF37]/10"
          >
            {/* Ambient Gold Light */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#D4AF37]/20 rounded-full blur-[120px] mix-blend-multiply" />
          </motion.div>
        ) : (
          <motion.div
            key="break-bg"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-[#FDFDFD] to-[#138AFE]/10"
          >
            {/* Ambient Blue Light */}
            <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-[#138AFE]/20 rounded-full blur-[120px] mix-blend-multiply" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 backdrop-blur-[50px] bg-white/30" />
    </div>
  );
};

function ImmersiveView() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden font-sans text-gray-800 relative select-none">
      {/* Background Layer */}
      <ImmersiveScene isFocusMode={isFocusMode} />

      {/* Top Navbar / Header area (Optional minimal UI) */}
      <header className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-center pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800/80">Focus<span className="text-[#138AFE]">Mode</span></h1>
        
        {/* Subtle User Profile / Status Indicator */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isFocusMode ? 'bg-[#D4AF37] animate-pulse' : 'bg-[#138AFE]'}`} />
          <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            {isFocusMode ? 'Deep Work Active' : 'Ready'}
          </span>
        </div>
      </header>

      {/* Main Content Grid (Glassmorphism layout) */}
      <main className="absolute inset-0 z-10 p-10 pt-28 flex overflow-hidden">
        
        {/* Left Column: Mixer & Environment */}
        <section className="w-1/3 h-full pr-5 pb-10 flex flex-col pointer-events-auto">
          <AudioMixer />
        </section>

        {/* Center Column: Timer Engine */}
        <section className="w-1/3 h-full px-5 pb-10 flex flex-col justify-start pointer-events-auto">
          {/* We wrap the Timer to give it height constraint without stretching */}
          <div className="h-fit">
              <Timer isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
          </div>
        </section>

        {/* Right Column: Advanced Tasks */}
        <section className="w-1/3 h-full pl-5 pb-10 flex flex-col pointer-events-auto">
          <TaskQueue />
        </section>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/focusmode" element={<FocusmodeDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/player" element={<Player />} />
        <Route path="/study-session" element={<StudySession />} />
        <Route path="/weightage" element={<Weightage />} />
        <Route path="/immersive" element={<ImmersiveView />} />
      </Routes>
    </Router>
  );
}
