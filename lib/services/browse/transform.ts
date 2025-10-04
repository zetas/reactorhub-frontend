import {
  BrowseCollections,
  ContentSummary,
  CreatorSummary,
  RawBrowsePayload,
} from './types';

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const formatDuration = (durationInSeconds?: number | null): string | undefined => {
  if (durationInSeconds == null || Number.isNaN(durationInSeconds)) {
    return undefined;
  }

  const totalSeconds = Math.max(0, Math.round(durationInSeconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${hours}h`;
  }

  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${String(seconds).padStart(2, '0')}s` : `${minutes}m`;
  }

  return `${seconds}s`;
};

const parseNumeric = (value: unknown): number | undefined => {
  if (value == null) return undefined;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const buildEpisodeLabel = (season?: unknown, episode?: unknown): string | undefined => {
  const s = parseNumeric(season);
  const e = parseNumeric(episode);
  if (s == null || e == null) return undefined;
  return `S${Math.round(s)} · E${Math.round(e)}`;
};

const resolveProgress = (source: Record<string, any>): number => {
  const progressSources = [
    source?.watch_progress?.progress_percentage,
    source?.watch_progress?.percentage,
    source?.percentage,
    source?.progress_percentage,
    source?.progress,
  ];

  for (const candidate of progressSources) {
    const numeric = parseNumeric(candidate);
    if (numeric != null) {
      return clamp(Math.round(numeric));
    }
  }

  const watched = parseNumeric(source?.watch_progress?.watched_seconds ?? source?.watched_seconds);
  const total = parseNumeric(source?.watch_progress?.total_seconds ?? source?.total_seconds);
  if (watched != null && total && total > 0) {
    return clamp(Math.round((watched / total) * 100));
  }

  return 0;
};

const normaliseId = (value: unknown, fallback?: string): string => {
  const resolved = (typeof value === 'string' && value.length > 0)
    ? value
    : fallback;
  if (!resolved) {
    throw new Error('Content item is missing an identifier');
  }
  return resolved;
};

export const mapContentResource = (raw: Record<string, any>): ContentSummary => {
  const base = raw?.content ?? raw;

  const id = normaliseId(base?.id ?? raw?.id, raw?.uuid ?? base?.uuid);
  const title = base?.title ?? raw?.title ?? 'Untitled';
  const description = base?.description ?? raw?.description ?? null;
  const thumbnail = base?.thumbnail_url ?? base?.thumbnail ?? raw?.thumbnail_url ?? raw?.thumbnail ?? null;
  const durationSeconds = parseNumeric(base?.duration ?? base?.duration_seconds ?? raw?.duration);
  const durationLabel = durationSeconds != null ? formatDuration(durationSeconds) : (typeof base?.duration === 'string' ? base.duration : undefined);
  const seriesName = base?.series_name ?? raw?.series_name ?? base?.series?.name ?? raw?.series?.name ?? null;
  const episodeLabel = buildEpisodeLabel(base?.season ?? raw?.season, base?.episode ?? raw?.episode);
  const creatorName = base?.creator?.name ?? raw?.creator?.name ?? base?.creator_name ?? raw?.creator_name ?? null;

  const isPaid = Boolean(base?.is_paid ?? raw?.is_paid);
  const tierRequired = parseNumeric(base?.minimum_tier ?? raw?.minimum_tier ?? base?.tier_required ?? raw?.tier_required ?? base?.tier_level ?? raw?.tier_level);

  return {
    id,
    title,
    description,
    thumbnail,
    durationLabel,
    progress: resolveProgress(raw),
    seriesName,
    episodeLabel,
    creatorName,
    isPaid,
    tierRequired: tierRequired ?? undefined,
  };
};

export const mapCreatorResource = (raw: Record<string, any>): CreatorSummary => {
  if (!raw) {
    throw new Error('Creator payload is required');
  }

  return {
    id: normaliseId(raw.id ?? raw.uuid, raw.slug),
    name: raw.name ?? raw.campaign_name ?? 'Unknown Creator',
    slug: raw.slug ?? undefined,
    campaignName: raw.campaign_name ?? raw.name ?? null,
    thumbnail: raw.thumbnail_url ?? raw.avatar ?? raw.image ?? null,
    patronCount: parseNumeric(raw.patron_count ?? raw.patrons) ?? undefined,
    contentCount: parseNumeric(raw.contents_count ?? raw.content_count) ?? undefined,
  };
};

const mapCreatorFromAccess = (access: Record<string, any>): CreatorSummary | null => {
  const candidate = access?.creator ?? access;
  if (!candidate) {
    return null;
  }

  const summary = mapCreatorResource(candidate);
  if (summary.contentCount == null && parseNumeric(access?.content_count)) {
    summary.contentCount = parseNumeric(access.content_count) ?? undefined;
  }
  return summary;
};

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
  const map = new Map<string, T>();
  items.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
};

export const buildBrowseCollections = (payload: RawBrowsePayload): BrowseCollections => {
  const continueWatching = uniqueById((payload.continueWatching ?? []).map(mapContentResource));
  const recentlyWatched = uniqueById((payload.recentlyWatched ?? []).map(mapContentResource));
  const creators = uniqueById((payload.creators ?? []).map(mapCreatorResource));
  const myCreators = uniqueById(
    (payload.myCreators ?? [])
      .map(mapCreatorFromAccess)
      .filter((value): value is CreatorSummary => Boolean(value))
  );

  const featured = continueWatching[0] ?? recentlyWatched[0] ?? null;

  return {
    featured,
    continueWatching,
    recentlyWatched,
    creators,
    myCreators,
  };
};
