import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Playlist from "../components/Playlist";

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
        </div>

        <div className="w-80">
          <Playlist currentId={id} initial={defaultPlaylist} />
        </div>
      </div>
    </div>
  );
}
