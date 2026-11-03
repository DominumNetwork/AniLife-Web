import { AppSettings, ContinueWatchingEntry, UserProfile, WatchlistEntry } from '../types/anime';
import { INITIAL_CONTINUE_WATCHING } from './animeData';

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'profile-dev',
    name: 'Dev',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    accentColor: '#8B5CF6',
  },
  {
    id: 'profile-guest',
    name: 'Guest',
    avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
    accentColor: '#06B6D4',
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  showDetailsWhenPaused: true,
  autoSkipIntro: true,
  skipFiller: true,
  showSkipButton: true,
  skipButtonLength: 85,
  watchedThreshold: 80,
  defaultQuality: 'Auto',
  playbackSpeed: 1.0,

  showSubtitlesByDefault: true,
  subtitlesOnDub: false,
  preferredSubLanguage: 'English',
  secondChoiceSubtitles: 'Automatic',
  captionSize: 'Medium',

  accentColor: '#8B5CF6',
  backdropImage: '/assets/aistudio/Screenshot_20261102_214725_Anilili_b7aba3a9.jpg',
  backdropDim: 'Medium',
  backdropBlur: true,
  glassPopups: true,
  refreshSpinner: true,

  anilistConnected: true,
  anilistUsername: 'Lilidev',
  discordPresence: true,

  hideAdultContent: false,
  onlyWatchableEpisodes: false,
  dnsOverHttps: true,
  activeServer: 'anikoto'
};

const STORAGE_KEYS = {
  SETTINGS: 'anilili_settings_v1',
  WATCHLIST: 'anilili_watchlist_v1',
  CONTINUE: 'anilili_continue_v1',
  PROFILES: 'anilili_profiles_v1',
  ACTIVE_PROFILE: 'anilili_active_profile_v1',
  SEARCH_HISTORY: 'anilili_search_history_v1',
  DOWNLOADS: 'anilili_downloads_v1'
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadWatchlist(): WatchlistEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (!raw) {
      return [
        { animeId: 'gushing-over-magical-girls', status: 'Watching', updatedAt: new Date().toISOString() },
        { animeId: 'apothecary-diaries-s3', status: 'Plan to watch', updatedAt: new Date().toISOString() },
        { animeId: 'eminence-in-shadow', status: 'Completed', updatedAt: new Date().toISOString() },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWatchlist(entries: WatchlistEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save watchlist:', err);
  }
}

export function loadContinueWatching(): ContinueWatchingEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTINUE);
    if (!raw) return INITIAL_CONTINUE_WATCHING;
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONTINUE_WATCHING;
  }
}

export function saveContinueWatching(entries: ContinueWatchingEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTINUE, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save continue watching:', err);
  }
}

export function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (!raw) {
      return ['another world', 'Loner Life in Another World', '86', 'eminence in shadow'];
    }
    return JSON.parse(raw);
  } catch {
    return ['another world', 'Loner Life in Another World', '86', 'eminence in shadow'];
  }
}

export function saveRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searches));
  } catch (err) {
    console.error('Failed to save search history:', err);
  }
}
