import * as api from '../api.js';
import { CONFIG } from '../config.js';
import { store, DEFAULTS } from '../store.js';
import { listSources } from '../sources.js';
import { $, $$, esc, spinner, sheet, toast, confirmSheet } from '../ui.js';

const ACCENTS = ['#8979F2', '#FFFFFF', '#FF6B8B', '#4DD49A', '#F0BD5C', '#4DA3FF', '#FF8A3D'];
const row = (t, s, right) => `<div class="row-set"><div class="t"><b>${t}</b>${s ? `<span class="s">${s}</span>` : ''}</div>${right || ''}</div>`;
const sw = (k, on) => `<button class="sw ${on ? 'on' : ''}" data-sw="${k}" role="switch" aria-checked="${on}"></button>`;

export async function render(el) {
  const s = store.settings(); const v = store.viewer(); const logged = !!store.token();
  if (logged && !v) api.viewer().then((x) => { store.setViewer(x); render(el); }).catch(() => {});
  el.innerHTML = `<div class="page-title"><h1>Settings</h1></div>
  <div class="group"><h3>Account</h3><div class="box">
    ${logged ? `<div class="row-set">${v?.avatar?.large ? `<img class="avatar" src="${esc(v.avatar.large)}" alt="">` : ''}<div class="t"><b>${esc(v?.name || 'AniList')}</b><span class="s">${v?.statistics ? `${v.statistics.anime.count} anime · ${v.statistics.anime.episodesWatched} episodes` : 'Signed in to AniList'}</span></div><button class="link-btn" id="logout">Sign out</button></div>`
      : `${row('AniList', 'Sync your list and progress', CONFIG.ANILIST_CLIENT_ID ? '<button class="link-btn" id="login">Sign in</button>' : '')}
         ${row('Use an access token', 'Paste a token from anilist.co/settings/developer', '<button class="link-btn" id="token">Enter</button>')}`}
  </div></div>
  <div class="group"><h3>Content</h3><div class="box">
    ${row('Hide adult content', 'Filters 18+ titles from Home, Browse and Library', sw('hideAdult', s.hideAdult))}
    ${row('Title language', '', `<select class="sel" id="lang"><option value="english">English</option><option value="romaji">Romaji</option><option value="native">Native</option></select>`)}
  </div></div>
  <div class="group"><h3>Playback</h3><div class="box">
    ${row('Autoplay next episode', '', sw('autoplay', s.autoplay))}${row('Skip intro automatically', 'When a source provides intro timestamps', sw('skipIntro', s.skipIntro))}
    ${row('Default audio', '', `<select class="sel" id="cat"><option value="sub">Sub</option><option value="dub">Dub</option></select>`)}
    ${row('Playback speed', '', `<select class="sel" id="spd">${[0.75, 1, 1.25, 1.5, 2].map((x) => `<option value="${x}">${x}×</option>`).join('')}</select>`)}
    ${row('Video sources', listSources().length ? listSources().map((x) => esc(x.name || x.id)).join(', ') : 'None configured — see js/sources.js')}
  </div></div>
  <div class="group"><h3>Appearance</h3><div class="box"><div class="row-set"><div class="t"><b>Accent colour</b></div></div>
    <div class="swatches">${ACCENTS.map((c) => `<button class="swatch ${s.accent.toLowerCase() === c.toLowerCase() ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div></div></div>
  <div class="group"><h3>Data</h3><div class="box">
    ${row('Export backup', 'Settings, saved anime, progress and watched episodes (no logins)', '<button class="link-btn" id="exp">Export</button>')}
    ${row('Restore backup', 'Import a JSON backup file', '<button class="link-btn" id="imp">Import</button><input type="file" id="file" accept="application/json,.json" class="hide">')}
    ${row('Clear search history', '', '<button class="link-btn" id="csh">Clear</button>')}
    ${row('Reset app data', 'Removes everything stored on this device', '<button class="link-btn" id="reset" style="color:var(--red)">Reset</button>')}
  </div></div>
  <div class="group"><h3>About</h3><div class="box">${row('Anilili Web', `Version ${esc(CONFIG.APP_VERSION)} · Metadata from AniList`)}</div></div>`;
  $('#lang', el).value = s.titleLang; $('#cat', el).value = s.category; $('#spd', el).value = String(s.playbackSpeed);
  $('#lang', el).onchange = (e) => store.setSetting('titleLang', e.target.value);
  $('#cat', el).onchange = (e) => store.setSetting('category', e.target.value);
  $('#spd', el).onchange = (e) => store.setSetting('playbackSpeed', +e.target.value);
  el.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.sw) { const k = t.dataset.sw; store.setSetting(k, !store.settings()[k]); t.classList.toggle('on'); }
    if (t.dataset.c) { store.setSetting('accent', t.dataset.c); $$('.swatch', el).forEach((x) => x.classList.toggle('on', x === t)); }
    if (t.id === 'login') { const st = crypto.getRandomValues(new Uint32Array(4)).join('-'); sessionStorage.setItem('anilili:oauth', st); location.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${CONFIG.ANILIST_CLIENT_ID}&response_type=token&state=${st}`; }
    if (t.id === 'token') sheet(`<h2>AniList token</h2><p class="sub" style="margin:0 0 12px;line-height:1.5">Create a client at anilist.co/settings/developer, authorize it, and paste the access token here. It is stored only in this browser.</p><input type="password" id="tk" placeholder="Access token" autocomplete="off"><div class="btns"><button class="btn accent block" id="ok">Save</button></div>`,
      (sh, close) => sh.querySelector('#ok').onclick = async () => { const val = sh.querySelector('#tk').value.trim(); if (!val) return; store.setToken(val); try { store.setViewer(await api.viewer()); close(); toast('Signed in'); render(el); } catch (err) { store.setToken(null); toast('Token rejected: ' + err.message); } });
    if (t.id === 'logout') { store.setToken(null); render(el); }
    if (t.id === 'exp') { const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([store.exportBackup()], { type: 'application/json' })), download: 'anilili-backup.json' }); a.click(); URL.revokeObjectURL(a.href); }
    if (t.id === 'imp') $('#file', el).click();
    if (t.id === 'csh') { store.clearSearchHistory(); toast('Search history cleared'); }
    if (t.id === 'reset' && await confirmSheet('Reset app data?', 'This removes your saved list, progress, settings and sign-in from this device.', 'Reset', true)) { store.clearAll(); location.hash = '#/home'; location.reload(); }
  });
  $('#file', el).onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { store.importBackup(await f.text()); toast('Backup restored'); render(el); } catch (err) { toast(err.message); } };
}
