'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui';
import { TrendingUp, TrendingDown, Users, Video, Play, Eye } from 'lucide-react';

interface PlatformStats {
  total_creators: number;
  total_users: number;
  total_content: number;
  total_series: number;
  creators_this_week: number;
  users_this_week: number;
  active_users_today: number;
  active_users_this_week: number;
  videos_watched_today: number;
  videos_watched_this_week: number;
}

interface GrowthMetrics {
  creator_growth_rate: number;
  user_growth_rate: number;
  content_growth_rate: number;
}

interface EngagementMetrics {
  avg_watch_time: number;
  completion_rate: number;
  daily_active_users: number;
  weekly_active_users: number;
}

interface MetricsData {
  platform_stats: PlatformStats;
  growth_metrics: GrowthMetrics;
  engagement_metrics: EngagementMetrics;
  updated_at: string;
}

interface TopCreator {
  id: string;
  campaign_name: string;
  total_views: number;
  content_count: number;
  patron_count: number;
}

interface ContentStats {
  content_by_type: Record<string, number>;
  total_duration_hours: number;
  avg_content_length: number;
  most_popular_series: Array<{
    name: string;
    total_views: number;
    episode_count: number;
  }>;
}

export default function PublicMetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [metricsRes, creatorsRes, contentRes] = await Promise.all([
          fetch('/api/v1/public/metrics'),
          fetch('/api/v1/public/metrics/top-creators'),
          fetch('/api/v1/public/metrics/content-stats')
        ]);

        if (!metricsRes.ok || !creatorsRes.ok || !contentRes.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const [metricsData, creatorsData, contentData] = await Promise.all([
          metricsRes.json(),
          creatorsRes.json(),
          contentRes.json()
        ]);

        setMetrics(metricsData);
        setTopCreators(creatorsData.top_creators);
        setContentStats(contentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatGrowthRate = (rate: number): JSX.Element => {
    const isPositive = rate >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span>{Math.abs(rate).toFixed(1)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading platform metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading metrics: {error}</p>
        </div>
      </div>
    );
  }

  if (!metrics || !contentStats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Reactor Platform Metrics
          </h1>
          <p className="text-lg text-gray-600">
            Real-time platform statistics and growth metrics
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date(metrics.updated_at).toLocaleString()}
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Creators</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.platform_stats.total_creators)}</div>
            <p className="text-xs text-gray-500">
              +{metrics.platform_stats.creators_this_week} this week
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.platform_stats.total_users)}</div>
            <p className="text-xs text-gray-500">
              +{metrics.platform_stats.users_this_week} this week
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Content</h3>
              <Video className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.platform_stats.total_content)}</div>
            <p className="text-xs text-gray-500">
              {metrics.platform_stats.total_series} series
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Videos Watched</h3>
              <Play className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.platform_stats.videos_watched_this_week)}</div>
            <p className="text-xs text-gray-500">
              {metrics.platform_stats.videos_watched_today} today
            </p>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Creator Growth</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Week over week</span>
              {formatGrowthRate(metrics.growth_metrics.creator_growth_rate)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Week over week</span>
              {formatGrowthRate(metrics.growth_metrics.user_growth_rate)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Growth</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Week over week</span>
              {formatGrowthRate(metrics.growth_metrics.content_growth_rate)}
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Watch Time</h3>
            <div className="text-2xl font-bold text-gray-900">{metrics.engagement_metrics.avg_watch_time.toFixed(1)}m</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Rate</h3>
            <div className="text-2xl font-bold text-gray-900">{metrics.engagement_metrics.completion_rate.toFixed(1)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Daily Active Users</h3>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.engagement_metrics.daily_active_users)}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Weekly Active Users</h3>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.engagement_metrics.weekly_active_users)}</div>
          </div>
        </div>

        {/* Top Creators and Content Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Top Creators</h3>
            <div className="space-y-4">
              {topCreators.slice(0, 5).map((creator, index) => (
                <div key={creator.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{creator.campaign_name}</p>
                      <p className="text-sm text-gray-500">
                        {creator.content_count} videos • {formatNumber(creator.patron_count)} patrons
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatNumber(creator.total_views)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Content Statistics</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Content by Type</h4>
                <div className="space-y-2">
                  {Object.entries(contentStats.content_by_type).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="capitalize text-gray-600">{type.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Duration</p>
                    <p className="font-medium text-gray-900">{contentStats.total_duration_hours}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Length</p>
                    <p className="font-medium text-gray-900">{contentStats.avg_content_length}m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Series */}
        {contentStats.most_popular_series.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Most Popular Series</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentStats.most_popular_series.map((series, index) => (
                <div key={series.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      #{index + 1}
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatNumber(series.total_views)}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{series.name}</h4>
                  <p className="text-sm text-gray-500">{series.episode_count} episodes</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}