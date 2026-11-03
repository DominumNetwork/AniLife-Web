import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Search,
  Calendar,
  Bookmark,
  Download,
  Dices,
  Bell,
  Settings
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeProfile,
    setShowProfileModal,
    setShowSettingsModal,
    setShowRandomModal,
    setShowNotificationsModal
  } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'mylist', label: 'My List', icon: Bookmark },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/40 border-b border-purple-900/20 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Branding & Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="hidden lg:flex items-center mr-3 select-none">
            <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">
              ANILILI
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/80 text-white shadow-lg shadow-purple-600/25 ring-1 ring-purple-400/40'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Random Pick (Dice) */}
          <button
            onClick={() => setShowRandomModal(true)}
            title="Random anime pick"
            aria-label="Random anime pick"
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Dices className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            title="Notifications"
            aria-label="Notifications"
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Settings"
            aria-label="Settings"
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Profile Badge */}
          <button
            onClick={() => setShowProfileModal(true)}
            title={`Switch Profile (${activeProfile.name})`}
            aria-label="Profile"
            className="ml-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs sm:text-sm ring-2 ring-purple-400/50 hover:ring-purple-300 transition-all cursor-pointer shadow-md"
          >
            {activeProfile.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
