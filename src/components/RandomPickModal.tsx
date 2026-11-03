import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import { Anime } from '../types/anime';
import { Dices, Play, RefreshCw, X, Star } from 'lucide-react';

export const RandomPickModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { playAnimeEpisode, setSelectedAnime } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'Anything' | 'Action' | 'Fantasy' | 'Comedy'>('Anything');
  const [isRolling, setIsRolling] = useState(false);
  const [pickedAnime, setPickedAnime] = useState<Anime>(() => {
    return ANIME_CATALOG[Math.floor(Math.random() * ANIME_CATALOG.length)];
  });

  const rollDice = () => {
    setIsRolling(true);
    let candidates = ANIME_CATALOG;
    if (selectedFilter !== 'Anything') {
      candidates = ANIME_CATALOG.filter(a => a.genres.includes(selectedFilter));
      if (candidates.length === 0) candidates = ANIME_CATALOG;
    }

    setTimeout(() => {
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      setPickedAnime(random);
      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#14121e] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-600/30 text-purple-400">
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-base">Random Pick</h3>
              <p className="text-xs text-zinc-400">Can't decide what to watch next?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5">
          {(['Anything', 'Action', 'Fantasy', 'Comedy'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Picked Card */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 shadow-lg group">
          <img
            src={pickedAnime.bannerImage || pickedAnime.posterImage}
            alt={pickedAnime.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isRolling ? 'blur-sm scale-105' : 'blur-0 scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
                <span>{pickedAnime.score}%</span>
              </span>
              <span className="text-xs text-zinc-300">{pickedAnime.format} • {pickedAnime.year}</span>
            </div>
            <h4 className="font-bold text-base text-white truncate">{pickedAnime.title}</h4>
            <p className="text-xs text-zinc-300 line-clamp-2">{pickedAnime.synopsis}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>Roll Again</span>
          </button>

          <button
            onClick={() => {
              onClose();
              playAnimeEpisode(pickedAnime, 1);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
