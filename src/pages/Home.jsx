import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const extractVideoId = (link) => {
    if (!link) return null;

    const trimmed = link.trim();
    // If the user pasted only the ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    // Try to parse as a URL to extract v= param or path-based IDs
    try {
      const maybeUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const url = new URL(maybeUrl);

      // v= query param
      const v = url.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;

      // pathname patterns: /embed/ID, /shorts/ID, /watch/... (handled by v), youtu.be/ID
      const p = url.pathname || "";
      let m = p.match(/\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];

      if (url.hostname && url.hostname.includes("youtu.be")) {
        m = p.match(/^\/([A-Za-z0-9_-]{11})/);
        if (m) return m[1];
      }
    } catch (e) {
      // not a valid absolute URL, fall back to searching the string
    }

    // Fallback: find any 11-char candidate in the string
    const any = trimmed.match(/([A-Za-z0-9_-]{11})/);
    return any ? any[1] : null;
  };

  const handleStart = () => {
    const id = extractVideoId(url);
    if (id) {
      navigate(`/player/${id}`);
    } else {
      // provide quick feedback to the user
      alert("Could not parse a YouTube video ID from the pasted text. Please paste a full youTube link or the 11-character video ID.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-400 drop-shadow-md">
        Enter YouTube Link
      </h1>

      <input
        type="text"
        placeholder="Paste YouTube URL here"
        className="border p-3 w-96 rounded-lg bg-slate-800 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleStart}
        className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg btn"
      >
        Start Focus Mode
      </button>
    </div>
  );
}
