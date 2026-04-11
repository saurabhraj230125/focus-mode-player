import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Timer, FileText, MonitorPlay, CheckSquare, Music, 
  MoreHorizontal, Video, Plus, RotateCcw
} from 'lucide-react';

const FocusmodeDashboard = () => {
  const [activeTab, setActiveTab] = useState('Timer');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'watch online videos', completed: false },
    { id: 2, text: 'Write notes', completed: true },
    { id: 3, text: 'Pause and solve examples', completed: false },
    { id: 4, text: 'maths', completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const navItems = [
    { name: 'Timer', icon: Timer },
    { name: 'Notes', icon: FileText },
    { name: 'YouTube', icon: MonitorPlay },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Music', icon: Music },
  ];

  return (
    <div className="h-screen w-full flex bg-slate-50 font-sans text-gray-800">
      
      {/* 1. Left Sidebar (Fixed Width ~ 260px) */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm z-10 shrink-0">
        <div className="flex items-center space-x-3 mb-8 px-2 pt-2">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            FM
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Focusmode</h1>
        </div>

        <div className="flex flex-col space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">
            WORKSPACE TOOLS
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <div className="flex-1 flex justify-start">
            <div className="text-sm font-semibold text-gray-600">
              Saturday, Apr 11
            </div>
          </div>
          
          <nav className="flex-1 flex justify-center space-x-8">
            <Link to="/" className="text-gray-500 hover:text-sky-600 font-medium text-sm transition-colors">Home</Link>
            <Link to="/analytics" className="text-gray-500 hover:text-sky-600 font-medium text-sm transition-colors">Analytics</Link>
            <Link to="/docs" className="text-gray-500 hover:text-sky-600 font-medium text-sm transition-colors">Docs</Link>
          </nav>

          <div className="flex-1 flex justify-end items-center space-x-3">
            <button className="px-4 py-1.5 border border-sky-200 text-sky-600 rounded-md text-sm font-medium hover:bg-sky-50 transition-colors">
              Reset
            </button>
            <div className="flex items-center space-x-1.5 bg-orange-50 text-orange-500 px-3 py-1.5 rounded-full font-bold text-sm shadow-sm border border-orange-100">
              <span>🔥 Streak: 0</span>
            </div>
            <button className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              Analytics 📊
            </button>
          </div>
        </header>

        {/* The Canvas */}
        <main 
          className="flex-1 overflow-auto p-8 relative"
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        >
          {/* Floating Widgets Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max max-w-7xl mx-auto">
            
            {/* YouTube Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center">
                    <MonitorPlay size={16} className="mr-2 text-gray-500" /> YouTube
                </h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Paste YouTube link here..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
                <div className="h-48 border-dashed border-2 border-red-200 bg-red-50 rounded-xl flex flex-col items-center justify-center text-center p-4">
                  <Video size={36} className="text-red-300 mb-3" />
                  <p className="font-medium text-sm text-red-500">Paste a YouTube link to start learning</p>
                </div>
              </div>
            </div>

            {/* Notes/Checklist Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center">
                  <CheckSquare size={16} className="mr-2 text-gray-500" /> Checklist
                </h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-col space-y-3 mb-6 flex-1">
                  {tasks.map(task => (
                    <label key={task.id} className="flex items-start space-x-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 cursor-pointer appearance-none bg-white border checked:bg-sky-500 checked:border-sky-500 transition-colors" 
                        />
                        {task.completed && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
                      </div>
                      <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'} transition-colors`}>{task.text}</span>
                    </label>
                  ))}
                </div>
                <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm font-semibold rounded-lg flex items-center justify-center transition-colors border border-gray-200">
                  <Plus size={16} className="mr-1.5" /> Add note
                </button>
              </div>
            </div>

            {/* Timer Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest flex items-center">
                  <Timer size={14} className="mr-2" /> TIMER
                </h3>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-1 w-full">
                <div className="flex flex-col items-center w-full mb-8">
                  <div className="text-7xl font-mono font-semibold text-slate-800 tracking-tight leading-none mb-4">
                    50:00
                  </div>
                  {/* Subtle Linear Progress Bar */}
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden max-w-[220px]">
                    {/* Simulated fill width */}
                    <div className="h-full bg-sky-400 rounded-full w-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-auto">
                  <button className="bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl py-3 px-8 shadow-sm transition-all text-sm">
                    Start Focus
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-50 rounded-full p-3 transition-colors flex-shrink-0" title="Reset Timer">
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default FocusmodeDashboard;