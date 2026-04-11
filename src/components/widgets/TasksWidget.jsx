import React, { useEffect, useState } from "react";

export default function TasksWidget() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const KEY = "fm_tasks_default";

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setTasks(JSON.parse(raw)); } catch (e) {}
  }, []);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {} }, [tasks]);

  function add() { if (!text.trim()) return; setTasks((s) => [...s, { id: Date.now(), text, done: false }]); setText(""); }
  function toggle(id) { setTasks((s) => s.map((t) => t.id === id ? { ...t, done: !t.done } : t)); }
  function remove(id) { setTasks((s) => s.filter((t) => t.id !== id)); }

  return (
    <div className="text-black">
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <div className={`flex-1 text-sm ${t.done ? "line-through text-slate-400" : ""}`}>{t.text}</div>
            <button onClick={() => remove(t.id)} className="text-red-500">✕</button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add task" className="flex-1 px-2 py-1 border rounded text-black" />
        <button onClick={add} className="px-3 py-1 bg-cyan-600 text-white rounded">Add</button>
      </div>
    </div>
  );
}
