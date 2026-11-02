import * as api from '../api.js';
import { store } from '../store.js';
import { $, $$, esc, spinner, errorBox, title, fmtFormat, fmtDate, score } from '../ui.js';

export async function render(el) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, i) => new Date(today.getTime() + i * 86400000));
  let sel = 0, all = [];
  el.innerHTML = `<div class="page-title"><h1>Schedule</h1><div class="sub">Airing times in your local time zone</div></div>
    <div class="days">${days.map((d, i) => `<button class="day ${i ? '' : 'on'}" data-i="${i}"><span>${d.toLocaleDateString(undefined, { weekday: 'short' })}</span><b>${d.getDate()}</b></button>`).join('')}</div>
    <div id="list">${spinner()}</div>`;
  const draw = () => {
    const s = days[sel].getTime() / 1000, e = s + 86400;
    const hide = store.settings().hideAdult;
    const rows = all.filter((x) => x.airingAt >= s && x.airingAt < e && !(hide && x.media.isAdult)).sort((a, b) => a.airingAt - b.airingAt);
    $('#list', el).innerHTML = rows.length ? rows.map((x) => `<a class="sched" href="#/detail/${x.media.id}">
      <div class="poster"><img src="${esc(x.media.coverImage?.large)}" alt="" loading="lazy" onload="this.classList.add('ld')"></div>
      <div class="t"><div class="time">${fmtDate(x.airingAt, { hour: 'numeric', minute: '2-digit' })} · Episode ${x.episode}</div><b>${esc(title(x.media))}</b>
      <div class="meta">${esc([fmtFormat(x.media.format), score(x.media) && '★ ' + score(x.media)].filter(Boolean).join(' · '))}</div></div></a>`).join('') : '<div class="empty"><h3>Nothing airing</h3>No episodes scheduled for this day.</div>';
  };
  $('.days', el).addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; sel = +b.dataset.i; $$('.day', el).forEach((d) => d.classList.toggle('on', d === b)); draw(); });
  try { all = await api.airingSchedule(days[0].getTime() / 1000, days[13].getTime() / 1000 + 86400); draw(); }
  catch (err) { $('#list', el).innerHTML = errorBox(err.message); $('#retry', el).onclick = () => render(el); }
}
