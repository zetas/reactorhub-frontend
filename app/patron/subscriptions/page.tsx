'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { patron, auth } from '@/lib/api';
import { useNavigation } from '@/contexts/NavigationContext';
import { TableSkeleton } from '@/components/ui/Skeletons';
import {
  Users,
  Star,
  Calendar,
  DollarSign,
  ExternalLink,
  Plus,
  Settings,
  Bell,
  BellOff,
  Crown,
  Heart,
  Eye,
  Play,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Globe,
  Youtube,
  Twitch,
  AlertCircle
} from 'lucide-react';

interface CreatorPlatformConnection {
  id: string;
  creatorPlatformUserId: string;
  connectedAt: string;
  totalPledged: number;
  currency: string;
  status: 'active' | 'declined' | 'pending';
}

interface CreatorSubscription {
  id: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    banner?: string;
    description: string;
    category: string;
    socialLinks: {
      youtube?: string;
      twitch?: string;
      discord?: string;
      twitter?: string;
    };
  };
  tier: {
    id: string;
    name: string;
    price: number;
    currency: string;
    benefits: string[];
  };
  subscribedAt: string;
  lastPayment: string;
  nextPayment: string;
  status: 'active' | 'paused' | 'cancelled';
  totalPaid: number;
  notifications: boolean;
  stats: {
    videosWatched: number;
    watchTime: number;
    joinedDate: string;
  };
}

type ViewMode = 'grid' | 'list';
type FilterBy = 'all' | 'active' | 'paused' | 'cancelled';
type SortBy = 'name' | 'subscribed' | 'price' | 'watched';

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { setBreadcrumbs, setBackUrl } = useNavigation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<CreatorSubscription[]>([]);
  const [creatorPlatformConnection, setCreatorPlatformConnection] = useState<CreatorPlatformConnection | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [sortBy, setSortBy] = useState<SortBy>('subscribed');
  const [showFilters, setShowFilters] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Set breadcrumbs for subscriptions page
    setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'My Subscriptions', href: '/patron/subscriptions', isActive: true }
    ]);
    setBackUrl('/dashboard');
  }, [setBreadcrumbs, setBackUrl]);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadSubscriptionData();
  }, [token, router]);

  const loadSubscriptionData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock subscription data - replace with actual API calls
      const mockCreatorPlatformConnection: CreatorPlatformConnection = {
        id: '1',
        creatorPlatformUserId: 'creator-platform_123',
        connectedAt: '2023-12-01',
        totalPledged: 47.50,
        currency: 'USD',
        status: 'active'
      };

      const mockSubscriptions: CreatorSubscription[] = [
        {
          id: '1',
          creator: {
            id: '1',
            name: 'ReactorOne',
            avatar: 'https://picsum.photos/seed/creator1/200/200',
            banner: 'https://picsum.photos/seed/banner1/800/200',
            description: 'Bringing you the best TV show and movie reactions!',
            category: 'Entertainment',
            socialLinks: {
              youtube: 'https://youtube.com/@reactorone',
              twitch: 'https://twitch.tv/reactorone',
              discord: 'https://discord.gg/reactorone'
            }
          },
          tier: {
            id: '1',
            name: 'Early Access',
            price: 5.00,
            currency: 'USD',
            benefits: [
              'Early access to reactions (24 hours)',
              'Discord community access',
              'Behind-the-scenes content',
              'Monthly live Q&A'
            ]
          },
          subscribedAt: '2024-01-15',
          lastPayment: '2024-01-01',
          nextPayment: '2024-02-01',
          status: 'active',
          totalPaid: 25.00,
          notifications: true,
          stats: {
            videosWatched: 23,
            watchTime: 48000,
            joinedDate: '2024-01-15'
          }
        },
        {
          id: '2',
          creator: {
            id: '2',
            name: 'FeelsTV',
            avatar: 'https://picsum.photos/seed/creator2/200/200',
            banner: 'https://picsum.photos/seed/banner2/800/200',
            description: 'Emotional reactions to the best shows and movies',
            category: 'Entertainment',
            socialLinks: {
              youtube: 'https://youtube.com/@feelstv',
              twitter: 'https://twitter.com/feelstv'
            }
          },
          tier: {
            id: '2',
            name: 'Supporter',
            price: 10.00,
            currency: 'USD',
            benefits: [
              'All Early Access benefits',
              'Exclusive bonus reactions',
              'Personal shoutout opportunities',
              'Priority comment responses',
              'Monthly movie polls'
            ]
          },
          subscribedAt: '2024-01-10',
          lastPayment: '2024-01-01',
          nextPayment: '2024-02-01',
          status: 'active',
          totalPaid: 50.00,
          notifications: true,
          stats: {
            videosWatched: 31,
            watchTime: 72000,
            joinedDate: '2024-01-10'
          }
        },
        {
          id: '3',
          creator: {
            id: '3',
            name: 'EpicReacts',
            avatar: 'https://picsum.photos/seed/creator3/200/200',
            banner: 'https://picsum.photos/seed/banner3/800/200',
            description: 'Epic reactions to blockbuster movies and trending shows',
            category: 'Entertainment',
            socialLinks: {
              youtube: 'https://youtube.com/@epicreacts',
              twitch: 'https://twitch.tv/epicreacts'
            }
          },
          tier: {
            id: '3',
            name: 'Basic',
            price: 3.00,
            currency: 'USD',
            benefits: [
              'Ad-free viewing',
              'Discord access',
              'Monthly updates'
            ]
          },
          subscribedAt: '2023-12-20',
          lastPayment: '2024-01-01',
          nextPayment: '2024-02-01',
          status: 'paused',
          totalPaid: 15.00,
          notifications: false,
          stats: {
            videosWatched: 12,
            watchTime: 28800,
            joinedDate: '2023-12-20'
          }
        }
      ];

      setCreatorPlatformConnection(mockCreatorPlatformConnection);
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      setError('Unable to load subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectCreatorPlatform = async () => {
    setConnecting(true);
    try {
      await auth.connectCreatorPlatform();
    } catch (error) {
      console.error('Failed to connect to Creator Platform:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleToggleNotifications = async (subscriptionId: string, enabled: boolean) => {
    try {
      // Mock API call - replace with actual endpoint
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, notifications: enabled } : sub
        )
      );
    } catch (error) {
      console.error('Failed to update notifications:', error);
    }
  };

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      // Mock API call - replace with actual endpoint
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'paused' } : sub
        )
      );
    } catch (error) {
      console.error('Failed to pause subscription:', error);
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      // Mock API call - replace with actual endpoint
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'active' } : sub
        )
      );
    } catch (error) {
      console.error('Failed to resume subscription:', error);
    }
  };

  const getFilteredAndSortedSubscriptions = () => {
    let filtered = subscriptions.filter(sub => {
      const matchesSearch = sub.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sub.creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sub.tier.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterBy === 'all' || sub.status === filterBy;

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.creator.name.localeCompare(b.creator.name);
        case 'subscribed':
          return new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime();
        case 'price':
          return b.tier.price - a.tier.price;
        case 'watched':
          return b.stats.videosWatched - a.stats.videosWatched;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalMonthlySpend = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => total + sub.tier.price, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20 border-green-500/20';
      case 'paused':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-900/20 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/20';
    }
  };

  const filteredSubscriptions = getFilteredAndSortedSubscriptions();

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16 sm:pt-20 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TableSkeleton rows={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 pb-20 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm border border-purple-500/20">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h1 className="heading-h2">My Subscriptions</h1>
                  <p className="body-text text-gray-400">
                    {filteredSubscriptions.length} creator{filteredSubscriptions.length !== 1 ? 's' : ''}
                    • {formatCurrency(getTotalMonthlySpend(), 'USD')}/month
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <label htmlFor="subscriptions-search" className="sr-only">
                  Search creators
                </label>
                <input
                  id="subscriptions-search"
                  type="search"
                  role="searchbox"
                  aria-label="Search by creator name or tier"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators..."
                  className="bg-gray-800/50 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">List view</span>
                </button>
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-lg backdrop-blur-sm border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-green-400">
                    {subscriptions.filter(sub => sub.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-lg backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Monthly Spend</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {formatCurrency(getTotalMonthlySpend(), 'USD')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-lg backdrop-blur-sm border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Videos Watched</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {subscriptions.reduce((total, sub) => total + sub.stats.videosWatched, 0)}
                  </p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-lg backdrop-blur-sm border border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Watch Time</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {formatDuration(subscriptions.reduce((total, sub) => total + sub.stats.watchTime, 0))}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter by Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterBy)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Subscriptions</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="subscribed">Date Subscribed</option>
                    <option value="name">Creator Name</option>
                    <option value="price">Price</option>
                    <option value="watched">Videos Watched</option>
                  </select>
                </div>

                {/* Creator Platform Connection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Creator Platform Status</label>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                    {creatorPlatformConnection ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Connected</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectCreatorPlatform}
                        disabled={connecting}
                        className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 disabled:opacity-50"
                      >
                        {connecting ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <Plus className="h-5 w-5" />
                        )}
                        <span className="text-sm">Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">Error Loading Data</p>
              <p className="text-gray-300 text-sm mt-1">{error}</p>
              <button
                onClick={loadSubscriptionData}
                className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Creator Platform Connection Banner */}
        {!creatorPlatformConnection && !error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Crown className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-400 mb-1">Connect Your Creator Platform Account</h3>
                  <p className="text-gray-400">
                    Link your creator platform account to automatically sync your subscriptions and get the most out of ReeActor.
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnectCreatorPlatform}
                disabled={connecting}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition disabled:opacity-50"
              >
                {connecting ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                <span>{connecting ? 'Connecting...' : 'Connect Creator Platform'}</span>
              </button>
            </div>
          </div>
        )}

        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? 'No matching subscriptions found' : 'No subscriptions yet'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'Start supporting your favorite creators by subscribing to their content.'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/browse"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition"
              >
                <Search className="h-5 w-5 mr-2" />
                Discover Creators
              </Link>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="group bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm border border-gray-800/50"
                  >
                    {/* Creator Banner */}
                    <div className="relative">
                      <img
                        src={subscription.creator.banner || subscription.creator.avatar}
                        alt={subscription.creator.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </span>
                      </div>
                      <div className="absolute -bottom-6 left-6">
                        <img
                          src={subscription.creator.avatar}
                          alt={subscription.creator.name}
                          className="w-12 h-12 rounded-full border-4 border-black object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-8">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/creators/${subscription.creator.id}`}
                          className="heading-h4 hover:text-purple-400 transition truncate"
                        >
                          {subscription.creator.name}
                        </Link>
                        <div className="flex items-center space-x-1">
                          {subscription.creator.socialLinks.youtube && (
                            <a
                              href={subscription.creator.socialLinks.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit YouTube channel"
                              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                            >
                              <Youtube className="h-5 w-5" aria-hidden="true" />
                            </a>
                          )}
                          {subscription.creator.socialLinks.twitch && (
                            <a
                              href={subscription.creator.socialLinks.twitch}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit Twitch channel"
                              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-purple-500 transition"
                            >
                              <Twitch className="h-5 w-5" aria-hidden="true" />
                            </a>
                          )}
                          {subscription.creator.socialLinks.discord && (
                            <a
                              href={subscription.creator.socialLinks.discord}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Join Discord server"
                              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-indigo-500 transition"
                            >
                              <Globe className="h-5 w-5" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="body-text text-gray-400 mb-4 line-clamp-2">
                        {subscription.creator.description}
                      </p>

                      {/* Tier Info */}
                      <div className="bg-purple-900/20 rounded-lg p-3 mb-4 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-purple-400">{subscription.tier.name}</span>
                          <span className="font-bold">{formatCurrency(subscription.tier.price, subscription.tier.currency)}/month</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          <p>Since {formatDate(subscription.subscribedAt)}</p>
                          <p>Total paid: {formatCurrency(subscription.totalPaid, subscription.tier.currency)}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-400">{subscription.stats.videosWatched}</p>
                          <p className="text-xs text-gray-400">Videos Watched</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-400">{formatDuration(subscription.stats.watchTime)}</p>
                          <p className="text-xs text-gray-400">Watch Time</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/creators/${subscription.creator.id}`}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition text-sm"
                        >
                          <Play className="h-4 w-4" />
                          <span>View Content</span>
                        </Link>

                        <button
                          onClick={() => handleToggleNotifications(subscription.id, !subscription.notifications)}
                          aria-label={subscription.notifications ? 'Disable notifications' : 'Enable notifications'}
                          className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition ${
                            subscription.notifications
                              ? 'text-yellow-400 hover:bg-yellow-600/20'
                              : 'text-gray-400 hover:bg-gray-600/20'
                          }`}
                          title={subscription.notifications ? 'Disable notifications' : 'Enable notifications'}
                        >
                          {subscription.notifications ? <Bell className="h-5 w-5" aria-hidden="true" /> : <BellOff className="h-5 w-5" aria-hidden="true" />}
                          <span className="sr-only">{subscription.notifications ? 'Disable notifications' : 'Enable notifications'}</span>
                        </button>

                        <button
                          onClick={() =>
                            subscription.status === 'paused'
                              ? handleResumeSubscription(subscription.id)
                              : handlePauseSubscription(subscription.id)
                          }
                          aria-label={subscription.status === 'paused' ? 'Resume subscription' : 'Pause subscription'}
                          className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600/20 rounded-md transition"
                          title={subscription.status === 'paused' ? 'Resume subscription' : 'Pause subscription'}
                        >
                          <Settings className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">{subscription.status === 'paused' ? 'Resume subscription' : 'Pause subscription'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center space-x-6 bg-gray-900/50 rounded-lg p-6 hover:bg-gray-800/50 transition backdrop-blur-sm border border-gray-800/50"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={subscription.creator.avatar}
                        alt={subscription.creator.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>

                    {/* Creator Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link
                          href={`/creators/${subscription.creator.id}`}
                          className="text-xl font-bold hover:text-purple-400 transition"
                        >
                          {subscription.creator.name}
                        </Link>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                        {subscription.creator.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{subscription.tier.name} • {formatCurrency(subscription.tier.price, subscription.tier.currency)}/month</span>
                        <span>Since {formatDate(subscription.subscribedAt)}</span>
                        <span>{subscription.stats.videosWatched} videos watched</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-2">
                      {subscription.creator.socialLinks.youtube && (
                        <a
                          href={subscription.creator.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                      {subscription.creator.socialLinks.twitch && (
                        <a
                          href={subscription.creator.socialLinks.twitch}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-purple-500 transition"
                        >
                          <Twitch className="h-5 w-5" />
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/creators/${subscription.creator.id}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition"
                      >
                        <Play className="h-4 w-4" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleToggleNotifications(subscription.id, !subscription.notifications)}
                        aria-label={subscription.notifications ? 'Disable notifications' : 'Enable notifications'}
                        className={`p-2 rounded-md transition ${
                          subscription.notifications
                            ? 'text-yellow-400 hover:bg-yellow-600/20'
                            : 'text-gray-400 hover:bg-gray-600/20'
                        }`}
                      >
                        {subscription.notifications ? <Bell className="h-5 w-5" aria-hidden="true" /> : <BellOff className="h-5 w-5" aria-hidden="true" />}
                        <span className="sr-only">{subscription.notifications ? 'Disable notifications' : 'Enable notifications'}</span>
                      </button>

                      <button
                        onClick={() =>
                          subscription.status === 'paused'
                            ? handleResumeSubscription(subscription.id)
                            : handlePauseSubscription(subscription.id)
                        }
                        aria-label={subscription.status === 'paused' ? 'Resume subscription' : 'Pause subscription'}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-600/20 rounded-md transition"
                      >
                        <Settings className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">{subscription.status === 'paused' ? 'Resume subscription' : 'Pause subscription'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}