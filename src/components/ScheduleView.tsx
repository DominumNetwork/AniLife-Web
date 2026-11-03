import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANIME_CATALOG } from '../utils/animeData';
import {
  Calendar as CalendarIcon,
  Clock,
  Bell,
  Star,
  Play
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { setSelectedAnime, playAnimeEpisode } = useApp();

  // Days list around early November 2026
  const days = [
    { label: 'Sat Oct 31', dayOfWeek: 6 },
    { label: 'Yesterday Nov 1', dayOfWeek: 0 },
    { label: 'Today Nov 2', dayOfWeek: 1, isToday: true },
    { label: 'Tomorrow Nov 3', dayOfWeek: 2 },
    { label: 'Wed Nov 4', dayOfWeek: 3 },
    { label: 'Thu Nov 5', dayOfWeek: 4 },
    { label: 'Fri Nov 6', dayOfWeek: 5 },
  ];

  const [selectedDayIdx, setSelectedDayIdx] = useState(2); // default Today
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const toggleReminder = (id: string) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentDay = days[selectedDayIdx];

  // Anime scheduled for this day
  const scheduledAnime = ANIME_CATALOG.filter(a => {
    if (a.airSchedule) {
      return a.airSchedule.dayOfWeek === currentDay.dayOfWeek;
    }
    // Distribute remaining across days for rich realism
    return (a.title.length % 7) === currentDay.dayOfWeek;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Schedule</h1>
          <p className="text-sm text-zinc-400 mt-1">Airing anime timetable & broadcast updates</p>
        </div>
        <button
          onClick={() => alert('Calendar picker: Viewing November 2026 releases.')}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-medium transition-colors cursor-pointer"
        >
          <CalendarIcon className="w-4 h-4 text-purple-400" />
          <span>Calendar</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {days.map((d, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={d.label}
              onClick={() => setSelectedDayIdx(idx)}
              className={`flex flex-col items-center px-4 py-2 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              <span className="text-xs font-semibold">{d.label}</span>
              {d.isToday && (
                <span className={`text-[10px] uppercase font-bold mt-0.5 ${isSelected ? 'text-purple-200' : 'text-purple-400'}`}>
                  Live
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Timetable List */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Releases on {currentDay.label}
        </div>

        {scheduledAnime.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-zinc-400 text-sm">
            No scheduled broadcasts on this date.
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledAnime.map((anime) => {
              const airTime = anime.airSchedule?.airTime || '23:00';
              const nextEp = anime.airSchedule?.nextEpisode || 1;
              const hasReminder = reminders[anime.id];

              return (
                <div
                  key={anime.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 group"
                >
                  <div
                    onClick={() => setSelectedAnime(anime)}
                    className="flex items-center gap-3.5 cursor-pointer flex-1"
                  >
                    <img
                      src={anime.posterImage}
                      alt={anime.title}
                      className="w-14 h-20 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/20">
                          <Clock className="w-3 h-3" />
                          <span>{airTime} JST</span>
                        </span>
                        <span className="text-xs text-zinc-400">• Episode {nextEp}</span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                        {anime.title}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {anime.format} • {anime.studio} • {anime.genres.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleReminder(anime.id)}
                      className={`p-2 rounded-full border transition-colors cursor-pointer ${
                        hasReminder
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={hasReminder ? 'Reminder set' : 'Remind me'}
                    >
                      <Bell className={`w-4 h-4 ${hasReminder ? 'fill-purple-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => playAnimeEpisode(anime, 1)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch</span>
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
