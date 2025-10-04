'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Play, Star, Users, Calendar, Clock, Bookmark, Check,
  Film, Award, TrendingUp, Eye, ArrowLeft, Share2
} from 'lucide-react';
import { creators } from '@/lib/api';
import { useAuthStore, useWatchStore } from '@/lib/store';

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  banner?: string;
  description?: string;
  subscriber_count: number;
  content_count: number;
  total_views: number;
  creator_platform_url?: string;
  created_at: string;
  is_followed?: boolean;
}

interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  episode_count: number;
  total_duration: number;
  status: 'ongoing' | 'completed' | 'hiatus';
  created_at: string;
}

interface Content {
  id: string;
  title: string;
  thumbnail?: string;
  duration: number;
  views: number;
  published_at: string;
  type: 'episode' | 'movie';
  series?: {
    id: string;
    title: string;
    slug: string;
  };
  is_premium: boolean;
  watch_progress?: number;
}

export default function CreatorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { myList, addToList, removeFromList } = useWatchStore();

  const [creator, setCreator] = useState<Creator | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [recentContent, setRecentContent] = useState<Content[]>([]);
  const [popularContent, setPopularContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'series' | 'all'>('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  const creatorId = params.id as string;
  const isInMyList = myList.includes(creatorId);

  useEffect(() => {
    loadCreatorData();
  }, [creatorId]);

  const loadCreatorData = async () => {
    try {
      setIsLoading(true);
      const [creatorRes, seriesRes, contentRes] = await Promise.all([
        // Mock API calls - in real app these would be actual API endpoints
        Promise.resolve({
          data: {
            id: creatorId,
            name: "FilmReels",
            username: "filmreels",
            avatar: "/api/placeholder/80/80",
            banner: "/api/placeholder/1200/300",
            description: "Cinematic reactions and deep dives into the greatest films of all time. Join me as we explore storytelling, cinematography, and the magic of movies together.",
            subscriber_count: 125000,
            content_count: 487,
            total_views: 15600000,
            creator_platform_url: "https://creator-platform.com/filmreels",
            created_at: "2020-03-15T00:00:00.000Z",
            is_followed: false
          }
        }),
        creators.getSeries(creatorId),
        creators.getContent(creatorId, { limit: 20, sort: 'recent' })
      ]);

      setCreator(creatorRes.data);
      setIsFollowing(creatorRes.data.is_followed || false);

      // Mock series data
      setSeries([
        {
          id: '1',
          title: 'Breaking Bad Complete Series',
          slug: 'breaking-bad',
          description: 'Full series reaction with analysis',
          thumbnail: '/api/placeholder/300/170',
          episode_count: 62,
          total_duration: 187200, // 52 hours
          status: 'completed',
          created_at: '2023-01-15T00:00:00.000Z'
        },
        {
          id: '2',
          title: 'Marvel Cinematic Universe',
          slug: 'mcu',
          description: 'Watching the MCU in chronological order',
          thumbnail: '/api/placeholder/300/170',
          episode_count: 28,
          total_duration: 100800, // 28 hours
          status: 'ongoing',
          created_at: '2023-06-01T00:00:00.000Z'
        },
        {
          id: '3',
          title: 'Studio Ghibli Collection',
          slug: 'ghibli',
          description: 'Exploring the magical world of Studio Ghibli',
          thumbnail: '/api/placeholder/300/170',
          episode_count: 12,
          total_duration: 28800, // 8 hours
          status: 'completed',
          created_at: '2023-03-10T00:00:00.000Z'
        }
      ]);

      // Mock recent content
      setRecentContent([
        {
          id: '1',
          title: 'The Dark Knight - First Time Watching',
          thumbnail: '/api/placeholder/300/170',
          duration: 4320, // 72 minutes
          views: 892000,
          published_at: '2024-01-15T00:00:00.000Z',
          type: 'movie',
          is_premium: false
        },
        {
          id: '2',
          title: 'Breaking Bad S01E01 - Pilot Reaction',
          thumbnail: '/api/placeholder/300/170',
          duration: 2880, // 48 minutes
          views: 543000,
          published_at: '2024-01-12T00:00:00.000Z',
          type: 'episode',
          series: { id: '1', title: 'Breaking Bad Complete Series', slug: 'breaking-bad' },
          is_premium: true,
          watch_progress: 0.3
        }
      ]);

      setPopularContent([
        {
          id: '3',
          title: 'Inception - Mind Blown Reaction',
          thumbnail: '/api/placeholder/300/170',
          duration: 3600, // 60 minutes
          views: 1200000,
          published_at: '2023-12-01T00:00:00.000Z',
          type: 'movie',
          is_premium: false
        },
        {
          id: '4',
          title: 'Avengers Endgame - Emotional Breakdown',
          thumbnail: '/api/placeholder/300/170',
          duration: 5400, // 90 minutes
          views: 1800000,
          published_at: '2023-11-15T00:00:00.000Z',
          type: 'movie',
          is_premium: true
        }
      ]);

    } catch (error) {
      console.error('Failed to load creator data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      // Mock follow/unfollow API call
      setIsFollowing(!isFollowing);
      if (!isFollowing) {
        addToList(creatorId);
      } else {
        removeFromList(creatorId);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Creator Not Found</h2>
          <p className="text-gray-400 mb-6">The creator you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/browse')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Browse Creators
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${creator.banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex items-end space-x-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-700 flex-shrink-0">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{creator.name}</h1>
              <p className="text-xl text-gray-300 mb-4">@{creator.username}</p>

              <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {formatNumber(creator.subscriber_count)} subscribers
                </span>
                <span className="flex items-center">
                  <Film className="h-4 w-4 mr-1" />
                  {creator.content_count} videos
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {formatNumber(creator.total_views)} views
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {formatDate(creator.created_at)}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleFollowToggle}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition ${
                    isFollowing
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </button>

                {creator.creator_platform_url && (
                  <a
                    href={creator.creator_platform_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Support on Creator Platform
                  </a>
                )}

                <button className="p-2 text-gray-400 hover:text-white transition">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        {creator.description && (
          <div className="mb-8">
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
              {creator.description}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'overview'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'series'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Series ({series.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 font-medium transition ${
              activeTab === 'all'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Content
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Popular Content */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Popular Content</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularContent.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onClick={() => router.push(`/watch/${content.id}`)}
                  />
                ))}
              </div>
            </section>

            {/* Recent Content */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Uploads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentContent.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onClick={() => router.push(`/watch/${content.id}`)}
                  />
                ))}
              </div>
            </section>

            {/* Featured Series */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Featured Series</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {series.slice(0, 3).map((seriesItem) => (
                  <SeriesCard
                    key={seriesItem.id}
                    series={seriesItem}
                    creatorId={creatorId}
                    onClick={() => router.push(`/series/${creatorId}/${seriesItem.slug}`)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Series Tab */}
        {activeTab === 'series' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((seriesItem) => (
              <SeriesCard
                key={seriesItem.id}
                series={seriesItem}
                creatorId={creatorId}
                onClick={() => router.push(`/series/${creatorId}/${seriesItem.slug}`)}
              />
            ))}
          </div>
        )}

        {/* All Content Tab */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...recentContent, ...popularContent].map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onClick={() => router.push(`/watch/${content.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Content Card Component
function ContentCard({ content, onClick }: { content: Content; onClick: () => void }) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:00`;
  };

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
    >
      <div className="relative bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-video relative">
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

          {/* Premium Badge */}
          {content.is_premium && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Premium
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(content.duration)}
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Watch Progress */}
          {content.watch_progress && content.watch_progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
              <div
                className="h-full bg-red-600"
                style={{ width: `${content.watch_progress * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-white mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
            {content.title}
          </h3>
          <div className="flex items-center text-sm text-gray-400 space-x-2">
            <span>{formatViews(content.views)} views</span>
            {content.series && (
              <>
                <span>•</span>
                <span>{content.series.title}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Series Card Component
function SeriesCard({
  series,
  creatorId,
  onClick
}: {
  series: Series;
  creatorId: string;
  onClick: () => void;
}) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h total`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'ongoing': return 'bg-blue-500';
      case 'hiatus': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complete';
      case 'ongoing': return 'Ongoing';
      case 'hiatus': return 'On Hiatus';
      default: return status;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
    >
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-video relative">
          {series.thumbnail ? (
            <img
              src={series.thumbnail}
              alt={series.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <Film className="h-12 w-12 text-gray-500" />
            </div>
          )}

          {/* Status Badge */}
          <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${getStatusColor(series.status)}`}>
            {getStatusText(series.status)}
          </div>

          {/* Episode Count */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {series.episode_count} episodes
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-white mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
            {series.title}
          </h3>
          {series.description && (
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">
              {series.description}
            </p>
          )}
          <div className="text-sm text-gray-400">
            {formatDuration(series.total_duration)}
          </div>
        </div>
      </div>
    </div>
  );
}