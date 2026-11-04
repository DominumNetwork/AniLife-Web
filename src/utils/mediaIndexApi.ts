/**
 * Anilife Media Index & Stream Provider Client
 * Connects to sanilili/media-index on jsDelivr CDN
 * Provides:
 * - Real episode lists with TMDB still backdrops, titles, runtimes, and overviews
 * - Lili direct MP4 streams from Cloudflare-fronted XFDM archive
 * - Intro and outro skip timings from AniSkip community database mirror
 * - Dub availability index and official backdrops
 */

export interface MediaIndexEpisode {
  number: number;
  title: string;
  overview?: string;
  air_date?: string;
  still?: string;
  runtime?: number;
  rating?: number;
}

export interface MediaIndexLiliRecord {
  provider: string;
  bangumi?: number;
  subject?: string;
  layout: 'archive' | 'temp';
  crawled: string;
  base: string;
  episodes: Record<string, string>;
}

export interface SkipInterval {
  type: 'op' | 'ed' | 'mixed-op' | 'mixed-ed' | 'recap';
  start: number;
  end: number;
  length?: number;
  skipId?: string;
}

export interface MediaIndexSkipData {
  op?: [number, number];
  ed?: [number, number];
  recap?: [number, number];
}

const MEDIA_INDEX_BASE = 'https://cdn.jsdelivr.net/gh/sanilili/media-index@main/data';

// In-memory cache to prevent redundant HTTP lookups
const episodeCache = new Map<number, MediaIndexEpisode[]>();
const liliStreamCache = new Map<number, MediaIndexLiliRecord | null>();
const skipCache = new Map<number, MediaIndexSkipData | null>();
let dubIndexSet: Set<number> | null = null;
let backdropMap: Record<string, string> | null = null;

/**
 * Fetch episode list for an AniList ID from media-index
 */
export async function fetchMediaIndexEpisodes(anilistId: number): Promise<MediaIndexEpisode[]> {
  if (episodeCache.has(anilistId)) {
    return episodeCache.get(anilistId)!;
  }

  const shard = Math.floor(anilistId / 1000);
  const url = `${MEDIA_INDEX_BASE}/anime/${shard}/${anilistId}/episodes.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      episodeCache.set(anilistId, []);
      return [];
    }
    const data: MediaIndexEpisode[] = await res.json();
    if (Array.isArray(data)) {
      episodeCache.set(anilistId, data);
      return data;
    }
  } catch (err) {
    console.warn(`[media-index] Failed to fetch episodes for ${anilistId}:`, err);
  }

  return [];
}

/**
 * Fetch direct stream record (Lili / XFDM) from media-index
 */
export async function fetchMediaIndexLiliStream(anilistId: number): Promise<MediaIndexLiliRecord | null> {
  if (liliStreamCache.has(anilistId)) {
    return liliStreamCache.get(anilistId)!;
  }

  const shard = Math.floor(anilistId / 1000);
  const url = `${MEDIA_INDEX_BASE}/anime/${shard}/${anilistId}/lili.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      liliStreamCache.set(anilistId, null);
      return null;
    }
    const record: MediaIndexLiliRecord = await res.json();
    if (record && record.base && record.episodes) {
      liliStreamCache.set(anilistId, record);
      return record;
    }
  } catch (err) {
    console.warn(`[media-index] No lili stream for ${anilistId}`);
  }

  liliStreamCache.set(anilistId, null);
  return null;
}

/**
 * Fetch intro & outro skip timings from media-index skip mirror or AniSkip API
 */
export async function fetchMediaIndexSkip(anilistId: number, episodeNum: number, malId?: number): Promise<MediaIndexSkipData | null> {
  const cacheKey = `${anilistId}_${episodeNum}`;
  
  const shard = Math.floor(anilistId / 1000);
  const mirrorUrl = `${MEDIA_INDEX_BASE}/skip/${shard}/${anilistId}.json`;

  try {
    const res = await fetch(mirrorUrl);
    if (res.ok) {
      const data = await res.json();
      const epData = data?.episodes?.[String(episodeNum)];
      if (Array.isArray(epData)) {
        const result: MediaIndexSkipData = {};
        for (const item of epData) {
          const [type, start, end] = item;
          if (type === 'op' || type === 'mixed-op') {
            result.op = [Number(start), Number(end)];
          } else if (type === 'ed' || type === 'mixed-ed') {
            result.ed = [Number(start), Number(end)];
          } else if (type === 'recap') {
            result.recap = [Number(start), Number(end)];
          }
        }
        return result;
      }
    }
  } catch (e) {
    // Fall back to AniSkip API below
  }

  // Fallback: Query AniSkip API directly if MAL ID is available
  if (malId) {
    try {
      const aniskipUrl = `https://api.aniskip.com/v2/skip-times/${malId}/${episodeNum}?types[]=op&types[]=ed&types[]=mixed-op&types[]=mixed-ed&types[]=recap&episodeLength=0`;
      const res = await fetch(aniskipUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.found && Array.isArray(json.results)) {
          const result: MediaIndexSkipData = {};
          for (const item of json.results) {
            const type = item.skipType;
            const start = item.interval?.startTime;
            const end = item.interval?.endTime;
            if (typeof start === 'number' && typeof end === 'number') {
              if (type === 'op' || type === 'mixed-op') {
                result.op = [start, end];
              } else if (type === 'ed' || type === 'mixed-ed') {
                result.ed = [start, end];
              } else if (type === 'recap') {
                result.recap = [start, end];
              }
            }
          }
          return result;
        }
      }
    } catch {
      // Ignored
    }
  }

  return null;
}

/**
 * Check if an anime has an English dub according to dub-index.json
 */
export async function isAnimeDubbed(anilistId: number): Promise<boolean> {
  if (!dubIndexSet) {
    try {
      const res = await fetch(`${MEDIA_INDEX_BASE}/dub-index.json`);
      if (res.ok) {
        const ids: number[] = await res.json();
        dubIndexSet = new Set(ids);
      } else {
        dubIndexSet = new Set();
      }
    } catch {
      dubIndexSet = new Set();
    }
  }
  return dubIndexSet.has(anilistId);
}

/**
 * Fetch high quality TMDB backdrops
 */
export async function fetchBackdrops(): Promise<Record<string, string>> {
  if (backdropMap) return backdropMap;
  try {
    const res = await fetch(`${MEDIA_INDEX_BASE}/backdrops.json`);
    if (res.ok) {
      const data = await res.json();
      backdropMap = data?.titles || {};
      return backdropMap!;
    }
  } catch {
    // Ignored
  }
  return {};
}
