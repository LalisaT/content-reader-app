import React from 'react';
import { Newspaper, Compass, Bookmark, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange, bookmarkCount }) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Newspaper },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, badge: bookmarkCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-6 h-14 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all duration-150 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold scale-105'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 text-white text-[9px] font-bold px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-6 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
