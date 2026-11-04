import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';

interface AppIntroProps {
  onClose: () => void;
}

export const AppIntro: React.FC<AppIntroProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsUserTapForSound, setNeedsUserTapForSound] = useState(false);

  const handleFinish = () => {
    setIsFadingOut(true);
    try {
      sessionStorage.setItem('anilife_intro_seen', '1');
    } catch {
      // Ignored
    }
    setTimeout(() => {
      onClose();
    }, 450);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try playing with sound first
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback with sound; mute and replay
        video.muted = true;
        setIsMuted(true);
        setNeedsUserTapForSound(true);
        video.play().catch(() => {
          // If video cannot play at all, auto finish
          handleFinish();
        });
      });
    }

    // Escape or Space to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Failsafe timeout: intro video is ~5s; if stuck for 8s, auto finish
    const timer = setTimeout(() => {
      handleFinish();
    }, 8000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  const handleUnmuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      if (!videoRef.current.muted) {
        setNeedsUserTapForSound(false);
      }
    }
  };

  return (
    <div
      onClick={() => {
        if (needsUserTapForSound && videoRef.current) {
          videoRef.current.muted = false;
          setIsMuted(false);
          setNeedsUserTapForSound(false);
        }
      }}
      className={`fixed inset-0 z-[200] bg-black flex items-center justify-center select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Intro Video */}
      <video
        ref={videoRef}
        src="/assets/videos/AniLife-Intro.mp4"
        playsInline
        autoPlay
        onEnded={handleFinish}
        className="w-full h-full object-contain max-w-5xl max-h-[90vh]"
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-10 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            AniLife Intro
          </span>
        </div>

        {/* Skip button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-bold text-white transition-all transform hover:scale-105 cursor-pointer shadow-lg"
          title="Skip Intro (Esc)"
        >
          <span>Skip</span>
          <X className="w-3.5 h-3.5 text-zinc-300" />
        </button>
      </div>

      {/* Unmute prompt banner if browser blocked audio */}
      {needsUserTapForSound && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-xs font-semibold text-purple-200 flex items-center gap-2 shadow-2xl animate-pulse cursor-pointer">
          <VolumeX className="w-4 h-4 text-purple-400" />
          <span>Click anywhere to unmute audio</span>
        </div>
      )}

      {/* Bottom Audio toggle */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-auto">
        <button
          onClick={handleUnmuteClick}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-all cursor-pointer shadow-lg"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-zinc-300" />
          ) : (
            <Volume2 className="w-4 h-4 text-purple-300" />
          )}
        </button>
      </div>
    </div>
  );
};
