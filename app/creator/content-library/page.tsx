'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, Film, Edit3, Trash2, Eye, Clock, Calendar, Filter,
  Search, Plus, MoreVertical, Play, TrendingUp, TrendingDown,
  Users, Heart, Settings, BookOpen, Grid, List, Star,
  MessageCircle, Share2, Download, ChevronDown, Tag
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigation } from '@/contexts/NavigationContext';
import { placeholders, handleImageError } from '@/lib/placeholders';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  video_url?: string;
  duration: number;
  views: number;
  watch_time: number; // total minutes watched
  avg_watch_time: number; // average minutes per view
  likes: number;
  comments: number;
  shares: number;
  published_at: string;
  status: 'published' | 'draft' | 'processing' | 'scheduled';
  type: 'episode' | 'movie' | 'special';
  series?: {
    id: string;
    title: string;
    slug: string;
  };
  is_premium: boolean;
  tier_access: string[];
  engagement_rate: number; // percentage
  completion_rate: number; // percentage of video watched on average
  patron_rating: number; // 1-5 stars from patron feedback
}

interface Series {
  id: string;
  title: string;
  slug: string;
  episode_count: number;
  total_views: number;
  avg_engagement: number;
  status: 'ongoing' | 'completed' | 'hiatus';
}

export default function ContentLibraryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBreadcrumbs } = useNavigation();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'processing'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'engagement'>('recent');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Creator Dashboard', href: '/creator/dashboard' },
      { label: 'Content Library', href: '/creator/content-library' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Temporarily bypass auth check for demo purposes
    // if (!user?.isCreator) {
    //   router.push('/creator/onboarding');
    //   return;
    // }
    loadContent();
  }, [user, sortBy, filterStatus]);

  const loadContent = async () => {
    try {
      setIsLoading(true);

      // Mock content data focused on patron engagement
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Breaking Bad S01E01 - Pilot Episode Reaction',
          description: 'First time watching the pilot episode of Breaking Bad. What an incredible start to the series!',
          thumbnail: placeholders.videoThumbnail(320, 180, 'Breaking Bad S01E01'),
          video_url: 'https://youtube.com/embed/abc123',
          duration: 2880, // 48 minutes
          views: 125000,
          watch_time: 95000, // total minutes watched
          avg_watch_time: 42, // average minutes per view
          likes: 8500,
          comments: 1200,
          shares: 450,
          published_at: '2024-01-15T10:00:00.000Z',
          status: 'published',
          type: 'episode',
          series: { id: '1', title: 'Breaking Bad Complete Series', slug: 'breaking-bad' },
          is_premium: true,
          tier_access: ['Premium', 'VIP'],
          engagement_rate: 85,
          completion_rate: 87,
          patron_rating: 4.8
        },
        {
          id: '2',
          title: 'Avatar: The Last Airbender S01E01 - The Boy in the Iceberg',
          description: 'Starting my journey through Avatar: The Last Airbender! This show has been recommended so many times.',
          thumbnail: placeholders.videoThumbnail(320, 180, 'Avatar S01E01'),
          video_url: 'https://youtube.com/embed/def456',
          duration: 1800, // 30 minutes
          views: 98000,
          watch_time: 78000,
          avg_watch_time: 28,
          likes: 7200,
          comments: 980,
          shares: 320,
          published_at: '2024-01-12T15:30:00.000Z',
          status: 'published',
          type: 'episode',
          series: { id: '2', title: 'Avatar: The Last Airbender', slug: 'avatar-tla' },
          is_premium: false,
          tier_access: ['Free'],
          engagement_rate: 92,
          completion_rate: 93,
          patron_rating: 4.9
        },
        {
          id: '3',
          title: 'The Dark Knight - Heath Ledger\'s Joker Analysis',
          description: 'Deep dive into Heath Ledger\'s iconic performance as the Joker in The Dark Knight.',
          thumbnail: placeholders.videoThumbnail(320, 180, 'Dark Knight'),
          duration: 3600, // 60 minutes
          views: 0,
          watch_time: 0,
          avg_watch_time: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          published_at: '2024-01-20T18:00:00.000Z',
          status: 'draft',
          type: 'movie',
          is_premium: true,
          tier_access: ['Premium', 'VIP'],
          engagement_rate: 0,
          completion_rate: 0,
          patron_rating: 0
        },
        {
          id: '4',
          title: 'The Office S01E01 - Pilot Episode First Watch',
          description: 'Finally starting The Office! I\'ve heard so much about this show, let\'s see what the hype is about.',
          thumbnail: placeholders.videoThumbnail(320, 180, 'The Office S01E01'),
          duration: 1320, // 22 minutes
          views: 87000,
          watch_time: 65000,
          avg_watch_time: 19,
          likes: 6100,
          comments: 850,
          shares: 280,
          published_at: '2024-01-10T20:00:00.000Z',
          status: 'published',
          type: 'episode',
          series: { id: '3', title: 'The Office Complete Series', slug: 'the-office' },
          is_premium: false,
          tier_access: ['Free'],
          engagement_rate: 88,
          completion_rate: 86,
          patron_rating: 4.7
        },
        {
          id: '5',
          title: 'Stranger Things S01E01 - The Vanishing of Will Byers',
          description: 'Starting Stranger Things! I\'ve managed to avoid spoilers for years, so this should be fun.',
          thumbnail: placeholders.videoThumbnail(320, 180, 'Stranger Things S01E01'),
          duration: 2880, // 48 minutes
          views: 0,
          watch_time: 0,
          avg_watch_time: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          published_at: '2024-01-25T20:00:00.000Z',
          status: 'processing',
          type: 'episode',
          series: { id: '4', title: 'Stranger Things', slug: 'stranger-things' },
          is_premium: false,
          tier_access: ['Free'],
          engagement_rate: 0,
          completion_rate: 0,
          patron_rating: 0
        }
      ];

      const mockSeries: Series[] = [
        {
          id: '1',
          title: 'Breaking Bad Complete Series',
          slug: 'breaking-bad',
          episode_count: 8,
          total_views: 450000,
          avg_engagement: 86,
          status: 'ongoing'
        },
        {
          id: '2',
          title: 'Avatar: The Last Airbender',
          slug: 'avatar-tla',
          episode_count: 12,
          total_views: 520000,
          avg_engagement: 91,
          status: 'ongoing'
        },
        {
          id: '3',
          title: 'The Office Complete Series',
          slug: 'the-office',
          episode_count: 5,
          total_views: 280000,
          avg_engagement: 84,
          status: 'ongoing'
        },
        {
          id: '4',
          title: 'Stranger Things',
          slug: 'stranger-things',
          episode_count: 1,
          total_views: 0,
          avg_engagement: 0,
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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'engagement':
        return b.engagement_rate - a.engagement_rate;
      case 'recent':
      default:
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-gray-500';
      case 'processing': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'processing': return 'Processing';
      case 'scheduled': return 'Scheduled';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Library</h1>
            <p className="text-gray-400">Manage your reaction content and track patron engagement</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <button 
              onClick={() => router.push('/creator/content/upload')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload Content
            </button>
          </div>
        </div>

        {/* Series Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Series Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {series.map((s) => (
              <div key={s.id} className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2 truncate">{s.title}</h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Episodes:</span>
                    <span className="text-white">{s.episode_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Views:</span>
                    <span className="text-white">{formatNumber(s.total_views)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Engagement:</span>
                    <span className="text-white">{s.avg_engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`capitalize ${s.status === 'ongoing' ? 'text-green-400' : 'text-gray-400'}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <label htmlFor="content-search" className="sr-only">
              Search content library
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
            <input
              id="content-search"
              type="search"
              role="searchbox"
              aria-label="Search by title or description"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="processing">Processing</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Views</option>
            <option value="engagement">Best Engagement</option>
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600' : 'bg-gray-800'}`}
            >
              <Grid className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Grid view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600' : 'bg-gray-800'}`}
            >
              <List className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">List view</span>
            </button>
          </div>
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedContent.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                <div className="relative">
                  <img
                    src={item.thumbnail || placeholders.videoThumbnail(320, 180)}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => handleImageError(e, 320, 180)}
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                    {formatDuration(item.duration)}
                  </div>
                  {item.patron_rating > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {item.patron_rating.toFixed(1)}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-white mb-2 line-clamp-2">{item.title}</h3>
                  {item.series && (
                    <p className="text-sm text-purple-400 mb-2">{item.series.title}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(item.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(item.likes)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {formatNumber(item.comments)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.avg_watch_time}m avg
                    </div>
                  </div>
                  
                  {item.status === 'published' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Engagement</span>
                        <span className="text-white">{item.engagement_rate}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${item.engagement_rate}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Completion</span>
                        <span className="text-white">{item.completion_rate}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${item.completion_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button aria-label="Edit content" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button aria-label="View content" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only">View</span>
                      </button>
                    </div>
                    <button aria-label="More options" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">More options</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedContent.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-750 transition-colors">
                <img
                  src={item.thumbnail || placeholders.videoThumbnail(120, 68)}
                  alt={item.title}
                  className="w-24 h-14 object-cover rounded"
                  onError={(e) => handleImageError(e, 120, 68)}
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-white mb-1">{item.title}</h3>
                      {item.series && (
                        <p className="text-sm text-purple-400">{item.series.title}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                      {item.patron_rating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {item.patron_rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(item.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(item.likes)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {formatNumber(item.comments)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(item.duration)}
                    </div>
                    {item.status === 'published' && (
                      <>
                        <div>Engagement: {item.engagement_rate}%</div>
                        <div>Completion: {item.completion_rate}%</div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button aria-label="Edit content" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </button>
                  <button aria-label="View content" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">View</span>
                  </button>
                  <button aria-label="More options" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">More options</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedContent.length === 0 && (
          <div className="text-center py-12">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No content found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Upload your first reaction video to get started'
              }
            </p>
            <button 
              onClick={() => router.push('/creator/content/upload')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="w-5 h-5" />
              Upload Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
}