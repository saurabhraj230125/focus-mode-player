import React, { useEffect, useState, useRef } from "react";

const STORAGE_KEY = "fmp_time_sessions";

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    // ignore
  }
}

function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function isSameLocalDay(tsA, tsB) {
  const a = new Date(tsA);
  const b = new Date(tsB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function TimeTracker() {
  const [sessions, setSessions] = useState(() => loadSessions());
  const [runningStart, setRunningStart] = useState(null);
  const [now, setNow] = useState(Date.now());
  const tickRef = useRef(null);

  useEffect(() => {
    if (runningStart) {
      tickRef.current = setInterval(() => setNow(Date.now()), 500);
    } else {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [runningStart]);

  useEffect(() => saveSessions(sessions), [sessions]);

  function start() {
    setRunningStart(Date.now());
  }

  function stop() {
    if (!runningStart) return;
    const end = Date.now();
    const session = { start: runningStart, end, duration: end - runningStart };
    const next = [...sessions, session];
    setSessions(next);
    setRunningStart(null);
  }

  function clearToday() {
    const today = new Date();
    const remaining = sessions.filter((s) => !isSameLocalDay(s.start, today));
    setSessions(remaining);
  }

  function clearAll() {
    setSessions([]);
  }

  const today = new Date();
  const todays = sessions.filter((s) => isSameLocalDay(s.start, today));
  const runningDuration = runningStart ? now - runningStart : 0;
  const totalMs = todays.reduce((acc, s) => acc + (s.duration || Math.max(0, (s.end || now) - s.start)), 0) + runningDuration;
  const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);

  return (
    <div className="p-3 rounded mb-4 card">
      <h3 className="text-sm font-semibold mb-2">Time Tracker</h3>

      <div className="text-sm muted mb-2">Today: <span className="font-medium text-white">{totalHours} hrs</span></div>

      <div className="flex gap-2 mb-3">
        {!runningStart ? (
          <button onClick={start} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded btn">Start</button>
        ) : (
          <button onClick={stop} className="flex-1 bg-gradient-to-r from-red-600 to-rose-500 text-white py-2 rounded btn">Stop</button>
        )}
        <button onClick={clearToday} className="px-3 bg-slate-800 text-white rounded text-sm btn">Clear</button>
      </div>

      <div className="text-xs text-gray-300 mb-2">Sessions ({todays.length})</div>
      <div className="max-h-32 overflow-auto text-sm">
        {runningStart && (
          <div className="text-sm text-green-300 mb-1">Running: {formatDuration(now - runningStart)}</div>
        )}
        {todays.length === 0 && !runningStart ? (
          <div className="text-gray-500">No sessions today</div>
        ) : (
          todays
            .slice()
            .reverse()
            .map((s, i) => (
              <div key={`${s.start}-${i}`} className="flex justify-between text-gray-300 py-1 border-b border-slate-800">
                <div className="text-sm">
                  {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="text-gray-400">{formatDuration(s.duration)}</div>
              </div>
            ))
        )}
      </div>

      <div className="mt-3 text-center">
        <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300">Clear all</button>
      </div>
    </div>
  );
}
