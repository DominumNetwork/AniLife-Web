import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import {
  ArrowLeft,
  RotateCcw,
  CheckCheck,
  Bell,
  Play,
  Sparkles,
  Server
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const NotificationsModal: React.FC<Props> = ({ onClose }) => {
  const { playAnimeEpisode } = useApp();

  const [hasError, setHasError] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Development Phase',
      body: 'AniLife is currently in development. Feel free to check back here for updates!',
      animeId: null,
      epNumber: null,
      time: '2 hours ago',
      unread: true,
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleRefresh = () => {
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl text-white animate-fadeIn flex flex-col">
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white">Notifications</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-purple-300 hover:text-white px-2 py-1.5 cursor-pointer"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1">
        {hasError ? (
          <div className="my-auto py-24 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Couldn't load notifications.</h3>
            <p className="text-xs text-zinc-400">NET-08</p>
            <button
              onClick={() => setHasError(false)}
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white shadow-lg cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.unread
                    ? 'bg-purple-900/20 border-purple-500/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.title}</span>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{item.body}</p>
                    <span className="text-[10px] text-zinc-500 block pt-1">{item.time}</span>
                  </div>

                  {item.animeId && (
                    <button
                      onClick={() => {
                        const anime = ANIME_CATALOG.find(a => a.id === item.animeId);
                        if (anime) {
                          onClose();
                          playAnimeEpisode(anime, item.epNumber || 1);
                        }
                      }}
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0 cursor-pointer shadow-md"
                      title="Watch Episode"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
