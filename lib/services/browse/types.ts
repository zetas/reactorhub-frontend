export interface CreatorSummary {
  id: string;
  name: string;
  slug?: string;
  campaignName?: string | null;
  thumbnail?: string | null;
  patronCount?: number;
  contentCount?: number;
}

export interface ContentSummary {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  durationLabel?: string;
  progress: number;
  seriesName?: string | null;
  episodeLabel?: string | null;
  creatorName?: string | null;
  isPaid: boolean;
  tierRequired?: number | null;
}

export interface BrowseCollections {
  featured: ContentSummary | null;
  continueWatching: ContentSummary[];
  recentlyWatched: ContentSummary[];
  creators: CreatorSummary[];
  myCreators: CreatorSummary[];
}

export interface RawBrowsePayload {
  creators: any[];
  continueWatching: any[];
  recentlyWatched: any[];
  myCreators: any[];
}
