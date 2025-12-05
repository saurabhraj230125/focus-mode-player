import React, { useState } from "react";

function splitSentences(text) {
  const cleaned = text.replace(/\n+/g, " ");
  const matches = cleaned.match(/[^.!?]+[.!?]?/g) || [cleaned];
  return matches.map((s) => s.trim()).filter(Boolean);
}

function topKeywords(text, n = 8) {
  const stop = new Set(["the", "is", "in", "and", "to", "of", "a", "for", "on", "with", "that", "as", "are", "by"]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !stop.has(w) && w.length > 2);
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n).map((r) => r[0]);
}

function generateSummary(transcript) {
  const sents = splitSentences(transcript);
  if (sents.length <= 3) return transcript;
  const keywords = topKeywords(transcript, 20);
  // score sentences by keyword hits
  const scored = sents.map((s) => {
    const lw = s.toLowerCase();
    let score = 0;
    for (const k of keywords.slice(0, 8)) if (lw.includes(k)) score++;
    return { s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((x) => x.s).join(" ");
}

function extractFormulas(transcript) {
  const lines = transcript.split(/\n+/);
  const formulas = [];
  for (const line of lines) {
    if (/[=<>±Σ∑∂Δπ]/.test(line) || /\d+\s*=/ .test(line) || /\bE=|\bF=|\bV=/.test(line)) {
      const t = line.trim();
      if (t.length > 3 && formulas.indexOf(t) === -1) formulas.push(t);
    }
  }
  return formulas.slice(0, 10);
}

function generateQuestions(transcript) {
  const sents = splitSentences(transcript).filter((s) => s.split(" ").length > 6);
  const qs = sents.slice(0, 6).map((s) => {
    // make a simple question from sentence
    if (/\bis\b|\bare\b|\bwas\b|\bwere\b/.test(s)) {
      return s.replace(/\?+$/g, "") + "?";
    }
    const words = s.split(/\s+/);
    const subject = words.slice(0, Math.min(4, words.length)).join(" ");
    return `What is ${subject.replace(/\.$/, "")}?`;
  });
  return qs;
}

function extractTimestamps(transcript) {
  const matches = [];
  const re = /(\d{1,2}:\d{2}:?\d{0,2})/g;
  let m;
  while ((m = re.exec(transcript)) !== null) {
    const idx = m.index;
    const context = transcript.slice(Math.max(0, idx - 40), idx + 80).replace(/\n/g, " ");
    matches.push({ time: m[1], context: context.trim() });
    if (matches.length >= 10) break;
  }
  // If none, create inferred timestamps by splitting
  if (matches.length === 0) {
    const sents = splitSentences(transcript).slice(0, 8);
    const guessed = sents.map((s, i) => ({ time: `${Math.floor(i * 5)}:00`, context: s }));
    return guessed;
  }
  return matches;
}

function simpleMindMap(transcript) {
  const keywords = topKeywords(transcript, 6);
  const map = { topic: keywords[0] || "Topic", nodes: [] };
  for (let i = 1; i < keywords.length; i++) map.nodes.push({ title: keywords[i], children: [] });
  return map;
}

export default function LectureAnalyzer() {
  const [input, setInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const analyze = (textArg) => {
    setStatus("Analyzing...");
    const text = textArg || transcript || input;
    if (!text || text.trim().length < 10) {
      setStatus("Please paste a transcript or a YouTube link (transcript preferred).");
      return;
    }
    if (/^https?:\/\//i.test(text) && text.trim().length < 50) {
      setStatus("You provided a URL only — paste the transcript for best results.");
      // still proceed but will likely produce limited output
    }
    // Simple heuristic analysis
    const summary = generateSummary(text);
    const formulas = extractFormulas(text);
    const questions = generateQuestions(text);
    const timestamps = extractTimestamps(text);
    const mindmap = simpleMindMap(text);
    setResult({ summary, formulas, questions, timestamps, mindmap });
    setStatus("Done");
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">AI Lecture Analyzer (local)</h4>
        <div className="text-sm text-gray-600 mb-2">Paste a transcript (recommended) or YouTube link and press Analyze. This is an offline heuristic analyzer; for richer results connect an AI service.</div>

        <textarea
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste transcript or YouTube link here..."
          className="w-full p-2 border rounded mb-2 h-28"
        />

        <div className="flex gap-2">
          <button onClick={() => { setTranscript(input); analyze(input); }} className="px-3 py-1 bg-blue-600 text-white rounded">Analyze</button>
          <button onClick={() => { setInput(""); setResult(null); setStatus(""); }} className="px-3 py-1 bg-gray-300 rounded">Reset</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">{status}</div>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h5 className="font-semibold mb-2">Summary</h5>
            <p className="text-sm text-gray-800">{result.summary}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h5 className="font-semibold mb-2">Key Formulas / Definitions</h5>
            {result.formulas.length === 0 ? (
              <div className="text-sm text-gray-600">No formulas detected.</div>
            ) : (
              <ul className="list-disc pl-5">
                {result.formulas.map((f, i) => (
                  <li key={i} className="text-sm">{f}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h5 className="font-semibold mb-2">Question Bank</h5>
            <ol className="pl-5 list-decimal">
              {result.questions.map((q, i) => (
                <li key={i} className="text-sm mb-1">{q}</li>
              ))}
            </ol>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h5 className="font-semibold mb-2">Important Timestamps</h5>
            <ul className="text-sm">
              {result.timestamps.map((t, i) => (
                <li key={i} className="mb-1"><strong>{t.time}</strong> — {t.context}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h5 className="font-semibold mb-2">Simple Mind Map</h5>
            <div className="text-sm">
              <div className="font-semibold">{result.mindmap.topic}</div>
              <ul className="pl-4 list-disc">
                {result.mindmap.nodes.map((n, i) => (
                  <li key={i}>{n.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
