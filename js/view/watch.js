import * as api from '../api.js';
import { store } from '../store.js';
import { hasSources, resolveStreams, resolveEpisodes } from '../sources.js';
import { slimMedia } from './detail.js';
import { $, esc, icon, title, spinner, errorBox, toast } from '../ui.js';

const HLS_CDN = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
let hlsPromise; const loadHls = () => hlsPromise ||= new Promise((res, rej) => { if (window.Hls) return res(window.Hls); const s = document.createElement('script'); s.src = HLS_CDN; s.onload = () => res(window.Hls); s.onerror = rej; document.head.append(s); });
let current = null;
export function cleanup() { if (current) { current.save?.(); current.hls?.destroy(); clearInterval(current.timer); current = null; } }

export async function render(el, params, id, ep) {
  el.innerHTML = spinner();
  let m; try { m = await api.mediaFull(+id); } catch (e) { el.innerHTML = errorBox(e.message); $('#retry', el).onclick = () => render(el, params, id, ep); return; }
  const episodes = (await resolveEpisodes(m)) || Array.from({ length: m.episodes || (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : 1) || 1 }, (_, i) => ({ number: i + 1 }));
  const num = +ep || 1; const s = store.settings(); let category = params.get('cat') || s.category;
  const hasNext = episodes.some((e) => e.number === num + 1);
  el.innerHTML = `<div class="watch"><div class="player" id="player"><div class="none">${spinner()}</div></div>
    <div class="w-head"><div class="sub"><a href="#/detail/${m.id}" style="color:var(--accent)">${esc(title(m))}</a></div><h1>Episode ${num}</h1></div>
    <div class="w-tools"><button class="btn ghost" id="sd" style="height:44px">${category === 'dub' ? 'Dub' : 'Sub'}</button>
      ${num > 1 ? `<a class="btn ghost" style="height:44px" href="#/watch/${m.id}/${num - 1}">‹ Previous</a>` : ''}
      ${hasNext ? `<a class="btn ghost" style="height:44px" href="#/watch/${m.id}/${num + 1}">Next ›</a>` : ''}
      <a class="btn ghost" style="height:44px" href="#/detail/${m.id}?tab=episodes">Episodes</a></div></div>`;
  $('#sd', el).onclick = () => { store.setSetting('category', category === 'dub' ? 'sub' : 'dub'); render(el, params, id, ep); };
  const box = $('#player', el);
  if (!hasSources()) {
    box.innerHTML = `<div class="none"><b>No video source configured</b><span>Anilili Web ships without streaming providers. Register your own licensed source in <code>js/sources.js</code> and episodes will play here.</span></div>`;
    store.setProgress(m.id, { episode: num, media: slimMedia(m), pos: 0, dur: 0 }); return;
  }
  const results = await resolveStreams(m, num, category);
  const pick = results[0]; const stream = pick?.streams?.[0];
  if (!stream) { box.innerHTML = `<div class="none"><b>Episode unavailable</b><span>None of your configured sources returned a stream for this episode${category === 'dub' ? ' (dub)' : ''}.</span></div>`; return; }
  box.innerHTML = `<video id="v" controls playsinline autoplay crossorigin="anonymous"></video><button class="skip hide" id="skip">Skip</button>`;
  const v = $('#v', el); const resume = store.progress()[m.id];
  const startAt = params.get('t') ? +params.get('t') : resume && resume.episode == num ? resume.pos : 0;
  const attach = async () => {
    if (stream.type === 'hls' || /\.m3u8(\?|$)/.test(stream.url)) {
      if (v.canPlayType('application/vnd.apple.mpegurl')) v.src = stream.url;
      else { const Hls = await loadHls(); if (Hls.isSupported()) { const h = new Hls(); h.loadSource(stream.url); h.attachMedia(v); current.hls = h; } else throw new Error('HLS not supported'); }
    } else v.src = stream.url;
  };
  current = { save: () => { if (v.duration) store.setProgress(m.id, { episode: num, pos: v.currentTime, dur: v.duration, media: slimMedia(m) }); } };
  (pick.subtitles || []).forEach((t, i) => { const tr = document.createElement('track'); Object.assign(tr, { kind: 'subtitles', src: t.url, srclang: t.lang || 'en', label: t.label || t.lang || 'Subtitles', default: i === 0 }); v.append(tr); });
  try { await attach(); } catch (e) { box.innerHTML = `<div class="none"><b>Playback failed</b><span>${esc(e.message)}</span></div>`; return; }
  v.playbackRate = s.playbackSpeed || 1;
  v.addEventListener('loadedmetadata', () => { if (startAt > 5 && startAt < v.duration - 20) v.currentTime = startAt; }, { once: true });
  const skip = $('#skip', el);
  current.timer = setInterval(() => {
    current.save(); const t = v.currentTime;
    const seg = [['intro', pick.intro], ['outro', pick.outro]].find(([, r]) => r && t >= r.start && t < r.end - 1);
    skip.classList.toggle('hide', !seg); if (seg) { skip.textContent = 'Skip ' + seg[0]; skip.onclick = () => { v.currentTime = seg[1].end; }; if (s.skipIntro && seg[0] === 'intro' && !skip.dataset.auto) { skip.dataset.auto = 1; v.currentTime = seg[1].end; } }
    if (v.duration && t / v.duration > 0.9) { store.markWatched(m.id, num); }
  }, 4000);
  v.addEventListener('ended', async () => {
    store.markWatched(m.id, num);
    const st = store.entry(m.id)?.status;
    if (store.token()) api.saveEntry(m.id, { progress: num, status: m.episodes && num >= m.episodes ? 'COMPLETED' : 'CURRENT' }).catch(() => {});
    store.setEntry(m.id, { status: m.episodes && num >= m.episodes ? 'COMPLETED' : (st || 'CURRENT'), progress: num, media: slimMedia(m) });
    if (s.autoplay && hasNext) location.hash = `#/watch/${m.id}/${num + 1}`;
  });
}
