'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { patron, content as contentApi } from '@/lib/api';
import {
  History,
  Play,
  Clock,
  Calendar,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Star,
  TrendingUp,
  X,
  CheckCircle,
  PlayCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface HistoryItem {
  id: string;
  contentId: string;
  title: string;
  thumbnail: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  duration: number;
  watchedSeconds: number;
  lastWatchedAt: string;
  completedAt?: string;
  series?: string;
  episodeNumber?: number;
  rating?: number;
  completed: boolean;
}

type FilterBy = 'all' | 'completed' | 'incomplete' | 'today' | 'week' | 'month';

export default function HistoryPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadHistoryData();
  }, [token, router]);

  const loadHistoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock history data - replace with actual API call
      const mockData: HistoryItem[] = [
        {
          id: '1',
          contentId: 'c1',
          title: 'Breaking Bad S01E01 - Pilot REACTION',
          thumbnail: 'https://picsum.photos/seed/hist1/320/180',
          creator: { id: '1', name: 'ReactorOne', avatar: 'https://picsum.photos/seed/av1/40/40' },
          duration: 2400,
          watchedSeconds: 2400,
          lastWatchedAt: '2024-01-20T15:30:00Z',
          completedAt: '2024-01-20T15:30:00Z',
          series: 'Breaking Bad',
          episodeNumber: 1,
          rating: 4.8,
          completed: true
        },
        {
          id: '2',
          contentId: 'c2',
          title: 'The Last of Us Episode 3 - EMOTIONAL REACTION',
          thumbnail: 'https://picsum.photos/seed/hist2/320/180',
          creator: { id: '2', name: 'FeelsTV', avatar: 'https://picsum.photos/seed/av2/40/40' },
          duration: 3600,
          watchedSeconds: 2400,
          lastWatchedAt: '2024-01-20T10:15:00Z',
          series: 'The Last of Us',
          episodeNumber: 3,
          rating: 4.9,
          completed: false
        },
        {
          id: '3',
          contentId: 'c3',
          title: 'Game of Thrones Season 8 Finale - WTF HAPPENED',
          thumbnail: 'https://picsum.photos/seed/hist3/320/180',
          creator: { id: '3', name: 'EpicReacts', avatar: 'https://picsum.photos/seed/av3/40/40' },
          duration: 4200,
          watchedSeconds: 4200,
          lastWatchedAt: '2024-01-19T20:45:00Z',
          completedAt: '2024-01-19T20:45:00Z',
          series: 'Game of Thrones',
          rating: 3.2,
          completed: true
        },
        {
          id: '4',
          contentId: 'c4',
          title: 'Attack on Titan Final Season - MIND BLOWN',
          thumbnail: 'https://picsum.photos/seed/hist4/320/180',
          creator: { id: '4', name: 'AnimeVibes', avatar: 'https://picsum.photos/seed/av4/40/40' },
          duration: 2800,
          watchedSeconds: 1800,
          lastWatchedAt: '2024-01-19T14:20:00Z',
          series: 'Attack on Titan',
          rating: 4.7,
          completed: false
        },
        {
          id: '5',
          contentId: 'c5',
          title: 'Stranger Things S4 Finale - EPIC BATTLE',
          thumbnail: 'https://picsum.photos/seed/hist5/320/180',
          creator: { id: '5', name: 'StreamingNerd', avatar: 'https://picsum.photos/seed/av5/40/40' },
          duration: 3900,
          watchedSeconds: 900,
          lastWatchedAt: '2024-01-18T16:10:00Z',
          series: 'Stranger Things',
          rating: 4.6,
          completed: false
        },
        {
          id: '6',
          contentId: 'c6',
          title: 'The Office Season 9 Finale Reaction - TEARS',
          thumbnail: 'https://picsum.photos/seed/hist6/320/180',
          creator: { id: '6', name: 'ComedyKing', avatar: 'https://picsum.photos/seed/av6/40/40' },
          duration: 2200,
          watchedSeconds: 2200,
          lastWatchedAt: '2024-01-17T12:30:00Z',
          completedAt: '2024-01-17T12:30:00Z',
          series: 'The Office',
          rating: 4.5,
          completed: true
        }
      ];

      // Sort by last watched date (most recent first)
      mockData.sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime());

      setHistoryItems(mockData);
    } catch (error) {
      console.error('Failed to load history:', error);
      setError('Unable to load watch history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredItems = () => {
    let filtered = historyItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.series?.toLowerCase().includes(searchQuery.toLowerCase());

      const now = new Date();
      const itemDate = new Date(item.lastWatchedAt);
      const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

      const matchesFilter = filterBy === 'all' ||
        (filterBy === 'completed' && item.completed) ||
        (filterBy === 'incomplete' && !item.completed) ||
        (filterBy === 'today' && daysDiff === 0) ||
        (filterBy === 'week' && daysDiff <= 7) ||
        (filterBy === 'month' && daysDiff <= 30);

      return matchesSearch && matchesFilter;
    });

    return filtered;
  };

  const handleResumeVideo = async (item: HistoryItem) => {
    try {
      // Update progress to current watched position
      await contentApi.updateProgress(item.contentId, item.watchedSeconds, item.duration);
      router.push(`/watch/${item.contentId}?t=${item.watchedSeconds}`);
    } catch (error) {
      console.error('Failed to resume video:', error);
      // Fallback to basic navigation
      router.push(`/watch/${item.contentId}`);
    }
  };

  const handleRestartVideo = (contentId: string) => {
    router.push(`/watch/${contentId}?t=0`);
  };

  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      // Mock API call - replace with actual endpoint
      setHistoryItems(prev => prev.filter(item => item.id !== historyId));
      setSelectedItems(prev => prev.filter(id => id !== historyId));
    } catch (error) {
      console.error('Failed to remove from history:', error);
    }
  };

  const handleClearSelected = async () => {
    setClearing(true);
    try {
      // Mock API call - replace with actual endpoint
      setHistoryItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Failed to clear history:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleClearAllHistory = async () => {
    setClearing(true);
    try {
      // Mock API call - replace with actual endpoint
      setHistoryItems([]);
      setSelectedItems([]);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Failed to clear all history:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleSelectItem = (historyId: string) => {
    setSelectedItems(prev =>
      prev.includes(historyId)
        ? prev.filter(id => id !== historyId)
        : [...prev, historyId]
    );
  };

  const handleSelectAll = () => {
    const filteredItems = getFilteredItems();
    setSelectedItems(
      selectedItems.length === filteredItems.length
        ? []
        : filteredItems.map(item => item.id)
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const formatWatchTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getProgressPercentage = (item: HistoryItem) => {
    return (item.watchedSeconds / item.duration) * 100;
  };

  const getTotalWatchTime = () => {
    return historyItems.reduce((total, item) => total + item.watchedSeconds, 0);
  };

  const getCompletedCount = () => {
    return historyItems.filter(item => item.completed).length;
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl backdrop-blur-sm border border-purple-500/20">
                  <History className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Watch History</h1>
                  <p className="text-gray-400">
                    {filteredItems.length} {filteredItems.length === 1 ? 'video' : 'videos'}
                    {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <label htmlFor="history-search" className="sr-only">
                  Search watch history
                </label>
                <input
                  id="history-search"
                  type="search"
                  role="searchbox"
                  aria-label="Search by title, creator, or series"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search history..."
                  className="bg-gray-800/50 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
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

              {/* Clear History */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition border border-red-500/20"
              >
                <Trash2 className="h-5 w-5" />
                <span>Clear History</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Watch Time</p>
                  <p className="text-2xl font-bold text-purple-400">{formatDuration(getTotalWatchTime())}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-4 rounded-lg backdrop-blur-sm border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{getCompletedCount()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-4 rounded-lg backdrop-blur-sm border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-400">{historyItems.filter(item => !item.completed).length}</p>
                </div>
                <PlayCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-4 rounded-lg backdrop-blur-sm border border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Videos</p>
                  <p className="text-2xl font-bold text-red-400">{historyItems.length}</p>
                </div>
                <Eye className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { value: 'all', label: 'All Videos' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'incomplete', label: 'In Progress' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterBy(filter.value as FilterBy)}
                    className={`px-4 py-2 rounded-lg transition ${
                      filterBy === filter.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-500/20 flex items-center justify-between">
              <span className="text-red-400">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedItems([])}
                  className="text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove Selected</span>
                </button>
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
                onClick={loadHistoryData}
                className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {filteredItems.length === 0 && !error ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <History className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? 'No matching videos found' : 'No watch history yet'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'Start watching some content and your viewing history will appear here.'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/browse"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition"
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Content
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  selectedItems.length === filteredItems.length
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-600'
                }`}>
                  {selectedItems.length === filteredItems.length && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Select All</span>
              </button>
            </div>

            {/* History List */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center space-x-4 bg-gray-900/50 rounded-lg p-4 hover:bg-gray-800/50 transition backdrop-blur-sm border border-gray-800/50"
                >
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                      selectedItems.includes(item.id)
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-600'
                    }`}
                  >
                    {selectedItems.includes(item.id) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-40 h-24 object-cover rounded-md"
                    />

                    {/* Progress Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResumeVideo(item)}
                          aria-label="Resume watching"
                          className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-purple-600/90 hover:bg-purple-600 rounded-full transition"
                          title="Resume watching"
                        >
                          <Play className="h-5 w-5 text-white" aria-hidden="true" />
                          <span className="sr-only">Resume watching</span>
                        </button>
                        <button
                          onClick={() => handleRestartVideo(item.contentId)}
                          aria-label="Watch from beginning"
                          className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-600/90 hover:bg-gray-600 rounded-full transition"
                          title="Watch from beginning"
                        >
                          <RotateCcw className="h-5 w-5 text-white" aria-hidden="true" />
                          <span className="sr-only">Watch from beginning</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <div className="bg-gray-700 h-1 rounded-b-md">
                        <div
                          className={`h-1 rounded-b-md ${item.completed ? 'bg-green-500' : 'bg-purple-600'}`}
                          style={{ width: `${getProgressPercentage(item)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute top-2 right-2 bg-black/75 px-2 py-1 rounded text-xs">
                      {formatDuration(item.duration)}
                    </div>

                    {/* Completion Badge */}
                    {item.completed && (
                      <div className="absolute top-2 left-2 bg-green-600 p-1 rounded-full">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/watch/${item.contentId}`} className="block">
                      <h3 className="font-semibold mb-1 hover:text-purple-400 transition line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={item.creator.avatar}
                          alt={item.creator.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-sm text-gray-400">{item.creator.name}</span>
                      </div>

                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-400">{item.rating}</span>
                        </div>
                      )}
                    </div>

                    {item.series && (
                      <div className="mb-2">
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded mr-2">
                          {item.series}
                          {item.episodeNumber && ` EP${item.episodeNumber}`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatDuration(item.watchedSeconds)} / {formatDuration(item.duration)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Watched {formatWatchTime(item.lastWatchedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleResumeVideo(item)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition text-sm"
                    >
                      <Play className="h-4 w-4" />
                      <span>{item.completed ? 'Watch Again' : 'Resume'}</span>
                    </button>

                    <button
                      onClick={() => handleRemoveFromHistory(item.id)}
                      aria-label="Remove from history"
                      className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-600/20 rounded-md transition"
                      title="Remove from history"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Remove from history</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Clear Watch History</h3>
            <p className="text-gray-400 mb-6">
              {selectedItems.length > 0
                ? `Are you sure you want to remove ${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} from your watch history?`
                : 'Are you sure you want to clear your entire watch history? This will remove all viewing records and cannot be undone.'
              }
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={selectedItems.length > 0 ? handleClearSelected : handleClearAllHistory}
                disabled={clearing}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition disabled:opacity-50"
              >
                {clearing && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>{clearing ? 'Clearing...' : 'Clear History'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}