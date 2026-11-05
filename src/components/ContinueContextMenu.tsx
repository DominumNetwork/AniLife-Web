import React from 'react';
import { Anime, WatchStatus } from '../types/anime';
import { useApp } from '../context/AppContext';
import {
  X,
  ChevronRight,
  Play,
  RotateCcw,
  Bookmark,
  Pause,
  CheckCircle2,
  Ban,
  Check
} from 'lucide-react';

interface Props {
  anime: Anime;
  episodeNumber: number;
  onClose: () => void;
  onOpenDetails: () => void;
}

export const ContinueContextMenu: React.FC<Props> = ({
  anime,
  episodeNumber,
  onClose,
  onOpenDetails
}) => {
  const { removeFromContinueWatching, setAnimeWatchStatus, watchlist } = useApp();

  const currentStatus = watchlist.find(w => w.animeId === anime.id)?.status || 'Watching';

  const statusOptions: { status: WatchStatus; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { status: 'Watching', label: 'Watching', desc: 'Working through it now', icon: Play },
    { status: 'Rewatching', label: 'Rewatching', desc: 'Seen it; going again', icon: RotateCcw },
    { status: 'Plan to watch', label: 'Plan to watch', desc: 'Saved for later', icon: Bookmark },
    { status: 'Paused', label: 'Paused', desc: 'On hold for now', icon: Pause },
    { status: 'Completed', label: 'Completed', desc: 'Finished every episode', icon: CheckCircle2 },
    { status: 'Dropped', label: 'Dropped', desc: 'Given up on', icon: Ban },
  ];

  const handleRemove = () => {
    removeFromContinueWatching(anime.id);
    onClose();
  };

  const handleStatusChange = (status: WatchStatus) => {
    setAnimeWatchStatus(anime.id, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#14121e]/95 border border-purple-500/20 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={anime.posterImage}
              alt={anime.title}
              className="w-12 h-16 object-cover rounded-lg shadow-md border border-white/10"
            />
            <div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-purple-400">
                Continue Watching
              </span>
              <h3 className="font-bold text-base line-clamp-1">{anime.title}</h3>
              <p className="text-xs text-zinc-400">Episode {episodeNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section: THIS TITLE */}
        <div className="mt-4">
          <h4 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-2">
            This Title
          </h4>
          <div className="space-y-1.5">
            <button
              onClick={() => {
                onClose();
                onOpenDetails();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div>
                <div className="text-sm font-medium">Details</div>
                <div className="text-xs text-zinc-400">Synopsis, seasons and every episode</div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>

            <button
              onClick={handleRemove}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-red-500/10 transition-colors text-left group"
            >
              <div>
                <div className="text-sm font-medium text-red-400 group-hover:text-red-300">
                  Remove from Continue watching
                </div>
                <div className="text-xs text-zinc-400">
                  Only from this row. Your AniList list stays as it is
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-red-300" />
            </button>
          </div>
        </div>

        {/* Section: MOVE ON ANILIST */}
        <div className="mt-5">
          <h4 className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-2">
            Move on AniList
          </h4>
          <div className="space-y-1">
            {statusOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = currentStatus === opt.status;
              return (
                <button
                  key={opt.status}
                  onClick={() => handleStatusChange(opt.status)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/30 border border-purple-500/40 text-purple-200'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <div className="text-left">
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-zinc-400">{opt.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
