import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const extractVideoId = (link) => {
  if (!link) return null;
  const onlyId = link.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(onlyId)) return onlyId;
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = link.match(regex);
  return match ? match[1] : null;
};

export default function Playlist({ currentId, storageKey = "fmp_playlist", initial = [] }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }, [items, storageKey]);

  const add = () => {
    const id = extractVideoId(input);
    if (!id) return;
    if (items.find((it) => it.id === id)) {
      setInput("");
      return;
    }
    const title = id;
    const thumb = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
    setItems([{ id, title, thumbnail: thumb }, ...items]);
    setInput("");
  };

  const remove = (id) => {
    setItems(items.filter((it) => it.id !== id));
  };

  return (
    <div className="bg-gray-900 bg-opacity-80 p-3 rounded">
      <h3 className="text-white font-semibold mb-2">Playlist</h3>

      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube URL or ID"
          className="flex-1 p-2 rounded bg-white text-black"
        />
        <button onClick={add} className="px-3 bg-blue-600 rounded text-white">Add</button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-auto">
        {items.length === 0 && <div className="text-gray-300">No items yet</div>}
        {items.map((it) => (
          <div
            key={it.id}
            className={`flex items-center justify-between p-2 rounded card ${it.id === currentId ? "border-l-4 border-cyan-400" : ""}`}
          >
            <div className="flex items-center gap-3">
              <img src={it.thumbnail || `https://i.ytimg.com/vi/${it.id}/mqdefault.jpg`} alt="thumb" className="w-16 h-10 object-cover rounded" />
              <button
                onClick={() => navigate(`/player/${it.id}`)}
                className="text-left text-white hover:underline truncate max-w-[10rem]"
                title={it.title}
              >
                {it.title}
              </button>
            </div>
            <div className="ml-2 flex gap-1">
              <button
                onClick={() => navigate(`/player/${it.id}`)}
                className="px-2 py-1 bg-green-600 rounded text-xs btn"
                title="Play"
              >
                ▶
              </button>
              <button
                onClick={() => remove(it.id)}
                className="px-2 py-1 bg-red-600 rounded text-xs btn"
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
