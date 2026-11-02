import { store, onChange } from './store.js';
import { icon, $, $$ } from './ui.js';
import * as home from './views/home.js';
import * as search from './views/search.js';
import * as schedule from './views/schedule.js';
import * as library from './views/library.js';
import * as settings from './views/settings.js';
import * as detail from './views/detail.js';
import * as watch from './views/watch.js';
import * as notifications from './views/notifications.js';
import * as api from './api.js';
// import './my-sources.js';   // ← register your own licensed video sources (see sources.js)

// AniList implicit grant returns to "<site>/#access_token=…" — catch it before the router runs.
(function captureToken() {
  const m = location.hash.match(/access_token=([^&]+)/); if (!m) return;
  const expected = sessionStorage.getItem('anilili:oauth');
  const state = (location.hash.match(/state=([^&]+)/) || [])[1];
  sessionStorage.removeItem('anilili:oauth');
  if (expected && state && expected !== decodeURIComponent(state)) {
    history.replaceState(null, '', location.pathname + '#/settings');
    return;
  }
  store.setToken(decodeURIComponent(m[1]));
  api.viewer().then((v) => store.setViewer(v)).catch(() => {});
  history.replaceState(null, '', location.pathname + '#/settings');
})();

const TABS = [['home', 'Home', 'home'], ['schedule', 'Schedule', 'cal'], ['library', 'Library', 'list'], ['settings', 'Settings', 'gear']];
const routes = [
  [/^home$/, home], [/^search$/, search], [/^schedule$/, schedule], [/^library$/, library], [/^settings$/, settings],
  [/^notifications$/, notifications], [/^detail\/(\d+)$/, detail], [/^watch\/(\d+)\/(\d+)$/, watch],
];
const NAV_ON = new Set(['home', 'search', 'schedule', 'library', 'settings']);
const view = $('#view'), nav = $('#nav');
let active = null;

function applyTheme() {
  const a = store.settings().accent; const r = document.documentElement.style;
  r.setProperty('--accent', a);
  const n = parseInt(a.slice(1), 16), lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  r.setProperty('--on-accent', lum > 0.6 ? '#000' : '#fff');
  r.setProperty('--accent-c', `color-mix(in srgb, ${a} 22%, #000)`);
}
function drawNav(route) {
  const cur = route === 'search' ? 'home' : route;
  nav.innerHTML = `<div class="bar">${TABS.map(([r, l, i]) => `<a href="#/${r}" class="${cur === r ? 'on' : ''}"><span class="pill">${icon(i)}</span>${l}</a>`).join('')}</div>`;
}
async function route() {
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, qs] = raw.split('?'); const params = new URLSearchParams(qs || '');
  active?.cleanup?.(); watch.cleanup();
  for (const [re, mod] of routes) {
    const m = path.match(re); if (!m) continue;
    active = mod; const top = path.split('/')[0];
    nav.classList.toggle('hide', !NAV_ON.has(top)); view.classList.toggle('no-nav', !NAV_ON.has(top));
    if (NAV_ON.has(top)) drawNav(top);
    window.scrollTo(0, 0);
    await mod.render(view, params, ...m.slice(1));
    return;
  }
  location.replace('#/home');
}
window.addEventListener('hashchange', route);
onChange(applyTheme);
applyTheme();
route().finally(() => { const s = $('#splash'); setTimeout(() => { s.classList.add('gone'); setTimeout(() => s.remove(), 400); }, 350); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
