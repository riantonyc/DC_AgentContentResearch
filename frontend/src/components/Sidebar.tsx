import React from 'react';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', icon: 'M12 5v14M5 12h14', path: '/' },
  { name: 'Spiritual Research', icon: 'M21 21-4.3-4.3M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', path: '/research' },
  { name: 'Content Ideas', icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-4', path: '/ideas' },
  { name: 'Script Builder', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', path: '/scripts' },
  { name: 'Calendar', icon: 'M3 4h18v16H3zM16 2v4M8 2v4M3 10h18', path: '/calendar' },
  { name: 'Creator Persona', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#EAEAEA] bg-[#FAFAFA] flex flex-col h-screen fixed left-0 top-0 pt-8 pb-4">
      <div className="px-6 mb-8 flex items-center gap-3 mt-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M5 10h14" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-[15px] tracking-tight text-[#111111] leading-tight">GraceScript Hub</h2>
          <p className="text-[11px] text-gray-500 font-medium">Christian Creator AI</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path}
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[#666666] hover:text-[#111111] hover:bg-white`}
          >
            <svg 
              className="mr-3 flex-shrink-0" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d={item.icon} />
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="px-6 mt-auto pt-4 border-t border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold">
            KR
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#111111]">Kreator Rohani</span>
            <span className="text-[10px] text-gray-400">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

