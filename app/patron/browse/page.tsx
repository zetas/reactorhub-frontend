'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  Grid,
  List,
  Play,
  Clock,
  TrendingUp,
  Star,
  Users,
  Calendar,
  ChevronRight,
  X,
  Check,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'popular' | 'rating' | 'alphabetical';
type FilterCategory = 'genre' | 'creator' | 'duration' | 'release';

interface Creator {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  totalContent: number;
  category: string;
  coverImage: string;
  description: string;
  rating: number;
  latestVideo: {
    title: string;
    thumbnail: string;
    duration: string;
    uploadedAt: string;
  };
}

const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'The Normies',
    avatar: '/images/creators/normies-avatar.jpg',
    subscribers: 125000,
    totalContent: 1250,
    category: 'TV & Anime',
    coverImage: '/images/features/watching-content.jpg',
    description: 'Group reactions to TV shows, anime, and movies',
    rating: 4.9,
    latestVideo: {
      title: 'Breaking Bad S5E14 "Ozymandias" REACTION',
      thumbnail: '/images/backgrounds/dark-cinema.jpg',
      duration: '45:20',
      uploadedAt: '2 hours ago',
    },
  },
  {
    id: '2',
    name: 'Blind Wave',
    avatar: '/images/creators/blind-wave-avatar.jpg',
    subscribers: 98000,
    totalContent: 890,
    category: 'Anime & Gaming',
    coverImage: '/images/backgrounds/dark-cinema.jpg',
    description: 'Anime reactions, gaming content, and podcasts',
    rating: 4.8,
    latestVideo: {
      title: 'One Piece Episode 1071 REACTION',
      thumbnail: '/images/features/watching-content.jpg',
      duration: '38:45',
      uploadedAt: '5 hours ago',
    },
  },
  {
    id: '3',
    name: 'YaBoyRoshi',
    avatar: '/images/creators/roshi-avatar.jpg',
    subscribers: 87500,
    totalContent: 650,
    category: 'Anime',
    coverImage: '/images/features/watching-content.jpg',
    description: 'Hilarious anime reactions with genuine commentary',
    rating: 4.9,
    latestVideo: {
      title: 'Attack on Titan Final Episode REACTION',
      thumbnail: '/images/backgrounds/dark-cinema.jpg',
      duration: '52:30',
      uploadedAt: '1 day ago',
    },
  },
  {
    id: '4',
    name: 'Nikki & Steven React',
    avatar: '/images/creators/nikki-steven-avatar.jpg',
    subscribers: 65000,
    totalContent: 450,
    category: 'Movies & TV',
    coverImage: '/images/backgrounds/dark-cinema.jpg',
    description: 'Couple reactions to movies and TV series',
    rating: 4.7,
    latestVideo: {
      title: 'The Last of Us Episode 3 REACTION',
      thumbnail: '/images/features/watching-content.jpg',
      duration: '42:15',
      uploadedAt: '3 days ago',
    },
  },
  {
    id: '5',
    name: 'Semblance of Sanity',
    avatar: '/images/creators/sos-avatar.jpg',
    subscribers: 72000,
    totalContent: 580,
    category: 'Anime',
    coverImage: '/images/features/watching-content.jpg',
    description: 'In-depth anime analysis and reactions',
    rating: 4.8,
    latestVideo: {
      title: 'Hunter x Hunter Episode 131 REACTION',
      thumbnail: '/images/backgrounds/dark-cinema.jpg',
      duration: '55:40',
      uploadedAt: '6 hours ago',
    },
  },
];

const genres = [
  'All Genres',
  'Anime',
  'TV Shows',
  'Movies',
  'Gaming',
  'Reality TV',
  'Documentaries',
  'Comedy',
  'Drama',
  'Horror',
];

export default function BrowsePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  const filteredCreators = mockCreators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All Genres' ||
      creator.category.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.latestVideo.uploadedAt.localeCompare(a.latestVideo.uploadedAt);
      case 'popular':
        return b.subscribers - a.subscribers;
      case 'rating':
        return b.rating - a.rating;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <label htmlFor="browse-search" className="sr-only">
                  Search content
                </label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="browse-search"
                  type="search"
                  role="searchbox"
                  aria-label="Search creators, shows, or categories"
                  placeholder="Search creators, shows, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-red-600 border-red-600'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {selectedFilters.size > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {selectedFilters.size}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:border-red-600 focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="alphabetical">A-Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-900 border border-gray-800 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-3 ${
                    viewMode === 'grid'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  } rounded-l-lg transition-colors`}
                >
                  <Grid className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-3 ${
                    viewMode === 'list'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  } rounded-r-lg transition-colors`}
                >
                  <List className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">List view</span>
                </button>
              </div>
            </div>
          </div>

          {/* Genre Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-3 min-h-[44px] rounded-full whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Duration Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Duration</h4>
                <div className="space-y-2">
                  {['Under 10 min', '10-30 min', '30-60 min', 'Over 60 min'].map(
                    (duration) => (
                      <label key={duration} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.has(duration)}
                          onChange={() => toggleFilter(duration)}
                          className="rounded border-gray-600 bg-gray-800 text-red-600"
                        />
                        <span className="text-sm text-gray-300">{duration}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Upload Date Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Upload Date</h4>
                <div className="space-y-2">
                  {['Today', 'This Week', 'This Month', 'This Year'].map((date) => (
                    <label key={date} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.has(date)}
                        onChange={() => toggleFilter(date)}
                        className="rounded border-gray-600 bg-gray-800 text-red-600"
                      />
                      <span className="text-sm text-gray-300">{date}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Type Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Content Type</h4>
                <div className="space-y-2">
                  {['Series', 'Movies', 'Live Streams', 'Podcasts'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.has(type)}
                        onChange={() => toggleFilter(type)}
                        className="rounded border-gray-600 bg-gray-800 text-red-600"
                      />
                      <span className="text-sm text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Rating</h4>
                <div className="space-y-2">
                  {['4.5+ Stars', '4+ Stars', '3+ Stars', 'All Ratings'].map((rating) => (
                    <label key={rating} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.has(rating)}
                        onChange={() => toggleFilter(rating)}
                        className="rounded border-gray-600 bg-gray-800 text-red-600"
                      />
                      <span className="text-sm text-gray-300">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {selectedFilters.size > 0 && (
              <button
                onClick={() => setSelectedFilters(new Set())}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {sortedCreators.length} Creators Found
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="h-4 w-4" />
            Trending searches: Anime, Breaking Bad, Marvel
          </div>
        </div>

        {/* Empty State */}
        {sortedCreators.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No creators found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find any creators matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All Genres');
                setSelectedFilters(new Set());
              }}
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition"
            >
              <X className="h-5 w-5 mr-2" />
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCreators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creators/${creator.id}`}
                className="group relative bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all"
              >
                {/* Cover Image */}
                <div className="relative aspect-video">
                  <Image
                    src={creator.coverImage}
                    alt={creator.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-red-600 rounded-full p-4">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Latest Video Info */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-gray-300 truncate">
                      {creator.latestVideo.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{creator.latestVideo.duration}</span>
                      <span>•</span>
                      <span>{creator.latestVideo.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors">
                        {creator.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {creator.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mt-3 line-clamp-2">
                    {creator.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{(creator.subscribers / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{creator.rating}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCreators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creators/${creator.id}`}
                className="group flex gap-6 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-64 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={creator.latestVideo.thumbnail}
                    alt={creator.latestVideo.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-12 w-12 text-white fill-white" />
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs">
                    {creator.latestVideo.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors">
                          {creator.name}
                        </h3>
                        <p className="text-sm text-gray-400">{creator.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{(creator.subscribers / 1000).toFixed(0)}K subscribers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{creator.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mt-3">{creator.description}</p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-200">Latest Video:</h4>
                    <p className="text-gray-400 mt-1">{creator.latestVideo.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded {creator.latestVideo.uploadedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-sm text-gray-400">
                      {creator.totalContent} videos available
                    </span>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
                      View Channel
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}