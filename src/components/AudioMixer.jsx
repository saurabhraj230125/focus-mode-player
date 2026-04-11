import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Disc, Volume2, Plus } from 'lucide-react';

const availableSounds = [
  { id: 'rain', icon: CloudRain, label: 'Soft Rain', color: '#63b3ed' },
  { id: 'wind', icon: Wind, label: 'Forest Wind', color: '#48bb78' },
  { id: 'lofi', icon: Disc, label: 'Lo-Fi Chill', color: '#ed8936' },
];

export const AudioMixer = () => {
  const [activeTracks, setActiveTracks] = useState([]);

  const addTrack = (sound) => {
    if (!activeTracks.find((t) => t.id === sound.id)) {
      setActiveTracks([...activeTracks, { ...sound, volume: 50 }]);
    }
  };

  const removeTrack = (id) => {
    setActiveTracks(activeTracks.filter((t) => t.id !== id));
  };

  const updateVolume = (id, newVol) => {
    setActiveTracks(activeTracks.map(t => t.id === id ? { ...t, volume: newVol } : t));
  };

  return (
    <div className="w-full h-full p-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-soft border border-white/50 flex flex-col">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center justify-between">
        Focus Soundscape
        <Volume2 className="text-gray-400" size={20} />
      </h2>

      {/* Available Sounds Drawer */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {availableSounds.map((sound) => (
          <motion.div
            key={sound.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addTrack(sound)}
            className="flex flex-col items-center justify-center p-3 w-20 bg-white rounded-2xl cursor-pointer border border-gray-100 shadow-sm hover:border-focus-blue/30 group"
          >
            <sound.icon size={24} className="text-gray-400 mb-2 group-hover:text-focus-blue transition-colors" />
            <span className="text-[10px] uppercase font-bold text-gray-500 text-center tracking-wider">{sound.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Active Tracks Well */}
      <div className="flex-grow bg-gray-50/50 rounded-2xl p-4 border border-gray-100 shadow-inner overflow-y-auto">
        <AnimatePresence>
          {activeTracks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-3"
            >
              <Plus size={32} />
              <p className="text-sm font-medium">Add sounds to your mix...</p>
            </motion.div>
          )}
          
          {activeTracks.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 last:mb-0 relative group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <track.icon size={18} style={{ color: track.color }} />
                  <span className="font-semibold text-gray-700 text-sm">{track.label}</span>
                </div>
                <button 
                  onClick={() => removeTrack(track.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Plus className="rotate-45" size={16} />
                </button>
              </div>
              
              {/* Custom Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={track.volume}
                onChange={(e) => updateVolume(track.id, e.target.value)}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-focus-blue"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
