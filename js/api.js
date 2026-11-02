// AniList GraphQL client — queries mirror the Android app's AniListClient.
import { CONFIG } from './config.js';
import { store } from './store.js';

const cache = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function gql(query, variables = {}, { auth = false, ttl = 0 } = {}) {
  const key = ttl ? JSON.stringify([query, variables]) : null;
  if (key) { const c = cache.get(key); if (c && c.exp > Date.now()) return c.data; }
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  const t = store.token(); if (auth && t) headers.Authorization = 'Bearer ' + t;
  for (let attempt = 0; ; attempt++) {
    let res;
    try { res = await fetch(CONFIG.ANILIST_URL, { method: 'POST', headers, body: JSON.stringify({ query, variables }) }); }
    catch { throw new Error('AniList is unreachable. Check your connection (or whether your network blocks anilist.co).'); }
    if (res.status === 429 && attempt < 2) { await sleep((+res.headers.get('Retry-After') || 5) * 1000); continue; }
    const json = await res.json().catch(() => null);
    if (!res.ok || (json?.errors && !json.data)) throw new Error(json?.errors?.[0]?.message || `AniList error ${res.status}`);
    if (key) cache.set(key, { exp: Date.now() + ttl, data: json.data });
    return json.data;
  }
}

const LIST = `id idMal title{romaji english native userPreferred} coverImage{large extraLarge color} bannerImage trailer{thumbnail}
 format season seasonYear episodes duration status averageScore popularity isAdult countryOfOrigin genres
 studios(isMain:true){nodes{id name isAnimationStudio}} nextAiringEpisode{episode airingAt timeUntilAiring} startDate{year month day}`;
const SPOT = `${LIST} description(asHtml:false)`;
const FULL = `id idMal title{romaji english native userPreferred} description(asHtml:false) coverImage{large extraLarge color} bannerImage
 format season seasonYear episodes duration status averageScore meanScore popularity favourites isAdult countryOfOrigin genres
 tags{name rank isMediaSpoiler isGeneralSpoiler} studios{nodes{id name isAnimationStudio}} trailer{id site thumbnail}
 nextAiringEpisode{episode airingAt timeUntilAiring} startDate{year month day} endDate{year month day}
 streamingEpisodes{title thumbnail url site} relations{edges{relationType node{${LIST}}}}`;

export function currentSeason(d = new Date()) {
  const m = d.getMonth(); return { season: m < 3 ? 'WINTER' : m < 6 ? 'SPRING' : m < 9 ? 'SUMMER' : 'FALL', year: d.getFullYear() };
}
const adultVar = (hide) => (hide ? { isAdult: false } : {});

export async function homeCollections(hideAdult) {
  const { season, year } = currentSeason();
  const q = `query($isAdult:Boolean,$airedBefore:Int,$season:MediaSeason,$seasonYear:Int){
    spotlight:Page(page:1,perPage:30){media(type:ANIME,sort:[TRENDING_DESC],isAdult:$isAdult){${SPOT}}}
    newest:Page(page:1,perPage:50){airingSchedules(airingAt_lesser:$airedBefore,sort:TIME_DESC){media{${LIST}}}}
    popular:Page(page:1,perPage:30){media(type:ANIME,season:$season,seasonYear:$seasonYear,sort:[POPULARITY_DESC],isAdult:$isAdult){${LIST}}}
    movies:Page(page:1,perPage:30){media(type:ANIME,format:MOVIE,sort:[POPULARITY_DESC],isAdult:$isAdult){${LIST}}}
    topRated:Page(page:1,perPage:30){media(type:ANIME,sort:[SCORE_DESC],isAdult:$isAdult){${LIST}}}
    upcoming:Page(page:1,perPage:30){media(type:ANIME,status:NOT_YET_RELEASED,sort:[POPULARITY_DESC],isAdult:$isAdult){${LIST}}}}`;
  const d = await gql(q, { ...adultVar(hideAdult), season, seasonYear: year, airedBefore: Math.floor(Date.now() / 1000) - 5400 }, { ttl: 300000 });
  const seen = new Set();
  const newest = d.newest.airingSchedules.map((s) => s.media).filter((m) => m && !seen.has(m.id) && seen.add(m.id) && !(hideAdult && m.isAdult));
  return { spotlight: d.spotlight.media, newest, popular: d.popular.media, movies: d.movies.media, topRated: d.topRated.media, upcoming: d.upcoming.media };
}

export async function discover(f = {}, page = 1, perPage = 30, hideAdult = true) {
  const q = `query($search:String,$page:Int,$perPage:Int,$genres:[String],$tags:[String],$year:Int,$season:MediaSeason,$status:MediaStatus,
    $format:MediaFormat,$country:CountryCode,$minimumScore:Int,$sort:[MediaSort],$isAdult:Boolean,$mediaIds:[Int]){
    Page(page:$page,perPage:$perPage){pageInfo{hasNextPage currentPage total}
      media(search:$search,type:ANIME,genre_in:$genres,tag_in:$tags,seasonYear:$year,season:$season,status:$status,format:$format,
        countryOfOrigin:$country,averageScore_greater:$minimumScore,sort:$sort,isAdult:$isAdult,id_in:$mediaIds){${LIST}}}}`;
  const v = { page, perPage, ...adultVar(hideAdult) };
  if (f.search) v.search = f.search;
  if (f.genres?.length) v.genres = f.genres;
  if (f.tags?.length) v.tags = f.tags;
  for (const k of ['year', 'season', 'status', 'format', 'country', 'minimumScore']) if (f[k]) v[k] = f[k];
  if (f.mediaIds) v.mediaIds = f.mediaIds;
  v.sort = [f.sort || (f.search ? 'SEARCH_MATCH' : 'POPULARITY_DESC')];
  const d = await gql(q, v, { ttl: 120000 });
  return { items: d.Page.media, hasNext: d.Page.pageInfo.hasNextPage, total: d.Page.pageInfo.total };
}
export const discoverOptions = () => gql('query{GenreCollection MediaTagCollection{name isAdult category}}', {}, { ttl: 3600000 });
export const mediaFull = async (id) => (await gql(`query($id:Int){Media(id:$id,type:ANIME){${FULL}}}`, { id }, { ttl: 120000 })).Media;
export const mediaByIds = async (ids) => ids.length ? (await gql(`query($ids:[Int]){Page(perPage:50){media(id_in:$ids,type:ANIME){${LIST}}}}`, { ids }, { ttl: 60000 })).Page.media : [];

export async function airingSchedule(start, end) {
  const q = `query($s:Int,$e:Int,$p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage} airingSchedules(airingAt_greater:$s,airingAt_lesser:$e,sort:TIME){episode airingAt media{${LIST}}}}}`;
  const all = []; let p = 1, more = true;
  while (more && p <= 8) { const d = (await gql(q, { s: start - 1, e: end, p }, { ttl: 300000 })).Page; all.push(...d.airingSchedules); more = d.pageInfo.hasNextPage; p++; }
  return all.filter((x) => x.media);
}

// ── Authenticated ───────────────────────────────────────────────────────────────────────────
export const viewer = async () => (await gql('query{Viewer{id name avatar{large} bannerImage statistics{anime{count episodesWatched minutesWatched meanScore}}}}', {}, { auth: true })).Viewer;
export async function userAnimeList(userId) {
  const q = `query($u:Int){MediaListCollection(userId:$u,type:ANIME,status_in:[CURRENT,REPEATING,PLANNING,PAUSED,COMPLETED,DROPPED]){
    lists{name status isCustomList entries{id updatedAt progress score(format:POINT_10_DECIMAL) status media{${LIST}}}}}}`;
  const d = (await gql(q, { u: userId }, { auth: true })).MediaListCollection;
  return d.lists.filter((l) => !l.isCustomList).flatMap((l) => l.entries);
}
export const saveEntry = (mediaId, vars) => {
  const decl = ['$mediaId:Int'], args = ['mediaId:$mediaId'], v = { mediaId };
  if (vars.status) { decl.push('$status:MediaListStatus'); args.push('status:$status'); v.status = vars.status; }
  if (vars.progress != null) { decl.push('$progress:Int'); args.push('progress:$progress'); v.progress = vars.progress; }
  if (vars.score != null) { decl.push('$score:Float'); args.push('score:$score'); v.score = vars.score; }
  return gql(`mutation(${decl.join(',')}){SaveMediaListEntry(${args.join(',')}){id status progress}}`, v, { auth: true });
};
export async function deleteEntry(mediaId) {
  const d = await gql('query($m:Int){Media(id:$m){mediaListEntry{id}}}', { m: mediaId }, { auth: true });
  const id = d.Media?.mediaListEntry?.id; if (id) await gql('mutation($id:Int){DeleteMediaListEntry(id:$id){deleted}}', { id }, { auth: true });
}
export async function notifications() {
  const q = `query{Page(perPage:30){notifications(type_in:[AIRING],resetNotificationCount:true){... on AiringNotification{id episode createdAt media{${LIST}}}}}}`;
  return (await gql(q, {}, { auth: true })).Page.notifications.filter((n) => n.media);
}
