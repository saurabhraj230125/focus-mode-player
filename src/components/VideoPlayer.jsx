import React from "react";
import YouTube from "react-youtube";

export default function VideoPlayer({ videoId, onPlayerReady, fill = false }) {
  if (!videoId) return null;

  const playerOptions = {
    width: "100%",
    height: "100%",
    playerVars: {
      controls: 1,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      playsinline: 1,
      vq: "hd1080",
      origin: typeof window !== "undefined" ? window.location.origin : "",
    },
  };

  // 🔥 Fullscreen Mode
  if (fill) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <YouTube
          videoId={videoId}
          opts={playerOptions}
          onReady={(e) => onPlayerReady?.(e.target)}
          className="w-full h-full"
          iframeClassName="w-full h-full border-0 block"
        />
      </div>
    );
  }

  // ✅ Normal Mode
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <YouTube
          videoId={videoId}
          opts={playerOptions}
          onReady={(e) => onPlayerReady?.(e.target)}
          className="w-full h-full"
          iframeClassName="w-full h-full border-0 block"
        />
      </div>
    </div>
  );
}