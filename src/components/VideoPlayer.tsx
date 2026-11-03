import React, { useState, useEffect, useRef } from 'react';
import { Anime, Episode, ServerOption } from '../types/anime';
import { useApp } from '../context/AppContext';
import { SERVERS } from '../utils/animeData';
import { formatPlayerClock, formatTime, calculateProgressPercent } from '../utils/playerUtils';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Lock,
  Unlock,
  ListOrdered,
  Radio,
  Subtitles,
  Maximize2,
  Minimize2,
  Settings as SettingsIcon,
  X,
  Volume2,
  VolumeX,
  Gauge,
  Tv,
  Check,
  ChevronDown,
  Download,
  Heart,
  Search
} from 'lucide-react';

interface Props {
  anime: Anime;
  initialEpisodeNumber: number;
  initialAudioMode?: 'SUB' | 'DUB';
  onClose: () => void;
}

export const VideoPlayer: React.FC<Props> = ({
  anime,
  initialEpisodeNumber,
  initialAudioMode = 'SUB',
  onClose
}) => {
  const { settings, updateWatchProgress } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(initialEpisodeNumber);
  const [audioMode, setAudioMode] = useState<'SUB' | 'DUB'>(initialAudioMode);
  const [activeServer, setActiveServer] = useState<ServerOption>(
    SERVERS.find(s => s.id === settings.activeServer) || SERVERS[0]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1440); // 24 mins default
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(settings.playbackSpeed || 1.0);
  const [screenSize, setScreenSize] = useState<'Fit' | 'Crop' | 'Fill'>('Fit');
  const [quality, setQuality] = useState<'Auto' | '1080p' | '720p' | '480p'>(settings.defaultQuality);
  const [isLocked, setIsLocked] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Active drawer sheets
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'servers' | 'settings' | 'episodes' | 'captions'>('none');

  // Clock string
  const [clockString, setClockString] = useState('');

  // Subtitles offset
  const [subOffsetSec, setSubOffsetSec] = useState(0.0);
  const [selectedSubLanguage, setSelectedSubLanguage] = useState(settings.preferredSubLanguage || 'English');

  // Find active episode object
  const activeSeason = anime.seasons[0];
  const allEpisodes = activeSeason?.episodes || [];
  const currentEpisode: Episode =
    allEpisodes.find(ep => ep.number === currentEpisodeNumber) ||
    allEpisodes[0] || {
      id: 'default',
      number: currentEpisodeNumber,
      title: `Episode ${currentEpisodeNumber}`,
      durationSec: 1440,
      thumbnail: anime.posterImage,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    };

  // Source finding simulation on episode/server change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentEpisodeNumber, activeServer.id, audioMode]);

  // Keep Clock updated every second
  useEffect(() => {
    const updateClock = () => {
      const clock = formatPlayerClock(currentTime, duration, new Date());
      setClockString(clock.displayString);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [currentTime, duration]);

  // Sync watch progress to global context
  useEffect(() => {
    if (currentTime > 0) {
      updateWatchProgress(anime.id, currentEpisodeNumber, currentTime, duration);
    }
  }, [currentTime, currentEpisodeNumber, anime.id, duration]);

  // Auto-hide controls when playing and not interacting
  useEffect(() => {
    if (!isPlaying || isLocked || activeDrawer !== 'none') return;
    const hideTimer = setTimeout(() => {
      setIsControlsVisible(false);
    }, 4500);
    return () => clearTimeout(hideTimer);
  }, [isPlaying, isControlsVisible, isLocked, activeDrawer]);

  const handleContainerClick = () => {
    if (!isLocked) {
      setIsControlsVisible(prev => !prev);
    }
  };

  const handlePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (newTimeSec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(newTimeSec, duration));
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSkipButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSeek(currentTime + (settings.skipButtonLength || 85));
  };

  const handlePrevEpisode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentEpisodeNumber > 1) {
      setCurrentEpisodeNumber(currentEpisodeNumber - 1);
    }
  };

  const handleNextEpisode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentEpisodeNumber < allEpisodes.length) {
      setCurrentEpisodeNumber(currentEpisodeNumber + 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Video aspect ratio styling
  const videoObjectFit = screenSize === 'Crop' ? 'cover' : screenSize === 'Fill' ? 'fill' : 'contain';

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col overflow-y-auto select-none"
    >
      {/* VIDEO CONTAINER */}
      <div className="relative w-full aspect-video max-h-[85vh] bg-black flex items-center justify-center overflow-hidden shrink-0">
        <video
          ref={videoRef}
          src={currentEpisode.videoUrl}
          playsInline
          className={`w-full h-full transition-all ${
            screenSize === 'Crop' ? 'object-cover' : screenSize === 'Fill' ? 'object-fill' : 'object-contain'
          }`}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
                setDuration(videoRef.current.duration);
              }
            }
          }}
          onEnded={() => {
            if (settings.autoSkipIntro && currentEpisodeNumber < allEpisodes.length) {
              setCurrentEpisodeNumber(currentEpisodeNumber + 1);
            } else {
              setIsPlaying(false);
            }
          }}
        />

        {/* LOADING SOURCE STATE (Screenshot 220315) */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full border-3 border-purple-500/30 border-t-purple-500 animate-spin" />
            <div className="space-y-1 max-w-md">
              <h3 className="font-bold text-base text-white">Finding a source for this episode.</h3>
              <p className="text-xs text-zinc-400">
                The first playable server starts now; more options are checked after playback begins.
              </p>
            </div>
          </div>
        )}

        {/* SCREEN LOCKED OVERLAY (Screenshot 220414) */}
        {isLocked && !isLoading && (
          <div className="absolute inset-0 z-30 pointer-events-auto flex items-center justify-between p-6">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-md text-xs font-semibold text-zinc-300">
              Screen locked
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLocked(false);
                setIsControlsVisible(true);
              }}
              className="p-3 rounded-full bg-black/70 hover:bg-black/90 border border-white/30 text-white cursor-pointer shadow-xl"
              title="Unlock screen"
            >
              <Unlock className="w-6 h-6 text-purple-400" />
            </button>

            {/* Skip button remains accessible even when locked */}
            <button
              onClick={handleSkipButton}
              className="px-4 py-2 rounded-2xl bg-black/70 hover:bg-black/90 border border-white/30 text-sm font-bold text-white cursor-pointer shadow-xl"
            >
              +{settings.skipButtonLength || 85}S
            </button>
          </div>
        )}

        {/* NORMAL CONTROLS OVERLAY (Screenshot 220324) */}
        {!isLocked && !isLoading && (
          <div
            className={`absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-t from-black/80 via-transparent to-black/80 transition-opacity duration-300 ${
              isControlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Bar: Back, Clock & Ending Time, Queue */}
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 -ml-1 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer backdrop-blur-md"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {/* Clock pill */}
                <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-semibold text-zinc-200 shadow-md">
                  {clockString || '10:03 PM — Ends at 10:27 PM'}
                </div>

                {/* Queue icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDrawer('episodes');
                  }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer backdrop-blur-md"
                  title="Queue"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Controls: Prev Ep, -10s, Play/Pause, +10s, Next Ep & Floating Skip */}
            <div className="relative flex items-center justify-center gap-4 sm:gap-8 my-auto">
              {/* Prev episode */}
              <button
                onClick={handlePrevEpisode}
                disabled={currentEpisodeNumber <= 1}
                className="p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 disabled:opacity-30 text-white cursor-pointer backdrop-blur-md transition-all"
                title="Previous episode"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Rewind 10s */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeek(currentTime - 10);
                }}
                className="p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer backdrop-blur-md transition-all"
                title="Rewind 10s"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/80 text-white flex items-center justify-center cursor-pointer backdrop-blur-md transition-all hover:scale-105 shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white ml-0.5" />
                )}
              </button>

              {/* Fast forward 10s */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeek(currentTime + 10);
                }}
                className="p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer backdrop-blur-md transition-all"
                title="Forward 10s"
              >
                <FastForward className="w-5 h-5" />
              </button>

              {/* Next episode */}
              <button
                onClick={handleNextEpisode}
                disabled={currentEpisodeNumber >= allEpisodes.length}
                className="p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 disabled:opacity-30 text-white cursor-pointer backdrop-blur-md transition-all"
                title="Next episode"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Floating +85S Skip Button (Screenshot 220324) */}
              <button
                onClick={handleSkipButton}
                className="absolute right-0 sm:right-4 px-3.5 py-1.5 rounded-2xl bg-black/60 hover:bg-black/85 border border-white/40 text-xs sm:text-sm font-bold text-white cursor-pointer backdrop-blur-md shadow-xl hover:border-purple-400 transition-all"
                title="Skip intro / recap"
              >
                +{settings.skipButtonLength || 85}S
              </button>
            </div>

            {/* Bottom Scrubber & Toolbar */}
            <div className="space-y-2">
              {/* Scrubber bar */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
                />
              </div>

              {/* Bottom icons row */}
              <div className="flex items-center justify-between">
                {/* Left: Lock and timestamp */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLocked(true);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white"
                    title="Lock screen"
                  >
                    <Lock className="w-4 h-4" />
                  </button>

                  <div className="text-xs font-semibold text-zinc-200">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Right: Drawer Buttons (Episodes, Server switch, Captions, Fullscreen, Settings) */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Episodes */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDrawer(activeDrawer === 'episodes' ? 'none' : 'episodes');
                    }}
                    className={`p-2 rounded-full hover:bg-white/10 ${
                      activeDrawer === 'episodes' ? 'text-purple-400 bg-white/15' : 'text-zinc-300'
                    }`}
                    title="Episodes"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  {/* Server switcher */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDrawer(activeDrawer === 'servers' ? 'none' : 'servers');
                    }}
                    className={`p-2 rounded-full hover:bg-white/10 ${
                      activeDrawer === 'servers' ? 'text-purple-400 bg-white/15' : 'text-zinc-300'
                    }`}
                    title="Server switch"
                  >
                    <Radio className="w-4 h-4" />
                  </button>

                  {/* Captions */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDrawer(activeDrawer === 'captions' ? 'none' : 'captions');
                    }}
                    className={`p-2 rounded-full hover:bg-white/10 ${
                      activeDrawer === 'captions' ? 'text-purple-400 bg-white/15' : 'text-zinc-300'
                    }`}
                    title="Captions / Subtitles"
                  >
                    <Subtitles className="w-4 h-4" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Settings */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDrawer(activeDrawer === 'settings' ? 'none' : 'settings');
                    }}
                    className={`p-2 rounded-full hover:bg-white/10 ${
                      activeDrawer === 'settings' ? 'text-purple-400 bg-white/15' : 'text-zinc-300'
                    }`}
                    title="Player Settings"
                  >
                    <SettingsIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DRAWER: SERVERS SHEET (Screenshot 220330) */}
        {activeDrawer === 'servers' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 w-full sm:w-80 bg-[#12101b]/95 border-l border-purple-500/30 backdrop-blur-2xl p-5 z-40 overflow-y-auto space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Streaming Servers</h3>
              <button
                onClick={() => setActiveDrawer('none')}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Mode Tabs: SUB / DUB */}
            <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setAudioMode('SUB')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  audioMode === 'SUB' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                SUB
              </button>
              <button
                onClick={() => setAudioMode('DUB')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  audioMode === 'DUB' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                DUB
              </button>
            </div>

            {/* Server options list */}
            <div className="space-y-2">
              {SERVERS.map((server) => {
                const isSelected = activeServer.id === server.id;
                return (
                  <button
                    key={server.id}
                    onClick={() => {
                      setActiveServer(server);
                      setActiveDrawer('none');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border border-purple-500 text-purple-200'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{server.name}</span>
                        {server.isStarred && <span className="text-amber-400 text-xs">★</span>}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Speed: {server.speed} • {server.supportsDownload ? 'Downloadable' : 'Stream only'}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* DRAWER: PLAYER SETTINGS (Screenshot 220334) */}
        {activeDrawer === 'settings' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#12101b]/95 border-l border-purple-500/30 backdrop-blur-2xl p-5 z-40 overflow-y-auto space-y-5 animate-fadeIn text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Now Playing</span>
                <h3 className="font-bold text-base text-white">Settings</h3>
              </div>
              <button
                onClick={() => setActiveDrawer('none')}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* VOLUME */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-bold uppercase tracking-wider text-[11px]">Volume</span>
                <span className="font-bold">{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVolume(val);
                    setIsMuted(false);
                    if (videoRef.current) {
                      videoRef.current.volume = val;
                      videoRef.current.muted = false;
                    }
                  }}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* PLAYBACK SPEED */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-bold uppercase tracking-wider text-[11px]">Playback Speed</span>
                <span className="font-bold">{playbackSpeed}x</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      if (videoRef.current) videoRef.current.playbackRate = spd;
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
                      playbackSpeed === spd
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* QUALITY */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-bold uppercase tracking-wider text-[11px]">Quality</span>
                <span className="font-bold text-purple-400">{quality}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Auto', '1080p', '720p', '480p'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`py-1.5 rounded-xl font-bold transition-all ${
                      quality === q
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* SCREEN SIZE (Fit, Crop, Fill) */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">Screen Size</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Fit', 'Crop', 'Fill'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setScreenSize(sz)}
                    className={`py-1.5 rounded-xl font-bold transition-all ${
                      screenSize === sz
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* AUDIO FORMAT */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Audio Format</div>
              <div className="text-zinc-400">AAC • Stereo • decoded on this device</div>
            </div>

            {/* PLAYBACK TOGGLES */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 cursor-pointer">
                <span>Auto-play next episode</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 cursor-pointer">
                <div>
                  <div>Auto-skip intro, recap and outro</div>
                  <div className="text-[10px] text-zinc-400">Skip timing supplied by server</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={settings.autoSkipIntro}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* DRAWER: CAPTIONS / SUBTITLES */}
        {activeDrawer === 'captions' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 w-full sm:w-80 bg-[#12101b]/95 border-l border-purple-500/30 backdrop-blur-2xl p-5 z-40 overflow-y-auto space-y-4 animate-fadeIn text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Subtitles & Captions</h3>
              <button
                onClick={() => setActiveDrawer('none')}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">Subtitle Language</span>
              <div className="space-y-1">
                {['English', 'Spanish', 'French', 'German', 'Portuguese', 'Off'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedSubLanguage(lang)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      selectedSubLanguage === lang
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <span>{lang}</span>
                    {selectedSubLanguage === lang && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Timing Offset */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-300">Timing Offset</span>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-2xl">
                <button
                  onClick={() => setSubOffsetSec(prev => Number((prev - 0.25).toFixed(2)))}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold"
                >
                  -0.25s
                </button>
                <span className="font-bold">{subOffsetSec > 0 ? `+${subOffsetSec}` : subOffsetSec}s</span>
                <button
                  onClick={() => setSubOffsetSec(prev => Number((prev + 0.25).toFixed(2)))}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold"
                >
                  +0.25s
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DRAWER: EPISODES DRAWER */}
        {activeDrawer === 'episodes' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 w-full sm:w-80 bg-[#12101b]/95 border-l border-purple-500/30 backdrop-blur-2xl p-5 z-40 overflow-y-auto space-y-3 animate-fadeIn text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Episodes ({allEpisodes.length})</h3>
              <button
                onClick={() => setActiveDrawer('none')}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {allEpisodes.map((ep) => {
                const isSelected = ep.number === currentEpisodeNumber;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setCurrentEpisodeNumber(ep.number);
                      setActiveDrawer('none');
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/40 border border-purple-400 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                    }`}
                  >
                    <span className="w-6 text-center font-bold text-zinc-400 text-xs">
                      {ep.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">{ep.title}</div>
                      <div className="text-[10px] text-zinc-400">24 min</div>
                    </div>
                    {isSelected && <Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* METADATA & EPISODES LIST BELOW PLAYER (Screenshot 220330) */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Episode Title & Metadata */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">{currentEpisode.title}</h2>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
            <span className="text-purple-400 font-bold">{anime.score}% score</span>
            <span>•</span>
            <span>Episode {currentEpisode.number}</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
            {currentEpisode.synopsis || anime.synopsis}
          </p>
        </div>

        {/* Anime Title Pill Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={anime.posterImage}
              alt={anime.title}
              className="w-10 h-10 rounded-full object-cover border border-purple-400"
            />
            <div>
              <h3 className="font-bold text-sm text-white">{anime.title}</h3>
              <p className="text-[11px] text-zinc-400">{(anime.membersCount / 1000).toFixed(1)}K members</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloaded episode ${currentEpisode.number} for offline play!`)}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-full hover:bg-white/10 ${
                isFavorited ? 'text-red-400' : 'text-zinc-300'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Server & Audio Quick Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDrawer('servers')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-purple-200 border border-white/10 cursor-pointer"
          >
            <span>{activeServer.name}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setAudioMode(audioMode === 'SUB' ? 'DUB' : 'SUB')}
            className="px-3.5 py-1.5 rounded-full bg-purple-600/40 border border-purple-500/40 text-xs font-bold text-purple-200 cursor-pointer"
          >
            {audioMode}
          </button>

          <button
            onClick={() => setActiveDrawer('servers')}
            className="text-xs text-purple-400 hover:text-purple-300 ml-1 cursor-pointer font-medium"
          >
            More servers...
          </button>
        </div>

        {/* Section: Episodes 13 list below */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Episodes {allEpisodes.length}</h3>
          </div>

          <div className="space-y-2">
            {allEpisodes.map((ep) => {
              const isSelected = ep.number === currentEpisodeNumber;
              return (
                <div
                  key={ep.id}
                  onClick={() => setCurrentEpisodeNumber(ep.number)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/20 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-24 aspect-video rounded-xl overflow-hidden shrink-0 bg-black/60">
                      <img
                        src={ep.thumbnail || anime.posterImage}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white">
                        EP {ep.number}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                        {ep.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Episode {ep.number}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <Play className="w-4 h-4 fill-purple-400 text-purple-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
