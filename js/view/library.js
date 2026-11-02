import * as api from '../api.js';
import { store } from '../store.js';
import { $, $$, esc, icon, title, card, grid, spinner, errorBox, STATUSES, fmtFormat, year } from '../ui.js';

const TABS = [['ALL', 'All'], ...STATUSES];
export async function render(el, params) {
  let tab = params.get('tab') || 'ALL';
  el.innerHTML = `<div class="page-title"><h1>Library</h1><div class="sub">${store.token() ? 'Synced with AniList' : 'Saved on this device'}</div></div>
    <div class="chips" id="lt">${TABS.map(([k, l]) => `<button class="chip ${k === tab ? 'on' : ''}" data-k="${k}">${l}</button>`).join('')}</div><div id="lb">${spinner()}</div>`;
  let entries;
  try {
    if (store.token()) {
      let v = store.viewer(); if (!v) { v = await api.viewer(); store.setViewer(v); }
      const remote = await api.userAnimeList(v.id);
      remote.forEach((e) => store.setEntry(e.media.id, { status: e.status === 'REPEATING' ? 'CURRENT' : e.status, progress: e.progress, score: e.score, media: e.media }));
    }
    entries = Object.entries(store.list()).map(([id, e]) => ({ id, ...e })).filter((e) => e.media);
  } catch (e) { $('#lb', el).innerHTML = errorBox(e.message); $('#retry', el).onclick = () => render(el, params); return; }
  const draw = () => {
    const hide = store.settings().hideAdult;
    const rows = entries.filter((e) => (tab === 'ALL' || e.status === tab) && !(hide && e.media.isAdult)).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    $('#lb', el).innerHTML = rows.length ? `<div class="grid">${rows.map((e) => card(e.media, e.progress ? `<div class="badge-ep">${e.progress}${e.media.episodes ? '/' + e.media.episodes : ''}</div>` : '')).join('')}</div>`
      : `<div class="empty"><h3>Nothing here yet</h3>Use “Add to list” on any anime to save it.</div>`;
  };
  $('#lt', el).addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return; tab = b.dataset.k; $$('#lt .chip', el).forEach((x) => x.classList.toggle('on', x === b)); draw(); });
  draw();
}
