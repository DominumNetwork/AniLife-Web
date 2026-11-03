import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import {
  RotateCcw,
  BarChart3,
  Plus,
  Check,
  Search,
  Filter,
  Play,
  Bookmark,
  Trash2
} from 'lucide-react';

export const MyListView: React.FC = () => {
  const {
    watchlist,
    setSelectedAnime,
    playAnimeEpisode,
    setAnimeWatchStatus,
    activeProfile,
    settings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Watchlist' | 'Custom'>('Watchlist');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Any format');
  const [selectedStatus, setSelectedStatus] = useState('Any status');
  const [isSimulatedError, setIsSimulatedError] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Filter watchlist items
  const resolvedList = watchlist
    .map(entry => {
      const anime = ANIME_CATALOG.find(a => a.id === entry.animeId);
      return anime ? { entry, anime } : null;
    })
    .filter(Boolean) as { entry: any; anime: any }[];

  const filteredEntries = resolvedList.filter(({ anime, entry }) => {
    const matchText = !filterQuery.trim() || anime.title.toLowerCase().includes(filterQuery.toLowerCase());
    const matchFormat = selectedFormat === 'Any format' || anime.format === selectedFormat;
    const matchStatus = selectedStatus === 'Any status' || entry.status === selectedStatus;
    return matchText && matchFormat && matchStatus;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Profile & Sync Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-black/40 border border-purple-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-400 p-0.5 shrink-0 bg-purple-900/40">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
              My List
            </span>
            {isSimulatedError ? (
              <div>
                <h2 className="text-xl font-bold text-white">Your lists could not be loaded</h2>
                <p className="text-xs text-zinc-400">Couldn't load your AniList profile. ACC-03</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{settings.anilistUsername || activeProfile.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AniList Synced
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {resolvedList.length} anime tracked • 100% cloud synced
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-zinc-200 font-medium transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Profile & stats</span>
          </button>

          <button
            onClick={() => setIsSimulatedError(!isSimulatedError)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-xs text-purple-200 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSimulatedError ? 'Try again' : 'Sync now'}</span>
          </button>
        </div>
      </div>

      {/* Tabs: Watchlist & New List */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('Watchlist')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'Watchlist'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Watchlist {resolvedList.length}</span>
        </button>

        <button
          onClick={() => alert('Create custom anime list (e.g. "Favorites 2026", "Top Isekai").')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-purple-300 font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New list</span>
        </button>
      </div>

      {/* Filter Row matching screenshot: Any format, Any status, Sort, Filter by title */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-purple-400 cursor-pointer"
        >
          <option value="Any format" className="bg-[#14121e]">Any format</option>
          <option value="TV" className="bg-[#14121e]">TV</option>
          <option value="Movie" className="bg-[#14121e]">Movie</option>
          <option value="ONA" className="bg-[#14121e]">ONA</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-purple-400 cursor-pointer"
        >
          <option value="Any status" className="bg-[#14121e]">Any status</option>
          <option value="Watching" className="bg-[#14121e]">Watching</option>
          <option value="Plan to watch" className="bg-[#14121e]">Plan to watch</option>
          <option value="Completed" className="bg-[#14121e]">Completed</option>
          <option value="Paused" className="bg-[#14121e]">Paused</option>
          <option value="Dropped" className="bg-[#14121e]">Dropped</option>
        </select>

        <div className="relative flex-1 min-w-[180px]">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter by title"
            className="w-full pl-8 pr-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Grid of anime items in Watchlist */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <Bookmark className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No items found</h3>
          <p className="text-sm text-zinc-400">Add anime to your watchlist to track episodes and progress</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredEntries.map(({ anime, entry }) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group cursor-pointer space-y-2 relative"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  {entry.status}
                </div>

                {/* Quick play overlay on hover */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    playAnimeEpisode(anime, 1);
                  }}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {anime.format} • {anime.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer hint */}
      <div className="text-center text-xs text-zinc-500 pt-4">
        Hold or select on a title to move it on your anime list or change status.
      </div>

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#14121e] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold">AniList Profile & Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-zinc-400">Total Anime</div>
                <div className="text-2xl font-bold text-purple-400">{resolvedList.length}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-zinc-400">Episodes Watched</div>
                <div className="text-2xl font-bold text-emerald-400">248</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-zinc-400">Days Watched</div>
                <div className="text-2xl font-bold text-cyan-400">4.2</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-zinc-400">Mean Score</div>
                <div className="text-2xl font-bold text-amber-400">82.4%</div>
              </div>
            </div>
            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 font-medium text-sm transition-colors text-center cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
