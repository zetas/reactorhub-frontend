// Enhanced mock data that matches real creator platform reaction content structure

export interface Creator {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  banner?: string;
  description: string;
  creatorPlatformUrl: string;
  joinedDate: string;
  isVerified: boolean;
  
  // Creator platform-specific data
  patronCount: number;
  monthlyEarnings?: number; // Optional for privacy
  
  // Tiers (Creator platform membership levels)
  tiers: CreatorTier[];
  
  // Content stats
  totalVideos: number;
  totalSeries: number;
  totalWatchTime: string; // e.g., "1,234 hours"
  
  // Social links
  socialLinks: {
    youtube?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
  };
  
  // Content categories
  categories: string[];
  tags: string[];
}

export interface CreatorTier {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  currency: string;
  patronCount: number;
  benefits: string[];
  isActive: boolean;
}

export interface ReactionContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  
  // Content type and metadata
  type: 'episode' | 'movie' | 'special' | 'bonus';
  originalContent: {
    title: string; // e.g., "Breaking Bad"
    season?: number;
    episode?: number;
    year?: number;
    genre: string[];
    imdbId?: string;
  };
  
  // Creator and access
  creatorId: string;
  requiredTier?: string; // Minimum tier needed to access
  isPublic: boolean; // Some content might be public for promotion
  
  // Video details
  duration: string; // e.g., "45:32"
  videoUrl?: string; // Would be actual video URL in production
  uploadDate: string;
  publishDate: string; // Might be scheduled for later
  
  // Engagement metrics
  views: number;
  likes: number;
  comments: number;
  shares: number;
  
  // Watch progress (for logged-in users)
  watchProgress?: number; // 0-1
  isWatched?: boolean;
  lastWatchedAt?: string;
  
  // Content organization
  seriesId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  tags: string[];
  
  // Creator platform-specific
  creatorPostId?: string;
  isEarlyAccess?: boolean;
  earlyAccessUntil?: string;
}

export interface ReactionSeries {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  banner?: string;
  
  // Original content info
  originalContent: {
    title: string;
    totalSeasons?: number;
    totalEpisodes?: number;
    year?: number;
    endYear?: number;
    genre: string[];
    network?: string;
    imdbId?: string;
  };
  
  // Creator and access
  creatorId: string;
  requiredTier?: string;
  isPublic: boolean;
  
  // Series metadata
  status: 'ongoing' | 'completed' | 'paused' | 'cancelled';
  startDate: string;
  endDate?: string;
  
  // Content organization
  episodes: string[]; // Array of episode IDs
  totalEpisodes: number;
  totalDuration: string;
  
  // Engagement
  totalViews: number;
  averageRating: number;
  subscriberCount: number; // People following this series
  
  // Progress tracking
  watchProgress?: number; // Overall series progress 0-1
  lastWatchedEpisodeId?: string;
  lastWatchedAt?: string;
  
  tags: string[];
}

// Mock Creators
export const mockCreators: Creator[] = [
  {
    id: 'creator-reactormike',
    name: 'ReactorMike',
    displayName: 'ReactorMike - First Time Reactions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    banner: 'https://images.unsplash.com/photo-1489599735188-900b2b7c9f8b?w=1200&h=300&fit=crop',
    description: 'First-time reactions to your favorite movies and TV shows! Join me on this journey of discovery as I experience these stories for the very first time.',
    creatorPlatformUrl: 'https://creator-platform.com/reactormike',
    joinedDate: '2023-06-01T00:00:00.000Z',
    isVerified: true,
    patronCount: 2847,
    totalVideos: 156,
    totalSeries: 8,
    totalWatchTime: '1,234 hours',
    socialLinks: {
      youtube: 'https://youtube.com/@reactormike',
      twitter: 'https://twitter.com/reactormike',
      discord: 'https://discord.gg/reactormike'
    },
    categories: ['TV Shows', 'Movies', 'First Time Reactions'],
    tags: ['Breaking Bad', 'Marvel', 'The Office', 'Inception', 'First Time Watching'],
    tiers: [
      {
        id: 'tier-basic',
        name: 'Reactor',
        description: 'Basic access to reaction videos',
        priceInCents: 500, // $5.00
        currency: 'USD',
        patronCount: 1847,
        benefits: [
          'Access to all reaction videos',
          'Early access (24 hours before public)',
          'Discord access',
          'Monthly behind-the-scenes content'
        ],
        isActive: true
      },
      {
        id: 'tier-premium',
        name: 'Super Reactor',
        description: 'Premium access with exclusive content',
        priceInCents: 1000, // $10.00
        currency: 'USD',
        patronCount: 847,
        benefits: [
          'Everything from Reactor tier',
          'Exclusive bonus reactions',
          'Vote on next series to watch',
          'Monthly live Q&A sessions',
          'Custom Discord role'
        ],
        isActive: true
      },
      {
        id: 'tier-vip',
        name: 'VIP Reactor',
        description: 'Ultimate fan experience',
        priceInCents: 2500, // $25.00
        currency: 'USD',
        patronCount: 153,
        benefits: [
          'Everything from previous tiers',
          'Personal reaction requests (1 per month)',
          'Direct message access',
          'Exclusive VIP-only content',
          'Annual signed poster'
        ],
        isActive: true
      }
    ]
  },
  {
    id: 'creator-moviefanatic',
    name: 'MovieFanatic',
    displayName: 'MovieFanatic - Cinematic Reactions',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?w=150&h=150&fit=crop&crop=face',
    banner: 'https://images.unsplash.com/photo-1489599735188-900b2b7c9f8b?w=1200&h=300&fit=crop',
    description: 'Passionate movie lover sharing authentic reactions to blockbusters, indie films, and everything in between. Marvel, DC, Horror, Comedy - I watch it all!',
    creatorPlatformUrl: 'https://creator-platform.com/moviefanatic',
    joinedDate: '2023-08-01T00:00:00.000Z',
    isVerified: true,
    patronCount: 1923,
    totalVideos: 89,
    totalSeries: 3,
    totalWatchTime: '892 hours',
    socialLinks: {
      youtube: 'https://youtube.com/@moviefanatic',
      twitter: 'https://twitter.com/moviefanatic',
      instagram: 'https://instagram.com/moviefanatic'
    },
    categories: ['Movies', 'Marvel', 'DC', 'Horror'],
    tags: ['MCU', 'Marvel', 'DC Universe', 'Horror Movies', 'Blockbusters'],
    tiers: [
      {
        id: 'tier-movie-basic',
        name: 'Movie Buff',
        description: 'Access to movie reactions',
        priceInCents: 399, // $3.99
        currency: 'USD',
        patronCount: 1234,
        benefits: [
          'Access to all movie reactions',
          'Early access (12 hours)',
          'Discord community access'
        ],
        isActive: true
      },
      {
        id: 'tier-movie-premium',
        name: 'Cinema Enthusiast',
        description: 'Premium movie experience',
        priceInCents: 799, // $7.99
        currency: 'USD',
        patronCount: 567,
        benefits: [
          'Everything from Movie Buff',
          'Exclusive director\'s cut reactions',
          'Monthly movie trivia nights',
          'Vote on movie polls'
        ],
        isActive: true
      },
      {
        id: 'tier-movie-vip',
        name: 'Hollywood Insider',
        description: 'Ultimate movie fan experience',
        priceInCents: 1999, // $19.99
        currency: 'USD',
        patronCount: 122,
        benefits: [
          'Everything from previous tiers',
          'Personal movie recommendations',
          'Exclusive premiere reactions',
          'Monthly video calls',
          'Custom movie poster designs'
        ],
        isActive: true
      }
    ]
  }
];

// Mock Series
export const mockSeries: ReactionSeries[] = [
  {
    id: 'series-breaking-bad',
    title: 'Breaking Bad - First Time Watching',
    description: 'Join me as I experience the legendary Breaking Bad for the very first time! No spoilers, just pure authentic reactions to one of TV\'s greatest shows.',
    thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop',
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=300&fit=crop',
    originalContent: {
      title: 'Breaking Bad',
      totalSeasons: 5,
      totalEpisodes: 62,
      year: 2008,
      endYear: 2013,
      genre: ['Crime', 'Drama', 'Thriller'],
      network: 'AMC',
      imdbId: 'tt0903747'
    },
    creatorId: 'creator-reactormike',
    requiredTier: 'tier-basic',
    isPublic: false,
    status: 'ongoing',
    startDate: '2024-01-15T10:00:00.000Z',
    episodes: ['bb-s01e01', 'bb-s01e02', 'bb-s01e03'], // Would contain all episode IDs
    totalEpisodes: 15, // Episodes uploaded so far
    totalDuration: '11 hours 23 minutes',
    totalViews: 2847392,
    averageRating: 4.9,
    subscriberCount: 2156,
    tags: ['Breaking Bad', 'First Time Watching', 'TV Drama', 'Crime Series']
  },
  {
    id: 'series-mcu-journey',
    title: 'Marvel Cinematic Universe - Complete Journey',
    description: 'Experiencing the entire MCU in chronological order! From Iron Man to the latest releases, witness my journey through the Marvel universe.',
    thumbnail: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=400&h=225&fit=crop',
    banner: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=1200&h=300&fit=crop',
    originalContent: {
      title: 'Marvel Cinematic Universe',
      totalEpisodes: 30, // Movies + Disney+ shows
      year: 2008,
      genre: ['Action', 'Adventure', 'Superhero'],
      network: 'Marvel Studios'
    },
    creatorId: 'creator-moviefanatic',
    requiredTier: 'tier-movie-basic',
    isPublic: false,
    status: 'ongoing',
    startDate: '2023-08-01T10:00:00.000Z',
    episodes: ['mcu-iron-man', 'mcu-hulk', 'mcu-iron-man-2'],
    totalEpisodes: 28,
    totalDuration: '67 hours 45 minutes',
    totalViews: 1923847,
    averageRating: 4.8,
    subscriberCount: 1654,
    tags: ['Marvel', 'MCU', 'Superhero', 'Action Movies']
  }
];

// Mock Episodes/Content
export const mockContent: ReactionContent[] = [
  {
    id: 'bb-s01e01',
    title: 'Breaking Bad S01E01 - "Pilot" | FIRST TIME WATCHING',
    description: 'My very first time watching Breaking Bad! I\'ve heard so much about this show and I\'m finally diving in. No spoilers please! What an incredible pilot episode - Walter White\'s transformation begins...',
    thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop',
    type: 'episode',
    originalContent: {
      title: 'Breaking Bad',
      season: 1,
      episode: 1,
      year: 2008,
      genre: ['Crime', 'Drama', 'Thriller']
    },
    creatorId: 'creator-reactormike',
    requiredTier: 'tier-basic',
    isPublic: false,
    duration: '47:32',
    uploadDate: '2024-01-15T10:00:00.000Z',
    publishDate: '2024-01-15T10:00:00.000Z',
    views: 125847,
    likes: 8934,
    comments: 1247,
    shares: 234,
    seriesId: 'series-breaking-bad',
    seasonNumber: 1,
    episodeNumber: 1,
    tags: ['Breaking Bad', 'Pilot', 'First Time Watching', 'TV Reaction'],
    creatorPostId: 'post-bb-pilot',
    isEarlyAccess: false
  },
  {
    id: 'bb-s01e02',
    title: 'Breaking Bad S01E02 - "Cat in the Bag" | THE TENSION IS REAL',
    description: 'Episode 2 and I\'m already on the edge of my seat! The moral dilemmas, the tension, the character development - this show is incredible. Walter and Jesse\'s dynamic is fascinating to watch unfold.',
    thumbnail: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop',
    type: 'episode',
    originalContent: {
      title: 'Breaking Bad',
      season: 1,
      episode: 2,
      year: 2008,
      genre: ['Crime', 'Drama', 'Thriller']
    },
    creatorId: 'creator-reactormike',
    requiredTier: 'tier-basic',
    isPublic: false,
    duration: '45:18',
    uploadDate: '2024-01-18T10:00:00.000Z',
    publishDate: '2024-01-18T10:00:00.000Z',
    views: 98234,
    likes: 7456,
    comments: 892,
    shares: 167,
    seriesId: 'series-breaking-bad',
    seasonNumber: 1,
    episodeNumber: 2,
    tags: ['Breaking Bad', 'Cat in the Bag', 'First Time Watching', 'TV Reaction'],
    creatorPostId: 'post-bb-s01e02',
    isEarlyAccess: true,
    earlyAccessUntil: '2024-01-19T10:00:00.000Z'
  },
  {
    id: 'mcu-iron-man',
    title: 'Iron Man (2008) - FIRST TIME WATCHING | MCU Journey Begins!',
    description: 'Starting my Marvel Cinematic Universe journey with the movie that started it all - Iron Man! Robert Downey Jr. is absolutely perfect as Tony Stark. The birth of a legend!',
    thumbnail: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=400&h=225&fit=crop',
    type: 'movie',
    originalContent: {
      title: 'Iron Man',
      year: 2008,
      genre: ['Action', 'Adventure', 'Superhero'],
      imdbId: 'tt0371746'
    },
    creatorId: 'creator-moviefanatic',
    requiredTier: 'tier-movie-basic',
    isPublic: false,
    duration: '2:18:45',
    uploadDate: '2023-08-01T15:00:00.000Z',
    publishDate: '2023-08-01T15:00:00.000Z',
    views: 234567,
    likes: 18934,
    comments: 2847,
    shares: 567,
    seriesId: 'series-mcu-journey',
    episodeNumber: 1,
    tags: ['Iron Man', 'Marvel', 'MCU', 'First Time Watching', 'Superhero'],
    creatorPostId: 'post-iron-man',
    isEarlyAccess: false
  },
  {
    id: 'inception-reaction',
    title: 'Inception (2010) - MIND = BLOWN | First Time Watching',
    description: 'Christopher Nolan\'s masterpiece Inception! This movie is an absolute mind-bender. The layers, the complexity, the stunning visuals - I need to watch this again immediately!',
    thumbnail: 'https://images.unsplash.com/photo-1489599735188-900b2b7c9f8b?w=400&h=225&fit=crop',
    type: 'movie',
    originalContent: {
      title: 'Inception',
      year: 2010,
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      imdbId: 'tt1375666'
    },
    creatorId: 'creator-reactormike',
    requiredTier: 'tier-basic',
    isPublic: true, // Public for promotion
    duration: '2:28:15',
    uploadDate: '2024-01-12T15:30:00.000Z',
    publishDate: '2024-01-12T15:30:00.000Z',
    views: 189234,
    likes: 14567,
    comments: 1834,
    shares: 423,
    tags: ['Inception', 'Christopher Nolan', 'First Time Watching', 'Sci-Fi', 'Mind-Bending'],
    creatorPostId: 'post-inception',
    isEarlyAccess: false
  },
  {
    id: 'office-s01e01',
    title: 'The Office S01E01 - "Pilot" | Starting My Office Journey!',
    description: 'Finally starting The Office! I\'ve heard this show is absolutely hilarious and heartwarming. Let\'s see what all the hype is about with Michael Scott and the Dunder Mifflin crew!',
    thumbnail: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=225&fit=crop',
    type: 'episode',
    originalContent: {
      title: 'The Office',
      season: 1,
      episode: 1,
      year: 2005,
      genre: ['Comedy', 'Mockumentary']
    },
    creatorId: 'creator-reactormike',
    requiredTier: 'tier-premium',
    isPublic: false,
    duration: '22:45',
    uploadDate: '2024-02-01T12:00:00.000Z',
    publishDate: '2024-02-01T12:00:00.000Z',
    views: 67834,
    likes: 5234,
    comments: 678,
    shares: 123,
    seasonNumber: 1,
    episodeNumber: 1,
    tags: ['The Office', 'Comedy', 'First Time Watching', 'Pilot Episode'],
    creatorPostId: 'post-office-pilot',
    isEarlyAccess: true,
    earlyAccessUntil: '2024-02-02T12:00:00.000Z'
  }
];

// Helper functions to get related data
export function getCreatorById(id: string): Creator | undefined {
  return mockCreators.find(creator => creator.id === id);
}

export function getSeriesById(id: string): ReactionSeries | undefined {
  return mockSeries.find(series => series.id === id);
}

export function getContentById(id: string): ReactionContent | undefined {
  return mockContent.find(content => content.id === id);
}

export function getContentByCreator(creatorId: string): ReactionContent[] {
  return mockContent.filter(content => content.creatorId === creatorId);
}

export function getSeriesByCreator(creatorId: string): ReactionSeries[] {
  return mockSeries.filter(series => series.creatorId === creatorId);
}

export function getContentBySeries(seriesId: string): ReactionContent[] {
  return mockContent.filter(content => content.seriesId === seriesId);
}

// Search functionality
export function searchContent(query: string): ReactionContent[] {
  const lowerQuery = query.toLowerCase();
  return mockContent.filter(content =>
    content.title.toLowerCase().includes(lowerQuery) ||
    content.description.toLowerCase().includes(lowerQuery) ||
    content.originalContent.title.toLowerCase().includes(lowerQuery) ||
    content.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function searchCreators(query: string): Creator[] {
  const lowerQuery = query.toLowerCase();
  return mockCreators.filter(creator =>
    creator.name.toLowerCase().includes(lowerQuery) ||
    creator.displayName.toLowerCase().includes(lowerQuery) ||
    creator.description.toLowerCase().includes(lowerQuery) ||
    creator.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function searchSeries(query: string): ReactionSeries[] {
  const lowerQuery = query.toLowerCase();
  return mockSeries.filter(series =>
    series.title.toLowerCase().includes(lowerQuery) ||
    series.description.toLowerCase().includes(lowerQuery) ||
    series.originalContent.title.toLowerCase().includes(lowerQuery) ||
    series.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}