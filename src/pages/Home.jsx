import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  // 1. ELON MUSK THINKING: Initialize a counter to measure "Input Energy" (Friction)
  const [pasteCount, setPasteCount] = useState(0);
  const navigate = useNavigate();

  const handlePasteCapture = (event) => {
    const pastedData = (event.clipboardData || window.clipboardData).getData('text');
    
    // 2. Increment the counter every time a paste occurs
    setPasteCount(prev => prev + 1);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'user_paste_link',
      pasted_text: pastedData,
      location: 'home_input_field'
    });
  };

  const extractVideoId = (link) => {
    if (!link) return null;
    const trimmed = link.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    try {
      const maybeUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const urlObj = new URL(maybeUrl);
      const v = urlObj.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      const p = urlObj.pathname || "";
      let m = p.match(/\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
      if (urlObj.hostname && urlObj.hostname.includes("youtu.be")) {
        m = p.match(/^\/([A-Za-z0-9_-]{11})/);
        if (m) return m[1];
      }
    } catch (e) {}
    const any = trimmed.match(/([A-Za-z0-9_-]{11})/);
    return any ? any[1] : null;
  };

  const handleStart = () => {
    const id = extractVideoId(url);
    if (id) {
      // 3. FINAL REPORT: Push the total efficiency count to GTM before leaving the page
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'video_play_intent',
        video_id: id,
        interaction_efficiency: pasteCount, // If this is > 1, the user struggled
        session_status: 'success'
      });

      navigate(`/player/${id}`);
    } else {
      // Optional: Track a "Failure" event to see what users are failing to paste
      window.dataLayer.push({
        event: 'video_play_failed',
        attempted_url: url
      });
      alert("Could not parse a YouTube video ID.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-400">
        Enter YouTube Link
      </h1>

      <input
        type="text"
        placeholder="Paste YouTube URL here"
        className="border p-3 w-96 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
        value={url}
        onPaste={handlePasteCapture}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button 
        onClick={handleStart} 
        className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition-transform"
      >
        Start Focus Mode
      </button>

      {/* Debug view for your local testing (optional) */}
      <p className="mt-2 text-slate-500 text-xs">Pastes this session: {pasteCount}</p>
    </div>
  );
}