import React, { useEffect, useState } from "react";

const STORAGE_KEY = "fmp_lecture_todos";

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}

function formatTimeLocal(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return ts;
  }
}

export default function LectureTodos({ storageKey = STORAGE_KEY }) {
  const [todos, setTodos] = useState(() => loadTodos());
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => saveTodos(todos), [todos]);

  function addTodo() {
    if (!title) return;
    const ts = time ? new Date(time).getTime() : Date.now();
    const t = { id: Date.now().toString(36), title, time: ts, done: false };
    setTodos((s) => [...s, t].sort((a, b) => (a.time || 0) - (b.time || 0)));
    setTitle("");
    setTime("");
  }

  function toggleDone(id) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTodo(id) {
    setTodos((s) => s.filter((t) => t.id !== id));
  }

  function clearAll() {
    if (confirm("Clear all lecture todos?")) setTodos([]);
  }

  const upcomingCount = todos.filter((t) => !t.done).length;

  return (
    <div className="p-3 rounded mb-4 card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Lecture Todos</h3>
        <div className="text-xs muted">Upcoming: {upcomingCount}</div>
      </div>

      <div className="space-y-2 mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lecture title (e.g. Physics chapter 1)"
          className="w-full p-2 rounded bg-white text-black text-sm shadow-sm"
        />
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          type="datetime-local"
          className="w-full p-2 rounded bg-white text-black text-sm shadow-sm"
        />
        <div className="flex gap-2">
          <button onClick={addTodo} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded btn">Add</button>
          <button onClick={clearAll} className="px-3 bg-slate-800 text-white py-2 rounded btn">Clear</button>
        </div>
      </div>

      <div className="max-h-44 overflow-auto text-sm text-gray-200">
        {todos.length === 0 && <div className="text-gray-400">No lecture tasks yet</div>}
        {todos.map((t) => (
          <div key={t.id} className={`flex items-center justify-between p-2 rounded mb-1 ${t.done ? 'opacity-60' : ''}`}>
            <div className="flex-1">
              <div className={`truncate font-medium ${t.done ? 'line-through text-gray-500' : 'text-white'}`}>{t.title}</div>
              <div className="text-xs text-gray-400">{formatTimeLocal(t.time)}</div>
            </div>
            <div className="flex flex-col items-end ml-2 gap-1">
              <button onClick={() => toggleDone(t.id)} className="px-2 py-1 bg-emerald-600 rounded text-xs btn">{t.done ? 'Undo' : 'Done'}</button>
              <button onClick={() => removeTodo(t.id)} className="px-2 py-1 bg-rose-600 rounded text-xs btn">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
