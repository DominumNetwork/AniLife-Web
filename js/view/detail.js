import * as api from '../api.js';
import { store } from '../store.js';
import { resolveEpisodes } from '../sources.js';
import { $, $$, esc, icon, title, fmtFormat, fmtStatus, fmtDate, year, cover, strip, card, spinner, errorBox, sheet, toast, STATUSES, confirmSheet } from '../ui.js';

export async function render(el, params, id) {
  el.innerHTML = `<a class="back" href="javascript:history.back()" aria-label="Back">${icon('back')}</a>${spinner()}`;
  let m;
  try { m = await api.mediaFull(+id); } catch (e) { el.innerHTML += errorBox(e.message); $('#retry', el).onclick = () => render(el, params, id); return; }
  if (!m) { el.innerHTML = '<div class="empty"><h3>Not found</h3></div>'; return; }
  let tab = params.get('tab') || 'home';
  const studio = (m.studios?.nodes || []).find((s) => s.isAnimationStudio) || m.studios?.nodes?.[0];
  const prog = store.progress()[m.id];
  const nextEp = prog ? prog.episode : 1;
  const episodes = (await resolveEpisodes(m)) || defaultEpisodes(m);

  const entryStatus = () => store.entry(m.id)?.status;
  const listLabel = () => { const s = entryStatus(); return s ? STATUSES.find((x) => x[0] === s)?.[1] || 'On list' : 'Add to list'; };

  const draw = () => {
    el.innerHTML = `<a class="back" href="javascript:history.back()" aria-label="Back">${icon('back')}</a>
      <div class="d-banner" style="background-image:url('${esc(m.bannerImage || cover(m))}')"></div>
      <div class="d-head"><div class="poster"><img class="ld" src="${esc(cover(m))}" alt=""></div>
        <div class="d-info"><h1>${esc(title(m))}</h1>${studio ? `<a class="studio" href="#/search?query=${encodeURIComponent(studio.name)}">${esc(studio.name)}</a>` : ''}
        ${m.averageScore ? `<div class="d-score">${m.averageScore}% score</div>` : ''}</div></div>
      <div class="d-actions"><button class="btn outline block" id="addlist">${icon('heart')}<span id="ll">${esc(listLabel())}</span></button>
        <a class="btn accent block" href="#/watch/${m.id}/${nextEp}">${icon('play')}${prog ? 'Resume' : 'Watch'}</a></div>
      <div class="chips" style="padding-top:18px">${[['home', 'Home'], ['episodes', 'Episodes'], ['related', 'Related']].map(([k, l]) => `<button class="chip ${tab === k ? 'on' : ''}" data-t="${k}">${l}</button>`).join('')}</div>
      <div id="tabbody"></div>`;
    $$('[data-t]', el).forEach((b) => b.onclick = () => { tab = b.dataset.t; draw(); });
    $('#addlist', el).onclick = () => listSheet(m, () => { $('#ll', el).textContent = listLabel(); });
    const body = $('#tabbody', el);
    if (tab === 'home') home(body); else if (tab === 'episodes') eps(body); else related(body);
  };

  function home(b) {
    const n = m.nextAiringEpisode;
    const desc = strip(m.description);
    b.innerHTML = `<div class="stats">${[[fmtStatus(m.status), 'Status'], [fmtFormat(m.format), 'Format'], [year(m) || '—', 'Year'], [m.episodes || '?', 'Episodes'], [m.duration ? m.duration + 'm' : '—', 'Duration']]
      .map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${l}</span></div>`).join('')}</div>
      ${n ? `<div class="next-ep">${icon('clock')}<div><b>Next episode ${n.episode}</b><span>${fmtDate(n.airingAt)}</span></div></div>` : ''}
      <div class="chips" style="padding-top:16px">${(m.genres || []).map((g) => `<a class="chip tag" href="#/search?genre=${encodeURIComponent(g)}">${esc(g)}</a>`).join('')}</div>
      <div class="overview"><h2>Overview</h2><p class="clamp" id="syn">${esc(desc || 'No synopsis available.')}</p>${desc.length > 300 ? '<button class="link-btn" id="more">Read more</button>' : ''}</div>
      ${m.trailer?.site === 'youtube' && m.trailer.id ? `<div class="overview"><h2>Trailer</h2></div><div class="trailer"><iframe src="https://www.youtube-nocookie.com/embed/${esc(m.trailer.id)}" allowfullscreen loading="lazy"></iframe></div>` : ''}`;
    $('#more', b)?.addEventListener('click', (e) => { $('#syn', b).classList.remove('clamp'); e.target.remove(); });
  }
  function eps(b) {
    const w = new Set(store.watched(m.id));
    if (!episodes.length) { b.innerHTML = '<div class="empty"><h3>No episodes yet</h3>This title has not aired.</div>'; return; }
    b.innerHTML = `<div class="ep-list">${episodes.map((e) => `<div class="ep ${w.has(e.number) ? 'done' : ''}" data-n="${e.number}">
      <div class="th">${e.thumbnail ? `<img src="${esc(e.thumbnail)}" alt="" loading="lazy">` : e.number}</div>
      <div class="t"><b>${esc(e.title || 'Episode ' + e.number)}</b><span>Episode ${e.number}</span></div>
      <button class="chk ${w.has(e.number) ? 'on' : ''}" data-w="${e.number}" aria-label="Toggle watched">${icon('check')}</button></div>`).join('')}</div>`;
    b.addEventListener('click', (ev) => {
      const wbtn = ev.target.closest('[data-w]');
      if (wbtn) { ev.stopPropagation(); const n = +wbtn.dataset.w; const on = store.toggleWatched(m.id, n); wbtn.classList.toggle('on', on); wbtn.closest('.ep').classList.toggle('done', on); return; }
      const row = ev.target.closest('.ep'); if (row) location.hash = `#/watch/${m.id}/${row.dataset.n}`;
    });
  }
  function related(b) {
    const edges = (m.relations?.edges || []).filter((e) => e.node && e.node.id && e.node.format);
    b.innerHTML = edges.length ? `<div class="grid">${edges.map((e) => `<div><div class="rel">${esc(e.relationType.replace(/_/g, ' '))}</div>${card(e.node)}</div>`).join('')}</div>` : '<div class="empty"><h3>Nothing related</h3></div>';
  }
  draw();
}

function defaultEpisodes(m) {
  const stream = (m.streamingEpisodes || []);
  let count = m.episodes || (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : 0) || stream.length;
  if (m.format === 'MOVIE') count = 1;
  return Array.from({ length: count }, (_, i) => {
    const s = stream.find((x) => new RegExp(`(^|\\s)(Episode|Ep\\.?)\\s*${i + 1}(\\D|$)`, 'i').test(x.title || ''));
    return { number: i + 1, title: s ? s.title.replace(/^Episode\s*\d+\s*[-–:]\s*/i, '') : 'Episode ' + (i + 1), thumbnail: s?.thumbnail || null };
  });
}

export function listSheet(m, done) {
  const cur = store.entry(m.id)?.status;
  sheet(`<h2>Add to list</h2>${STATUSES.map(([k, l]) => `<button class="opt ${cur === k ? 'on' : ''}" data-s="${k}"><span class="rd"></span>${l}</button>`).join('')}
    ${cur ? '<button class="opt danger" data-s="REMOVE">Remove from list</button>' : ''}`, (s, close) => s.addEventListener('click', async (e) => {
    const k = e.target.closest('[data-s]')?.dataset.s; if (!k) return; close();
    const slim = slimMedia(m);
    try {
      if (k === 'REMOVE') { store.setEntry(m.id, null); if (store.token()) await api.deleteEntry(m.id); toast('Removed from list'); }
      else {
        const prev = store.entry(m.id); const progress = k === 'COMPLETED' && m.episodes ? m.episodes : prev?.progress;
        store.setEntry(m.id, { status: k, progress, media: slim });
        if (store.token()) await api.saveEntry(m.id, { status: k, progress });
        toast('Saved to ' + STATUSES.find((x) => x[0] === k)[1]);
      }
    } catch (err) { toast('Saved locally — AniList sync failed: ' + err.message); }
    done?.();
  }));
}
export function slimMedia(m) {
  return { id: m.id, idMal: m.idMal, title: m.title, coverImage: m.coverImage, bannerImage: m.bannerImage, format: m.format, seasonYear: m.seasonYear, startDate: m.startDate, episodes: m.episodes, duration: m.duration, status: m.status, averageScore: m.averageScore, isAdult: m.isAdult, genres: m.genres, nextAiringEpisode: m.nextAiringEpisode };
}
