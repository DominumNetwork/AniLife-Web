import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import {
  Download,
  HardDrive,
  Play,
  Trash2,
  CheckCircle2,
  Wifi,
  Settings2
} from 'lucide-react';

interface DownloadedItem {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  sizeMb: number;
  quality: string;
  dateDownloaded: string;
}

export const DownloadsView: React.FC = () => {
  const { playAnimeEpisode } = useApp();

  const [downloads, setDownloads] = useState<DownloadedItem[]>([
    {
      id: 'dl-1',
      animeId: 'gushing-over-magical-girls',
      episodeNumber: 1,
      title: 'A Villain Is Born?!',
      sizeMb: 340,
      quality: '1080p',
      dateDownloaded: 'Nov 1, 2026'
    },
    {
      id: 'dl-2',
      animeId: 'gushing-over-magical-girls',
      episodeNumber: 2,
      title: 'Her Name Is Magia Baiser!',
      sizeMb: 355,
      quality: '1080p',
      dateDownloaded: 'Nov 1, 2026'
    },
    {
      id: 'dl-3',
      animeId: 'eminence-in-shadow',
      episodeNumber: 1,
      title: 'The Hated Classmate',
      sizeMb: 410,
      quality: '1080p',
      dateDownloaded: 'Oct 30, 2026'
    }
  ]);

  const totalUsedMb = downloads.reduce((acc, item) => acc + item.sizeMb, 0);
  const totalUsedGb = (totalUsedMb / 1024).toFixed(1);
  const maxStorageGb = 64;
  const usedPercent = Math.min(100, Math.round((totalUsedMb / (maxStorageGb * 1024)) * 100));

  const handleDelete = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handlePlayDownloaded = (item: DownloadedItem) => {
    const anime = ANIME_CATALOG.find(a => a.id === item.animeId);
    if (anime) {
      playAnimeEpisode(anime, item.episodeNumber);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Downloads</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage offline anime episodes & storage</p>
      </div>

      {/* Storage meter card */}
      <div className="p-5 rounded-3xl bg-black/40 border border-purple-500/20 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">Device Storage</span>
          </div>
          <span className="text-xs text-zinc-300">
            <strong className="text-purple-400">{totalUsedGb} GB</strong> used of {maxStorageGb} GB
          </span>
        </div>

        {/* Storage progress bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(3, usedPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-zinc-500" />
            <span>Download over Wi-Fi only: On</span>
          </div>
          <span>Auto-delete watched: Off</span>
        </div>
      </div>

      {/* Downloaded list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
          <span>Downloaded Episodes ({downloads.length})</span>
          {downloads.length > 0 && (
            <button
              onClick={() => setDownloads([])}
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {downloads.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 space-y-3">
            <Download className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No downloaded episodes</h3>
            <p className="text-sm text-zinc-400">
              Download episodes from the anime details page to watch them offline anytime.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {downloads.map((item) => {
              const anime = ANIME_CATALOG.find(a => a.id === item.animeId);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 group"
                >
                  <div
                    onClick={() => handlePlayDownloaded(item)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black/60 shrink-0">
                      {anime?.posterImage && (
                        <img
                          src={anime.posterImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300">
                          EP {item.episodeNumber}
                        </span>
                        <span className="text-xs text-zinc-400">{anime?.title}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-white truncate mt-0.5 group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        {item.sizeMb} MB • {item.quality} • {item.dateDownloaded}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayDownloaded(item)}
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                      title="Play offline"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete download"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
