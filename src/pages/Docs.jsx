import React from "react";

export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto p-8 docs-light">
      <h1 className="text-3xl font-bold mb-4 docs-title">Focus Mode Player — Documentation</h1>

      <section className="mb-6 card p-5">
        <h2 className="text-xl font-semibold mb-2">Overview <span className="doc-badge">New</span></h2>
        <p className="docs-lead">Focus Mode Player is a distraction-minimizing YouTube player built for students. Paste a YouTube link on the Home page to open a distraction-free player with notes, study scheduling, and lightweight playlist features.</p>
      </section>

      <section className="mb-6 card p-5">
        <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm docs-lead">
          <li>Open the app and paste a YouTube URL or the 11-character video ID into the Home input.</li>
          <li>Click <strong className="important">Start Focus Mode</strong> to open the player page.</li>
          <li>On the player page you can watch the video without typical YouTube distractions.</li>
        </ol>
      </section>

      <section className="mb-6 card p-5">
        <h2 className="text-xl font-semibold mb-2">Player Page — Features</h2>
        <ul className="list-disc list-inside space-y-2 text-sm docs-lead">
          <li><strong>Notes Organizer</strong> (below the video): take notes while watching — notes auto-save to your browser and include a <span className="doc-badge">Smart Clean</span> button to tidy formatting.</li>
          <li><strong>Lecture Todos</strong> (right sidebar): schedule lectures you must complete at specific times, mark <span className="important">Done</span>, or delete tasks. Tasks persist in <span className="doc-code">localStorage</span>.</li>
          <li><strong>Time Tracker</strong> (right sidebar): track study sessions manually with <span className="doc-badge">Start / Stop</span> — shows hours studied today.</li>
          <li><strong>Playlist</strong> (right sidebar): add quick video IDs or links, play or remove items. (Note: an advanced playlist manager was available earlier and has been removed per preference.)</li>
          <li><strong>Watermark</strong>: the app shows a minimal watermark to remind you this is a focused environment.</li>
        </ul>
      </section>

      <section className="mb-6 card p-5">
        <h2 className="text-xl font-semibold mb-2">Tips & Best Practices</h2>
        <div className="callout">
          <div className="text-sm docs-lead">Pro tip: Create your Lecture Todos before starting a session — it helps to stay focused and finish important topics first.</div>
        </div>
        <ul className="list-disc list-inside space-y-2 text-sm docs-lead">
          <li>Use the Notes Organizer to write short bullet points. Click <span className="doc-badge">Smart Clean</span> to tidy formatting before exporting.</li>
          <li>Create Lecture Todos before you start a study session so you have a clear plan for the day.</li>
          <li>Use the Time Tracker to log focused study sessions and review daily totals to build consistent study habits.</li>
          <li>If your pasted YouTube link doesn't work, try pasting the 11-character video ID (e.g. <span className="doc-code">dQw4w9WgXcQ</span>).</li>
        </ul>
      </section>

      <section className="mb-6 card p-5">
        <h2 className="text-xl font-semibold mb-2">Privacy & Storage</h2>
        <p className="text-sm docs-lead">All notes, playlists and local data are stored locally in your browser's <span className="doc-code">localStorage</span>. Nothing is sent to a server by default, so your data stays on your device.</p>
      </section>

      <section className="mb-6 card p-5">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc list-inside space-y-2 text-sm docs-lead">
          <li>If the video doesn't play, ensure the pasted URL contains a valid video ID. Try opening the original YouTube link directly in a new tab to verify.</li>
          <li>If the oEmbed thumbnail/title lookup fails (CORS), the app will fall back to a standard YouTube thumbnail URL.</li>
          <li>For long lecture videos, the Start button may show a delay if the ID extraction fails — try the direct video ID if necessary.</li>
        </ul>
      </section>

      
    </div>
  );
}
