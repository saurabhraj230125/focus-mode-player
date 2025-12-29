import React from "react";
import YouTube from "react-youtube";

export default function VideoPlayer({ videoId, onPlayerReady, className = "", fill = false }) {
  if (!videoId) return (
    <div className="w-full max-w-4xl mx-auto card p-6 text-center text-muted">
      Paste a YouTube link on Home to start
    </div>
  );

  if (fill) {
    // Full-viewport player for landscape mobile
    return (
      <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center ${className}`}>
        <div className="w-full h-full">
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: { controls: 1, rel: 0, disablekb: 0 },
            }}
            onReady={(e) => {
              if (onPlayerReady) onPlayerReady(e.target);
            }}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="relative w-full" style={{ maxWidth: '900px', paddingTop: '56.25%' }}>
        <div className="absolute inset-0">
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: { controls: 1, rel: 0, disablekb: 0 },
            }}
            onReady={(e) => {
              if (onPlayerReady) onPlayerReady(e.target);
            }}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
