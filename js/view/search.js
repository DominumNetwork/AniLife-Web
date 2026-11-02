import * as api from '../api.js';
import { store } from '../store.js';
import { $, $$, esc, icon, card, spinner, errorBox, sheet } from '../ui.js';

const FORMATS = [['TV', 'TV'], ['MOVIE', 'Movie'], ['OVA', 'OVA'], ['ONA', 'ONA'], ['SPECIAL', 'Special']];
const STATUS = [['RELEASING', 'Releasing'], ['FINISHED', 'Finished'], ['NOT_YET_RELEASED', 'Upcoming']];
const SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const SORTS = [['POPULARITY_DESC', 'Popularity'], ['TRENDING_DESC', 'Trending'], ['SCORE_DESC', 'Score'], ['START_DATE_DESC', 'Newest'], ['TITLE_ROMAJI', 'Title']];

export async function render(el, params) {
  const f = { search: params.get('query') || params.get('q') || '', genres: params.get('genre') ? [params.get('genre')] : [], format: '', status: '', year: '', season: '', sort: '', minimumScore: '' };
  let opts = null, page = 1, items = [], hasNext = false, total = 0, token = 0;
  const hide = store.settings().hideAdult;
  el.innerHTML = `
    <div class="page-title"><div class="row"><div><h1>Browse</h1><div class="sub">Find your next obsession</div></div><button class="link-btn" id="reset">Reset</button></div></div>
    <div class="searchbar"><label class="field">${icon('search')}<input id="q" type="search" placeholder="Search anime…" value="${esc(f.search)}" enterkeyhint="search" autocomplete="off"></label>
      <button class="sq-btn" id="filter" aria-label="Filters">${icon('filter')}</button></div>
    <div id="hist"></div><div class="label">Categories</div><div class="chips" id="cats"></div><div class="hr"></div>
    <div class="section-head" style="padding-top:4px"><h2 id="h">Discover anime</h2><span class="sub" id="sortlbl">Trending</span></div>
    <div id="res"></div><div id="more" class="pad" style="text-align:center"></div>`;
  const q = $('#q', el);

  const drawCats = () => {
    const cats = [['Movies', 'format', 'MOVIE'], ...['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'].map((g) => [g, 'genre', g])];
    $('#cats', el).innerHTML = cats.map(([l, k, v]) => `<button class="chip sq ${(k === 'genre' ? f.genres.includes(v) : f.format === v) ? 'on' : ''}" data-k="${k}" data-v="${esc(v)}">${esc(l)}</button>`).join('');
  };
  const drawHist = () => {
    const h = store.searchHistory(); const box = $('#hist', el);
    box.innerHTML = !f.search && h.length ? `<div class="chips">${h.map((x) => `<button class="chip tag" data-h="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : '';
  };
  async function load(reset) {
    const my = ++token; if (reset) { page = 1; items = []; $('#res', el).innerHTML = spinner(); }
    try {
      const r = await api.discover(f, page, 30, hide); if (my !== token) return;
      items = items.concat(r.items); hasNext = r.hasNext; total = r.total;
      $('#res', el).innerHTML = items.length ? `<div class="grid">${items.map((m) => card(m)).join('')}</div>` : `<div class="empty"><h3>No results</h3>Try different keywords or filters.</div>`;
      $('#more', el).innerHTML = hasNext ? '<button class="btn ghost" id="loadmore">Load more</button>' : '';
      $('#sortlbl', el).textContent = f.search ? `${total || items.length} results` : (SORTS.find((s) => s[0] === (f.sort || 'POPULARITY_DESC')) || SORTS[0])[1];
    } catch (e) { $('#res', el).innerHTML = errorBox(e.message); $('#retry', el).onclick = () => load(true); }
  }
  let deb; q.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => { f.search = q.value.trim(); drawHist(); load(true); }, 350); });
  q.addEventListener('keydown', (e) => { if (e.key === 'Enter') store.pushSearch(q.value); });
  el.addEventListener('click', (e) => {
    const c = e.target.closest('[data-k]'); const h = e.target.closest('[data-h]');
    if (c) { const { k, v } = c.dataset; if (k === 'genre') f.genres = f.genres.includes(v) ? [] : [v]; else f.format = f.format === v ? '' : v; drawCats(); load(true); }
    if (h) { q.value = f.search = h.dataset.h; drawHist(); load(true); }
    if (e.target.closest('#loadmore')) { page++; load(false); }
    if (e.target.closest('#reset')) { Object.assign(f, { search: '', genres: [], format: '', status: '', year: '', season: '', sort: '', minimumScore: '' }); q.value = ''; drawCats(); drawHist(); load(true); }
  });
  $('#filter', el).onclick = async () => {
    if (!opts) try { opts = await api.discoverOptions(); } catch { opts = { GenreCollection: [], MediaTagCollection: [] }; }
    const yrs = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + 1 - i);
    const sel = (id, label, list, cur) => `<div class="label" style="padding:10px 0 6px">${label}</div><select class="sel" id="${id}" style="width:100%;height:46px"><option value="">Any</option>${list.map(([v, l]) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    sheet(`<h2>Filters</h2>${sel('f-genre', 'Genre', (opts.GenreCollection || []).filter((g) => !hide || g !== 'Hentai').map((g) => [g, g]), f.genres[0] || '')}
      ${sel('f-format', 'Format', FORMATS, f.format)}${sel('f-status', 'Status', STATUS, f.status)}${sel('f-year', 'Year', yrs.map((y) => [y, y]), f.year)}
      ${sel('f-season', 'Season', SEASONS.map((s) => [s, s[0] + s.slice(1).toLowerCase()]), f.season)}${sel('f-score', 'Minimum score', [50, 60, 70, 80, 90].map((n) => [n, n + '%']), f.minimumScore)}
      ${sel('f-sort', 'Sort by', SORTS, f.sort)}<div class="btns"><button class="btn ghost block" id="f-clear">Clear</button><button class="btn accent block" id="f-apply">Apply</button></div>`, (s, close) => {
      s.querySelector('#f-clear').onclick = () => { Object.assign(f, { genres: [], format: '', status: '', year: '', season: '', sort: '', minimumScore: '' }); close(); drawCats(); load(true); };
      s.querySelector('#f-apply').onclick = () => {
        const v = (id) => s.querySelector(id).value; const g = v('#f-genre'); f.genres = g ? [g] : [];
        Object.assign(f, { format: v('#f-format'), status: v('#f-status'), year: v('#f-year') && +v('#f-year'), season: v('#f-season'), minimumScore: v('#f-score') && +v('#f-score'), sort: v('#f-sort') });
        close(); drawCats(); load(true);
      };
    });
  };
  drawCats(); drawHist(); load(true);
}
