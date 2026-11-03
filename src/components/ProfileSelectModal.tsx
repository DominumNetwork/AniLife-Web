import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types/anime';
import { X, Lock, Plus, Check, Shield } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ProfileSelectModal: React.FC<Props> = ({ onClose }) => {
  const { profiles, activeProfile, setActiveProfile } = useApp();

  const [pinTargetProfile, setPinTargetProfile] = useState<UserProfile | null>(null);
  const [pinDigits, setPinDigits] = useState<string>('');
  const [pinError, setPinError] = useState(false);

  const handleSelectProfile = (profile: UserProfile) => {
    if (profile.pin) {
      setPinTargetProfile(profile);
      setPinDigits('');
      setPinError(false);
    } else {
      setActiveProfile(profile);
      onClose();
    }
  };

  const handleNumpad = (digit: string) => {
    if (pinDigits.length >= 4) return;
    const next = pinDigits + digit;
    setPinDigits(next);
    setPinError(false);

    if (next.length === 4) {
      if (pinTargetProfile && next === pinTargetProfile.pin) {
        setActiveProfile(pinTargetProfile);
        setPinTargetProfile(null);
        onClose();
      } else {
        setPinError(true);
        setTimeout(() => setPinDigits(''), 700);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn text-white">
      <div
        className="w-full max-w-lg bg-[#14121e] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black">
              {pinTargetProfile ? 'Enter Profile PIN' : "Who's watching?"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {pinTargetProfile ? `Unlock profile "${pinTargetProfile.name}"` : 'Select your profile or add a new viewer'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Numpad view if locked profile clicked */}
        {pinTargetProfile ? (
          <div className="space-y-6 text-center animate-fadeIn">
            {/* PIN Dots */}
            <div className="flex justify-center gap-4 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pinDigits.length > i
                      ? 'bg-purple-500 border-purple-400 scale-110'
                      : pinError
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-white/20'
                  }`}
                />
              ))}
            </div>

            {pinError && <p className="text-xs text-red-400 font-semibold">Incorrect PIN code. Try again.</p>}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((btn, idx) => {
                if (btn === '') return <div key={idx} />;
                if (btn === '⌫') {
                  return (
                    <button
                      key={btn}
                      onClick={() => setPinDigits(prev => prev.slice(0, -1))}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/15 text-zinc-300 font-bold text-sm cursor-pointer"
                    >
                      ⌫
                    </button>
                  );
                }
                return (
                  <button
                    key={btn}
                    onClick={() => handleNumpad(btn)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/15 text-white font-bold text-lg cursor-pointer transition-all active:scale-95"
                  >
                    {btn}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPinTargetProfile(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel PIN entry
            </button>
          </div>
        ) : (
          /* Profile selection row */
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {profiles.map((prof) => {
                const isActive = activeProfile.id === prof.id;
                return (
                  <button
                    key={prof.id}
                    onClick={() => handleSelectProfile(prof)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-purple-500/40 p-0.5 group-hover:scale-105 transition-transform">
                      <img
                        src={prof.avatar}
                        alt={prof.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-purple-900/60 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300">
                      {prof.name}
                    </span>
                  </button>
                );
              })}

              {/* Add Profile */}
              <button
                onClick={() => alert('Add profile feature: Create separate watchlist & preferences.')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-purple-400 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform text-zinc-400 group-hover:text-purple-300">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-semibold text-xs text-zinc-400 group-hover:text-white">
                  Add Profile
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
