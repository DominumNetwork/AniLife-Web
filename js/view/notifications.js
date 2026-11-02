import * as api from '../api.js';
import { store } from '../store.js';
import { $, esc, icon, title, fmtDate, spinner, errorBox } from '../ui.js';
export async function render(el) {
  el.innerHTML = `<a class="back" href="javascript:history.back()">${icon('back')}</a><div class="page-title" style="padding-top:56px"><h1>Notifications</h1></div><div id="nb">${spinner()}</div>`;
  if (!store.token()) { $('#nb', el).innerHTML = '<div class="empty"><h3>Sign in to AniList</h3>Airing notifications come from your AniList account.</div>'; return; }
  try {
    const n = await api.notifications();
    $('#nb', el).innerHTML = n.length ? n.map((x) => `<a class="sched" href="#/detail/${x.media.id}"><div class="poster"><img src="${esc(x.media.coverImage?.large)}" alt="" onload="this.classList.add('ld')"></div>
      <div class="t"><div class="time">Episode ${x.episode} aired</div><b>${esc(title(x.media))}</b><div class="meta">${fmtDate(x.createdAt)}</div></div></a>`).join('') : '<div class="empty"><h3>All caught up</h3></div>';
  } catch (e) { $('#nb', el).innerHTML = errorBox(e.message); $('#retry', el).onclick = () => render(el); }
}
