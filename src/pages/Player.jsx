import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Playlist from "../components/Playlist";
import Notes from "../components/Notes";
import TimeTracker from "../components/TimeTracker";
import LectureTodos from "../components/LectureTodos";

export default function Player() {
  const { id } = useParams();
  const [landscapeMode, setLandscapeMode] = useState(false);

  const defaultPlaylist = [
    { id: "dQw4w9WgXcQ", title: "Sample 1" },
    { id: "M7lc1UVf-VE", title: "Sample 2" },
  ];

  useEffect(() => {
    // Determine when to show landscape full-screen: small devices in landscape with a video loaded
    const mq = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(orientation: landscape)")
      : null;

    const check = () => {
      const isLandscape = mq ? mq.matches : false;
      const isSmall = typeof window !== "undefined" ? window.innerWidth < 768 : false;
      setLandscapeMode(!!id && isLandscape && isSmall);
    };

    check();

    if (mq && mq.addEventListener) mq.addEventListener("change", check);
    else if (mq && mq.addListener) mq.addListener(check);

    window.addEventListener("resize", check);

    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener("change", check);
      else if (mq && mq.removeListener) mq.removeListener(check);
      window.removeEventListener("resize", check);
    };
  }, [id]);

  // Lock scrolling when in landscape overlay
  useEffect(() => {
    if (landscapeMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [landscapeMode]);

  return (
    <div className="bg-black min-h-screen text-white p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        <main className="flex-1">
          <VideoPlayer videoId={id} fill={landscapeMode} />

          <div className="mt-4">
            <Notes videoId={id} />
          </div>
        </main>

        <aside className="w-full md:w-80 md:shrink-0 mt-4 md:mt-0 space-y-4">
          <TimeTracker />
          <LectureTodos />
          <Playlist currentId={id} initial={defaultPlaylist} />
        </aside>
      </div>

      {landscapeMode && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setLandscapeMode(false)}
            className="absolute top-4 right-4 z-60 px-3 py-2 bg-black/40 border border-white/20 rounded text-white"
            aria-label="Exit landscape">
            Exit
          </button>
          <div className="w-full h-full flex items-center justify-center">
            <VideoPlayer videoId={id} fill />
          </div>
        </div>
      )}
    </div>
  );
}
