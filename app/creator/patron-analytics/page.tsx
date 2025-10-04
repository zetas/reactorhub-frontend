'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, Eye, Clock, Users, Heart,
  Calendar, Filter, Download, BarChart3, PieChart, LineChart,
  Play, MessageCircle, Share2, Globe, Smartphone,
  Monitor, Tablet, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  PerformanceChart, 
  ContentPerformanceChart, 
  DeviceBreakdownChart, 
  TrafficSourcesChart,
  PatronActivityChart,
  WatchTimeDistributionChart
} from '@/components/charts/PatronAnalyticsCharts';

interface PatronAnalyticsData {
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
    comments: number;
    shares: number;
    saves: number;
  };
}

export default function PatronAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBreadcrumbs } = useNavigation();
  const [data, setData] = useState<PatronAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'watchTime' | 'engagement'>('views');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Creator Dashboard', href: '/creator/dashboard' },
      { label: 'Patron Analytics', href: '/creator/patron-analytics' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Temporarily bypass auth check for demo purposes
    // if (!user?.isCreator) {
    //   router.push('/creator/onboarding');
    //   return;
    // }
    loadAnalytics();
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Mock patron analytics data - in real app this would be API calls
      const mockData: PatronAnalyticsData = {
        overview: {
          total_views: 2450000,
          views_trend: 12.5,
          watch_time: 144000, // minutes (2400 hours)
          watch_time_trend: 8.3,
          active_patrons: 15420,
          patron_trend: 15.2,
          avg_engagement: 78.5,
          engagement_trend: 5.7
        },
        content_performance: [
          { title: 'Avatar: The Last Airbender S1E1', views: 125000, watchTime: 42, engagement: 85, color: 'bg-purple-500' },
          { title: 'Breaking Bad S1E1 Reaction', views: 98000, watchTime: 38, engagement: 82, color: 'bg-blue-500' },
          { title: 'The Office Pilot Episode', views: 87000, watchTime: 35, engagement: 79, color: 'bg-green-500' },
          { title: 'Stranger Things S1E1', views: 76000, watchTime: 41, engagement: 88, color: 'bg-yellow-500' },
          { title: 'Game of Thrones S1E1', views: 65000, watchTime: 45, engagement: 83, color: 'bg-red-500' }
        ],
        device_breakdown: [
          { name: 'Desktop', percentage: 45, color: 'bg-blue-500' },
          { name: 'Mobile', percentage: 35, color: 'bg-green-500' },
          { name: 'Tablet', percentage: 20, color: 'bg-purple-500' }
        ],
        traffic_sources: [
          { source: 'Direct', percentage: 35, views: 857500 },
          { source: 'YouTube', percentage: 28, views: 686000 },
          { source: 'Social Media', percentage: 20, views: 490000 },
          { source: 'Search', percentage: 12, views: 294000 },
          { source: 'Other', percentage: 5, views: 122500 }
        ],
        top_content: [
          { id: '1', title: 'Avatar: The Last Airbender S1E1', views: 125000, watchTime: 42, engagement_rate: 85 },
          { id: '2', title: 'Breaking Bad S1E1 Reaction', views: 98000, watchTime: 38, engagement_rate: 82 },
          { id: '3', title: 'The Office Pilot Episode', views: 87000, watchTime: 35, engagement_rate: 79 },
          { id: '4', title: 'Stranger Things S1E1', views: 76000, watchTime: 41, engagement_rate: 88 },
          { id: '5', title: 'Game of Thrones S1E1', views: 65000, watchTime: 45, engagement_rate: 83 }
        ],
        engagement_metrics: {
          likes: 89500,
          comments: 12400,
          shares: 5600,
          saves: 8900
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to load patron analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-400';
    if (trend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patron Analytics</h1>
            <p className="text-gray-400">Track how your patrons engage with your content</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold">{formatNumber(data.overview.total_views)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(data.overview.views_trend)}
                <span className={`text-sm ${getTrendColor(data.overview.views_trend)}`}>
                  {Math.abs(data.overview.views_trend)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Watch Time</p>
                  <p className="text-2xl font-bold">{formatTime(data.overview.watch_time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(data.overview.watch_time_trend)}
                <span className={`text-sm ${getTrendColor(data.overview.watch_time_trend)}`}>
                  {Math.abs(data.overview.watch_time_trend)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Patrons</p>
                  <p className="text-2xl font-bold">{formatNumber(data.overview.active_patrons)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(data.overview.patron_trend)}
                <span className={`text-sm ${getTrendColor(data.overview.patron_trend)}`}>
                  {Math.abs(data.overview.patron_trend)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Heart className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Engagement</p>
                  <p className="text-2xl font-bold">{data.overview.avg_engagement}%</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(data.overview.engagement_trend)}
                <span className={`text-sm ${getTrendColor(data.overview.engagement_trend)}`}>
                  {Math.abs(data.overview.engagement_trend)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Performance Trends</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as 'views' | 'watchTime' | 'engagement')}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
              >
                <option value="views">Views</option>
                <option value="watchTime">Watch Time</option>
                <option value="engagement">Engagement</option>
              </select>
            </div>
            <PerformanceChart metric={selectedMetric} timeRange={timeRange} />
          </div>

          {/* Content Performance */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Top Content Performance</h3>
            <ContentPerformanceChart data={data.content_performance} />
          </div>

          {/* Device Breakdown */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Device Usage</h3>
            <DeviceBreakdownChart data={data.device_breakdown} />
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Traffic Sources</h3>
            <TrafficSourcesChart data={data.traffic_sources} />
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patron Activity */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Patron Activity</h3>
            <PatronActivityChart timeRange={timeRange} />
          </div>

          {/* Watch Time Distribution */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Watch Time Distribution</h3>
            <WatchTimeDistributionChart />
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Engagement Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg mx-auto mb-3">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.engagement_metrics.likes)}</p>
              <p className="text-gray-400 text-sm">Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.engagement_metrics.comments)}</p>
              <p className="text-gray-400 text-sm">Comments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-3">
                <Share2 className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.engagement_metrics.shares)}</p>
              <p className="text-gray-400 text-sm">Shares</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-3">
                <Play className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.engagement_metrics.saves)}</p>
              <p className="text-gray-400 text-sm">Saves</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}