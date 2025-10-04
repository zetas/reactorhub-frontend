'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useWatchStore } from '@/lib/store';
import { patron } from '@/lib/api';
import {
  Heart,
  Play,
  Clock,
  Calendar,
  Grid,
  List,
  Filter,
  Search,
  X,
  Trash2,
  Star,
  Eye,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Bookmark
} from 'lucide-react';

interface WatchlistContent {
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
  addedAt: string;
  watched: boolean;
  rating?: number;
  description?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'added' | 'title' | 'creator' | 'duration' | 'published';
type SortOrder = 'asc' | 'desc';
type FilterBy = 'all' | 'unwatched' | 'in_progress' | 'completed';

export default function WatchlistPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { myList, removeFromList } = useWatchStore();

  const [watchlistContent, setWatchlistContent] = useState<WatchlistContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('added');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadWatchlistData();
  }, [token, router]);

  const loadWatchlistData = async () => {
    setLoading(true);
    try {
      // Mock watchlist data - replace with actual API call
      const mockData: WatchlistContent[] = [
        {
          id: '1',
          title: 'Breaking Bad S01E01 - Pilot REACTION',
          thumbnail: 'https://picsum.photos/seed/wl1/320/180',
          creator: { id: '1', name: 'ReactorOne', avatar: 'https://picsum.photos/seed/av1/40/40' },
          duration: 2400,
          progress: 1200,
          publishedAt: '2024-01-15',
          series: 'Breaking Bad',
          addedAt: '2024-01-20',
          watched: false,
          rating: 4.8,
          description: 'First time watching the legendary pilot episode!'
        },
        {
          id: '2',
          title: 'The Last of Us Episode 3 - EMOTIONAL REACTION',
          thumbnail: 'https://picsum.photos/seed/wl2/320/180',
          creator: { id: '2', name: 'FeelsTV', avatar: 'https://picsum.photos/seed/av2/40/40' },
          duration: 3600,
          publishedAt: '2024-01-13',
          series: 'The Last of Us',
          addedAt: '2024-01-19',
          watched: true,
          rating: 4.9,
          description: 'Get ready for tears - this episode hits different'
        },
        {
          id: '3',
          title: 'Game of Thrones Season 8 Finale - WTF HAPPENED',
          thumbnail: 'https://picsum.photos/seed/wl3/320/180',
          creator: { id: '3', name: 'EpicReacts', avatar: 'https://picsum.photos/seed/av3/40/40' },
          duration: 4200,
          progress: 4200,
          publishedAt: '2024-01-10',
          series: 'Game of Thrones',
          addedAt: '2024-01-18',
          watched: true,
          rating: 3.2,
          description: 'My reaction to the most controversial finale ever'
        },
        {
          id: '4',
          title: 'Attack on Titan Final Season - MIND BLOWN',
          thumbnail: 'https://picsum.photos/seed/wl4/320/180',
          creator: { id: '4', name: 'AnimeVibes', avatar: 'https://picsum.photos/seed/av4/40/40' },
          duration: 2800,
          publishedAt: '2024-01-12',
          series: 'Attack on Titan',
          addedAt: '2024-01-17',
          watched: false,
          rating: 4.7,
          description: 'Everything comes together in this incredible finale'
        },
        {
          id: '5',
          title: 'Stranger Things S4 Finale - EPIC BATTLE',
          thumbnail: 'https://picsum.photos/seed/wl5/320/180',
          creator: { id: '5', name: 'StreamingNerd', avatar: 'https://picsum.photos/seed/av5/40/40' },
          duration: 3900,
          progress: 500,
          publishedAt: '2024-01-08',
          series: 'Stranger Things',
          addedAt: '2024-01-16',
          watched: false,
          rating: 4.6,
          description: 'The most intense season finale yet!'
        }
      ];

      // Filter based on myList from store
      const filteredData = mockData.filter(item => myList.includes(item.id));
      setWatchlistContent(filteredData);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedContent = () => {
    let filtered = watchlistContent.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.series?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterBy === 'all' ||
        (filterBy === 'unwatched' && !item.watched && !item.progress) ||
        (filterBy === 'in_progress' && item.progress && item.progress < item.duration) ||
        (filterBy === 'completed' && item.watched);

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'added':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'creator':
          comparison = a.creator.name.localeCompare(b.creator.name);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'published':
          comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const handleRemoveFromWatchlist = (contentId: string) => {
    removeFromList(contentId);
    setWatchlistContent(prev => prev.filter(item => item.id !== contentId));
    setSelectedItems(prev => prev.filter(id => id !== contentId));
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(id => handleRemoveFromWatchlist(id));
    setSelectedItems([]);
    setShowDeleteConfirm(false);
  };

  const handleSelectItem = (contentId: string) => {
    setSelectedItems(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAll = () => {
    const filteredContent = getFilteredAndSortedContent();
    setSelectedItems(
      selectedItems.length === filteredContent.length
        ? []
        : filteredContent.map(item => item.id)
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

  const getProgressPercentage = (item: WatchlistContent) => {
    if (!item.progress) return 0;
    return (item.progress / item.duration) * 100;
  };

  const getWatchStatus = (item: WatchlistContent) => {
    if (item.watched) return 'Completed';
    if (item.progress && item.progress > 0) return 'In Progress';
    return 'Not Started';
  };

  const filteredContent = getFilteredAndSortedContent();

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
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm border border-red-500/20">
                  <Bookmark className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">My Watchlist</h1>
                  <p className="text-gray-400">
                    {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'}
                    {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search watchlist..."
                  className="bg-gray-800/50 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="h-5 w-5" />
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
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Items</option>
                    <option value="unwatched">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="added">Date Added</option>
                    <option value="title">Title</option>
                    <option value="creator">Creator</option>
                    <option value="duration">Duration</option>
                    <option value="published">Published Date</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
                  >
                    <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                    {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </button>
                </div>
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
                  onClick={() => setShowDeleteConfirm(true)}
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
        {filteredContent.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Bookmark className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? 'No matching items found' : 'Your watchlist is empty'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'Start adding videos to your watchlist and they\'ll appear here for easy access later.'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/browse"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
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
                  selectedItems.length === filteredContent.length
                    ? 'bg-red-600 border-red-600'
                    : 'border-gray-600'
                }`}>
                  {selectedItems.length === filteredContent.length && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Select All</span>
              </button>
            </div>

            {/* Content Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-800/50"
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 left-3 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectItem(item.id);
                        }}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                          selectedItems.includes(item.id)
                            ? 'bg-red-600 border-red-600'
                            : 'border-white/50 bg-black/50'
                        }`}
                      >
                        {selectedItems.includes(item.id) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Remove Button */}
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFromWatchlist(item.id);
                        }}
                        className="w-8 h-8 bg-red-600/90 hover:bg-red-600 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    <Link href={`/watch/${item.id}`} className="block">
                      {/* Thumbnail */}
                      <div className="relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full aspect-video object-cover"
                        />

                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-1 rounded text-sm">
                          {formatDuration(item.duration)}
                        </div>

                        {/* Progress Bar */}
                        {item.progress && item.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-700 h-1">
                            <div
                              className="bg-red-600 h-1"
                              style={{ width: `${getProgressPercentage(item)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition">
                          {item.title}
                        </h3>

                        <div className="flex items-center space-x-2 mb-3">
                          <img
                            src={item.creator.avatar}
                            alt={item.creator.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-400">{item.creator.name}</span>
                        </div>

                        {item.series && (
                          <div className="mb-2">
                            <span className="text-xs bg-red-600 px-2 py-1 rounded">
                              {item.series}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>Added {formatDate(item.addedAt)}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{item.rating}</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            getWatchStatus(item) === 'Completed' ? 'bg-green-600' :
                            getWatchStatus(item) === 'In Progress' ? 'bg-yellow-600' :
                            'bg-gray-600'
                          }`}>
                            {getWatchStatus(item)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 bg-gray-900/50 rounded-lg p-4 hover:bg-gray-800/50 transition backdrop-blur-sm border border-gray-800/50"
                  >
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => handleSelectItem(item.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                        selectedItems.includes(item.id)
                          ? 'bg-red-600 border-red-600'
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
                        className="w-32 h-18 object-cover rounded-md"
                      />
                      {item.progress && item.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-700 h-1 rounded-b-md">
                          <div
                            className="bg-red-600 h-1 rounded-b-md"
                            style={{ width: `${getProgressPercentage(item)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/watch/${item.id}`} className="block">
                        <h3 className="font-semibold mb-1 hover:text-red-400 transition truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-1">
                          <img
                            src={item.creator.avatar}
                            alt={item.creator.name}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-sm text-gray-400">{item.creator.name}</span>
                        </div>
                        {item.series && (
                          <span className="text-xs bg-red-600 px-2 py-1 rounded mr-2">
                            {item.series}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          getWatchStatus(item) === 'Completed' ? 'bg-green-600' :
                          getWatchStatus(item) === 'In Progress' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        }`}>
                          {getWatchStatus(item)}
                        </span>
                      </Link>
                    </div>

                    {/* Metadata */}
                    <div className="text-sm text-gray-400 text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(item.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{item.rating}</span>
                      </div>
                      <div>Added {formatDate(item.addedAt)}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/watch/${item.id}`}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
                      >
                        <Play className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleRemoveFromWatchlist(item.id)}
                        className="p-2 bg-gray-700 hover:bg-red-600 rounded-full transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Remove from Watchlist</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} from your watchlist?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}