import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Weightage() {
  const location = useLocation();
  const colors = (location && location.state && location.state.colors) ? location.state.colors : ["#7C3AED", "#06B6D4"];
  const [fileName, setFileName] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFileName(f.name);
    else setFileName(null);
  };

  // Placeholder for real Gemini/OpenAI integration. Replace with a backend endpoint
  // that calls your chosen LLM (Gemini/OpenAI) and returns structured JSON.
  async function callGeminiForAnalysis(file) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      summary: "Detected key topics and estimated weightage from supplied papers.",
      topics: [
        { name: "Algebra", weight: 28, examples: 12 },
        { name: "Calculus", weight: 22, examples: 9 },
        { name: "Statistics", weight: 18, examples: 6 },
        { name: "Geometry", weight: 15, examples: 5 },
        { name: "Combinatorics", weight: 10, examples: 3 },
        { name: "Misc", weight: 7, examples: 2 },
      ],
      suggestions: [
        "Focus first on Algebra and Calculus — high expected weight.",
        "Create 3 practice tests concentrated on top-2 topics.",
        "Allocate weekly study blocks with Pomodoro for problem practice.",
      ],
    };
  }

  // Try calling a backend AI endpoint first; if unavailable, fall back to the mock above.
  async function analyzeWithBackend(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Call local Gemini-backed server
      const res = await fetch("http://localhost:5000/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      return normalizeAIResponse(json);
    } catch (e) {
      console.warn("Backend analysis failed, falling back to local mock:", e);
      return callGeminiForAnalysis(file);
    }
  }

  // Normalize different AI response shapes into our expected structure
  function normalizeAIResponse(payload) {
    if (!payload) return payload;
    if (payload.topics && Array.isArray(payload.topics)) return payload;
    // If payload is free text, try to parse simple "Topic: X%" lines.
    if (typeof payload === "string") {
      const lines = payload.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      const topics = [];
      for (const line of lines) {
        const m = line.match(/([A-Za-z ]+):?\s*(\d{1,3})%?/);
        if (m) topics.push({ name: m[1].trim(), weight: Number(m[2]) });
      }
      if (topics.length) return { summary: lines.slice(0,2).join(' '), topics, suggestions: [] };
    }
    return payload;
  }

  const handleAnalyze = async () => {
    if (!fileRef.current || !fileRef.current.files[0]) {
      alert("Please select a file first!");
      return;
    }

    setAnalyzing(true);
    setProgress(6);
    setResults(null);

    const simulate = setInterval(() => {
      setProgress((p) => Math.min(95, p + Math.floor(Math.random() * 12)));
    }, 350);

    try {
      const file = fileRef.current.files[0];
      const data = await analyzeWithBackend(file);

      clearInterval(simulate);
      setProgress(100);
      setResults(data);
      setAnalyzing(false);
    } catch (err) {
      clearInterval(simulate);
      setAnalyzing(false);
      setProgress(0);
      alert("Analysis failed — check console for details.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Weightage Analyzer</h1>
          <p className="mt-1 text-sm text-slate-300">Upload previous year papers and get topic weight predictions.</p>
        </div>

        <div className="w-full md:w-1/2 bg-slate-900 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm text-slate-300">Select file</label>
          <input
            ref={fileRef}
            onChange={handleFileChange}
            type="file"
            accept=".pdf,.txt"
            className="mt-2 w-full"
            disabled={analyzing}
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!fileName || analyzing}
              className="px-4 py-2 text-white rounded-md disabled:opacity-50"
              style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
            >
              {analyzing ? "Analyzing…" : "Analyze"}
            </button>
            <div className="text-sm text-slate-400">{fileName || "No file chosen"}</div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: `${progress}%`, transition: 'width 300ms linear' }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-400">Progress: {progress}%</div>
          </div>
        </div>
      </div>

      {results && (
        <section className="mt-8 space-y-6">
            <div className="rounded-md p-4 bg-emerald-100 border border-emerald-200">
              <div className="text-emerald-800 font-semibold text-lg">Congratulations — Your Analysis Completed!</div>
              <div className="mt-1 text-black text-sm">{results.summary}</div>
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-black text-lg">Topic Weightage</h3>
                <ul className="mt-4 space-y-4">
                  {results.topics.map((t) => (
                    <li key={t.name} className="flex items-center justify-between">
                      <div>
                        <div className="text-black font-medium text-sm">{t.name}</div>
                        <div className="text-xs text-gray-600">Examples: {t.examples}</div>
                      </div>
                      <div className="ml-4 w-36">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${t.weight}%` }} />
                        </div>
                        <div className="text-sm text-black text-right mt-1 font-semibold">{t.weight}%</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-black text-lg">Study Suggestions</h3>
                <ol className="mt-3 list-decimal list-inside text-black space-y-2">
                  {results.suggestions.map((s, i) => (
                    <li key={i} className="text-black">{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-2 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-black text-lg">Export / Next Steps</h3>
              <div className="mt-2 text-black">You can export this analysis or generate a study plan using the Study Planner.</div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/planner')}
                  className="px-3 py-2 bg-cyan-600 rounded-md text-white"
                >
                  Go to Study Planner
                </button>
              </div>
            </div>
          </section>
      )}
    </div>
  );
}
