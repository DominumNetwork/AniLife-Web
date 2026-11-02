// Local persistence (replaces the Android app's DataStore / Room stores).
const P = 'anilili:';
const read = (k, d) => { try { const v = localStorage.getItem(P + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} };

export const DEFAULTS = {
  hideAdult: true, autoplay: true, skipIntro: true, titleLang: 'english',
  accent: '#8979F2', subtitleSize: 100, playbackSpeed: 1, category: 'sub',
};
const listeners = new Set();
export const onChange = (fn) => (listeners.add(fn), () => listeners.delete(fn));
const emit = () => listeners.forEach((f) => f());

export const store = {
  settings: () => ({ ...DEFAULTS, ...read('settings', {}) }),
  setSetting(k, v) { write('settings', { ...read('settings', {}), [k]: v }); emit(); },

  token: () => read('token', null),
  setToken(t) { write('token', t); if (!t) write('viewer', null); emit(); },
  viewer: () => read('viewer', null),
  setViewer: (v) => write('viewer', v),

  // Local list: { [id]: { status, score, progress, updatedAt, media } }
  list: () => read('list', {}),
  setEntry(id, entry) { const l = read('list', {}); if (entry) l[id] = { ...l[id], ...entry, updatedAt: Date.now() }; else delete l[id]; write('list', l); emit(); },
  entry: (id) => read('list', {})[id] || null,

  // Continue watching: { [id]: { episode, pos, dur, updatedAt, media } }
  progress: () => read('progress', {}),
  setProgress(id, p) { const l = read('progress', {}); l[id] = { ...l[id], ...p, updatedAt: Date.now() }; write('progress', l); },
  removeProgress(id) { const l = read('progress', {}); delete l[id]; write('progress', l); emit(); },

  // Watched episodes: { [id]: [numbers] }
  watched: (id) => (read('watched', {})[id] || []),
  toggleWatched(id, ep) {
    const w = read('watched', {}); const s = new Set(w[id] || []);
    s.has(ep) ? s.delete(ep) : s.add(ep); w[id] = [...s].sort((a, b) => a - b); write('watched', w); return s.has(ep);
  },
  markWatched(id, ep) { const w = read('watched', {}); const s = new Set(w[id] || []); s.add(ep); w[id] = [...s].sort((a, b) => a - b); write('watched', w); },

  searchHistory: () => read('searchHistory', []),
  pushSearch(q) { q = q.trim(); if (!q) return; write('searchHistory', [q, ...read('searchHistory', []).filter((x) => x !== q)].slice(0, 12)); },
  clearSearchHistory: () => write('searchHistory', []),

  // Backup / restore (same idea as the Android JSON backup; tokens are never included).
  exportBackup() {
    return JSON.stringify({ app: 'anilili-web', version: 1, exportedAt: new Date().toISOString(),
      settings: read('settings', {}), list: read('list', {}), progress: read('progress', {}), watched: read('watched', {}) }, null, 2);
  },
  importBackup(text) {
    const d = JSON.parse(text);
    if (!d || typeof d !== 'object' || !('list' in d || 'settings' in d)) throw new Error('Not an Anilili backup file');
    for (const k of ['settings', 'list', 'progress', 'watched']) if (d[k] && typeof d[k] === 'object') write(k, d[k]);
    emit();
  },
  clearAll() { Object.keys(localStorage).filter((k) => k.startsWith(P)).forEach((k) => localStorage.removeItem(k)); emit(); },
};
