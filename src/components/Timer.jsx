import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const Timer = ({ isFocusMode, setIsFocusMode }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setIsFocusMode(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, setIsFocusMode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsFocusMode(!isActive); // Activate visual focus scene based on timer play state
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setIsFocusMode(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  const strokeColor = isActive ? '#D4AF37' : '#2fc6f6';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-soft border border-white/50 w-full h-full">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg className="w-full h-full transform -rotate-90 pointer-events-none absolute inset-0">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 120}
            animate={{ strokeDashoffset: isActive ? ((100 - progress) / 100) * (2 * Math.PI * 120) : (2 * Math.PI * 120) * 0 }}
            initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
            transition={{ duration: 1, ease: 'linear' }}
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <span className={`text-6xl font-light tracking-tighter ${isActive ? 'text-focus-gold' : 'text-gray-800'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-gray-500 mt-2 font-medium tracking-wide uppercase text-sm">
            {isActive ? 'Deep Work' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleTimer}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${isActive ? 'bg-[#D4AF37] hover:bg-yellow-500' : 'bg-[#2fc6f6] hover:bg-blue-400'}`}
        >
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={resetTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-gray-600 shadow-soft border border-gray-100 hover:text-gray-800"
        >
          <RotateCcw size={20} />
        </motion.button>
      </div>
    </div>
  );
};
