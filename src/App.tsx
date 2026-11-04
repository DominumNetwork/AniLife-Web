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
import { AniListAuthModal } from './components/AniListAuthModal';
import { AppIntro } from './components/AppIntro';

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
    showAuthModal,
    setShowAuthModal,
    showIntro,
    setShowIntro,
    settings,
  } = useApp();

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Canvas background (AMOLED pure black vs Dark) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: settings.canvasBackground === 'amoled' ? '#000000' : '#121214'
        }}
      />

      {/* Optional Background Anime Backdrop with dimming and blur */}
      {settings.backdropSource !== 'none' && settings.backdropImage && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-700"
            style={{
              backgroundImage: `url(${settings.backdropImage})`,
              filter: settings.backdropBlur ? 'blur(16px)' : 'none',
              transform: settings.backdropBlur ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          {/* Dimming overlay */}
          <div
            className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundColor:
                settings.backdropDim === 'Dark'
                  ? 'rgba(0, 0, 0, 0.88)'
                  : settings.backdropDim === 'Light'
                  ? 'rgba(0, 0, 0, 0.50)'
                  : 'rgba(0, 0, 0, 0.70)',
            }}
          />
        </>
      )}
      <div className="fixed inset-0 z-0 bg-radial from-purple-900/10 via-transparent to-black/80 pointer-events-none" />

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

      {/* AniList Sign In & Auth Modal */}
      {showAuthModal && (
        <AniListAuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Animated AniLife Startup Intro */}
      {showIntro && (
        <AppIntro onClose={() => setShowIntro(false)} />
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
