import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppSettings } from '../types/anime';
import {
  ArrowLeft,
  X,
  PlaySquare,
  Subtitles,
  UserCheck,
  Palette,
  Shield,
  Server,
  Database,
  Info,
  Check,
  RotateCcw,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings } = useApp();

  const [activeSection, setActiveSection] = useState<
    'player' | 'subtitles' | 'accounts' | 'appearance' | 'content' | 'servers' | 'data' | 'about'
  >('appearance');

  const themeSwatches = [
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Lavender', hex: '#C084FC' },
    { name: 'Sky', hex: '#38BDF8' },
    { name: 'Cyan', hex: '#06B6D4' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Amber', hex: '#F59E0B' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Coral', hex: '#FB7185' },
  ];

  const handleExportData = () => {
    const backup = {
      settings,
      timestamp: new Date().toISOString(),
      app: 'Anilili Web',
      version: '0.1.84'
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anilili_backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl text-white animate-fadeIn flex flex-col">
      {/* Top Navbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white capitalize">{activeSection}</h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-56 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {[
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'player', label: 'Player', icon: PlaySquare },
            { id: 'subtitles', label: 'Subtitles', icon: Subtitles },
            { id: 'accounts', label: 'Accounts & Sync', icon: UserCheck },
            { id: 'content', label: 'Content', icon: Shield },
            { id: 'servers', label: 'Servers', icon: Server },
            { id: 'data', label: 'Data', icon: Database },
            { id: 'about', label: 'About', icon: Info },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-300" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div className="flex-1 space-y-6">
          {/* SECTION: APPEARANCE (Matching screenshot 215004 & 215014) */}
          {activeSection === 'appearance' && (
            <div className="space-y-6 animate-fadeIn">
              {/* LIVE PREVIEW CARD (Matching screenshot 215004) */}
              <div className="p-5 rounded-3xl bg-[#14121e] border border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Play
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white/90"
                    style={{ backgroundColor: `${settings.accentColor}bb` }}
                  >
                    Save
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-zinc-300">
                    Sub
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-zinc-300">
                    Dub
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">Episode 12 • The Journey Continues</h4>
                  <p className="text-xs text-zinc-400">24 min • Sub and dub • Aired 2 days ago</p>
                </div>

                {/* Progress bar in preview */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: '65%', backgroundColor: settings.accentColor }}
                  />
                </div>

                {/* Swatches preview dots */}
                <div className="flex items-center gap-2 pt-1">
                  {themeSwatches.slice(0, 5).map(s => (
                    <span
                      key={s.hex}
                      className="w-3.5 h-3.5 rounded-full inline-block"
                      style={{ backgroundColor: s.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* THEME PRESETS */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Theme Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {themeSwatches.map((th) => {
                    const isSelected = settings.accentColor === th.hex;
                    return (
                      <button
                        key={th.name}
                        onClick={() => updateSettings({ accentColor: th.hex })}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-purple-400 shadow-lg shadow-purple-600/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="w-5 h-5 rounded-full shadow-md"
                            style={{ backgroundColor: th.hex }}
                          />
                          {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="font-bold text-xs text-white">{th.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GRANULAR TOGGLES (Popups, Refresh spinner, Reset theme) */}
              <div className="space-y-2 pt-2 divide-y divide-white/10 text-xs sm:text-sm">
                <label className="py-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Popups</div>
                    <div className="text-xs text-zinc-400">Blur the screen behind popups and sheets</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.glassPopups}
                    onChange={(e) => updateSettings({ glassPopups: e.target.checked })}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                </label>

                <label className="py-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Refresh spinner</div>
                    <div className="text-xs text-zinc-400">The circle you pull down to reload a page</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.refreshSpinner}
                    onChange={(e) => updateSettings({ refreshSpinner: e.target.checked })}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                </label>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Reset theme</div>
                    <div className="text-xs text-zinc-400">Back to AMOLED black and monochrome</div>
                  </div>
                  <button
                    onClick={() => updateSettings({ accentColor: '#8B5CF6' })}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-zinc-300 font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PLAYER (Matching screenshot 214833) */}
          {activeSection === 'player' && (
            <div className="space-y-4 divide-y divide-white/10 text-xs sm:text-sm animate-fadeIn">
              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Show details when paused</div>
                  <div className="text-xs text-zinc-400">After 15s paused. Off: pausing leaves picture alone</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showDetailsWhenPaused}
                  onChange={(e) => updateSettings({ showDetailsWhenPaused: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Auto-skip intro, recap and outro</div>
                  <div className="text-xs text-zinc-400">Use provider or AniSkip timings when available</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSkipIntro}
                  onChange={(e) => updateSettings({ autoSkipIntro: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Skip filler episodes</div>
                  <div className="text-xs text-zinc-400">Next and auto-play go to the next episode that isn't filler</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.skipFiller}
                  onChange={(e) => updateSettings({ skipFiller: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Skip button</div>
                  <div className="text-xs text-zinc-400">A one-press jump on the controls when a show has no skip timings</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSkipButton}
                  onChange={(e) => updateSettings({ showSkipButton: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Skip button length</div>
                  <div className="text-xs text-zinc-400">How far one press jumps</div>
                </div>
                <select
                  value={settings.skipButtonLength}
                  onChange={(e) => updateSettings({ skipButtonLength: Number(e.target.value) })}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-white"
                >
                  <option value={85} className="bg-[#14121e]">85s</option>
                  <option value={90} className="bg-[#14121e]">90s</option>
                  <option value={60} className="bg-[#14121e]">60s</option>
                  <option value={30} className="bg-[#14121e]">30s</option>
                </select>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Watched at</div>
                  <div className="text-xs text-zinc-400">When an episode counts as watched</div>
                </div>
                <select
                  value={settings.watchedThreshold}
                  onChange={(e) => updateSettings({ watchedThreshold: Number(e.target.value) })}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-white"
                >
                  <option value={80} className="bg-[#14121e]">80%</option>
                  <option value={85} className="bg-[#14121e]">85%</option>
                  <option value={90} className="bg-[#14121e]">90%</option>
                </select>
              </div>
            </div>
          )}

          {/* SECTION: SUBTITLES (Matching screenshot 214846) */}
          {activeSection === 'subtitles' && (
            <div className="space-y-4 divide-y divide-white/10 text-xs sm:text-sm animate-fadeIn">
              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Show subtitles by default</div>
                  <div className="text-xs text-zinc-400">Text baked into the video cannot be hidden</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSubtitlesByDefault}
                  onChange={(e) => updateSettings({ showSubtitlesByDefault: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Also on dubbed audio</div>
                  <div className="text-xs text-zinc-400">Applies from the next episode</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.subtitlesOnDub}
                  onChange={(e) => updateSettings({ subtitlesOnDub: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Preferred subtitle language</div>
                  <div className="text-xs text-zinc-400">Which track to take when a source carries several</div>
                </div>
                <span className="text-purple-400 font-semibold">{settings.preferredSubLanguage}</span>
              </div>
            </div>
          )}

          {/* SECTION: ACCOUNTS & SYNC */}
          {activeSection === 'accounts' && (
            <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-base">AniList</div>
                  <div className="text-xs text-zinc-400">Logged in as {settings.anilistUsername || 'Lilidev'}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  Connected
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-base">MyAnimeList</div>
                  <div className="text-xs text-zinc-400">Sync with your MAL profile</div>
                </div>
                <button
                  onClick={() => alert('Connect MyAnimeList account')}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-purple-300 font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </div>

              <label className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Discord Rich Presence</div>
                  <div className="text-xs text-zinc-400">Display what anime you are watching on Discord</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.discordPresence}
                  onChange={(e) => updateSettings({ discordPresence: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>
            </div>
          )}

          {/* SECTION: CONTENT & SERVERS */}
          {activeSection === 'servers' && (
            <div className="space-y-3 animate-fadeIn text-xs sm:text-sm">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <span>42 Available Anilili Mirrors</span>
                <span className="text-purple-400">DoH Active</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Anikoto (Primary ★)', speed: '12ms', status: 'Online' },
                  { name: 'AnimePahe CDN', speed: '24ms', status: 'Online' },
                  { name: 'Lili Dedicated Cloud', speed: '18ms', status: 'Online' },
                  { name: 'Bee Stream', speed: '32ms', status: 'Online' },
                  { name: 'Sun 1080p Engine', speed: '45ms', status: 'Online' },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{s.name}</div>
                      <div className="text-xs text-zinc-400">Latency: {s.speed}</div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: DATA */}
          {activeSection === 'data' && (
            <div className="space-y-3 animate-fadeIn text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="font-bold text-white">Backup & Restore</div>
                <p className="text-xs text-zinc-400">Export your local watchlist, watch progress, and settings to a JSON file.</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={() => alert('Select a valid Anilili JSON backup to restore.')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 font-semibold text-xs text-white cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Clear Video Cache</div>
                  <div className="text-xs text-zinc-400">Free temporary buffered frames and preview snapshots</div>
                </div>
                <button
                  onClick={() => alert('Video cache cleared successfully!')}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-xs text-red-400 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* SECTION: ABOUT */}
          {activeSection === 'about' && (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 mx-auto flex items-center justify-center shadow-xl shadow-purple-600/30 text-white font-black text-2xl">
                A
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Anilili Web</h3>
                <p className="text-xs text-purple-400 font-semibold mt-1">v0.1.84 build 96 (Official Web Client)</p>
              </div>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                Made with love by lili & team. Built for the anime community with ultra-low latency playback, AniList sync, and custom UI themes.
              </p>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => alert('Opening Anilili Community Discord...')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Join Discord Community</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
