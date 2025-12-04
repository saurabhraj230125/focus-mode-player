import React from "react";
import YouTube from "react-youtube";

export default function VideoPlayer({ videoId }) {
  return (
    <div className="flex justify-center items-center w-full">
      <YouTube
        videoId={videoId}
        className="w-full max-w-4xl"
        opts={{
          playerVars: {
            controls: 1,
            rel: 0,
            disablekb: 0
          }
        }}
      />
    </div>
  );
}
