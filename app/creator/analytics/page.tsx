'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, Eye, Clock, Users, DollarSign,
  Calendar, Filter, Download, BarChart3, PieChart, LineChart,
  Play, Heart, MessageCircle, Share2, Globe, Smartphone,
  Monitor, Tablet, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { creatorDashboard } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { 
  PerformanceChart
} from '@/components/charts/AnalyticsCharts';
import { 
  ContentPerformanceChart, 
  DeviceBreakdownChart, 
  TrafficSourcesChart,
  PatronActivityChart,
  WatchTimeDistributionChart
} from '@/components/charts/PatronAnalyticsCharts';

interface AnalyticsData {
  overview: {
    total_views: number;
    views_trend: number;
    watch_time: number;
    watch_time_trend: number;
    active_patrons: number;
    patrons_trend: number;
    avg_engagement_rate: number;
    engagement_trend: number;
    avg_watch_percentage: number;
    watch_percentage_trend: number;
  };
  top_content: TopContentItem[];
  // Removed revenue_breakdown - focusing on patron engagement
  demographics: {
    devices: { name: string; percentage: number; color: string }[];
    locations: { country: string; percentage: number; views: number }[];
    age_groups: { range: string; percentage: number }[];
  };
  engagement_metrics: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  traffic_sources: {
    source: string;
    percentage: number;
    views: number;
  }[];
}

interface TopContentItem {
  id: string;
  title: string;
  views: number;
  watch_time: number;
  engagement_rate: number;
  watch_percentage: number;
  published_at: string;
  thumbnail?: string;
}

// Removed RevenueItem interface - focusing on patron engagement instead

export default function CreatorAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'revenue' | 'engagement'>('views');

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

      // Mock analytics data - in real app this would be API calls
      const mockData: AnalyticsData = {
        overview: {
          total_views: 2450000,
          views_trend: 12.5,
          watch_time: 8640000, // seconds (2400 hours)
          watch_time_trend: 8.3,
          active_patrons: 1955,
          patrons_trend: 8.7,
          avg_engagement_rate: 0.68,
          engagement_trend: 3.2,
          avg_watch_percentage: 0.72,
          watch_percentage_trend: -2.1
        },
        top_content: [
          {
            id: '1',
            title: 'Breaking Bad S01E01 - Pilot Reaction',
            views: 125000,
            watch_time: 95000,
            engagement_rate: 0.75,
            watch_percentage: 82,
            published_at: '2024-01-15T10:00:00.000Z',
            thumbnail: '/api/placeholder/150/85'
          },
          {
            id: '2',
            title: 'Inception - Mind-Blown First Watch',
            views: 89000,
            watch_time: 62000,
            engagement_rate: 0.68,
            watch_percentage: 76,
            published_at: '2024-01-12T15:30:00.000Z',
            thumbnail: '/api/placeholder/150/85'
          },
          {
            id: '3',
            title: 'The Dark Knight - Joker Analysis',
            views: 78000,
            watch_time: 54000,
            engagement_rate: 0.71,
            watch_percentage: 71,
            published_at: '2024-01-10T18:00:00.000Z',
            thumbnail: '/api/placeholder/150/85'
          }
        ],
        // Removed revenue_breakdown - focusing on patron engagement metrics
        demographics: {
          devices: [
            { name: 'Desktop', percentage: 45, color: 'bg-blue-500' },
            { name: 'Mobile', percentage: 35, color: 'bg-green-500' },
            { name: 'Tablet', percentage: 20, color: 'bg-purple-500' }
          ],
          locations: [
            { country: 'United States', percentage: 42, views: 1029000 },
            { country: 'Canada', percentage: 18, views: 441000 },
            { country: 'United Kingdom', percentage: 12, views: 294000 },
            { country: 'Australia', percentage: 8, views: 196000 },
            { country: 'Germany', percentage: 6, views: 147000 },
            { country: 'Others', percentage: 14, views: 343000 }
          ],
          age_groups: [
            { range: '18-24', percentage: 28 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 22 },
            { range: '45-54', percentage: 12 },
            { range: '55+', percentage: 3 }
          ]
        },
        engagement_metrics: {
          likes: 89500,
          comments: 12400,
          shares: 5600,
          saves: 8900
        },
        traffic_sources: [
          { source: 'Direct', percentage: 35, views: 857500 },
          { source: 'YouTube', percentage: 28, views: 686000 },
          { source: 'Social Media', percentage: 20, views: 490000 },
          { source: 'Search', percentage: 12, views: 294000 },
          { source: 'Other', percentage: 5, views: 122500 }
        ]
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (!num || num === undefined) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours.toLocaleString()}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Removed formatCurrency - focusing on patron engagement metrics instead of revenue

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Analytics Data</h2>
          <p className="text-gray-400">Analytics data will appear once you have published content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Track your content performance and audience insights</p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Views"
            value={formatNumber(analytics.overview.total_views)}
            trend={analytics.overview.views_trend}
            icon={Eye}
            color="blue"
          />
          <MetricCard
            title="Watch Time"
            value={formatDuration(analytics.overview.watch_time)}
            trend={analytics.overview.watch_time_trend}
            icon={Clock}
            color="green"
          />
          {/* Removed Subscribers metric - focusing on Active Patrons instead */}
          <MetricCard
            title="Active Patrons"
            value={analytics.overview.active_patrons.toLocaleString()}
            trend={analytics.overview.patrons_trend}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Engagement Rate"
            value={`${Math.round(analytics.overview.avg_engagement_rate * 100)}%`}
            trend={analytics.overview.engagement_trend}
            icon={Heart}
            color="red"
          />
          <MetricCard
            title="Avg. Watch %"
            value={`${Math.round(analytics.overview.avg_watch_percentage * 100)}%`}
            trend={analytics.overview.watch_percentage_trend}
            icon={Play}
            color="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Performance Overview</h2>
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setSelectedMetric('views')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    selectedMetric === 'views' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Views
                </button>
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    selectedMetric === 'revenue' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('engagement')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    selectedMetric === 'engagement' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Engagement
                </button>
              </div>
            </div>

            {/* Interactive Performance Chart */}
            <PerformanceChart 
              metric={selectedMetric} 
              timeRange={timeRange}
              className="mt-4"
            />
          </div>

          {/* Patron Engagement Breakdown */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Patron Engagement by Tier</h2>
            
            <div className="space-y-4">
              {[
                { tier: 'Free Tier', patrons: 1250, engagement: 78, color: 'bg-blue-500' },
                { tier: 'Basic Supporters', patrons: 450, engagement: 85, color: 'bg-green-500' },
                { tier: 'Premium Fans', patrons: 180, engagement: 92, color: 'bg-purple-500' },
                { tier: 'VIP Members', patrons: 75, engagement: 96, color: 'bg-yellow-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`} />
                    <span className="text-sm text-gray-300">{item.tier}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.patrons.toLocaleString()} patrons</div>
                    <div className="text-xs text-gray-400">{item.engagement}% engagement</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Active Patrons</span>
                <span className="font-semibold text-blue-400">
                  {(1250 + 450 + 180 + 75).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Performance and Demographics */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Content */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Top Performing Content</h2>
            <div className="space-y-4">
              {analytics.top_content.map((content, index) => (
                <div key={content.id} className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-600 w-8">
                    {index + 1}
                  </div>
                  <div className="w-16 h-10 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                    {content.thumbnail ? (
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{content.title}</h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>{formatNumber(content.views)} views</span>
                      <span>{Math.round(content.engagement_rate * 100)}% eng.</span>
                      <span>{Math.round(content.watch_percentage)}% completion</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-6">
            {/* Device Breakdown */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Devices
              </h3>
              
              {/* Interactive Device Chart */}
              <DeviceBreakdownChart data={analytics.demographics.devices} className="mb-4" />
              
              <div className="space-y-3">
                {analytics.demographics.devices.map((device) => (
                  <div key={device.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${device.color} mr-3`} />
                      <span className="text-sm">{device.name}</span>
                    </div>
                    <span className="text-sm font-medium">{device.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Top Locations
              </h3>
              <div className="space-y-3">
                {analytics.demographics.locations.slice(0, 4).map((location) => (
                  <div key={location.country} className="flex items-center justify-between">
                    <span className="text-sm">{location.country}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{location.percentage}%</div>
                      <div className="text-xs text-gray-400">{formatNumber(location.views)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement and Traffic Sources */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Engagement Metrics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Engagement Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatNumber(analytics.engagement_metrics.likes)}</div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatNumber(analytics.engagement_metrics.comments)}</div>
                <div className="text-sm text-gray-400">Comments</div>
              </div>
              <div className="text-center">
                <Share2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatNumber(analytics.engagement_metrics.shares)}</div>
                <div className="text-sm text-gray-400">Shares</div>
              </div>
              <div className="text-center">
                <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatNumber(analytics.engagement_metrics.saves)}</div>
                <div className="text-sm text-gray-400">Saves</div>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Traffic Sources</h2>
            
            {/* Interactive Traffic Sources Chart */}
            <TrafficSourcesChart data={analytics.traffic_sources} className="mb-6" />
            
            <div className="space-y-4">
              {analytics.traffic_sources.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{source.source}</span>
                    <span>{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatNumber(source.views)} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age Demographics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Age Demographics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.demographics.age_groups.map((group) => (
              <div key={group.range} className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{group.percentage}%</div>
                <div className="text-sm text-gray-400">{group.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  color
}: {
  title: string;
  value: string;
  trend: number;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    purple: 'bg-purple-500/10 text-purple-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    red: 'bg-red-500/10 text-red-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center text-sm ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  );
}