Focus Mode Player

Focus Mode Player is a minimal React + Vite app that creates a distraction-free environment for students to watch YouTube videos, take notes, manage tasks, and track study time — all in one focused workspace.

🚀 Features

Distraction-Free YouTube Player: Paste a YouTube URL or video ID to watch videos without ads, recommendations, or clutter.

Floating Workspace Widgets: Timer, Notes, Tasks, and YouTube widgets can be moved and resized.

Pomodoro Timer & Streak Tracker: Track study sessions and maintain daily focus streaks.

Notes Organizer: Take notes while watching videos; auto-save and tidy formatting with a Smart Clean feature.

Local Storage Persistence: All data stays on your device — no server needed.

⚙️ Setup (Development)

Run these commands from your project root:

# Install dependencies
npm install

# Start development server
npm run dev


Open http://localhost:5173 in your browser to view the app.

Tailwind CSS is preconfigured. If needed, regenerate the Tailwind output using postcss and tailwindcss.

📝 Usage Guide

Paste a YouTube link or 11-character video ID in the Home page input.
Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ.

Click Start Focus Mode to open the distraction-free player page.

Use Workspace Widgets:

YouTube Widget: Watch your video in a minimal black player.

Timer Widget: Start/stop the Pomodoro timer and track study sessions.

Notes Widget: Take notes and export them.

Tasks Widget: Add Lecture Todos, mark as done, or delete tasks.

Reset Layout: Click Reset to remove all widgets and start fresh.

Analytics & Streak: Track your study performance over days with the streak tracker.

🗂 Files of Interest

src/pages/Home.jsx — Home page for pasting links

src/pages/Player.jsx — Distraction-free player page

src/components/VideoPlayer.jsx — Embeds YouTube using react-youtube

src/components/widgets/* — Timer, Notes, Tasks, Music, YouTube widgets

tailwind.config.js & postcss.config.cjs — Tailwind setup

🎨 Design / Style Guide
Element	Color / Style
Background Grid Canvas	#F8FAFC
Widget Card Background	#FFFFFF
Active Sidebar / Buttons	#F97316
Secondary Buttons / Timer	#0EA5E9
Shadows	0 4px 6px -1 rgba(0,0,0,0.1)
Typography	Sans-serif, clean, modern

Widgets have soft shadows and neumorphic influence for a modern, focus-oriented look.

👨‍💻 Founder

Saurabh Raj is the founder of Focus Mode Player, a productivity tool built to help students study with fewer distractions.

Saurabh created Focus Mode Player to provide a focused digital environment for learning, organizing tasks, and tracking study sessions. The platform started from a simple idea: combine technology and education to solve real student problems while studying online.

In just four months, Focus Mode Player has grown to 100+ active users, proving the need for tools that help students maintain focus and productivity.

⚡ Tips

Create Lecture Todos before starting a study session to maximize focus.

Take short bullet-point notes and use the Smart Clean feature to tidy formatting.

Use the Pomodoro timer and streak tracker to monitor your productivity.

If a YouTube link doesn’t work, try the 11-character video ID.