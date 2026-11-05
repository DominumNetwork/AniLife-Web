import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Anime, ContinueWatchingEntry } from '../types/anime';
import { ContinueContextMenu } from './ContinueContextMenu';
import {
  Play,
  Info,
  X,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  Rows,
  Sparkles,
  ExternalLink,
  Flame,
  Tv,
  Trophy
} from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const {
    setSelectedAnime,
    continueWatching,
    playAnimeEpisode,
    removeFromContinueWatching,
    liveCatalog,
    trendingAnime,
    popularSeasonAnime,
    topRatedAnime,
    spotlightAnime,
    currentUser,
    setShowAuthModal
  } = useApp();

  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);
  const [isContinueExpanded, setIsContinueExpanded] = useState(false);
  const [contextItem, setContextItem] = useState<{ anime: Anime; episodeNumber: number } | null>(null);

  // Dynamic spotlight list directly from AniList
  const spotlightAnimeList =
    spotlightAnime.length > 0
      ? spotlightAnime
      : liveCatalog.slice(0, 5);

  const currentSpotlight = spotlightAnimeList[activeSpotlightIdx] || liveCatalog[0];

  // Resolve Continue Watching items with full anime metadata
  const resolvedContinueItems = continueWatching
    .map(entry => {
      const anime = liveCatalog.find(a => a.id === entry.animeId);
      return anime ? { entry, anime } : null;
    })
    .filter(Boolean) as { entry: ContinueWatchingEntry; anime: Anime }[];

  // Dynamic rows from real AniList data
  const forYouList = topRatedAnime.length > 0 ? topRatedAnime.slice(0, 10) : liveCatalog.slice(4, 12);
  const trendingList = trendingAnime.length > 0 ? trendingAnime : liveCatalog.slice(0, 12);
  const seasonList = popularSeasonAnime.length > 0 ? popularSeasonAnime : liveCatalog.slice(8, 20);

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Spotlight Featured Banner */}
      {currentSpotlight && (
        <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[480px] flex items-end p-5 sm:p-10 border border-purple-500/20 shadow-2xl group">
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
              <span className="text-xs uppercase tracking-widest font-bold text-purple-300 flex items-center gap-1.5">
                <img
                  src="/assets/images/Anilife-Logo.png"
                  alt=""
                  className="w-4 h-4 rounded-full shadow-sm"
                />
                <span>AniLife Spotlight • Live AniList</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {currentSpotlight.title}
            </h1>

            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-1 text-purple-300 font-bold bg-purple-900/40 px-2.5 py-0.5 rounded-full border border-purple-500/30">
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
                className={`transition-all rounded-full cursor-pointer ${
                  activeSpotlightIdx === i
                    ? 'w-6 h-1.5 bg-purple-500 shadow-sm shadow-purple-500/80'
                    : 'w-1.5 h-1.5 bg-zinc-500 hover:bg-zinc-300'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Continue Watching Section - Only shown when user has active watch history */}
      {resolvedContinueItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Continue watching
                </h2>
                <span className="w-8 h-0.5 bg-[#74cf66] rounded-full" />
              </div>
            </div>

            <button
              onClick={() => setIsContinueExpanded(!isContinueExpanded)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs text-[#74cf66] font-medium transition-colors cursor-pointer"
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
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'
                : 'flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1'
            }
          >
            {resolvedContinueItems.map(({ entry, anime }) => {
              const progressPct = Math.min(
                100,
                Math.round((entry.currentTimeSec / (entry.durationSec || 1440)) * 100)
              );

              return (
                <div
                  key={anime.id}
                  className={`group relative shrink-0 ${
                    isContinueExpanded ? 'w-full' : 'w-72 sm:w-80'
                  } h-36 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-[#74cf66] overflow-hidden transition-all duration-300 shadow-xl cursor-pointer`}
                  onClick={() => playAnimeEpisode(anime, entry.episodeNumber, entry.audioMode)}
                >
                  {/* Background Banner Image */}
                  <img
                    src={anime.bannerImage || anime.posterImage}
                    alt={anime.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-n2hr0omr9adP.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  {/* Top Buttons: (i) on left, (x) on right */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextItem({ anime, episodeNumber: entry.episodeNumber });
                      }}
                      className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                      title="Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromContinueWatching(anime.id);
                      }}
                      className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Center Play Button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-[#74cf66] text-black flex items-center justify-center shadow-lg shadow-[#74cf66]/40">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Info: Title, Subtitle, Progress Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 space-y-1 z-10">
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-[#74cf66] transition-colors">
                      {anime.title}
                    </h4>
                    <p className="text-xs text-zinc-300 truncate">
                      Episode {entry.episodeNumber} • {entry.audioMode || 'SUB'}
                    </p>

                    {/* Progress Bar along bottom */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#74cf66] rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Row: Trending Now (Real Live AniList GraphQL) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Trending Now</h2>
            <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {trendingList.map((anime, idx) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group shrink-0 w-32 sm:w-44 cursor-pointer space-y-2"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30 bg-zinc-900">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx158870-g875H3jE8wR8.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-black text-amber-300">
                  #{idx + 1}
                </div>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-purple-300 flex items-center gap-1">
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
            <Tv className="w-4 h-4 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Popular This Season</h2>
            <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {seasonList.map((anime) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group shrink-0 w-32 sm:w-44 cursor-pointer space-y-2"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30 bg-zinc-900">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx158870-g875H3jE8wR8.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-purple-300 flex items-center gap-1">
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

      {/* Row: Top Rated of All Time */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">Top Rated All-Time</h2>
            <span className="w-8 h-0.5 bg-purple-500/80 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {forYouList.map((anime) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="group shrink-0 w-32 sm:w-44 cursor-pointer space-y-2"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/30 bg-zinc-900">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx158870-g875H3jE8wR8.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span>{anime.score}%</span>
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
