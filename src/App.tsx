import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/HeaderNav';
import { HomeFeed } from './components/HomeFeed';
import { BrowseSearch } from './components/BrowseSearch';
import { ScheduleView } from './components/ScheduleView';
import { MyListView } from './components/MyListView';
import { DownloadsView } from './components/DownloadsView';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { VideoPlayer } from './components/VideoPlayer';
import { SettingsModal } from './components/SettingsModal';
import { RandomPickModal } from './components/RandomPickModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileSelectModal } from './components/ProfileSelectModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedAnime,
    setSelectedAnime,
    activeVideo,
    setActiveVideo,
    showSettingsModal,
    setShowSettingsModal,
    showRandomModal,
    setShowRandomModal,
    showNotificationsModal,
    setShowNotificationsModal,
    showProfileModal,
    setShowProfileModal,
    settings,
  } = useApp();

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Background Anime Backdrop with dimming and blur matching screenshots */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${settings.backdropImage || '/assets/aistudio/Screenshot_20261102_214725_Anilili_b7aba3a9.jpg'})`,
          filter: settings.backdropBlur ? 'blur(14px)' : 'none',
          transform: settings.backdropBlur ? 'scale(1.05)' : 'scale(1)',
        }}
      />
      {/* Dark violet gradient overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor:
            settings.backdropDim === 'Dark'
              ? 'rgba(9, 7, 18, 0.92)'
              : settings.backdropDim === 'Light'
              ? 'rgba(11, 9, 20, 0.72)'
              : 'rgba(10, 8, 19, 0.84)',
        }}
      />
      <div className="fixed inset-0 z-0 bg-radial from-purple-900/15 via-transparent to-black/70 pointer-events-none" />

      {/* Main App Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderNav />

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5">
          {activeTab === 'home' && <HomeFeed />}
          {activeTab === 'search' && <BrowseSearch />}
          {activeTab === 'schedule' && <ScheduleView />}
          {activeTab === 'mylist' && <MyListView />}
          {activeTab === 'downloads' && <DownloadsView />}
        </main>
      </div>

      {/* OVERLAYS & MODALS */}

      {/* Anime Details Modal */}
      {selectedAnime && (
        <AnimeDetailModal
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}

      {/* Fullscreen Video Player */}
      {activeVideo && (
        <VideoPlayer
          anime={activeVideo.anime}
          initialEpisodeNumber={activeVideo.episodeNumber}
          initialAudioMode={activeVideo.audioMode}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}

      {/* Random Pick Modal */}
      {showRandomModal && (
        <RandomPickModal onClose={() => setShowRandomModal(false)} />
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal onClose={() => setShowNotificationsModal(false)} />
      )}

      {/* Profile Select Modal */}
      {showProfileModal && (
        <ProfileSelectModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
