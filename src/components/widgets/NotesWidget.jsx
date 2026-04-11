import React, { useEffect, useState } from "react";

export default function NotesWidget() {
  const KEY = "fm_notes_default";
  const [items, setItems] = useState([
    { id: 1, text: "Watch lecture actively", done: false },
    { id: 2, text: "Write notes", done: false },
    { id: 3, text: "Pause and solve examples", done: false },
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }, [items]);

  const toggle = (id) => setItems((s) => s.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  const add = () => setItems((s) => [...s, { id: Date.now(), text: "New note", done: false }]);
  const update = (id, text) => setItems((s) => s.map((it) => it.id === id ? { ...it, text } : it));

  return (
    <div className="text-black">
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-start gap-2">
            <input type="checkbox" checked={it.done} onChange={() => toggle(it.id)} />
            <input value={it.text} onChange={(e) => update(it.id, e.target.value)} className="flex-1 bg-transparent border-b border-dashed text-sm py-1 text-black" />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button onClick={add} className="px-3 py-1 bg-slate-100 rounded">Add note</button>
      </div>
    </div>
  );
}
