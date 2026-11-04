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
    currentUser,
    setShowProfileModal,
    setShowSettingsModal,
    setShowRandomModal,
    setShowNotificationsModal,
    setShowAuthModal
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
          {/* Brand Logo & Title */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 mr-2 sm:mr-3 select-none cursor-pointer group shrink-0 focus:outline-none"
            title="AniLife Home"
            aria-label="AniLife Home"
          >
            <img
              src="/assets/images/AniLife-logo-fill.png"
              alt="AniLife Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md shadow-purple-950/60 group-hover:scale-105 transition-transform object-cover ring-1 ring-white/10"
            />
            <span className="hidden sm:inline-block text-lg sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300">
              ANILIFE
            </span>
          </button>

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

          {/* AniList Sync & Account Button */}
          <button
            onClick={() => setShowAuthModal(true)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              currentUser
                ? 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border-purple-500/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
            title="AniList Account & Sync"
          >
            {currentUser ? (
              <>
                <img
                  src={currentUser.avatar.medium}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="truncate max-w-[90px]">{currentUser.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[9px] font-black text-white flex items-center justify-center">
                  A
                </span>
                <span>Sign in</span>
              </>
            )}
          </button>

          {/* Profile Badge */}
          <button
            onClick={() => setShowProfileModal(true)}
            title={`Switch Profile (${activeProfile.name})`}
            aria-label="Profile"
            className="ml-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-purple-400/50 hover:ring-purple-300 transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: activeProfile.accentColor || '#F59E0B' }}
          >
            {activeProfile.avatar ? (
              <img src={activeProfile.avatar} alt={activeProfile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-xs sm:text-sm">{activeProfile.name.charAt(0).toUpperCase()}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
