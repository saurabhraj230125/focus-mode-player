import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Playlist from "../components/Playlist";
import Notes from "../components/Notes";
import Pomodoro from "../components/Pomodoro";
import TimeTracker from "../components/TimeTracker";
import LectureTodos from "../components/LectureTodos";

export default function Player() {
  const { id } = useParams();
  const defaultPlaylist = [
    { id: "dQw4w9WgXcQ", title: "Sample 1" },
    { id: "M7lc1UVf-VE", title: "Sample 2" },
  ];

  return (
    <div className="bg-black min-h-screen text-white p-4">
      <div className="max-w-6xl mx-auto flex gap-4">
        <div className="flex-1">
          <VideoPlayer videoId={id} />

          <div className="mt-4">
            <Notes videoId={id} />
          </div>
        </div>

        <div className="w-80">
          <TimeTracker />
          <LectureTodos />
          <Playlist currentId={id} initial={defaultPlaylist} />
        </div>
      </div>
    </div>
  );
}
