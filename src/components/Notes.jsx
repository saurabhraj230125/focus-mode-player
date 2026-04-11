import React, { useEffect, useState, useRef } from "react";

function cleanAndStructure(text) {
  if (!text) return "";

  let t = text.replace(/\r\n/g, "\n").trim();
  t = t.replace(/\n{3,}/g, "\n\n");

  const lines = t.split("\n").map((l) => l.trim());
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
  const [status, setStatus] = useState("Saved");
  const timeoutRef = useRef(null);

  // Load notes
  useEffect(() => {
    if (!videoId) return;
    try {
      const saved = localStorage.getItem(storageKey);
      setText(saved || "");
    } catch {
      setText("");
    }
  }, [videoId]);

  // Auto-save
  useEffect(() => {
    if (!videoId) return;

    setStatus("Auto-saving...");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, text);
        setStatus("Saved");
      } catch {
        setStatus("Error saving");
      }
    }, 800);

    return () => clearTimeout(timeoutRef.current);
  }, [text, videoId]);

  // Manual Save
  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, text);
      setStatus("Saved manually");
    } catch {
      setStatus("Error saving");
    }
  };

  const handleClean = () => {
    setText(cleanAndStructure(text));
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
    if (!confirm("Clear notes?")) return;
    setText("");
    localStorage.removeItem(storageKey);
    setStatus("Cleared");
  };

  return (
    <div className="mt-4 p-4 rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-800 font-semibold">Notes</h3>
        <span className="text-xs text-gray-500">{status}</span>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="w-full p-3 rounded-lg bg-gray-50 text-black resize-vertical shadow-inner outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Write notes while watching..."
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={handleSave} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:opacity-90">
          Save
        </button>

        <button onClick={handleClean} className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:opacity-90">
          Smart Clean
        </button>

        <button onClick={handleExport} className="px-3 py-1 rounded bg-green-500 text-white text-sm hover:opacity-90">
          Export
        </button>

        <button onClick={handleClear} className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:opacity-90">
          Clear
        </button>
      </div>
    </div>
  );
}
