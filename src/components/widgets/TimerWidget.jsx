import React, { useEffect, useRef, useState } from "react";

const MODES = {
  focus: 50 * 60,
  short: 10 * 60,
  long: 20 * 60,
};

export default function TimerWidget() {
  const [mode, setMode] = useState("focus");
  const [remaining, setRemaining] = useState(MODES[mode]);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  const alarmRef = useRef(null);

  useEffect(() => {
    setRemaining(MODES[mode]);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(ref.current); setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  // play a simple 5-second alarm via WebAudio when remaining reaches 0
  useEffect(() => {
    if (remaining !== 0) return;
    // avoid multiple alarms
    if (alarmRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880; // A5
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      // fade in quickly
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      o.start(now);
      alarmRef.current = { ctx, o, g };
      // stop after ~5s with a small fade out
      setTimeout(() => {
        try {
          const { o: _o, g: _g, ctx: _ctx } = alarmRef.current || {};
          if (_g && _ctx) {
            const t = _ctx.currentTime;
            _g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
            _o.stop(t + 0.65);
            setTimeout(() => { try { _ctx.close(); } catch (e) {} }, 800);
          }
        } catch (e) {}
        alarmRef.current = null;
      }, 5000);
    } catch (e) {
      // best-effort: ignore if audio cannot be created
      alarmRef.current = null;
    }
    // cleanup if component unmounts
    return () => {
      try {
        if (alarmRef.current) {
          const { o, g, ctx } = alarmRef.current;
          try { o.stop(); } catch (e) {}
          try { ctx.close(); } catch (e) {}
          alarmRef.current = null;
        }
      } catch (e) {}
    };
  }, [remaining]);

  function start() { if (remaining > 0) setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setRemaining(MODES[mode]); }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-slate-900">
      {/* Header: drag icon + title + menu */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate-400"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-xs font-semibold tracking-wider text-slate-500">TIMER</div>
        </div>
        <button className="text-slate-300 hover:text-slate-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 20a2 2 0 110-4 2 2 0 010 4z" /></svg>
        </button>
      </div>

      {/* Large centered timer */}
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-mono font-semibold text-slate-900">{mm}:{ss}</div>
      </div>

      {/* Controls and session buttons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={start} className="px-3 py-1 bg-cyan-600 text-white rounded-md text-sm hover:bg-cyan-700">Start</button>
          <button onClick={pause} className="px-3 py-1 bg-amber-400 text-white rounded-md text-sm hover:bg-amber-500">Pause</button>
          <button onClick={reset} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm hover:bg-slate-300">Reset</button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setMode('focus')} className={mode === 'focus' ? 'px-2 py-1 rounded-md text-sm bg-cyan-600 text-white' : 'px-2 py-1 rounded-md text-sm bg-slate-100 text-slate-600'}>Focus</button>
          <button onClick={() => setMode('short')} className={mode === 'short' ? 'px-2 py-1 rounded-md text-sm bg-cyan-600 text-white' : 'px-2 py-1 rounded-md text-sm bg-slate-100 text-slate-600'}>Short</button>
          <button onClick={() => setMode('long')} className={mode === 'long' ? 'px-2 py-1 rounded-md text-sm bg-cyan-600 text-white' : 'px-2 py-1 rounded-md text-sm bg-slate-100 text-slate-600'}>Long</button>
        </div>
      </div>

      {/* Lower section: sessions text + placeholder box */}
      <div className="mt-4 text-sm text-slate-500">
        <div>0/6 sessions</div>
        <div className="mt-2 bg-slate-100 rounded-md p-2 text-slate-500">No sessions yet</div>
      </div>
    </div>
  );
}
