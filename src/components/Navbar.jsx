import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full py-4 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-bold">FM</div>
          <div>
            <div className="text-white font-semibold text-lg">Focus Mode Player</div>
            <div className="text-xs muted">Study with fewer distractions</div>
          </div>
        </div>

        <nav className="text-sm">
          <Link className="px-3 py-1 text-gray-300 hover:text-white" to="/">Home</Link>
          <Link className="px-3 py-1 text-gray-300 hover:text-white" to="/docs">Docs</Link>
        </nav>
      </div>
    </header>
  );
}
