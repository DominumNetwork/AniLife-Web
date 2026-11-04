import { AppSettings, ContinueWatchingEntry, UserProfile, WatchlistEntry, ThemePresetName } from '../types/anime';
import { INITIAL_CONTINUE_WATCHING } from './animeData';

export const POPULAR_AVATARS = [
  { name: 'Satoru Gojo', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png' },
  { name: 'Monkey D. Luffy', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png' },
  { name: 'Frieren', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b176754-PCnpqIOkjhFk.png' },
  { name: 'Maomao', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b126824-MqsCncTO1qpv.png' },
  { name: 'Roronoa Zoro', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b62-S7oAeA9WInjV.png' },
  { name: 'Anya Forger', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b138100-4Li0tWRCa5bQ.png' },
  { name: 'Levi Ackerman', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png' },
  { name: 'Killua Zoldyck', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b27-Z5O02kQUydpT.jpg' },
  { name: 'Megumin', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b89361-tq8PQQ4MmF0M.png' },
  { name: 'Rimuru Tempest', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b123962-eL9yGV0NLMF7.png' },
  { name: 'Naruto Uzumaki', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b17-phjcWCkRuIhu.png' },
  { name: 'Goku', url: 'https://s4.anilist.co/file/anilistcdn/character/large/246-wsRRr6z1kii8.png' },
  { name: 'Vegeta', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b913-NIFkKazWM8VO.png' },
  { name: 'Freeza', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b3694-bDfOdSSdFfPv.png' },
  { name: 'Emilia', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b88572-IzTwXEHSobRs.jpg' },
  { name: 'Subaru Natski', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b88573-F8yMTK9GhnTA.png' },
  { name: 'Rem', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b88575-Ayu8UPDA8NS6.png' },
  { name: 'Ram', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b88576-NWkotUiJ3mK3.png' },
  { name: 'Ace D. Portgas', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b2072-Lc6jEdsueJUK.jpg' },
  { name: 'Cid Kagenou', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b136837-3WR22FYet8Hv.jpg' },
  { name: 'Aqua', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b89362-ibkc0eoECaW1.png' },
  { name: 'Power', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b137079-6yLEUYR3bmpr.png' },
  { name: 'Denji', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b130102-FO1VHNnEnLlB.png' },
  { name: 'Pochita', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b170266-bBXPkNJnd3mg.png' },
  { name: 'Saitama', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b73935-ON5d0mAcrItd.jpg' },
  { name: 'Sasuke Uchiha', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b13-SISLEw1oAD7a.png' },
  { name: 'Tanya Degurechaff', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b121052-bQZT3nIvaryX.png' },
  { name: 'Beatrice', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b90181-wRPm0OEaucmw.png' },
  { name: 'Puc', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b90187-xJXlD84KXl3t.jpg' },
  { name: 'Veldora Tempest', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b128034-Gg5MrpTFNSv8.png' },
  { name: 'Kazuma', url: 'https://s4.anilist.co/file/anilistcdn/character/large/b89364-7Th8Tv1XKJtt.png' }
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
