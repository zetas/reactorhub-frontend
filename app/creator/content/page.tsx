'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, Film, Edit3, Trash2, Eye, Clock, Calendar, Filter,
  Search, Plus, MoreVertical, Play, TrendingUp, TrendingDown,
  Users, DollarSign, Settings, BookOpen, Grid, List
} from 'lucide-react';
import { creatorDashboard } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  video_url?: string;
  duration: number;
  views: number;
  watch_time: number;
  likes: number;
  published_at: string;
  status: 'published' | 'draft' | 'processing' | 'scheduled';
  type: 'episode' | 'movie';
  series?: {
    id: string;
    title: string;
    slug: string;
  };
  is_premium: boolean;
  tier_access: string[];
  revenue_estimate: number;
  engagement_rate: number;
}

interface Series {
  id: string;
  title: string;
  slug: string;
  episode_count: number;
  status: 'ongoing' | 'completed' | 'hiatus';
}

export default function CreatorContentPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'processing'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'revenue'>('recent');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (!user?.isCreator) {
      router.push('/creator/onboarding');
      return;
    }
    loadContent();
  }, [user, sortBy, filterStatus]);

  const loadContent = async () => {
    try {
      setIsLoading(true);

      // Mock API call - in real app this would be actual API
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Breaking Bad S01E01 - Pilot Episode Reaction',
          description: 'First time watching the pilot episode of Breaking Bad. What an incredible start to the series!',
          thumbnail: '/api/placeholder/320/180',
          video_url: 'https://youtube.com/embed/abc123',
          duration: 2880, // 48 minutes
          views: 125000,
          watch_time: 95000,
          likes: 8500,
          published_at: '2024-01-15T10:00:00.000Z',
          status: 'published',
          type: 'episode',
          series: { id: '1', title: 'Breaking Bad Complete Series', slug: 'breaking-bad' },
          is_premium: true,
          tier_access: ['Premium', 'VIP'],
          revenue_estimate: 850,
          engagement_rate: 0.68
        },
        {
          id: '2',
          title: 'Inception - Mind-Bending First Watch',
          description: 'Watching Christopher Nolan\'s Inception for the first time. This movie is incredible!',
          thumbnail: '/api/placeholder/320/180',
          video_url: 'https://youtube.com/embed/def456',
          duration: 4500, // 75 minutes
          views: 89000,
          watch_time: 62000,
          likes: 6200,
          published_at: '2024-01-12T15:30:00.000Z',
          status: 'published',
          type: 'movie',
          is_premium: false,
          tier_access: ['Free'],
          revenue_estimate: 320,
          engagement_rate: 0.71
        },
        {
          id: '3',
          title: 'The Dark Knight - Heath Ledger\'s Joker Analysis',
          description: 'Deep dive into Heath Ledger\'s iconic performance as the Joker in The Dark Knight.',
          thumbnail: '/api/placeholder/320/180',
          duration: 3600, // 60 minutes
          views: 0,
          watch_time: 0,
          likes: 0,
          published_at: '2024-01-20T18:00:00.000Z',
          status: 'draft',
          type: 'movie',
          is_premium: true,
          tier_access: ['Premium', 'VIP'],
          revenue_estimate: 0,
          engagement_rate: 0
        },
        {
          id: '4',
          title: 'Marvel Phase 4 Retrospective',
          description: 'Looking back at all the movies and shows from Marvel\'s Phase 4. What worked and what didn\'t?',
          thumbnail: '/api/placeholder/320/180',
          duration: 5400, // 90 minutes
          views: 0,
          watch_time: 0,
          likes: 0,
          published_at: '2024-01-25T20:00:00.000Z',
          status: 'processing',
          type: 'movie',
          is_premium: false,
          tier_access: ['Free'],
          revenue_estimate: 0,
          engagement_rate: 0
        }
      ];

      const mockSeries: Series[] = [
        {
          id: '1',
          title: 'Breaking Bad Complete Series',
          slug: 'breaking-bad',
          episode_count: 62,
          status: 'ongoing'
        },
        {
          id: '2',
          title: 'Marvel Cinematic Universe',
          slug: 'mcu',
          episode_count: 28,
          status: 'ongoing'
        }
      ];

      setContent(mockContent);
      setSeries(mockSeries);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await creatorDashboard.deleteContent(contentId);
        setContent(content.filter(item => item.id !== contentId));
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedContent.length} selected items?`)) {
      try {
        await Promise.all(selectedContent.map(id => creatorDashboard.deleteContent(id)));
        setContent(content.filter(item => !selectedContent.includes(item.id)));
        setSelectedContent([]);
        setShowBulkActions(false);
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const toggleContentSelection = (contentId: string) => {
    setSelectedContent(prev => {
      const newSelection = prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId];

      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-500';
      case 'draft': return 'bg-gray-500/10 text-gray-400';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500';
      case 'scheduled': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-400 mt-1">
              Manage your videos, series, and content library
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/creator/content/upload')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </button>
            <button
              onClick={() => router.push('/creator/series/new')}
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Create Series
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="processing">Processing</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="recent">Most Recent</option>
                <option value="views">Most Views</option>
                <option value="revenue">Highest Revenue</option>
              </select>

              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {selectedContent.length} item{selectedContent.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
              <button
                onClick={() => {
                  setSelectedContent([]);
                  setShowBulkActions(false);
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => (
              <ContentGridCard
                key={item.id}
                content={item}
                isSelected={selectedContent.includes(item.id)}
                onSelect={() => toggleContentSelection(item.id)}
                onEdit={() => router.push(`/creator/content/${item.id}/edit`)}
                onDelete={() => handleDeleteContent(item.id)}
                onView={() => router.push(`/watch/${item.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedContent.length === filteredContent.length && filteredContent.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContent(filteredContent.map(item => item.id));
                        setShowBulkActions(true);
                      } else {
                        setSelectedContent([]);
                        setShowBulkActions(false);
                      }
                    }}
                    className="rounded"
                  />
                </div>
                <div className="col-span-5">Content</div>
                <div className="col-span-2">Stats</div>
                <div className="col-span-2">Revenue</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-gray-700">
              {filteredContent.map((item) => (
                <ContentListItem
                  key={item.id}
                  content={item}
                  isSelected={selectedContent.includes(item.id)}
                  onSelect={() => toggleContentSelection(item.id)}
                  onEdit={() => router.push(`/creator/content/${item.id}/edit`)}
                  onDelete={() => handleDeleteContent(item.id)}
                  onView={() => router.push(`/watch/${item.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredContent.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No content matches your filters' : 'No content yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by uploading your first video'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => router.push('/creator/content/upload')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Upload Content
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Grid Card Component
function ContentGridCard({
  content,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onView
}: {
  content: ContentItem;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:00`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-500';
      case 'draft': return 'bg-gray-500/10 text-gray-400';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500';
      case 'scheduled': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="absolute top-2 left-2 z-10 rounded"
        />

        {content.thumbnail ? (
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Film className="h-12 w-12 text-gray-500" />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${getStatusColor(content.status)}`}>
          {content.status}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(content.duration)}
        </div>

        {/* Premium Badge */}
        {content.is_premium && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Premium
          </div>
        )}

        {/* Actions Menu */}
        <div className="absolute top-2 right-12">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 bg-black/50 text-white rounded hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg z-20 min-w-32">
              <button
                onClick={() => { onView(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                View
              </button>
              <button
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-600 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <h3 className="font-medium text-white mb-2 line-clamp-2">
          {content.title}
        </h3>

        {/* Series Info */}
        {content.series && (
          <p className="text-sm text-gray-400 mb-2">
            {content.series.title}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {formatNumber(content.views)}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatNumber(content.watch_time / 60)}m watched
          </div>
          <div className="flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            ${content.revenue_estimate}
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {Math.round(content.engagement_rate * 100)}%
          </div>
        </div>

        {/* Published Date */}
        <p className="text-xs text-gray-500">
          {new Date(content.published_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// List Item Component
function ContentListItem({
  content,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onView
}: {
  content: ContentItem;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-500';
      case 'draft': return 'bg-gray-500/10 text-gray-400';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500';
      case 'scheduled': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="p-4 hover:bg-gray-750 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Checkbox */}
        <div className="col-span-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded"
          />
        </div>

        {/* Content Info */}
        <div className="col-span-5 flex items-center space-x-3">
          <div className="w-16 h-10 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
            {content.thumbnail ? (
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <Film className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white truncate">
              {content.title}
            </h3>
            {content.series && (
              <p className="text-sm text-gray-400 truncate">
                {content.series.title}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(content.published_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="col-span-2 text-sm">
          <div className="text-white">{formatNumber(content.views)} views</div>
          <div className="text-gray-400 text-xs">
            {Math.round(content.engagement_rate * 100)}% engagement
          </div>
        </div>

        {/* Revenue */}
        <div className="col-span-2 text-sm">
          <div className="text-green-400 font-medium">
            ${content.revenue_estimate}
          </div>
          <div className="text-gray-400 text-xs">
            {content.is_premium ? 'Premium' : 'Free'}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-1">
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(content.status)}`}>
            {content.status}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-1 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg z-20 min-w-32">
              <button
                onClick={() => { onView(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                View
              </button>
              <button
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-600 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}