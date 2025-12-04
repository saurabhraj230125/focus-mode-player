import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const extractVideoId = (link) => {
    if (!link) return null;

    // If the user pasted only the ID
    const onlyId = link.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(onlyId)) return onlyId;

    // Match common YouTube URL patterns: v=, youtu.be/, embed/, shorts/
    const regex = /(?:youtube(?:-nocookie)?\.com\/(?:.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const handleStart = () => {
    const id = extractVideoId(url);
    if (id) navigate(`/player/${id}`);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Enter YouTube Link</h1>

      <input
        type="text"
        placeholder="Paste YouTube URL here"
        className="border p-3 w-96 rounded-lg"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleStart}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Start Focus Mode
      </button>
    </div>
  );
}
