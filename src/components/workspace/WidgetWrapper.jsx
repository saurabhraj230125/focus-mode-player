import React, { useState, useRef, useEffect } from "react";

// Premium SVG Icons
const Icons = {
  Drag: <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>,
  Options: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>,
  Duplicate: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>,
  Remove: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 4h6m-6 0V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
};

export default function WidgetWrapper({ id, children, onRemove, onDuplicate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const title = id ? id.split("_")[0].charAt(0).toUpperCase() + id.split("_")[0].slice(1) : "Widget";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden">

      {/* HEADER / DRAG AREA */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white/50 backdrop-blur-[2px] cursor-move select-none h-10 group">

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center">
            {Icons.Drag}
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest font-display">{title}</div>
        </div>

        {/* OPTIONS MENU */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            className={`p-1 rounded-md transition-colors ${open ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700'}`}
            title="Options"
          >
            {Icons.Options}
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate && onDuplicate(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg"
              >
                {Icons.Duplicate} Duplicate
              </button>

              <div className="h-[1px] w-full bg-gray-100 my-1"></div>

              <button
                onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg"
              >
                {Icons.Remove} Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 w-full relative overflow-auto p-2">
        {children}
      </div>

    </div>
  );
}
