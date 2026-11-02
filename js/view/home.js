import * as api from '../api.js';
import { store } from '../store.js';
import { $, $$, esc, icon, title, fmtFormat, score, countdown, strip, card, spinner, errorBox, sheet, toast } from '../ui.js';

const GENRES = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];
const TABS = [['newest', 'Newest'], ['popular', 'Popular'], ['movies', 'Movies'], ['top', 'Top Rated']];
let heroTimer;

export function cleanup() { clearInterval(heroTimer); }

export async function render(el) {
  const s = store.settings();
  el.innerHTML = `
    <div class="topbar"><span class="wordmark">Anilili</span><div>
      ${store.token() ? `<a class="icon-btn" href="#/notifications" aria-label="Notifications">${icon('bell')}</a>` : ''}
      <a class="icon-btn" href="#/search" aria-label="Search">${icon('search')}</a></div></div>
    <div class="chips" id="genres">${GENRES.map((g, i) => `<button class="chip ${i ? '' : 'on'}" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>
    <div id="home-body">${spinner()}</div>`;
  $('#genres', el).addEventListener('click', (e) => {
    const g = e.target.closest('[data-g]')?.dataset.g; if (!g) return;
    if (g === 'All') return; location.hash = '#/search?genre=' + encodeURIComponent(g);
  });
  const body = $('#home-body', el);
  try {
    const data = await api.homeCollections(s.hideAdult);
    body.innerHTML = '';
    body.append(hero(data.spotlight.filter((m) => m.bannerImage || m.coverImage).slice(0, 6)));
    body.append(...continueWatching());
    body.append(...tabbed(data));
    const up = section('Upcoming', 'Coming soon', data.upcoming.slice(0, 20));
    body.append(up);
  } catch (e) {
    body.innerHTML = errorBox(e.message); $('#retry', body).onclick = () => render(el);
  }
}

function hero(items) {
  const wrap = document.createElement('div'); wrap.className = 'hero';
  wrap.innerHTML = items.map((m, i) => {
    const n = m.nextAiringEpisode;
    return `<div class="hero-slide ${i ? '' : 'on'}">
      <div class="hero-bg" style="background-image:url('${esc(m.bannerImage || m.coverImage?.extraLarge)}')"></div>
      <div class="hero-top">${n ? `<span class="pill-dark">${icon('clock')}<span style="width:16px;height:16px;display:contents"></span>EP ${n.episode} ${countdown(n.timeUntilAiring)}</span>` : '<span></span>'}
        <span class="pill-dark">${i + 1} / ${items.length}</span></div>
      <div class="hero-body">
        <div class="hero-meta"><span>${esc(fmtFormat(m.format))}</span>${m.averageScore ? `<span>·</span><span class="star">★</span><span>${m.averageScore}</span>` : ''}${m.duration ? `<span>·</span><span>${m.duration} mins</span>` : ''}</div>
        <h2>${esc(title(m))}</h2>
        <div class="hero-genres">${esc((m.genres || []).slice(0, 2).join(' · '))}</div>
        <div class="hero-actions"><a class="btn ghost" href="#/detail/${m.id}">${icon('info')}Details</a>
          <a class="btn primary" href="#/watch/${m.id}/${n ? Math.max(1, n.episode - 1) : 1}">${icon('play')}Watch Now</a></div>
      </div></div>`;
  }).join('') + `<div class="dots">${items.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>`;
  let cur = 0;
  const go = (n) => { cur = (n + items.length) % items.length; $$('.hero-slide', wrap).forEach((s, i) => s.classList.toggle('on', i === cur)); $$('.dots i', wrap).forEach((d, i) => d.classList.toggle('on', i === cur)); };
  clearInterval(heroTimer); heroTimer = setInterval(() => go(cur + 1), 7000);
  let sx = 0; wrap.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; clearInterval(heroTimer); }, { passive: true });
  wrap.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); });
  return wrap;
}

function continueWatching() {
  const items = Object.entries(store.progress()).map(([id, p]) => ({ id, ...p })).filter((p) => p.media).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20);
  if (!items.length) return [];
  const sec = document.createElement('section'); sec.className = 'section';
  sec.innerHTML = `<div class="section-head"><div><h2>Continue Watching</h2><p>Long-press a title to remove it</p></div></div>
    <div class="rail">${items.map((p) => {
      const pct = p.dur ? Math.min(100, (p.pos / p.dur) * 100) : 0;
      return `<a class="cw-card" href="#/watch/${p.id}/${p.episode}" data-id="${p.id}">
        <div class="cw-thumb"><img src="${esc(p.media.bannerImage || p.media.coverImage?.large)}" alt="" loading="lazy"><div class="play">${icon('play')}</div>
        <div class="cw-bar"><i style="width:${pct}%"></i></div></div>
        <div class="cw-title">${esc(title(p.media))}</div><div class="sub">Episode ${esc(p.episode)}</div></a>`;
    }).join('')}</div>`;
  $$('.cw-card', sec).forEach((a) => {
    let t; const id = a.dataset.id;
    const ask = () => sheet(`<h2>${esc(a.querySelector('.cw-title').textContent)}</h2><button class="opt danger" data-r>Remove from Continue Watching</button>`, (s, close) =>
      s.querySelector('[data-r]').onclick = () => { store.removeProgress(id); close(); a.remove(); toast('Removed'); });
    a.addEventListener('contextmenu', (e) => { e.preventDefault(); ask(); });
    a.addEventListener('touchstart', () => { t = setTimeout(() => { a.dataset.lp = 1; ask(); }, 550); }, { passive: true });
    a.addEventListener('touchend', () => clearTimeout(t)); a.addEventListener('touchmove', () => clearTimeout(t), { passive: true });
    a.addEventListener('click', (e) => { if (a.dataset.lp) { e.preventDefault(); delete a.dataset.lp; } });
  });
  return [sec];
}

function tabbed(d) {
  const sec = document.createElement('section'); sec.className = 'section';
  const sets = { newest: d.newest, popular: d.popular, movies: d.movies, top: d.topRated };
  sec.innerHTML = `<div class="seg">${TABS.map(([k, l], i) => `<button data-k="${k}" class="${i ? '' : 'on'}">${l}</button>`).join('')}</div><div id="tab-grid"></div>`;
  const draw = (k) => { $('#tab-grid', sec).innerHTML = `<div class="grid">${sets[k].slice(0, 30).map((m) => card(m)).join('')}</div>`; };
  draw('newest');
  $('.seg', sec).addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    $$('.seg button', sec).forEach((x) => x.classList.toggle('on', x === b)); draw(b.dataset.k);
  });
  return [sec];
}

export function section(h, sub, items) {
  const s = document.createElement('section'); s.className = 'section';
  s.innerHTML = `<div class="section-head"><div><h2>${esc(h)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div></div><div class="rail">${items.map((m) => card(m)).join('')}</div>`;
  return s;
}
