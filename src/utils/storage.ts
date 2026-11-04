import { AppSettings, ContinueWatchingEntry, UserProfile, WatchlistEntry, ThemePresetName } from '../types/anime';
import { INITIAL_CONTINUE_WATCHING } from './animeData';

export const POPULAR_AVATARS = [
  { name: 'Satoru Gojo', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b127997-vWnCSn7qfHw4.png' },
  { name: 'Monkey D. Luffy', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-I2bAezgqYJ3r.png' },
  { name: 'Frieren', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b183492-Y6fBffGg5V6g.png' },
  { name: 'Maomao', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b139982-hP7d9J2k0G5l.png' },
  { name: 'Roronoa Zoro', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b62-pXN86lM6i17U.png' },
  { name: 'Anya Forger', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b138100-q0B6g3F9m4P2.png' },
  { name: 'Levi Ackerman', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b45627-yT569N1X8J4E.png' },
  { name: 'Killua Zoldyck', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b27-oWw1yW9s5Gq2.png' },
  { name: 'Megumin', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b89361-4Z8L7G5h9V01.png' },
  { name: 'Rimuru Tempest', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b124507-6B7f8D9m0P12.png' },
];

export const THEME_PRESETS: Record<ThemePresetName, { canvas: 'amoled' | 'dark'; accent: string; label: string }> = {
  'Midnight': { canvas: 'amoled', accent: '#8B5CF6', label: 'Midnight (AMOLED + Purple)' },
  'Crimson Night': { canvas: 'amoled', accent: '#D1102B', label: 'Crimson Night (Blood Red)' },
  'Toxic': { canvas: 'amoled', accent: '#39FF14', label: 'Toxic (Neon Green)' },
  'Royal': { canvas: 'amoled', accent: '#9333EA', label: 'Royal (Deep Purple)' },
  'Deep Sea': { canvas: 'amoled', accent: '#3B82F6', label: 'Deep Sea (Ocean Blue)' },
  'Cyber': { canvas: 'amoled', accent: '#22D3EE', label: 'Cyber (Cyan Glow)' },
  'Sakura': { canvas: 'dark', accent: '#F472B6', label: 'Sakura (Pink Pastel)' },
  'Ember': { canvas: 'amoled', accent: '#F97316', label: 'Ember (Sunset Orange)' },
  'Gilded': { canvas: 'amoled', accent: '#FACC15', label: 'Gilded (Gold)' },
  'Forest': { canvas: 'dark', accent: '#10B981', label: 'Forest (Emerald)' },
  'High contrast': { canvas: 'amoled', accent: '#FFFFFF', label: 'High contrast (Pure Monochrome)' },
};

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'profile-dominum',
    name: 'Dominum',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b127997-vWnCSn7qfHw4.png',
    accentColor: '#8B5CF6',
    pin: '1234',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'profile-guest',
    name: 'Guest',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b183492-Y6fBffGg5V6g.png',
    accentColor: '#06B6D4',
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'profile-maomao',
    name: 'Anime Fan',
    avatar: 'https://s4.anilist.co/file/anilistcdn/character/large/b139982-hP7d9J2k0G5l.png',
    accentColor: '#10B981',
    createdAt: Date.now() - 20000000,
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  // Theme & Appearance
  themePreset: 'Midnight',
  canvasBackground: 'amoled',
  accentColor: '#8B5CF6',
  backdropSource: 'none',
  backdropImage: 'https://image.tmdb.org/t/p/w1280/tka5fcGkFclwf3brgUZunXHIwAg.jpg',
  backdropDim: 'Medium',
  backdropBlur: true,
  glassPopups: true,
  refreshSpinner: true,
  playAppIntro: true,

  // Player
  autoPlayNext: true,
  autoSkipIntro: true,
  skipFiller: true,
  showSkipButton: true,
  skipButtonLength: 85,
  watchedThreshold: 80,
  defaultQuality: 'Auto',
  playbackSpeed: 1.0,
  screenFit: 'Fit',
  defaultAudioMode: 'SUB',

  // Subtitles
  showSubtitlesByDefault: true,
  subtitlesOnDub: false,
  preferredSubLanguage: 'English',
  secondChoiceSubtitles: 'Automatic',
  captionSize: 'Medium',
  subtitleOffsetSec: 0,

  // Servers & Sources
  activeServer: 'xfdm',
  serverPriority: [
    'xfdm',
    'anichan',
    'zoko',
    'animepahe',
    'anikoto',
    'animeheaven',
    'animeav1',
    'kaa',
    'allanime',
    'rareanimes',
    'kartoons',
    'onepace'
  ],
  enabledServers: [
    'xfdm',
    'anichan',
    'zoko',
    'animepahe',
    'anikoto',
    'animeheaven',
    'animeav1',
    'kaa',
    'allanime',
    'rareanimes',
    'kartoons',
    'onepace'
  ],

  // Content
  hideAdultContent: false,
  titleLanguage: 'english',
  blurSpoilers: false,
  onlyWatchableEpisodes: false,

  // Accounts & Sync
  anilistConnected: true,
  anilistUsername: 'Dominum',
  discordPresence: true,
  dnsOverHttps: true,
};

const STORAGE_KEYS = {
  SETTINGS: 'anilife_settings_v3',
  WATCHLIST_PREFIX: 'anilife_watchlist_v3_',
  CONTINUE_PREFIX: 'anilife_continue_v3_',
  SEARCH_PREFIX: 'anilife_searches_v3_',
  PROFILES: 'anilife_profiles_v3',
  ACTIVE_PROFILE_ID: 'anilife_active_profile_id_v3',
  OAUTH_TOKEN: 'anilife_oauth_token',
  LIVE_CATALOG_CACHE: 'anilife_live_catalog_cache_v3',
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

export function loadProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) return DEFAULT_PROFILES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_PROFILES;
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles:', err);
  }
}

export function loadActiveProfileId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    return id || DEFAULT_PROFILES[0].id;
  } catch {
    return DEFAULT_PROFILES[0].id;
  }
}

export function saveActiveProfileId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  } catch (err) {
    console.error('Failed to save active profile id:', err);
  }
}

export function loadWatchlist(profileId: string = 'default'): WatchlistEntry[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.WATCHLIST_PREFIX}${profileId}`);
    if (!raw) {
      return [
        { animeId: '162780', status: 'Watching', updatedAt: new Date().toISOString() },
        { animeId: '130298', status: 'Completed', updatedAt: new Date().toISOString() },
        { animeId: '153841', status: 'Plan to watch', updatedAt: new Date().toISOString() },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWatchlist(profileId: string, entries: WatchlistEntry[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.WATCHLIST_PREFIX}${profileId}`, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save watchlist:', err);
  }
}

export function loadContinueWatching(profileId: string = 'default'): ContinueWatchingEntry[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CONTINUE_PREFIX}${profileId}`);
    if (!raw) return INITIAL_CONTINUE_WATCHING;
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONTINUE_WATCHING;
  }
}

export function saveContinueWatching(profileId: string, entries: ContinueWatchingEntry[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CONTINUE_PREFIX}${profileId}`, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save continue watching:', err);
  }
}

export function loadRecentSearches(profileId: string = 'default'): string[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.SEARCH_PREFIX}${profileId}`);
    if (!raw) {
      return ['Dandadan', 'Apothecary Diaries', 'One Piece', 'Frieren', 'Jujutsu Kaisen'];
    }
    return JSON.parse(raw);
  } catch {
    return ['Dandadan', 'Apothecary Diaries', 'One Piece', 'Frieren', 'Jujutsu Kaisen'];
  }
}

export function saveRecentSearches(profileId: string, searches: string[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.SEARCH_PREFIX}${profileId}`, JSON.stringify(searches));
  } catch (err) {
    console.error('Failed to save recent searches:', err);
  }
}
