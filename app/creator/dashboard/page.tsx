'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, Users, Film, Eye, Clock,
  Plus, Upload, BarChart3, Calendar, DollarSign, Activity
} from 'lucide-react';
import { creatorDashboard } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useNavigation } from '@/contexts/NavigationContext';
// Removed problematic Recharts import that causes Redux infinite loop

interface DashboardStats {
  total_views: number;
  total_watch_time: number;
  active_patrons: number;
  content_count: number;
  views_trend: number;
  watch_time_trend: number;
  patrons_trend: number;
  revenue_estimate: number;
}

interface RecentContent {
  id: string;
  title: string;
  thumbnail?: string;
  views: number;
  watch_time: number;
  created_at: string;
  type: 'episode' | 'movie';
}

interface TopContent {
  id: string;
  title: string;
  views: number;
  average_watch_percentage: number;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBreadcrumbs } = useNavigation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContent, setRecentContent] = useState<RecentContent[]>([]);
  const [topContent, setTopContent] = useState<TopContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Set breadcrumbs for dashboard
    setBreadcrumbs([
      { label: 'Dashboard', href: '/creator/dashboard', isActive: true }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Temporarily bypass auth check for demo purposes
    // if (!user?.isCreator) {
    //   router.push('/creator/onboarding');
    //   return;
    // }
    loadDashboardData();
  }, [user, timeRange]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, contentRes, analyticsRes] = await Promise.all([
        creatorDashboard.getStats(),
        creatorDashboard.getContent({ limit: 5, sort: 'recent' }),
        creatorDashboard.getAnalytics({ range: timeRange })
      ]);

      setStats(statsRes.data.data);
      setRecentContent(contentRes.data.data);
      setTopContent(analyticsRes.data.top_content || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours.toLocaleString()}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-dark-50">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-950 to-accent-900 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto mobile-padding py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold heading-gradient">Creator Dashboard</h1>
            <p className="text-dark-400 mt-1">
              {user?.name ? `Welcome, ${user.name}` : 'Welcome to your creator dashboard'}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/creator/content/upload')}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition shadow-lg hover:shadow-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 glass-dark border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={formatNumber(stats?.total_views || 0)}
            trend={stats?.views_trend || 0}
            icon={Eye}
            color="blue"
          />
          <StatCard
            title="Watch Time"
            value={formatWatchTime(stats?.total_watch_time || 0)}
            trend={stats?.watch_time_trend || 0}
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Active Patrons"
            value={formatNumber(stats?.active_patrons || 0)}
            trend={stats?.patrons_trend || 0}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Est. Revenue"
            value={`$${formatNumber(stats?.revenue_estimate || 0)}`}
            trend={0}
            icon={DollarSign}
            color="yellow"
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Content */}
          <div className="lg:col-span-2">
            <div className="glass-dark rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Content</h2>
                <button
                  onClick={() => router.push('/creator/content')}
                  className="text-sm text-primary-500 hover:text-primary-400 transition"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentContent.length > 0 ? (
                  recentContent.map((content) => (
                    <div key={content.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-dark-800/50 transition">
                      <div className="w-24 h-14 bg-dark-800 rounded overflow-hidden flex-shrink-0">
                        {content.thumbnail ? (
                          <img
                            src={content.thumbnail}
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="h-6 w-6 text-dark-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{content.title}</h3>
                        <p className="text-xs text-dark-400">
                          {content.views} views • {formatWatchTime(content.watch_time)} watched
                        </p>
                      </div>
                      <button
                        onClick={() => router.push(`/creator/content/${content.id}`)}
                        className="text-dark-400 hover:text-primary-500 transition"
                      >
                        <BarChart3 className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Film className="h-12 w-12 text-dark-600 mx-auto mb-2" />
                    <p className="text-dark-400">No content yet</p>
                    <button
                      onClick={() => router.push('/creator/content/upload')}
                      className="mt-4 text-primary-500 hover:text-primary-400 text-sm transition"
                    >
                      Upload your first video
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Performing Content */}
          <div>
            <div className="glass-dark rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Top Content</h2>
              <div className="space-y-3">
                {topContent.length > 0 ? (
                  topContent.map((content, index) => (
                    <div key={content.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-800/50 transition">
                      <div className="text-2xl font-bold text-primary-500 w-8">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{content.title}</h3>
                        <div className="flex items-center space-x-2 text-xs text-dark-400">
                          <span>{formatNumber(content.views)} views</span>
                          <span>•</span>
                          <span>{content.average_watch_percentage}% avg watch</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-dark-400 text-sm">No data available</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-dark rounded-xl p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/creator/content/upload')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-dark-800/50 hover:bg-primary-500/20 border border-dark-700 hover:border-primary-500 rounded-lg transition"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </button>
                <button
                  onClick={() => router.push('/creator/analytics')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-dark-800/50 hover:bg-accent-500/20 border border-dark-700 hover:border-accent-500 rounded-lg transition"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
                <button
                  onClick={() => router.push('/creator/patrons')}
                  className="w-full flex items-center justify-center px-4 py-2 bg-dark-800/50 hover:bg-emerald-500/20 border border-dark-700 hover:border-emerald-500 rounded-lg transition"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Patrons
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Overview Chart */}
        <div className="glass-dark rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Engagement Overview</h2>
          <div className="h-64 bg-dark-800/50 rounded-lg flex items-center justify-center border border-dark-700">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-dark-400 mx-auto mb-2" />
              <p className="text-dark-400">Chart temporarily disabled</p>
              <p className="text-sm text-dark-500">Visit Analytics page for detailed charts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
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
  color: 'blue' | 'green' | 'purple' | 'yellow';
}) {
  const colorClasses = {
    blue: 'from-accent-500 to-accent-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-primary-400 to-primary-500',
    yellow: 'from-primary-500 to-primary-600',
  };

  return (
    <div className="glass-dark p-6 rounded-xl card-hover group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} transition-transform duration-200 group-hover:scale-110`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-emerald-400' : 'text-primary-400'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold heading-gradient">{value}</p>
        <p className="text-sm text-dark-400">{title}</p>
      </div>
    </div>
  );
}