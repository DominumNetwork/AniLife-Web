// ─────────────────────────────────────────────────────────────────────────────────────────────
// Pluggable video sources.
//
// The Android app's built-in streaming providers are intentionally NOT part of the web port.
// Register your own licensed source(s) here (or from any script loaded before app.js):
//
//   import { registerSource } from './sources.js';
//   registerSource({
//     id: 'my-catalogue',
//     name: 'My Catalogue',
//     // Optional: does this source have the title? Return false to hide it.
//     async hasTitle(media) { return true; },
//     // Return the episodes you can play. Omit to fall back to AniList's episode count.
//     async getEpisodes(media) { return [{ number: 1, title: 'Episode 1', thumbnail: null }]; },
//     // Return playable streams for one episode. category: 'sub' | 'dub'
//     async getStreams(media, episodeNumber, category) {
//       return {
//         streams: [{ url: 'https://…/master.m3u8', type: 'hls' /* or 'mp4' */, quality: '1080p', label: 'Server 1' }],
//         subtitles: [{ url: 'https://…/en.vtt', lang: 'en', label: 'English' }],
//         intro: { start: 62, end: 150 },   // optional, seconds
//         outro: { start: 1320, end: 1400 }, // optional
//       };
//     },
//   });
// ─────────────────────────────────────────────────────────────────────────────────────────────
const sources = [];
export const registerSource = (s) => { if (s && s.id && s.getStreams) sources.push(s); };
export const listSources = () => sources.slice();
export const hasSources = () => sources.length > 0;

export async function resolveEpisodes(media) {
  for (const s of sources) {
    try { if (s.hasTitle && !(await s.hasTitle(media))) continue; if (s.getEpisodes) { const e = await s.getEpisodes(media); if (e?.length) return e; } } catch {}
  }
  return null;
}
export async function resolveStreams(media, episode, category) {
  const out = [];
  for (const s of sources) {
    try { if (s.hasTitle && !(await s.hasTitle(media))) continue;
      const r = await s.getStreams(media, episode, category);
      if (r?.streams?.length) out.push({ source: s, ...r }); } catch (e) { console.warn('source failed', s.id, e); }
  }
  return out;
}
