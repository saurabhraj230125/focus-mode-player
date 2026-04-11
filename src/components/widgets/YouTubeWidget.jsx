import React, { useState } from "react";
import VideoPlayer from "../VideoPlayer"; 
import "./YouTubeWidget.css";

// ✅ Robust Video ID extractor
function extractVideoId(url) {
  if (!url) return null;

  try {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    if (match) return match[1];

    const u = new URL(url);

    if (u.hostname.includes("youtube")) {
      return u.searchParams.get("v");
    }

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
  } catch {
    return null;
  }

  return null;
}

export default function YouTubeWidget() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const id = extractVideoId(value.trim());
    setVideoId(id);
  };

  return (
    <div className="youtube-widget-container">
      
      {/* ✅ Normal Mode */}
      {!isFullScreen && (
        <div className="youtube-widget">
          
          <div className="widget-header">
            <input
              value={input}
              onChange={handleChange}
              placeholder="Paste YouTube link here..."
              className="youtube-input"
            />

            {videoId && (
              <button
                className="focus-btn"
                onClick={() => setIsFullScreen(true)}
              >
                Focus Mode
              </button>
            )}
          </div>

          {/* ❌ Invalid Link */}
          {input && !videoId && (
            <p className="error-text">Invalid YouTube link</p>
          )}

          {/* 🎥 Player */}
          {videoId ? (
            <VideoPlayer videoId={videoId} />
          ) : (
            <div className="youtube-placeholder">
              <span style={{ fontSize: "28px" }}>🎥</span>
              <p>Paste a YouTube link to start learning</p>
            </div>
          )}
        </div>
      )}

      {/* 🔥 Fullscreen Mode */}
      {isFullScreen && videoId && (
        <div className="fixed inset-0 z-50 bg-black">
          
          <button
            className="exit-full-screen-btn"
            onClick={() => setIsFullScreen(false)}
          >
            ✕ Exit
          </button>

          <VideoPlayer videoId={videoId} fill={true} />
        </div>
      )}
    </div>
  );
}