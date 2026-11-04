import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Anime } from '../types/anime';
import { Dices, Play, RefreshCw, X, Star, Sparkles, Info } from 'lucide-react';

const RANDOM_CATEGORIES = [
  'Anything',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Isekai',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Supernatural',
  'Mystery',
  'Dubbed'
] as const;

type RandomCategory = (typeof RANDOM_CATEGORIES)[number];

const BACKUP_COVERS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1280&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=1280&auto=format&fit=crop'
];

export const RandomPickModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { playAnimeEpisode, setSelectedAnime, liveCatalog } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<RandomCategory>('Anything');
  const [isRolling, setIsRolling] = useState(false);

  const availableAnime = useMemo(() => {
    const catalog = liveCatalog && liveCatalog.length > 0 ? liveCatalog : [];
    if (selectedFilter === 'Anything') return catalog;
    if (selectedFilter === 'Dubbed') return catalog.filter(a => a.hasDub);
    return catalog.filter(a => 
      a.genres && a.genres.some(g => g.toLowerCase() === selectedFilter.toLowerCase())
    );
  }, [liveCatalog, selectedFilter]);

  const [pickedAnime, setPickedAnime] = useState<Anime>(() => {
    const list = availableAnime.length > 0 ? availableAnime : liveCatalog;
    return list[Math.floor(Math.random() * list.length)] || liveCatalog[0];
  });

  const rollDice = () => {
    setIsRolling(true);
    const candidates = availableAnime.length > 0 ? availableAnime : liveCatalog;

    setTimeout(() => {
      let nextPick = candidates[Math.floor(Math.random() * candidates.length)];
      if (candidates.length > 1 && nextPick.id === pickedAnime.id) {
        nextPick = candidates.find(c => c.id !== pickedAnime.id) || nextPick;
      }
      setPickedAnime(nextPick);
      setIsRolling(false);
    }, 450);
  };

  const handleCategoryChange = (category: RandomCategory) => {
    setSelectedFilter(category);
    let filtered = liveCatalog;
    if (category === 'Dubbed') {
      filtered = liveCatalog.filter(a => a.hasDub);
    } else if (category !== 'Anything') {
      filtered = liveCatalog.filter(a =>
        a.genres && a.genres.some(g => g.toLowerCase() === category.toLowerCase())
      );
    }
    const pool = filtered.length > 0 ? filtered : liveCatalog;
    setPickedAnime(pool[Math.floor(Math.random() * pool.length)]);
  };

  const animeImage =
    pickedAnime.bannerImage ||
    pickedAnime.posterImage ||
    BACKUP_COVERS[Math.abs(pickedAnime.title.length) % BACKUP_COVERS.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#14121e] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-slideUp overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-600/30 text-purple-400">
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-white">Random Pick</h3>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xs text-zinc-400">Can't decide what to watch next?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {RANDOM_CATEGORIES.map((category) => {
            const isSelected = selectedFilter === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 shadow-xl group bg-black/60">
          <img
            src={animeImage}
            alt={pickedAnime.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isRolling ? 'blur-md scale-105 opacity-60' : 'blur-0 scale-100 opacity-100'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = BACKUP_COVERS[0];
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute bottom-3.5 left-4 right-4 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
                <span>{pickedAnime.score}%</span>
              </span>
              <span className="text-xs text-zinc-300 font-medium">
                {pickedAnime.format} • {pickedAnime.year}
              </span>
              {pickedAnime.hasDub && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  DUB
                </span>
              )}
            </div>

            <h4 className="font-extrabold text-base sm:text-lg text-white leading-tight">
              {pickedAnime.title}
            </h4>

            {pickedAnime.genres && pickedAnime.genres.length > 0 && (
              <div className="text-[11px] text-purple-300 font-semibold truncate">
                {pickedAnime.genres.slice(0, 4).join(' • ')}
              </div>
            )}

            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
              {pickedAnime.synopsis || 'An exciting anime ready to stream in HD.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>Reroll</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setSelectedAnime(pickedAnime);
            }}
            className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4 text-purple-300" />
            <span>Details</span>
          </button>

          <button
            onClick={() => {
              onClose();
              playAnimeEpisode(pickedAnime, 1);
            }}
            className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
