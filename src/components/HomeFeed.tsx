import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import { Anime, ContinueWatchingEntry } from '../types/anime';
import { ContinueContextMenu } from './ContinueContextMenu';
import {
  Play,
  Info,
  X,
  Star,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Rows
} from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const {
    setSelectedAnime,
    continueWatching,
    playAnimeEpisode,
    removeFromContinueWatching
  } = useApp();

  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);
  const [isContinueExpanded, setIsContinueExpanded] = useState(false);
  const [contextItem, setContextItem] = useState<{ anime: Anime; episodeNumber: number } | null>(null);

  const spotlightAnimeList = [
    ANIME_CATALOG.find(a => a.id === 'apothecary-diaries-s3') || ANIME_CATALOG[1],
    ANIME_CATALOG.find(a => a.id === 'eminence-in-shadow') || ANIME_CATALOG[2],
    ANIME_CATALOG.find(a => a.id === 'gushing-over-magical-girls') || ANIME_CATALOG[0],
    ANIME_CATALOG.find(a => a.id === 'frieren-journey-end') || ANIME_CATALOG[3],
  ];

  const currentSpotlight = spotlightAnimeList[activeSpotlightIdx] || spotlightAnimeList[0];

  // Resolve Continue Watching items with full anime metadata
  const resolvedContinueItems = continueWatching
    .map(entry => {
      const anime = ANIME_CATALOG.find(a => a.id === entry.animeId);
      return anime ? { entry, anime } : null;
    })
    .filter(Boolean) as { entry: ContinueWatchingEntry; anime: Anime }[];

  const trendingAnime = ANIME_CATALOG.slice(0, 6);
  const popularSeason = [
    ANIME_CATALOG[0],
    ANIME_CATALOG[1],
    ANIME_CATALOG[4],
    ANIME_CATALOG[7],
    ANIME_CATALOG[9],
  ];
  const topRated = [...ANIME_CATALOG].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Spotlight Featured Banner */}
      <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[460px] flex items-end p-5 sm:p-10 border border-purple-500/20 shadow-2xl group">
        {/* Backdrop Image with gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100 group-hover:scale-102"
          style={{
            backgroundImage: `url(${currentSpotlight.bannerImage || currentSpotlight.posterImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c17] via-[#0e0c17]/65 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0c17] via-[#0e0c17]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-purple-500 rounded-full inline-block" />
            <span className="text-xs uppercase tracking-widest font-bold text-purple-300">
              Anilili Featured
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {currentSpotlight.title}
          </h1>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300">
            <div className="flex items-center gap-1 text-purple-300 font-bold bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
              <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
              <span>{currentSpotlight.score}%</span>
            </div>
            <span>•</span>
            <span>{currentSpotlight.format}</span>
            <span>•</span>
            <span>{currentSpotlight.year}</span>
            <span>•</span>
            <span>{currentSpotlight.durationMins}m</span>
            <span>•</span>
            <span className="text-zinc-400">{currentSpotlight.genres.slice(0, 2).join(' • ')}</span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {currentSpotlight.synopsis}
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => playAnimeEpisode(currentSpotlight, 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Open to watch</span>
            </button>

            <button
              onClick={() => setSelectedAnime(currentSpotlight)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute right-5 bottom-6 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
          {spotlightAnimeList.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSpotlightIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all rounded-full ${
                activeSpotlightIdx === i
                  ? 'w-6 h-1.5 bg-purple-500'
                  : 'w-1.5 h-1.5 bg-zinc-500 hover:bg-zinc-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Continue Watching Row */}
      {resolvedContinueItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Continue watching
                </h2>
                <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                Long-press a title to remove it or move it on your anime list
              </p>
            </div>

            <button
              onClick={() => setIsContinueExpanded(!isContinueExpanded)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs text-purple-300 font-medium transition-colors cursor-pointer"
            >
              {isContinueExpanded ? (
                <>
                  <Rows className="w-3.5 h-3.5" />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </>
              )}
            </button>
          </div>

          <div
            className={
              isContinueExpanded
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
                : 'flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1'
            }
          >
            {resolvedContinueItems.map(({ entry, anime }) => {
              const progressPct = Math.min(
                100,
                Math.round((entry.currentTimeSec / (entry.durationSec || 1440)) * 100)
              );
              const remainingMin = Math.max(
                1,
                Math.round(((entry.durationSec || 1440) - entry.currentTimeSec) / 60)
              );

              return (
                <div
                  key={anime.id}
                  className={`group relative shrink-0 ${
                    isContinueExpanded ? 'w-full' : 'w-44 sm:w-56'
                  } rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20`}
                >
                  {/* Poster Thumbnail */}
                  <div
                    onClick={() => playAnimeEpisode(anime, entry.episodeNumber, entry.audioMode)}
                    className="relative aspect-video w-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src={anime.posterImage}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg group-hover:scale-110 group-hover:bg-purple-600 transition-all">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* DUB badge */}
                    {entry.audioMode === 'DUB' && (
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 tracking-wider">
                        DUB
                      </span>
                    )}

                    {/* Progress Bar along bottom */}
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Info bar */}
                  <div className="p-2.5 flex items-start justify-between gap-1">
                    <div
                      onClick={() => setSelectedAnime(anime)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <h4 className="font-semibold text-xs sm:text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                        {anime.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        EP {entry.episodeNumber} • {entry.serverName} • {remainingMin}m left
                      </p>
                    </div>

                    {/* Context info button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextItem({ anime, episodeNumber: entry.episodeNumber });
                      }}
                      className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      title="More options"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Row: Trending Now */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Trending Now</h2>
            <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {trendingAnime.map((anime) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group shrink-0 w-32 sm:w-44 cursor-pointer space-y-2"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-purple-300 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-purple-400 text-purple-400" />
                  <span>{anime.score}%</span>
                </div>
                {anime.hasDub && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-amber-300">
                    DUB
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {anime.format} • {anime.year} • {anime.genres[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Row: Popular This Season */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Popular This Season</h2>
            <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {popularSeason.map((anime) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group shrink-0 w-32 sm:w-44 cursor-pointer space-y-2"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-purple-300 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-purple-400 text-purple-400" />
                  <span>{anime.score}%</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {anime.genres.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Row: Top Rated */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Top Rated</h2>
            <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {topRated.map((anime) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group shrink-0 w-32 sm:w-44 cursor-pointer space-y-2"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-purple-300 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-purple-400 text-purple-400" />
                  <span>{anime.score}%</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {anime.format} • {anime.membersCount.toLocaleString()} members
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom: Arrange Home Button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => alert('Home layout configured: All categories and spotlight rows active.')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span>Arrange Home</span>
        </button>
      </div>

      {/* Context Menu Modal if opened */}
      {contextItem && (
        <ContinueContextMenu
          anime={contextItem.anime}
          episodeNumber={contextItem.episodeNumber}
          onClose={() => setContextItem(null)}
          onOpenDetails={() => {
            setSelectedAnime(contextItem.anime);
            setContextItem(null);
          }}
        />
      )}
    </div>
  );
};
