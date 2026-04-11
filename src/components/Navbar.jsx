import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full py-3 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* BRANDING SECTION */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-extrabold shadow-sm group-hover:shadow-md transition-all">
            FM
          </div>

          <div className="flex flex-col">
            <span className="text-gray-900 font-extrabold text-xl tracking-tight leading-none">
              Focusmode
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              Study & Focus
            </span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors" to="/">
            Home
          </Link>
          <Link className="text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"to="/articles">
            Articles
          </Link>
          <Link className="text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors" to="/docs">
            Docs
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            to="/login"
          >
            Log in
          </Link>

          <Link
            className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all"
            to="/signup"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </header>
  );
}
