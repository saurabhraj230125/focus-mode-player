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
  } catch (e) {}
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
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [runningStart]);

  useEffect(() => saveSessions(sessions), [sessions]);

  function start() {
    setRunningStart(Date.now());
  }

  function stop() {
    if (!runningStart) return;
    const end = Date.now();
    const session = { start: runningStart, end, duration: end - runningStart };
    setSessions([...sessions, session]);
    setRunningStart(null);
  }

  function clearToday() {
    const today = new Date();
    setSessions(sessions.filter((s) => !isSameLocalDay(s.start, today)));
  }

  function clearAll() {
    setSessions([]);
  }

  const today = new Date();
  const todays = sessions.filter((s) => isSameLocalDay(s.start, today));
  const runningDuration = runningStart ? now - runningStart : 0;
  const totalMs =
    todays.reduce((acc, s) => acc + (s.duration || Math.max(0, (s.end || now) - s.start)), 0) +
    runningDuration;
  const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);

  return (
    <div className="p-4 rounded-lg mb-4 bg-gray-800 text-white shadow-md">
      <h3 className="text-lg font-semibold mb-3">Time Tracker</h3>

      <div className="text-sm mb-3">
        Today: <span className="font-medium">{totalHours} hrs</span>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 mb-3">
        {!runningStart ? (
          <button
            onClick={start}
            className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-md font-semibold transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-md font-semibold transition"
          >
            Stop
          </button>
        )}
        <button
          onClick={clearToday}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-md font-semibold transition"
        >
          Clear Today
        </button>
      </div>

      {/* SESSIONS LIST */}
      <div className="text-xs text-gray-300 mb-2">Sessions ({todays.length})</div>
      <div className="max-h-36 overflow-auto text-sm">
        {runningStart && (
          <div className="text-green-300 mb-1">Running: {formatDuration(runningDuration)}</div>
        )}
        {todays.length === 0 && !runningStart ? (
          <div className="text-gray-500">No sessions today</div>
        ) : (
          todays
            .slice()
            .reverse()
            .map((s, i) => (
              <div
                key={`${s.start}-${i}`}
                className="flex justify-between py-1 border-b border-gray-700"
              >
                <div>{new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="text-gray-400">{formatDuration(s.duration)}</div>
              </div>
            ))
        )}
      </div>

      <div className="mt-3 text-center">
        <button
          onClick={clearAll}
          className="text-xs text-red-400 hover:text-red-300 transition"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
