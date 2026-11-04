import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ExternalLink,
  Key,
  User,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AniListAuthModal: React.FC<Props> = ({ onClose }) => {
  const {
    currentUser,
    oauthToken,
    initiateAniListOAuth,
    loginWithToken,
    logoutFromAniList,
    connectAniListUser,
    syncAniList,
    isSyncingAniList
  } = useApp();

  const [activeTab, setActiveTab] = useState<'oauth' | 'token' | 'username'>('oauth');
  const [tokenInput, setTokenInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const success = await loginWithToken(tokenInput.trim());
      if (success) {
        setStatusMessage({ text: 'Successfully authenticated with AniList!', type: 'success' });
        setTimeout(() => onClose(), 800);
      } else {
        setStatusMessage({ text: 'Invalid AniList token. Please verify and try again.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Authentication failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await connectAniListUser(usernameInput.trim());
      if (res.success) {
        setStatusMessage({ text: `Connected to AniList profile "${usernameInput.trim()}"!`, type: 'success' });
        setTimeout(() => onClose(), 800);
      } else {
        setStatusMessage({ text: res.error || 'User not found on AniList', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Connection failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn text-white">
      <div
        className="w-full max-w-lg bg-[#12101d] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-600/30">
              A
            </div>
            <div>
              <h2 className="text-xl font-black text-white">AniList Account</h2>
              <p className="text-xs text-zinc-400">
                {currentUser ? 'Signed in & synchronized' : 'Real-time tracking, lists & episode sync'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ALREADY SIGNED IN VIEW */}
        {currentUser ? (
          <div className="space-y-5 animate-fadeIn">
            {/* User Profile Card */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-4">
              {currentUser.bannerImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url(${currentUser.bannerImage})` }}
                />
              )}
              <div className="relative z-10 flex items-center gap-4">
                <img
                  src={currentUser.avatar.large}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-400 shadow-xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white truncate">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-purple-300 mt-0.5">
                    {oauthToken ? 'Full OAuth Access (Read & Write)' : 'Public Profile Linked'}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              {currentUser.statistics?.anime && (
                <div className="relative z-10 grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-xs text-zinc-400 font-medium">Anime</div>
                    <div className="text-base font-extrabold text-white">
                      {currentUser.statistics.anime.count}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-xs text-zinc-400 font-medium">Episodes</div>
                    <div className="text-base font-extrabold text-purple-300">
                      {currentUser.statistics.anime.episodesWatched}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-xs text-zinc-400 font-medium">Days</div>
                    <div className="text-base font-extrabold text-sky-300">
                      {(currentUser.statistics.anime.minutesWatched / 1440).toFixed(1)}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-xs text-zinc-400 font-medium">Mean</div>
                    <div className="text-base font-extrabold text-amber-300">
                      {currentUser.statistics.anime.meanScore}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={syncAniList}
                disabled={isSyncingAniList}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingAniList ? 'animate-spin' : ''}`} />
                <span>{isSyncingAniList ? 'Syncing AniList...' : 'Sync Now'}</span>
              </button>

              <button
                onClick={() => {
                  logoutFromAniList();
                  setStatusMessage({ text: 'Signed out from AniList', type: 'success' });
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 font-bold text-sm text-red-300 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('oauth')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'oauth'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                1-Click Sign In
              </button>
              <button
                onClick={() => setActiveTab('token')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'token'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Token / PIN
              </button>
              <button
                onClick={() => setActiveTab('username')}
                className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'username'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Username
              </button>
            </div>

            {activeTab === 'oauth' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-sky-950/30 border border-purple-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AniList OAuth 2.0 Authorization</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Sign in with your AniList credentials to enable automatic watch progress sync, list updates, and library management.
                  </p>
                  <button
                    onClick={initiateAniListOAuth}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 font-bold text-sm text-white shadow-xl shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Authorize with AniList</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-semibold text-zinc-300">Client Settings Info</span>
                    <span>Client ID: <strong className="text-white">55798</strong></span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    If your AniList client currently has <code className="text-purple-300">Redirect URL: null</code>, add this callback URL in your{' '}
                    <a
                      href="https://anilist.co/settings/developer"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 underline hover:text-purple-300"
                    >
                      AniList Developer settings
                    </a>:
                  </p>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                    <code className="text-[11px] text-purple-300 truncate flex-1 font-mono">
                      {callbackUrl}
                    </code>
                    <button
                      onClick={handleCopyCallback}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'token' && (
              <form onSubmit={handleTokenSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    AniList Access Token or PIN
                  </label>
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Paste your AniList Bearer token here..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-purple-500/30 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-400"
                  />
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Don't have a token?</span>
                    <a
                      href="https://anilist.co/api/v2/oauth/authorize?client_id=55798&response_type=token"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                    >
                      <span>Generate one from AniList</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !tokenInput.trim()}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying Token...' : 'Connect with Token'}
                </button>
              </form>
            )}

            {activeTab === 'username' && (
              <form onSubmit={handleUsernameSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">
                    AniList Username
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. Dominum"
                    className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-purple-500/30 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-400"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Fetches your public anime lists, stats, and watch progress without entering credentials.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !usernameInput.trim()}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Finding User...' : 'Fetch Anime Lists'}
                </button>
              </form>
            )}

            {statusMessage && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/15 text-red-300 border border-red-500/30'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
