// Shared UI helpers.
import { store } from './store.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const I = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2" fill="currentColor" stroke="none"/><path d="M8 3v4M16 3v4" /><path d="M3 10h18" stroke="#000" stroke-opacity=".5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" fill="currentColor"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none"/>',
  info: '<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M12 11v6M12 7.5v.01" stroke="#000"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" fill="currentColor" stroke="none"/>',
};
export const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg>`;

export function title(m) {
  const t = m.title || {}; const lang = store.settings().titleLang;
  return (lang === 'romaji' ? t.romaji : lang === 'native' ? t.native : t.english) || t.english || t.userPreferred || t.romaji || t.native || 'Untitled';
}
export const fmtFormat = (f) => ({ TV: 'TV', TV_SHORT: 'TV Short', MOVIE: 'Movie', SPECIAL: 'Special', OVA: 'OVA', ONA: 'ONA', MUSIC: 'Music' }[f] || f || '');
export const fmtStatus = (s) => ({ RELEASING: 'Releasing', FINISHED: 'Finished', NOT_YET_RELEASED: 'Upcoming', CANCELLED: 'Cancelled', HIATUS: 'Hiatus' }[s] || s || '—');
export const year = (m) => m.seasonYear || m.startDate?.year || '';
export const cover = (m) => m.coverImage?.extraLarge || m.coverImage?.large || '';
export const score = (m) => (m.averageScore ? m.averageScore + '%' : '');
export function countdown(sec) {
  if (sec == null) return ''; const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), mi = Math.floor((sec % 3600) / 60);
  return d ? `${d}D ${h}H` : h ? `${h}H ${mi}M` : `${mi}M`;
}
export const fmtDate = (ts, opts = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) => new Date(ts * 1000).toLocaleString(undefined, opts);
export const strip = (html) => String(html || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');

export function card(m, extra = '') {
  const meta = [fmtFormat(m.format), year(m), m.episodes ? m.episodes + ' EP' : ''].filter(Boolean).join(' · ');
  return `<a class="card" href="#/detail/${m.id}" data-id="${m.id}">
    <div class="poster" style="background:${esc(m.coverImage?.color || '#16161a')}">
      <img src="${esc(m.coverImage?.large || cover(m))}" loading="lazy" alt="" onload="this.classList.add('ld')">
      ${score(m) ? `<div class="score"><b>★</b>${score(m)}</div>` : ''}${extra}
    </div>
    <h3>${esc(title(m))}</h3><div class="meta">${esc(meta)}</div></a>`;
}
export const grid = (items) => items.length ? `<div class="grid">${items.map((m) => card(m)).join('')}</div>` : '';
export const spinner = () => '<div class="spinner"></div>';
export const errorBox = (msg, retryId = 'retry') => `<div class="err">${esc(msg)}<br><button id="${retryId}">Try again</button></div>`;

let toastT;
export function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
}
export function sheet(html, onMount) {
  const root = $('#sheet-root');
  root.innerHTML = `<div class="scrim"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  const close = () => { root.innerHTML = ''; };
  $('.scrim', root).addEventListener('click', (e) => { if (e.target.classList.contains('scrim')) close(); });
  onMount?.($('.sheet', root), close);
  return close;
}
export function confirmSheet(titleText, body, okLabel = 'Confirm', danger = false) {
  return new Promise((res) => {
    const close = sheet(`<h2>${esc(titleText)}</h2><p class="sub" style="font-size:15px;line-height:1.5;margin:0 0 6px">${esc(body)}</p>
      <div class="btns"><button class="btn ghost block" data-a="no">Cancel</button><button class="btn ${danger ? 'ghost' : 'accent'} block" data-a="yes" ${danger ? 'style="color:var(--red)"' : ''}>${esc(okLabel)}</button></div>`,
      (el) => el.addEventListener('click', (e) => { const a = e.target.closest('[data-a]')?.dataset.a; if (a) { close(); res(a === 'yes'); } }));
  });
}

export const STATUSES = [['CURRENT', 'Watching'], ['PLANNING', 'Plan to watch'], ['COMPLETED', 'Completed'], ['PAUSED', 'Paused'], ['DROPPED', 'Dropped']];
