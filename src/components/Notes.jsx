import React, { useEffect, useState, useRef } from "react";

function cleanAndStructure(text) {
  if (!text) return "";

  // Normalize line endings and trim
  let t = text.replace(/\r\n/g, "\n").trim();

  // Collapse multiple blank lines
  t = t.replace(/\n{3,}/g, "\n\n");

  // Trim each line
  const lines = t.split("\n").map((l) => l.trim());

  // Convert dash-starting lines to bullets and group short lines into paragraphs
  const out = [];
  let buffer = [];
  for (let line of lines) {
    if (line === "") {
      if (buffer.length) {
        out.push(buffer.join(" "));
        buffer = [];
      }
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      if (buffer.length) {
        out.push(buffer.join(" "));
        buffer = [];
      }
      out.push(`- ${line.replace(/^[-*]\s+/, "")}`);
      continue;
    }

    // If line contains a colon and is short, treat it as a heading
    if (/^[A-Za-z ]{1,30}:$/.test(line) || /^[A-Za-z ]{1,30}:\s/.test(line)) {
      if (buffer.length) {
        out.push(buffer.join(" "));
        buffer = [];
      }
      out.push(line);
      continue;
    }

    buffer.push(line);
  }
  if (buffer.length) out.push(buffer.join(" "));

  return out.join("\n\n");
}

export default function Notes({ videoId }) {
  const storageKey = `fmp_notes_${videoId}`;
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setText(raw);
      else setText("");
    } catch {
      setText("");
    }
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;
    // debounce autosave
    setStatus("Saving...");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, text);
        setStatus(`Saved ${new Date().toLocaleTimeString()}`);
      } catch (e) {
        setStatus("Error saving");
      }
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, videoId]);

  const handleClean = () => {
    const cleaned = cleanAndStructure(text);
    setText(cleaned);
    setStatus("Cleaned");
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoId || "notes"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!confirm("Clear notes for this video?")) return;
    setText("");
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setStatus("Cleared");
  };

  return (
    <div className="mt-4 p-3 rounded card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">Notes Organizer</h3>
        <div className="text-gray-300 text-xs">{status}</div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="w-full p-3 rounded bg-slate-50 text-black resize-vertical shadow-inner"
        placeholder="Write notes while watching..."
      />

      <div className="flex gap-2 mt-3">
        <button onClick={handleClean} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded text-white text-sm btn">Smart Clean</button>
        <button onClick={handleExport} className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded text-white text-sm btn">Export</button>
        <button onClick={handleClear} className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-500 rounded text-white text-sm btn">Clear</button>
      </div>
    </div>
  );
}
