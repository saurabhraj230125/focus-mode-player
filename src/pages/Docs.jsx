import React from "react";

export default function Docs() {
  return (
    // CRITICAL: h-screen and overflow-y-auto allow this specific page to scroll 
    // while keeping the main app body locked.
    <div className="h-screen w-full overflow-y-auto bg-slate-50 custom-scrollbar">
      
      {/* You can drop your <Navbar /> component right here if you have one! */}

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-8 pb-32">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Focusmode <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Docs</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium">Everything you need to know to study with fewer distractions.</p>
        </div>

        {/* Overview Section */}
        <section className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            Overview 
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 rounded-full border border-orange-100">
              New Update
            </span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Focusmode is a highly customizable, distraction-minimizing productivity dashboard built for students. 
            Instead of jumping between different tabs, you can drag, drop, and resize the exact tools you need—like a Pomodoro timer, notes, and a focused YouTube player—into one clean, personalized workspace.
          </p>
        </section>

        {/* Getting Started Section */}
        <section className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 leading-relaxed font-medium">
            <li>Open the app menu on the left side of your screen.</li>
            <li>Click on any tool (like <strong className="text-gray-900">Timer</strong> or <strong className="text-gray-900">YouTube</strong>) to add it to your workspace.</li>
            <li><strong>On Desktop:</strong> Click and drag the top bar of any widget to move it around. Drag the bottom right corner to resize it.</li>
            <li><strong>On Mobile:</strong> Your tools will automatically stack neatly so you can easily scroll through them with your thumb.</li>
          </ol>
        </section>

        {/* Features Section */}
        <section className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workspace Tools</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-3">
              <span className="text-xl">⏱</span>
              <div>
                <strong className="text-gray-900 block">Focus Timer</strong>
                Track your study sessions manually. Your daily streak is automatically calculated and displayed in the top navigation bar.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">📝</span>
              <div>
                <strong className="text-gray-900 block">Notes Organizer</strong>
                Take notes while watching lectures. Notes auto-save to your browser instantly.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">▶️</span>
              <div>
                <strong className="text-gray-900 block">YouTube Player</strong>
                Paste a YouTube link to watch educational content without seeing the comment section or algorithmic recommendations.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-xl">🎵</span>
              <div>
                <strong className="text-gray-900 block">Study Music Player</strong>
                Listen to high-quality ambient sounds, Lofi beats, or focus waves without opening a new tab.
              </div>
            </li>
          </ul>
        </section>

        {/* Tips & Best Practices */}
        <section className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips & Best Practices</h2>
          
          <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800 font-semibold">
              Pro tip: If your workspace gets messy from dragging too many windows around, just click the "Reset" button in the top menu to instantly organize your layout!
            </p>
          </div>
          
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Create your Tasks list before you start a study session so you have a clear plan for the day.</li>
            <li>Review your daily streak to build consistent, long-term study habits.</li>
            <li>If a YouTube link doesn't work, try pasting just the 11-character video ID (e.g. <code className="bg-gray-100 text-orange-600 px-1.5 py-0.5 rounded text-sm font-mono">dQw4w9WgXcQ</code>).</li>
          </ul>
        </section>

        {/* Privacy & Storage */}
        <section className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy & Storage</h2>
          <p className="text-gray-600 leading-relaxed">
            All notes, tasks, workspace layouts, and streak data are stored locally in your browser's <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">localStorage</code>. Nothing is sent to a server by default, ensuring your study data stays completely private and on your own device.
          </p>
        </section>

        {/* Founder Section */}
        <section className="mb-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg border border-slate-700 p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-500 rounded-full blur-[80px] opacity-30"></div>
          
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Meet the Founder</h2>
          <div className="space-y-4 text-slate-300 relative z-10 leading-relaxed">
            <p>
              <strong className="text-white">Saurabh Raj</strong> is the founder of Focusmode, a productivity tool designed to help students study with fewer distractions.
            </p>
            <p>
              Saurabh started Focusmode with a simple vision: to create a focused digital environment where students can learn, organize their tasks, and stay productive without unnecessary internet distractions. Being passionate about improving student productivity and empowering the youth of India, he began building the platform to support better study habits and smarter learning.
            </p>
            <p>
              The idea for Focusmode was driven by Saurabh’s deep interest in combining technology, AI, and education to solve the real problems students face while studying online.
            </p>
            <p className="pt-2">
              In just <strong className="text-orange-400">two months</strong>, the platform has already grown to <strong className="text-orange-400">100+ users</strong>, proving the growing need for tools that help students maintain intense focus and study more effectively.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
