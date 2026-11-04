import React, { useState, useEffect } from 'react';
import { Anime, Episode, WatchStatus } from '../types/anime';
import { useApp } from '../context/AppContext';
import { getAnimeAniListId } from '../utils/animeData';
import { fetchMediaIndexEpisodes } from '../utils/mediaIndexApi';
import {
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  Play,
  Download,
  Share2,
  ChevronDown,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  Check
} from 'lucide-react';

interface Props {
  anime: Anime;
  onClose: () => void;
}

export const AnimeDetailModal: React.FC<Props> = ({ anime, onClose }) => {
  const {
    playAnimeEpisode,
    watchlist,
    setAnimeWatchStatus,
    continueWatching,
    setSelectedAnime
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Home' | 'Episodes' | 'Related'>('Home');
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [sortOldest, setSortOldest] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [realEpisodes, setRealEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const numId = getAnimeAniListId(anime);
    if (numId) {
      fetchMediaIndexEpisodes(numId).then((eps) => {
        if (eps && eps.length > 0) {
          const mapped: Episode[] = eps.map((e) => ({
            id: `${anime.id}-ep-${e.number}`,
            number: e.number,
            title: e.title || `Episode ${e.number}`,
            durationSec: (e.runtime || anime.durationMins || 24) * 60,
            thumbnail: e.still || anime.bannerImage || anime.posterImage,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            synopsis: e.overview,
            airedDate: e.air_date
          }));
          setRealEpisodes(mapped);
        }
      });
    }
  }, [anime]);

  const currentWatchlistEntry = watchlist.find(w => w.animeId === anime.id);
  const watchStatus: WatchStatus = currentWatchlistEntry?.status || 'Watching';

  const continueEntry = continueWatching.find(c => c.animeId === anime.id);
  const currentEpNum = continueEntry?.episodeNumber || 1;
  const progressPercent = continueEntry
    ? Math.round((continueEntry.currentTimeSec / (continueEntry.durationSec || 1440)) * 100)
    : 15;

  const activeSeason = anime.seasons[selectedSeasonIdx] || anime.seasons[0];
  const allEpisodes = realEpisodes.length > 0 ? realEpisodes : (activeSeason?.episodes || []);

  const filteredEpisodes = allEpisodes
    .filter(ep => !episodeSearch.trim() || ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) || `ep ${ep.number}`.includes(episodeSearch.toLowerCase()))
    .sort((a, b) => sortOldest ? a.number - b.number : b.number - a.number);

  const toggleEpisodeWatched = (epNumber: number) => {
    setWatchedEpisodes(prev => ({
      ...prev,
      [epNumber]: !prev[epNumber]
    }));
  };

  const statusList: WatchStatus[] = ['Watching', 'Plan to watch', 'Completed', 'Paused', 'Rewatching', 'Dropped'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl text-white animate-fadeIn">
      {/* Top Navbar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
          {anime.title}
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => alert(`Share link for ${anime.title} copied!`)}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] border border-purple-500/30 shadow-2xl">
          <img
            src={anime.bannerImage || anime.posterImage}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c17] via-[#0e0c17]/60 to-transparent" />

          <div className="absolute bottom-4 left-4 flex items-end gap-4">
            <div className="relative w-20 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl shrink-0 group">
              <img
                src={anime.posterImage}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="space-y-1 mb-1">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-600/60 border border-purple-400/40 text-purple-200">
                {anime.studio}
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white">{anime.title}</h1>
              <p className="text-xs sm:text-sm text-zinc-300">
                {anime.score}% score • {(anime.membersCount / 1000).toFixed(1)}K members • {allEpisodes.length} episodes
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/50 text-xs sm:text-sm font-semibold text-purple-200 transition-all cursor-pointer shadow-md"
            >
              <span>{watchStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-300" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-[#14121e] border border-purple-500/40 p-1.5 shadow-2xl z-30 space-y-1">
                {statusList.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setAnimeWatchStatus(anime.id, st);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      watchStatus === st ? 'bg-purple-600 text-white' : 'hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <span>{st}</span>
                    {watchStatus === st && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => toggleEpisodeWatched(currentEpNum)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle watched"
          >
            {watchedEpisodes[currentEpNum] ? (
              <Eye className="w-4 h-4 text-purple-400" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              playAnimeEpisode(anime, currentEpNum);
            }}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continue {currentEpNum}</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Episode {currentEpNum} of {allEpisodes.length}</span>
            <span className="text-purple-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          {(['Home', 'Episodes', 'Related'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {activeTab === 'Home' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center">
                <div className="font-bold text-sm sm:text-base text-white">{anime.status}</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Status</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center">
                <div className="font-bold text-sm sm:text-base text-white">{anime.format}</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Format</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center">
                <div className="font-bold text-sm sm:text-base text-white">{anime.year}</div>
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Year</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-purple-500/20 text-xs font-medium text-zinc-300"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Overview</h3>
              <p className={`text-sm text-zinc-300 leading-relaxed ${isOverviewExpanded ? '' : 'line-clamp-3'}`}>
                {anime.synopsis}
              </p>
              <button
                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                {isOverviewExpanded ? 'Show less' : 'More'}
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Trailer</h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <video
                  src={anime.trailerUrl || anime.seasons[0]?.episodes[0]?.videoUrl}
                  poster={anime.bannerImage || anime.posterImage}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="divide-y divide-white/10 text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-zinc-400">Start date</span>
                <span className="font-medium text-white">{anime.startDate}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-zinc-400">Season</span>
                <span className="font-medium text-white">{anime.seasonName} {anime.year}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-zinc-400">Members</span>
                <span className="font-medium text-white">{anime.membersCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Episodes' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex gap-2">
              {anime.seasons.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeasonIdx(idx)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedSeasonIdx === idx
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                  }`}
                >
                  <div>{s.title}</div>
                  <div className="text-[10px] text-zinc-400">{s.year}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  placeholder="Filter episodes..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-black/40 border border-purple-500/20 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => setSortOldest(!sortOldest)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-medium transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                <span>{sortOldest ? 'Oldest' : 'Newest'}</span>
              </button>

              <button
                onClick={() => setIsGridView(!isGridView)}
                className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Toggle Grid / List"
              >
                {isGridView ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>

              <button
                onClick={() => alert(`Downloading all ${allEpisodes.length} episodes for offline viewing!`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-purple-300 font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                {allEpisodes.length} episodes
              </div>

              <div className={isGridView ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'space-y-2'}>
                {filteredEpisodes.map((ep) => {
                  const isEpWatched = !!watchedEpisodes[ep.number];
                  return (
                    <div
                      key={ep.id}
                      onClick={() => {
                        onClose();
                        playAnimeEpisode(anime, ep.number);
                      }}
                      className={`group flex ${
                        isGridView ? 'flex-col' : 'items-center'
                      } justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer`}
                    >
                      <div className={`flex ${isGridView ? 'flex-col' : 'items-center'} gap-3 flex-1 min-w-0`}>
                        <div className="relative aspect-video w-full sm:w-36 rounded-xl overflow-hidden shrink-0 bg-black/60">
                          <img
                            src={ep.thumbnail || anime.posterImage}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white">
                            EP {ep.number}
                          </span>
                          {isEpWatched && (
                            <div className="absolute bottom-0 inset-x-0 h-1 bg-purple-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                            {ep.title}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Episode {ep.number} • {ep.airedDate || '24 min'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEpisodeWatched(ep.number);
                          }}
                          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                            isEpWatched ? 'text-purple-400' : 'text-zinc-500 hover:text-white'
                          }`}
                          title={isEpWatched ? 'Mark as unwatched' : 'Mark as watched'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Downloading Episode ${ep.number} (${ep.title}) for offline play!`);
                          }}
                          className="p-2 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                          title="Download episode"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Related' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Seasons Row */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Seasons</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-900/30 border border-purple-500/50">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <img
                      src={anime.posterImage}
                      alt={anime.title}
                      className="w-10 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-white">{anime.title}</h4>
                      <p className="text-xs text-zinc-400">Season 1 • {anime.year} • {allEpisodes.length} eps</p>
                      <span className="text-[11px] text-purple-400 font-semibold">You are here</span>
                    </div>
                  </div>
                  <Play className="w-4 h-4 fill-purple-400 text-purple-400" />
                </div>

                {anime.related
                  .filter(r => r.relation.includes('Season'))
                  .map((rel, idx) => (
                    <div
                      key={rel.id}
                      onClick={() => alert(`Opening ${rel.title}`)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/10 text-zinc-400 font-bold flex items-center justify-center text-xs">
                          {idx + 2}
                        </div>
                        <img
                          src={rel.poster}
                          alt={rel.title}
                          className="w-10 h-14 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-white">{rel.title}</h4>
                          <p className="text-xs text-zinc-400">{rel.relation}</p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-zinc-400" />
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">More Like This</h3>
              <div className="space-y-2">
                {anime.related
                  .filter(r => r.relation === 'More like this')
                  .map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => alert(`Opening recommendations for ${rel.title}`)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={rel.poster}
                          alt={rel.title}
                          className="w-10 h-14 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-white">{rel.title}</h4>
                          <p className="text-xs text-zinc-400">{rel.format} • {rel.year}</p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-zinc-400" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
