import React from 'react';
import { WatchSession } from '@/types/continueWatching';
import { formatDistanceToNow } from 'date-fns';

interface WatchCardProps {
  session: WatchSession;
  onResume: (session: WatchSession) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({ session, onResume }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const getEpisodeLabel = (): string | null => {
    if (session.season_number && session.episode_number) {
      return `S${session.season_number}E${session.episode_number}`;
    }
    if (session.episode_number) {
      return `Ep ${session.episode_number}`;
    }
    return null;
  };

  const getThumbnailUrl = (): string => {
    if (session.thumbnail_url) {
      return session.thumbnail_url;
    }

    // Fallback to YouTube/Vimeo thumbnail
    if (session.youtube_id) {
      return `https://img.youtube.com/vi/${session.youtube_id}/maxresdefault.jpg`;
    }

    if (session.vimeo_id) {
      return `https://vumbnail.com/${session.vimeo_id}.jpg`;
    }

    // Placeholder gradient
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0YjVzNjM7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWYyOTM3O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2cpIiAvPjwvc3ZnPg==';
  };

  return (
    <div
      onClick={() => onResume(session)}
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-blue-500"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onResume(session);
        }
      }}
      aria-label={`Resume watching ${session.title}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-700">
        <img
          src={getThumbnailUrl()}
          alt={session.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            // Fallback to gradient on image load error
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0YjVzNjM7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWYyOTM3O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2cpIiAvPjwvc3ZnPg==';
          }}
        />

        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg
            className="h-16 w-16 text-white drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/50">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${session.percentage}%` }}
            role="progressbar"
            aria-valuenow={session.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(session.percentage)}% watched`}
          />
        </div>

        {/* Duration badge */}
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {formatDuration(session.total - session.progress)} left
        </div>

        {/* Episode label */}
        {getEpisodeLabel() && (
          <div className="absolute left-2 top-2 rounded bg-blue-600/90 px-2 py-1 text-xs font-bold text-white">
            {getEpisodeLabel()}
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-white">
          {session.title}
        </h3>

        {session.series_name && (
          <p className="mt-1 text-xs text-slate-400">{session.series_name}</p>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">{session.creator_name}</span>
          <span className="flex-shrink-0">
            {formatDistanceToNow(new Date(session.last_watched), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};
