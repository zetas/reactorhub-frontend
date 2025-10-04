'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { patron, creators, auth } from '@/lib/api';
import {
  Film,
  PlayCircle,
  Clock,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Star,
  Calendar,
  BarChart3,
  Heart
} from 'lucide-react';

interface Content {
  id: string;
  title: string;
  thumbnail: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  duration: number;
  progress?: number;
  publishedAt: string;
  series?: string;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  description: string;
  subscriberCount: number;
  contentCount: number;
  isSubscribed: boolean;
}

export default function PatronDashboard() {
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();
  const [continueWatching, setContinueWatching] = useState<Content[]>([]);
  const [recentlyWatched, setRecentlyWatched] = useState<Content[]>([]);
  const [subscribedCreators, setSubscribedCreators] = useState<Creator[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadDashboardData();
  }, [token, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data in parallel
      const [continueData, recentData, creatorsData] = await Promise.all([
        patron.getContinueWatching().catch(() => ({ data: [] })),
        patron.getRecentlyWatched().catch(() => ({ data: [] })),
        creators.list().catch(() => ({ data: [] }))
      ]);

      setContinueWatching(continueData.data.slice(0, 8));
      setRecentlyWatched(recentData.data.slice(0, 8));
      setSubscribedCreators(creatorsData.data.filter((c: Creator) => c.isSubscribed).slice(0, 6));

      // For now, recommended content will be empty for new users
      // In the future, this could be populated with trending content or content from popular creators
      setRecommendedContent([]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
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
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-dark-950 to-transparent backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-primary-500 text-2xl font-bold heading-gradient">
                ReactorHub
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-dark-50 font-semibold hover:text-primary-400 transition">
                  Home
                </Link>
                <Link href="/browse" className="text-dark-400 hover:text-dark-50 transition">
                  Browse
                </Link>
                <Link href="/patron/watchlist" className="text-dark-400 hover:text-dark-50 transition">
                  My List
                </Link>
                <Link href="/patron/history" className="text-dark-400 hover:text-dark-50 transition">
                  History
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-dark-800/50 backdrop-blur-sm text-dark-50 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 border border-dark-700"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-dark-400" />
              </div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-dark-800/50 rounded-full transition"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-primary-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:bg-dark-800/50 p-2 rounded-md transition">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'P'}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </button>
                <div className="absolute right-0 mt-2 w-48 glass-dark rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/patron/account" className="flex items-center px-4 py-2 hover:bg-dark-800/50 transition">
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </Link>
                  <Link href="/patron/subscriptions" className="flex items-center px-4 py-2 hover:bg-dark-800/50 transition">
                    <Users className="h-4 w-4 mr-3" />
                    Subscriptions
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 hover:bg-dark-800/50 text-left transition"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/50 to-transparent z-10"></div>
          <img
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Featured content"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 z-20 p-8 max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 heading-gradient">
              {user?.name ? `Welcome, ${user.name}!` : 'Welcome to ReactorHub!'}
            </h1>
            <p className="text-xl text-dark-300 mb-6">
              Discover amazing content from your favorite creators
            </p>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-md font-semibold transition shadow-lg hover:shadow-xl">
                <PlayCircle className="h-5 w-5" />
                <span>Resume Watching</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 glass-dark hover:bg-dark-800/60 rounded-md font-semibold transition">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Now</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-dark p-6 rounded-xl card-hover group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Watch Time This Week</p>
                  <p className="text-3xl font-bold heading-gradient mt-2">14h 32m</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 transition-transform duration-200 group-hover:scale-110">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="glass-dark p-6 rounded-xl card-hover group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Videos Watched</p>
                  <p className="text-3xl font-bold heading-gradient mt-2">47</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 transition-transform duration-200 group-hover:scale-110">
                  <Film className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="glass-dark p-6 rounded-xl card-hover group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Subscriptions</p>
                  <p className="text-3xl font-bold heading-gradient mt-2">{subscribedCreators.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 transition-transform duration-200 group-hover:scale-110">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="glass-dark p-6 rounded-xl card-hover group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Favorites</p>
                  <p className="text-3xl font-bold heading-gradient mt-2">12</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 transition-transform duration-200 group-hover:scale-110">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary-500" />
              Continue Watching
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {continueWatching.map((content) => (
                <Link
                  key={content.id}
                  href={`/watch/${content.id}`}
                  className="group relative overflow-hidden rounded-md hover:scale-105 transition-transform"
                >
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950 to-transparent p-3">
                    <p className="text-xs font-semibold truncate">{content.title}</p>
                    {content.progress && (
                      <div className="mt-2 bg-dark-700 rounded-full h-1">
                        <div
                          className="bg-primary-500 h-1 rounded-full"
                          style={{ width: `${(content.progress / content.duration) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 bg-dark-950/75 backdrop-blur-sm px-2 py-1 rounded text-xs">
                    {formatDuration(content.duration)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recommended for You */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Star className="h-6 w-6 mr-2 text-primary-400" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendedContent.map((content) => (
              <Link
                key={content.id}
                href={`/watch/${content.id}`}
                className="group glass-dark rounded-xl overflow-hidden hover:bg-dark-800/60 transition card-hover"
              >
                <div className="relative">
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-dark-950/75 backdrop-blur-sm px-2 py-1 rounded text-xs">
                    {formatDuration(content.duration)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                  <div className="flex items-center justify-between text-sm text-dark-400">
                    <div className="flex items-center space-x-2">
                      <img
                        src={content.creator.avatar}
                        alt={content.creator.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{content.creator.name}</span>
                    </div>
                    <span>{formatDate(content.publishedAt)}</span>
                  </div>
                  {content.series && (
                    <div className="mt-2">
                      <span className="text-xs bg-primary-500 px-2 py-1 rounded">
                        {content.series}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Your Creators */}
        {subscribedCreators.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2 text-accent-500" />
              Your Creators
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {subscribedCreators.map((creator) => (
                <Link
                  key={creator.id}
                  href={`/creators/${creator.id}`}
                  className="text-center group"
                >
                  <div className="relative mb-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-full aspect-square rounded-full object-cover group-hover:ring-4 ring-primary-500 transition"
                    />
                    <div className="absolute bottom-0 right-0 bg-emerald-500 h-4 w-4 rounded-full border-2 border-dark-950"></div>
                  </div>
                  <h3 className="font-semibold text-sm">{creator.name}</h3>
                  <p className="text-xs text-dark-400">{creator.contentCount} videos</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Watched */}
        {recentlyWatched.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-accent-400" />
              Recently Watched
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {recentlyWatched.map((content) => (
                <Link
                  key={content.id}
                  href={`/watch/${content.id}`}
                  className="group relative overflow-hidden rounded-md hover:scale-105 transition-transform"
                >
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-950 to-transparent p-3">
                    <p className="text-xs font-semibold truncate">{content.title}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-dark-950/75 backdrop-blur-sm px-2 py-1 rounded text-xs">
                    {formatDuration(content.duration)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}