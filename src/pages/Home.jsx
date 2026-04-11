import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rnd } from "react-rnd";
import WidgetWrapper from "../components/workspace/WidgetWrapper";
import TimerWidget from "../components/widgets/TimerWidget";
import NotesWidget from "../components/widgets/NotesWidget";
import YouTubeWidget from "../components/widgets/YouTubeWidget";
import TasksWidget from "../components/widgets/TasksWidget";
import MusicWidget from "../components/widgets/MusicWidget";

const LOCAL_LAYOUT_KEY = "focusmode_layout";
const LOCAL_WIDGETS_KEY = "focusmode_workspace_widgets";
const GRID_CONTAINER_PADDING = [20, 20];

// --- Default Sizes & Positions for Every Tool ---
const DEFAULT_WIDGET_RECTS = {
  youtube: { x: 40, y: 40, width: 520, height: 400 },
  timer: { x: 590, y: 40, width: 300, height: 200 },
  notes: { x: 590, y: 260, width: 300, height: 220 },
  tasks: { x: 40, y: 460, width: 320, height: 300 },
  music: { x: 380, y: 460, width: 320, height: 250 },
  fallback: { x: 40, y: 40, width: 320, height: 250 }
};

// Premium SVG Icons
const Icons = {
  Timer: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Notes: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  YouTube: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Tasks: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  Music: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
  SidebarToggle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
};

export default function Home() {
  const [widgets, setWidgets] = useState([]);
  const [rects, setRects] = useState({});
  const [draggingId, setDraggingId] = useState(null);
  
  // Responsive States
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768); 
  
  const workspaceRef = useRef(null);
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);

  // --- Streak Calculation ---
  function formatLocalDay(d) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const computeStreakFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem("fmp_time_sessions");
      const sessions = raw ? JSON.parse(raw) : [];
      const days = new Set(sessions.map((s) => formatLocalDay(new Date(s.start))));
      let count = 0;
      let d = new Date();
      while (days.has(formatLocalDay(d))) { count++; d.setDate(d.getDate() - 1); }
      setStreak(count);
    } catch (e) { setStreak(0); }
  }, []);

  useEffect(() => {
    computeStreakFromStorage();
    const id = setInterval(computeStreakFromStorage, 3000);
    return () => clearInterval(id);
  }, [computeStreakFromStorage]);

  // --- Restore Default Layout Function ---
  const loadDefaultWorkspace = useCallback(() => {
    const yt = "youtube_1", timer = "timer_1", notes = "notes_1";
    
    setWidgets([
      { id: yt, type: "youtube" }, 
      { id: timer, type: "timer" }, 
      { id: notes, type: "notes" }
    ]);
    
    setRects({
      [yt]: { ...DEFAULT_WIDGET_RECTS.youtube },
      [timer]: { ...DEFAULT_WIDGET_RECTS.timer },
      [notes]: { ...DEFAULT_WIDGET_RECTS.notes }
    });

    try { 
      localStorage.removeItem(LOCAL_LAYOUT_KEY); 
      localStorage.removeItem(LOCAL_WIDGETS_KEY); 
    } catch (e) {}
  }, []);

  // --- Initialize Workspace on Load ---
  useEffect(() => {
    const savedWidgets = localStorage.getItem(LOCAL_WIDGETS_KEY);
    const savedRects = localStorage.getItem(LOCAL_LAYOUT_KEY);

    if (savedWidgets && savedRects && JSON.parse(savedWidgets).length > 0) {
      setWidgets(JSON.parse(savedWidgets));
      setRects(JSON.parse(savedRects));
    } else {
      loadDefaultWorkspace();
    }
  }, [loadDefaultWorkspace]);

  // --- Persist Data ---
  useEffect(() => { try { localStorage.setItem(LOCAL_WIDGETS_KEY, JSON.stringify(widgets)); } catch (e) {} }, [widgets]);
  useEffect(() => { try { localStorage.setItem(LOCAL_LAYOUT_KEY, JSON.stringify(rects)); } catch (e) {} }, [rects]);

  // --- Resize Listener for Mobile detection ---
  useEffect(() => {
    function handleResize() {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck && collapsed) setCollapsed(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  // --- Widget Management ---
  const scrollToWidget = (id) => {
    try {
      const el = document.getElementById(`widget_${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (e) {}
  };

  const addWidget = useCallback((type) => {
    const existing = widgets.find((w) => w.type === type);
    if (existing) return scrollToWidget(existing.id);
    
    const id = `${type}_${Date.now()}`;
    setWidgets((s) => [...s, { id, type }]);
    
    // Look up default exact size for the specific tool added
    const startingRect = DEFAULT_WIDGET_RECTS[type] || DEFAULT_WIDGET_RECTS.fallback;
    setRects((r) => ({ ...r, [id]: { ...startingRect } }));
    
    if (isMobile) setCollapsed(true);
  }, [widgets, isMobile]);

  const toggleWidget = (type) => {
    const existing = widgets.find((w) => w.type === type);
    if (existing) removeWidget(existing.id);
    else addWidget(type);
  };

  const removeWidget = (id) => {
    setWidgets((s) => s.filter((w) => w.id !== id));
    setRects((r) => { const copy = { ...r }; delete copy[id]; return copy; });
  };

  const duplicateWidget = (id) => {
    const src = widgets.find((w) => w.id === id);
    if (!src) return;
    const nid = `${src.type}_${Date.now()}`;
    setWidgets((s) => [...s, { id: nid, type: src.type }]);
    
    // Offset the duplicated widget slightly so it doesn't perfectly hide the old one
    setRects((r) => ({ 
      ...r, 
      [nid]: r[id] 
        ? { x: r[id].x + 40, y: r[id].y + 40, width: r[id].width, height: r[id].height } 
        : { ...(DEFAULT_WIDGET_RECTS[src.type] || DEFAULT_WIDGET_RECTS.fallback) } 
    }));
  };

  const widgetFor = (w) => {
    switch (w.type) {
      case "timer": return <TimerWidget />;
      case "notes": return <NotesWidget />;
      case "youtube": return <YouTubeWidget />;
      case "tasks": return <TasksWidget />;
      case "music": return <MusicWidget />;
      default: return <div className="p-4">Unknown</div>;
    }
  };

  // --- Rnd Canvas Event Handlers ---
  const onDragStopWidget = (id, d) => setRects((r) => ({ ...r, [id]: { ...(r[id] || {}), x: Math.max(0, d.x), y: Math.max(0, d.y) } }));
  const onResizeStopWidget = (id, ref, pos) => {
    const width = Math.max(200, parseInt(ref.style.width, 10));
    const height = Math.max(150, parseInt(ref.style.height, 10));
    setRects((r) => ({ ...r, [id]: { ...(r[id] || {}), x: Math.max(0, pos.x), y: Math.max(0, pos.y), width, height } }));
  };

  // --- Helper for Sidebar Buttons ---
  const renderSidebarButton = (type, label, icon) => {
    const isActive = widgets.some(w => w.type === type);
    return (
      <button
        title={label}
        onClick={() => toggleWidget(type)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md font-semibold' 
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 font-medium'
        }`}
      >
        <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>{icon}</span>
        {(!collapsed || isMobile) && <span>{label}</span>}
      </button>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans relative">
      
      {/* MOBILE OVERLAY */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-50
        ${isMobile ? 'fixed h-full shadow-2xl' : 'relative'} 
        ${collapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}
        ${collapsed && !isMobile ? 'w-20' : 'w-64'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
          {(!collapsed || isMobile) && <span className="text-xl font-extrabold text-gray-900 tracking-tight">Focusmode</span>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg mx-auto transition-colors"
          >
            {isMobile && !collapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : Icons.SidebarToggle}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {(!collapsed || isMobile) && <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 px-2 mt-2">Workspace Tools</div>}
          {renderSidebarButton("timer", "Timer", Icons.Timer)}
          {renderSidebarButton("notes", "Notes", Icons.Notes)}
          {renderSidebarButton("youtube", "YouTube", Icons.YouTube)}
          {renderSidebarButton("tasks", "Tasks", Icons.Tasks)}
          {renderSidebarButton("music", "Music", Icons.Music)}
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-10 shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && collapsed && (
              <button onClick={() => setCollapsed(false)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            )}
            <div className="text-sm font-medium text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={loadDefaultWorkspace} className="hidden sm:block px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all">
              Reset
            </button>
            <div className="px-3 sm:px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full shadow-sm flex items-center gap-1">
              <span>🔥</span> <span className="hidden sm:inline">Streak:</span> {streak}
            </div>
            <button onClick={() => navigate("/analytics")} className="px-3 sm:px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all">
              <span className="hidden sm:inline">Analytics</span> 📊
            </button>
          </div>
        </header>

        {/* WORKSPACE CANVAS / MOBILE STACK */}
        <div className="flex-1 overflow-auto relative bg-slate-50 custom-scrollbar workspace" ref={workspaceRef}>
          {isMobile ? (
            /* MOBILE VIEW: Clean Vertical Stack */
            <div className="flex flex-col gap-6 p-4 pb-24 w-full max-w-md mx-auto">
              {widgets.map((w) => (
                <div key={w.id} id={`widget_${w.id}`} className="w-full bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden min-h-[250px] animate-fade-in">
                  <WidgetWrapper id={w.id} onRemove={() => removeWidget(w.id)} onDuplicate={() => duplicateWidget(w.id)}>
                    {widgetFor(w)}
                  </WidgetWrapper>
                </div>
              ))}
              {widgets.length === 0 && (
                <div className="text-center p-10 text-gray-400 font-medium mt-10 border-2 border-dashed border-gray-200 rounded-xl">
                  Open the menu to add tools.
                </div>
              )}
            </div>
          ) : (
            /* DESKTOP VIEW: Draggable Canvas */
            <div className="w-full h-full min-h-[800px]" style={{ padding: `${GRID_CONTAINER_PADDING[1]}px ${GRID_CONTAINER_PADDING[0]}px` }}>
              {widgets.map((w) => {
                const r = rects[w.id] || { ...(DEFAULT_WIDGET_RECTS[w.type] || DEFAULT_WIDGET_RECTS.fallback) };
                return (
                  <Rnd
                    key={w.id}
                    size={{ width: r.width, height: r.height }}
                    position={{ x: r.x, y: r.y }}
                    bounds="parent"
                    onDragStart={() => setDraggingId(w.id)}
                    onDragStop={(e, d) => { setDraggingId(null); onDragStopWidget(w.id, d); }}
                    onResizeStart={() => setDraggingId(w.id)}
                    onResizeStop={(e, dir, ref, delta, pos) => { setDraggingId(null); onResizeStopWidget(w.id, ref, pos); }}
                    dragGrid={[1, 1]}
                    enableUserSelectHack={true}
                    className={`absolute transition-shadow duration-200 rounded-xl workspace-rnd-item ${draggingId === w.id ? 'dragging' : 'shadow-sm hover:shadow-md z-10'}`}
                    minWidth={250}
                    minHeight={150}
                    resizeHandles={["se"]}
                  >
                    <div id={`widget_${w.id}`} className="w-full h-full bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col">
                      <WidgetWrapper id={w.id} onRemove={() => removeWidget(w.id)} onDuplicate={() => duplicateWidget(w.id)}>
                        {widgetFor(w)}
                      </WidgetWrapper>
                    </div>
                  </Rnd>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}