import React, { useEffect, useRef, useState } from "react";

const TRACKS = {
  Rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "Brown Noise": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "Focus Music": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
};

export default function MusicWidget() {
  const [track, setTrack] = useState("Rain");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play(); else audioRef.current.pause();
  }, [playing, track]);

  return (
    <div className="text-black">
      <div className="flex gap-2 items-center">
        <select value={track} onChange={(e) => setTrack(e.target.value)} className="px-2 py-1 border rounded text-black">
          {Object.keys(TRACKS).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button onClick={() => setPlaying((s) => !s)} className="px-3 py-1 rounded bg-cyan-600 text-white">{playing ? "Pause" : "Play"}</button>
      </div>

      <div className="mt-2">
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
      </div>

      <audio ref={audioRef} loop src={TRACKS[track]} />
    </div>
  );
}
