import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, AppSettings, ContinueWatchingEntry, UserProfile, WatchlistEntry, WatchStatus } from '../types/anime';
import { ANIME_CATALOG } from '../utils/animeData';
import {
  DEFAULT_PROFILES,
  DEFAULT_SETTINGS,
  loadContinueWatching,
  loadRecentSearches,
  loadSettings,
  loadWatchlist,
  saveContinueWatching,
  saveRecentSearches,
  saveSettings,
  saveWatchlist
} from '../utils/storage';

interface VideoPlaybackTarget {
  anime: Anime;
  episodeNumber: number;
  audioMode: 'SUB' | 'DUB';
  serverId: string;
}

interface AppContextType {
  activeTab: 'home' | 'search' | 'schedule' | 'mylist' | 'downloads';
  setActiveTab: (tab: 'home' | 'search' | 'schedule' | 'mylist' | 'downloads') => void;
  selectedAnime: Anime | null;
  setSelectedAnime: (anime: Anime | null) => void;
  activeVideo: VideoPlaybackTarget | null;
  setActiveVideo: (video: VideoPlaybackTarget | null) => void;
  continueWatching: ContinueWatchingEntry[];
  watchlist: WatchlistEntry[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  setActiveProfile: (profile: UserProfile) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  showRandomModal: boolean;
  setShowRandomModal: (show: boolean) => void;
  showNotificationsModal: boolean;
  setShowNotificationsModal: (show: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  updateWatchProgress: (animeId: string, episodeNumber: number, currentTimeSec: number, durationSec: number) => void;
  removeFromContinueWatching: (animeId: string) => void;
  setAnimeWatchStatus: (animeId: string, status: WatchStatus) => void;
  playAnimeEpisode: (anime: Anime, episodeNum?: number, audioMode?: 'SUB' | 'DUB') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'schedule' | 'mylist' | 'downloads'>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoPlaybackTarget | null>(null);

  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [watchlist, setWatchlistState] = useState<WatchlistEntry[]>(loadWatchlist);
  const [continueWatching, setContinueWatchingState] = useState<ContinueWatchingEntry[]>(loadContinueWatching);
  const [recentSearches, setRecentSearchesState] = useState<string[]>(loadRecentSearches);

  const [profiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(DEFAULT_PROFILES[0]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Sync settings with root CSS variables for dynamic accent themes
  useEffect(() => {
    document.documentElement.style.setProperty('--anilili-accent', settings.accentColor);
  }, [settings.accentColor]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  const updateWatchProgress = (animeId: string, episodeNumber: number, currentTimeSec: number, durationSec: number) => {
    setContinueWatchingState(prev => {
      const existingIdx = prev.findIndex(item => item.animeId === animeId);
      const updatedItem: ContinueWatchingEntry = {
        animeId,
        episodeNumber,
        currentTimeSec,
        durationSec,
        serverName: settings.activeServer,
        audioMode: 'SUB',
        updatedAt: new Date().toISOString()
      };

      let nextList: ContinueWatchingEntry[];
      if (existingIdx >= 0) {
        nextList = [...prev];
        nextList[existingIdx] = updatedItem;
      } else {
        nextList = [updatedItem, ...prev];
      }
      saveContinueWatching(nextList);
      return nextList;
    });
  };

  const removeFromContinueWatching = (animeId: string) => {
    setContinueWatchingState(prev => {
      const filtered = prev.filter(item => item.animeId !== animeId);
      saveContinueWatching(filtered);
      return filtered;
    });
  };

  const setAnimeWatchStatus = (animeId: string, status: WatchStatus) => {
    setWatchlistState(prev => {
      const existingIdx = prev.findIndex(item => item.animeId === animeId);
      let updated: WatchlistEntry[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], status, updatedAt: new Date().toISOString() };
      } else {
        updated = [{ animeId, status, updatedAt: new Date().toISOString() }, ...prev];
      }
      saveWatchlist(updated);
      return updated;
    });
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearchesState(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      const next = [query.trim(), ...filtered].slice(0, 10);
      saveRecentSearches(next);
      return next;
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearchesState(prev => {
      const next = prev.filter(q => q !== query);
      saveRecentSearches(next);
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearchesState([]);
    saveRecentSearches([]);
  };

  const playAnimeEpisode = (anime: Anime, episodeNum: number = 1, audioMode: 'SUB' | 'DUB' = 'SUB') => {
    setActiveVideo({
      anime,
      episodeNumber: episodeNum,
      audioMode,
      serverId: settings.activeServer || 'anikoto'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAnime,
        setSelectedAnime,
        activeVideo,
        setActiveVideo,
        continueWatching,
        watchlist,
        settings,
        updateSettings,
        profiles,
        activeProfile,
        setActiveProfile,
        showProfileModal,
        setShowProfileModal,
        showSettingsModal,
        setShowSettingsModal,
        showRandomModal,
        setShowRandomModal,
        showNotificationsModal,
        setShowNotificationsModal,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        updateWatchProgress,
        removeFromContinueWatching,
        setAnimeWatchStatus,
        playAnimeEpisode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
