import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudySession() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [sessionMinutes, setSessionMinutes] = useState(50);
  const [usePomodoro, setUsePomodoro] = useState(true);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [ambient, setAmbient] = useState(true);

  const extractVideoId = (link) => {
    if (!link) return null;
    const trimmed = link.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    try {
      const maybeUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const urlObj = new URL(maybeUrl);
      const v = urlObj.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      const p = urlObj.pathname || "";
      let m = p.match(/\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
      if (urlObj.hostname && urlObj.hostname.includes("youtu.be")) {
        m = p.match(/^\/([A-Za-z0-9_-]{11})/);
        if (m) return m[1];
      }
    } catch (e) {}
    const any = trimmed.match(/([A-Za-z0-9_-]{11})/);
    return any ? any[1] : null;
  };

  const handleStart = () => {
    const id = extractVideoId(url);
    if (!id) {
      alert("Please paste a valid YouTube link or ID.");
      return;
    }

    const options = {
      sessionMinutes,
      usePomodoro,
      workMinutes,
      breakMinutes,
      ambient,
    };

    navigate(`/player/${id}`, { state: { sessionOptions: options } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6" style={{background: 'linear-gradient(180deg,#081229,#081a2f 40%,#07172b)'}}>
      <div className="w-full max-w-3xl bg-white/5 border border-white/6 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-white">Study Session Player</h1>
          <p className="mt-2 text-sm text-slate-300">Paste a YouTube link (or ID) and configure your focus session.</p>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300">YouTube URL or ID</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube link or ID"
              className="mt-2 w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <label className="text-sm text-slate-300">Session length (minutes)</label>
              <input
                type="number"
                value={sessionMinutes}
                onChange={(e) => setSessionMinutes(Number(e.target.value))}
                className="mt-2 w-32 p-2 rounded bg-slate-800 text-white"
                min={10}
                max={240}
              />
              <div className="mt-3 text-xs text-slate-400">Overall intended study time for this session.</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Use Pomodoro</label>
                <input type="checkbox" checked={usePomodoro} onChange={(e) => setUsePomodoro(e.target.checked)} />
              </div>
              {usePomodoro && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400">Work (min)</label>
                    <input type="number" value={workMinutes} onChange={(e) => setWorkMinutes(Number(e.target.value))} className="mt-1 w-full p-2 rounded bg-slate-800 text-white" min={5} max={90} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Break (min)</label>
                    <input type="number" value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} className="mt-1 w-full p-2 rounded bg-slate-800 text-white" min={1} max={30} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-300">Ambient Focus Music</div>
              <div className="text-xs text-slate-400">Play soft background audio during the session.</div>
            </div>
            <div>
              <input type="checkbox" checked={ambient} onChange={(e) => setAmbient(e.target.checked)} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleStart} className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg shadow">Start Session</button>
            <button onClick={() => { setUrl(''); setSessionMinutes(50); setUsePomodoro(true); setAmbient(true); }} className="px-4 py-2 border border-slate-700 text-slate-200 rounded-lg">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
