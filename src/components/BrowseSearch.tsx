import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  History,
  X,
  Star,
  Film
} from 'lucide-react';

export const BrowseSearch: React.FC = () => {
  const {
    setSelectedAnime,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Season',
    'Movies',
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Romance'
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('All');
  };

  const filteredAnime = useMemo(() => {
    return ANIME_CATALOG.filter((anime) => {
      const matchQuery =
        !query.trim() ||
        anime.title.toLowerCase().includes(query.toLowerCase()) ||
        (anime.romajiTitle && anime.romajiTitle.toLowerCase().includes(query.toLowerCase())) ||
        anime.genres.some(g => g.toLowerCase().includes(query.toLowerCase()));

      let matchCategory = true;
      if (selectedCategory === 'Season') {
        matchCategory = anime.status === 'Releasing';
      } else if (selectedCategory === 'Movies') {
        matchCategory = anime.format === 'Movie';
      } else if (selectedCategory !== 'All') {
        matchCategory = anime.genres.includes(selectedCategory);
      }

      return matchQuery && matchCategory;
    });
  }, [query, selectedCategory]);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Browse</h1>
        <p className="text-sm text-zinc-400 mt-1">Find your next obsession</p>
      </div>

      {/* Search Input Bar + Reset & Filter Buttons */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime"
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-black/60 border border-purple-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-inner transition-all"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <button
          onClick={handleReset}
          className="text-sm font-semibold text-purple-400 hover:text-purple-300 px-2 py-2 cursor-pointer transition-colors"
        >
          Reset
        </button>

        <button
          onClick={() => alert('Filter options: sort by score, format, popularity, year.')}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0"
          title="Filter and Sort"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            <span>Recent searches</span>
            <button
              onClick={clearRecentSearches}
              className="text-[11px] hover:text-purple-300 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <div
                key={term}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-purple-500/20 text-xs text-zinc-300 group cursor-pointer transition-all"
                onClick={() => handleChipClick(term)}
              >
                <History className="w-3.5 h-3.5 text-purple-400" />
                <span>{term}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(term);
                  }}
                  className="text-zinc-500 hover:text-white p-0.5 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Horizontal Pills */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Categories
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400/50'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Anime Grid */}
      <div className="pt-2">
        <div className="text-xs text-zinc-400 mb-3">
          Showing {filteredAnime.length} results
        </div>

        {filteredAnime.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 space-y-3">
            <Film className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No anime found</h3>
            <p className="text-sm text-zinc-400">Try searching for different keywords or reset filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredAnime.map((anime) => (
              <div
                key={anime.id}
                onClick={() => setSelectedAnime(anime)}
                className="group cursor-pointer space-y-2"
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
                    {anime.format} • {anime.year} • {anime.genres.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
