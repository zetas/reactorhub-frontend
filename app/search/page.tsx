'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, Calendar, Eye, Clock, Star, User, Play } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: 'video' | 'series' | 'creator';
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  stats: {
    views: number;
    duration?: string;
    publishedAt: string;
    rating?: number;
  };
  tags: string[];
  isWatched?: boolean;
  watchProgress?: number;
  episodeCount?: number; // For series
  subscriberCount?: number; // For creators
}

type SortOption = 'relevance' | 'date' | 'views' | 'rating' | 'duration';
type FilterType = 'all' | 'video' | 'series' | 'creator';
type ViewMode = 'grid' | 'list';

import { mockContent, mockSeries, mockCreators, getCreatorById } from '@/lib/mockData';

// Convert enhanced mock data to search results format
function convertToSearchResults(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Add content (videos)
  mockContent.forEach(content => {
    const creator = getCreatorById(content.creatorId);
    if (creator) {
      results.push({
        id: content.id,
        title: content.title,
        description: content.description,
        thumbnail: content.thumbnail,
        type: content.type === 'movie' ? 'video' : 'video',
        creator: {
          id: creator.id,
          name: creator.name,
          avatar: creator.avatar
        },
        stats: {
          views: content.views,
          duration: content.duration,
          publishedAt: content.publishDate,
          rating: 4.8 // Mock rating
        },
        tags: content.tags,
        isWatched: content.isWatched || false,
        watchProgress: content.watchProgress || 0
      });
    }
  });
  
  // Add series
  mockSeries.forEach(series => {
    const creator = getCreatorById(series.creatorId);
    if (creator) {
      results.push({
        id: series.id,
        title: series.title,
        description: series.description,
        thumbnail: series.thumbnail,
        type: 'series',
        creator: {
          id: creator.id,
          name: creator.name,
          avatar: creator.avatar
        },
        stats: {
          views: series.totalViews,
          publishedAt: series.startDate,
          rating: series.averageRating
        },
        tags: series.tags,
        episodeCount: series.totalEpisodes,
        watchProgress: series.watchProgress || 0
      });
    }
  });
  
  // Add creators
  mockCreators.forEach(creator => {
    results.push({
      id: creator.id,
      title: creator.displayName,
      description: creator.description,
      thumbnail: creator.avatar,
      type: 'creator',
      creator: {
        id: creator.id,
        name: creator.name,
        avatar: creator.avatar
      },
      stats: {
        views: creator.totalVideos * 50000, // Mock total views
        publishedAt: creator.joinedDate,
        rating: 4.8
      },
      tags: creator.tags,
      subscriberCount: creator.patronCount
    });
  });
  
  return results;
}

const mockResults: SearchResult[] = convertToSearchResults();

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>(() => {
    // If there's an initial query, filter results immediately
    if (initialQuery) {
      return mockResults.filter(result =>
        result.title.toLowerCase().includes(initialQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(initialQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(initialQuery.toLowerCase())) ||
        result.creator.name.toLowerCase().includes(initialQuery.toLowerCase())
      );
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [minDuration, setMinDuration] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState<number>(0);

  const performSearch = useCallback((searchQuery: string) => {
    console.log('performSearch called with:', searchQuery);
    
    if (!searchQuery.trim()) {
      console.log('Empty query, clearing results');
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    console.log('Searching for:', searchQuery);
    console.log('Mock results available:', mockResults.length);
    
    // Filter mock results based on query
    const filtered = mockResults.filter(result => {
      const titleMatch = result.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = result.description.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const creatorMatch = result.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return titleMatch || descMatch || tagMatch || creatorMatch;
    });
    
    console.log('Filtered results:', filtered.length, filtered);
    setResults(filtered);
    setIsLoading(false);
  }, []);

  // Initial search on mount
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // Handle URL changes
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && searchQuery !== query) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams, performSearch, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(result => result.type === filterType);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(result =>
        selectedTags.some(tag => result.tags.includes(tag))
      );
    }

    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateRange) {
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(result =>
        new Date(result.stats.publishedAt) >= cutoff
      );
    }

    // Apply duration filter
    if (minDuration > 0 || maxDuration > 0) {
      filtered = filtered.filter(result => {
        if (!result.stats.duration) return true;
        
        const [minutes, seconds] = result.stats.duration.split(':').map(Number);
        const totalMinutes = minutes + (seconds / 60);
        
        if (minDuration > 0 && totalMinutes < minDuration) return false;
        if (maxDuration > 0 && totalMinutes > maxDuration) return false;
        
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.stats.publishedAt).getTime() - new Date(a.stats.publishedAt).getTime();
        case 'views':
          return b.stats.views - a.stats.views;
        case 'rating':
          return (b.stats.rating || 0) - (a.stats.rating || 0);
        case 'duration':
          const getDuration = (duration?: string) => {
            if (!duration) return 0;
            const [minutes, seconds] = duration.split(':').map(Number);
            return minutes + (seconds / 60);
          };
          return getDuration(b.stats.duration) - getDuration(a.stats.duration);
        case 'relevance':
        default:
          return 0; // Keep original order for relevance
      }
    });

    return filtered;
  }, [results, filterType, selectedTags, dateRange, minDuration, maxDuration, sortBy]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    results.forEach(result => {
      result.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [results]);

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

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'video':
        router.push(`/watch/${result.id}`);
        break;
      case 'series':
        router.push(`/series/${result.id}`);
        break;
      case 'creator':
        router.push(`/creators/${result.id}`);
        break;
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for videos, series, or creators..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Results Summary */}
          {query && (
            <div className="text-center">
              <p className="text-gray-300">
                {isLoading ? 'Searching...' : `${filteredAndSortedResults.length} results for "${query}"`}
              </p>
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        {results.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors lg:hidden"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              {/* Sort and View Controls */}
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Newest</option>
                  <option value="views">Most Viewed</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                </select>

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

            {/* Filters Panel */}
            <div className={`bg-gray-800 rounded-lg p-6 mb-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  >
                    <option value="all">All Types</option>
                    <option value="video">Videos</option>
                    <option value="series">Series</option>
                    <option value="creator">Creators</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Date</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                  >
                    <option value="all">Any Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minDuration || ''}
                      onChange={(e) => setMinDuration(Number(e.target.value) || 0)}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxDuration || ''}
                      onChange={(e) => setMaxDuration(Number(e.target.value) || 0)}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setSelectedTags([]);
                      setDateRange('all');
                      setMinDuration(0);
                      setMaxDuration(0);
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : filteredAndSortedResults.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredAndSortedResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.type === 'video' ? 'bg-red-600 text-white' :
                        result.type === 'series' ? 'bg-blue-600 text-white' :
                        'bg-purple-600 text-white'
                      }`}>
                        {result.type === 'video' ? <Play className="h-3 w-3 inline mr-1" /> :
                         result.type === 'series' ? <Grid className="h-3 w-3 inline mr-1" /> :
                         <User className="h-3 w-3 inline mr-1" />}
                        {result.type}
                      </span>
                    </div>
                    
                    {/* Duration/Episode Count */}
                    {result.stats.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {result.stats.duration}
                      </div>
                    )}
                    
                    {result.episodeCount && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {result.episodeCount} episodes
                      </div>
                    )}
                    
                    {/* Watch Progress */}
                    {result.watchProgress && result.watchProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-lg overflow-hidden">
                        <div 
                          className="h-full bg-red-600"
                          style={{ width: `${result.watchProgress * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="font-medium text-sm group-hover:text-red-400 transition-colors line-clamp-2">
                      {result.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {result.creator.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(result.stats.views)}
                      </span>
                      {result.stats.rating && (
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {result.stats.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-40 h-24 object-cover rounded"
                    />
                    
                    {/* Type Badge */}
                    <div className="absolute top-1 left-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        result.type === 'video' ? 'bg-red-600 text-white' :
                        result.type === 'series' ? 'bg-blue-600 text-white' :
                        'bg-purple-600 text-white'
                      }`}>
                        {result.type}
                      </span>
                    </div>
                    
                    {/* Watch Progress */}
                    {result.watchProgress && result.watchProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-b overflow-hidden">
                        <div 
                          className="h-full bg-red-600"
                          style={{ width: `${result.watchProgress * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-red-400 transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {result.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {result.creator.name}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(result.stats.views)} views
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(result.stats.publishedAt)}
                      </span>
                      {result.stats.duration && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {result.stats.duration}
                        </span>
                      )}
                      {result.stats.rating && (
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {result.stats.rating}
                        </span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {result.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          +{result.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : query ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <p className="text-gray-500">Try different keywords or check your spelling</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Search for videos, series, or creators</p>
            <p className="text-gray-500">Enter a search term to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}