'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Clock, Eye, Calendar, Filter, Grid, List, Bookmark, Share2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import ContentCard from '@/components/ContentCard';
import { getSeriesById, getContentBySeries, getCreatorById } from '@/lib/mockData';

interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  views: number;
  isWatched: boolean;
  watchProgress?: number;
  episodeNumber: number;
  seasonNumber?: number;
}

interface SeriesData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  bannerImage?: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    isSubscribed: boolean;
  };
  stats: {
    totalEpisodes: number;
    totalViews: number;
    totalDuration: string;
    lastUpdated: string;
  };
  episodes: Episode[];
  tags: string[];
  isBookmarked: boolean;
  completionPercentage: number;
}

export default function SeriesPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [series, setSeries] = useState<SeriesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'episode' | 'date' | 'views'>('episode');
  const [filterWatched, setFilterWatched] = useState<'all' | 'watched' | 'unwatched'>('all');
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    loadSeries();
  }, [params.id]);

  const loadSeries = async () => {
    try {
      setIsLoading(true);
      
      // Get series data from enhanced mock data
      const seriesData = getSeriesById(params.id as string);
      const seriesContent = getContentBySeries(params.id as string);
      const creator = seriesData ? getCreatorById(seriesData.creatorId) : null;
      
      if (!seriesData || !creator) {
        setError('Series not found');
        return;
      }
      
      const mockSeries: SeriesData = {
        id: seriesData.id,
        title: seriesData.title,
        description: seriesData.description,
        thumbnail: seriesData.thumbnail,
        bannerImage: seriesData.banner,
        creator: {
          id: creator.id,
          name: creator.name,
          avatar: creator.avatar,
          isSubscribed: true // Mock subscription status
        },
        stats: {
          totalEpisodes: seriesData.totalEpisodes,
          totalViews: seriesData.totalViews,
          totalDuration: seriesData.totalDuration,
          lastUpdated: seriesData.endDate || new Date().toISOString()
        },
        episodes: seriesContent.map(content => ({
          id: content.id,
          title: content.title,
          description: content.description,
          thumbnail: content.thumbnail,
          duration: content.duration,
          publishedAt: content.publishDate,
          views: content.views,
          isWatched: content.isWatched || false,
          watchProgress: content.watchProgress || 0,
          episodeNumber: content.episodeNumber || 1,
          seasonNumber: content.seasonNumber || 1
        })),
        tags: seriesData.tags,
        isBookmarked: true,
        completionPercentage: 40 // 2 out of 5 episodes watched
      };

      setSeries(mockSeries);
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = () => {
    if (!series) return;
    setSeries({
      ...series,
      isBookmarked: !series.isBookmarked
    });
  };

  const handleEpisodeClick = (episodeId: string) => {
    router.push(`/watch/${episodeId}`);
  };

  const handleContinueWatching = () => {
    if (!series) return;
    
    // Find first unwatched episode or episode with incomplete progress
    const nextEpisode = series.episodes.find(ep => 
      !ep.isWatched || (ep.watchProgress && ep.watchProgress < 0.9)
    );
    
    if (nextEpisode) {
      router.push(`/watch/${nextEpisode.id}`);
    }
  };

  const getFilteredAndSortedEpisodes = () => {
    if (!series) return [];
    
    let filtered = series.episodes;
    
    // Apply watched filter
    if (filterWatched === 'watched') {
      filtered = filtered.filter(ep => ep.isWatched);
    } else if (filterWatched === 'unwatched') {
      filtered = filtered.filter(ep => !ep.isWatched);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'episode':
          return a.episodeNumber - b.episodeNumber;
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading series...</div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Series not found</div>
      </div>
    );
  }

  const filteredEpisodes = getFilteredAndSortedEpisodes();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">{series.title}</h1>
            <p className="text-sm text-gray-400">{series.creator.name}</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {series.bannerImage && (
          <div className="h-64 md:h-80 bg-gradient-to-r from-gray-800 to-gray-700 relative overflow-hidden">
            <img
              src={series.bannerImage}
              alt={series.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Series Poster */}
            <div className="md:col-span-1">
              <div className="relative">
                <img
                  src={series.thumbnail}
                  alt={series.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
                {series.completionPercentage > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-3 rounded-b-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{series.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${series.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Series Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{series.title}</h1>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                  <span className="flex items-center">
                    <Play className="h-4 w-4 mr-1" />
                    {series.stats.totalEpisodes} episodes
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {formatNumber(series.stats.totalViews)} views
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {series.stats.totalDuration}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Updated {formatDate(series.stats.lastUpdated)}
                  </span>
                </div>

                {/* Creator Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={series.creator.avatar}
                    alt={series.creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{series.creator.name}</h3>
                    <p className="text-sm text-gray-400">
                      {series.creator.isSubscribed ? 'Subscribed' : 'Not subscribed'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={handleContinueWatching}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    <span>Continue Watching</span>
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      series.isBookmarked
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Bookmark className="h-5 w-5" />
                    <span>{series.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Description */}
                <div>
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="text-gray-300 hover:text-white transition-colors mb-2"
                  >
                    {showDescription ? 'Show less' : 'Show more'}
                  </button>
                  <div className={`text-gray-300 ${showDescription ? '' : 'line-clamp-3'}`}>
                    {series.description.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {series.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold">Episodes</h2>
          
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={filterWatched}
              onChange={(e) => setFilterWatched(e.target.value as any)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700"
            >
              <option value="all">All Episodes</option>
              <option value="watched">Watched</option>
              <option value="unwatched">Unwatched</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700"
            >
              <option value="episode">Episode Order</option>
              <option value="date">Release Date</option>
              <option value="views">Most Viewed</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Episodes Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => handleEpisodeClick(episode.id)}
                className="group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Watch Progress */}
                  {episode.watchProgress && episode.watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-lg overflow-hidden">
                      <div 
                        className="h-full bg-red-600"
                        style={{ width: `${episode.watchProgress * 100}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Watched Indicator */}
                  {episode.isWatched && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                  
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {episode.duration}
                  </div>
                </div>
                
                <div className="mt-2">
                  <h3 className="font-medium text-sm group-hover:text-red-400 transition-colors line-clamp-2">
                    {episode.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatNumber(episode.views)} views • {formatDate(episode.publishedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => handleEpisodeClick(episode.id)}
                className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-32 h-18 object-cover rounded"
                  />
                  
                  {/* Watch Progress */}
                  {episode.watchProgress && episode.watchProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-b overflow-hidden">
                      <div 
                        className="h-full bg-red-600"
                        style={{ width: `${episode.watchProgress * 100}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Watched Indicator */}
                  {episode.isWatched && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-red-400 transition-colors">
                    {episode.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                    <span>{episode.duration}</span>
                    <span>{formatNumber(episode.views)} views</span>
                    <span>{formatDate(episode.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredEpisodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No episodes found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}