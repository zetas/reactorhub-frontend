// Shared analytics types to avoid duplication across creator pages

export interface PatronAnalyticsData {
  overview: {
    total_views: number;
    views_trend: number;
    watch_time: number; // total minutes
    watch_time_trend: number;
    active_patrons: number;
    patron_trend: number;
    avg_engagement: number;
    engagement_trend: number;
  };
  content_performance: Array<{
    title: string;
    views: number;
    watchTime: number; // in minutes
    engagement: number; // percentage
    color: string;
  }>;
  device_breakdown: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  traffic_sources: Array<{
    source: string;
    percentage: number;
    views: number;
  }>;
  top_content: Array<{
    id: string;
    title: string;
    views: number;
    watchTime: number;
    engagement_rate: number;
  }>;
  engagement_metrics: {
    likes: number;
    likes_trend: number;
    comments: number;
    comments_trend: number;
    shares: number;
    shares_trend: number;
    bookmarks: number;
    bookmarks_trend: number;
  };
  patron_activity: Array<{
    date: string;
    active_patrons: number;
    new_patrons: number;
    returning_patrons: number;
  }>;
  content_categories: Array<{
    category: string;
    views: number;
    percentage: number;
    color: string;
  }>;
  viewing_patterns: {
    peak_hours: Array<{
      hour: number;
      views: number;
    }>;
    peak_days: Array<{
      day: string;
      views: number;
    }>;
  };
}

export interface AnalyticsData {
  overview: {
    total_views: number;
    views_trend: number;
    watch_time: number;
    watch_time_trend: number;
    active_patrons: number;
    patron_trend: number;
    avg_engagement: number;
    engagement_trend: number;
  };
  content_performance: Array<{
    title: string;
    views: number;
    watchTime: number;
    engagement: number;
    color: string;
  }>;
  device_breakdown: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  traffic_sources: Array<{
    source: string;
    percentage: number;
    views: number;
  }>;
  top_content: Array<{
    id: string;
    title: string;
    views: number;
    watchTime: number;
    engagement_rate: number;
  }>;
  engagement_metrics: {
    likes: number;
    likes_trend: number;
    comments: number;
    comments_trend: number;
    shares: number;
    shares_trend: number;
    bookmarks: number;
    bookmarks_trend: number;
  };
  patron_activity: Array<{
    date: string;
    active_patrons: number;
    new_patrons: number;
    returning_patrons: number;
  }>;
  content_categories: Array<{
    category: string;
    views: number;
    percentage: number;
    color: string;
  }>;
  viewing_patterns: {
    peak_hours: Array<{
      hour: number;
      views: number;
    }>;
    peak_days: Array<{
      day: string;
      views: number;
    }>;
  };
}

// Common loading state hook pattern
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Common data fetching pattern
export interface DataState<T> extends LoadingState {
  data: T | null;
}