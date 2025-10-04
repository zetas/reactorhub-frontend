'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Play,
  TrendingUp,
  Award,
  Star,
  Edit
} from 'lucide-react';
// Mock auth store for now
const useAuthStore = () => ({ user: { id: '1', name: 'John Doe' } });

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  bio?: string;
  location?: string;
  website?: string;
  stats: {
    totalWatchTime: number; // in minutes
    videosWatched: number;
    seriesCompleted: number;
    creatorsFollowed: number;
    favoriteGenres: string[];
    watchStreak: number; // days
    totalLikes: number;
    totalBookmarks: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    autoplay: boolean;
    notifications: boolean;
    publicProfile: boolean;
  };
  recentActivity: Array<{
    id: string;
    type: 'watched' | 'liked' | 'bookmarked' | 'followed';
    title: string;
    creator: string;
    timestamp: string;
    thumbnail?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
}

export default function PatronProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      
      // Mock profile data - in real app this would be an API call
      const mockProfile: UserProfile = {
        id: 'patron-1',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatar: 'https://via.placeholder.com/150x150/6b46c1/ffffff?text=AJ',
        joinedAt: '2023-08-15T10:00:00.000Z',
        bio: 'Love watching first-time reactions to my favorite movies and shows! Always looking for new creators to follow.',
        location: 'San Francisco, CA',
        website: 'https://alexjohnson.blog',
        stats: {
          totalWatchTime: 15420, // 257 hours
          videosWatched: 342,
          seriesCompleted: 12,
          creatorsFollowed: 8,
          favoriteGenres: ['Sci-Fi', 'Drama', 'Comedy', 'Horror'],
          watchStreak: 23,
          totalLikes: 156,
          totalBookmarks: 89
        },
        preferences: {
          theme: 'dark',
          autoplay: true,
          notifications: true,
          publicProfile: true
        },
        recentActivity: [
          {
            id: '1',
            type: 'watched',
            title: 'Breaking Bad S01E01 - Pilot',
            creator: 'ReactorMike',
            timestamp: '2024-01-20T14:30:00.000Z',
            thumbnail: 'https://via.placeholder.com/80x45/1a1a1a/ffffff?text=BB'
          },
          {
            id: '2',
            type: 'liked',
            title: 'Inception - Mind-Blown First Watch',
            creator: 'ReactorMike',
            timestamp: '2024-01-19T20:15:00.000Z',
            thumbnail: 'https://via.placeholder.com/80x45/1a1a1a/ffffff?text=INC'
          },
          {
            id: '3',
            type: 'bookmarked',
            title: 'Marvel Cinematic Universe Reactions',
            creator: 'MovieFanatic',
            timestamp: '2024-01-19T16:45:00.000Z',
            thumbnail: 'https://via.placeholder.com/80x45/1a1a1a/ffffff?text=MCU'
          },
          {
            id: '4',
            type: 'followed',
            title: 'Started following CinemaReacts',
            creator: 'CinemaReacts',
            timestamp: '2024-01-18T12:00:00.000Z'
          }
        ],
        achievements: [
          {
            id: '1',
            title: 'First Watch',
            description: 'Watched your first video on ReactorHub',
            icon: '🎬',
            unlockedAt: '2023-08-15T10:30:00.000Z',
            rarity: 'common'
          },
          {
            id: '2',
            title: 'Binge Watcher',
            description: 'Watched 10 videos in a single day',
            icon: '📺',
            unlockedAt: '2023-09-02T22:15:00.000Z',
            rarity: 'rare'
          },
          {
            id: '3',
            title: 'Series Completionist',
            description: 'Completed your first series',
            icon: '🏆',
            unlockedAt: '2023-10-15T18:45:00.000Z',
            rarity: 'epic'
          },
          {
            id: '4',
            title: 'Streak Master',
            description: 'Maintained a 30-day watch streak',
            icon: '🔥',
            unlockedAt: '2024-01-10T09:00:00.000Z',
            rarity: 'legendary'
          }
        ]
      };

      setProfile(mockProfile);
      setEditForm({
        name: mockProfile.name,
        bio: mockProfile.bio || '',
        location: mockProfile.location || '',
        website: mockProfile.website || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      // In real app, this would be an API call
      setProfile({
        ...profile,
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watched': return <Play className="h-4 w-4" />;
      case 'liked': return <Heart className="h-4 w-4" />;
      case 'bookmarked': return <Bookmark className="h-4 w-4" />;
      case 'followed': return <User className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-600';
      case 'rare': return 'bg-blue-600';
      case 'epic': return 'bg-purple-600';
      case 'legendary': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button
            onClick={() => router.push('/patron/settings')}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="text-center mb-6">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 text-center font-semibold text-xl"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm resize-none"
                      rows={3}
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Location"
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      placeholder="Website"
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
                    {profile.bio && (
                      <p className="text-gray-300 text-sm mb-3">{profile.bio}</p>
                    )}
                    {profile.location && (
                      <p className="text-gray-400 text-sm mb-1">{profile.location}</p>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      >
                        {profile.website}
                      </a>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm mt-3 transition-colors"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm">
                  Member since {formatDate(profile.joinedAt)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-2" />
                    Watch Time
                  </span>
                  <span className="font-semibold">{formatWatchTime(profile.stats.totalWatchTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <Play className="h-4 w-4 mr-2" />
                    Videos Watched
                  </span>
                  <span className="font-semibold">{profile.stats.videosWatched}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <Award className="h-4 w-4 mr-2" />
                    Series Completed
                  </span>
                  <span className="font-semibold">{profile.stats.seriesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    Creators Followed
                  </span>
                  <span className="font-semibold">{profile.stats.creatorsFollowed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Watch Streak
                  </span>
                  <span className="font-semibold">{profile.stats.watchStreak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <Heart className="h-4 w-4 mr-2" />
                    Total Likes
                  </span>
                  <span className="font-semibold">{profile.stats.totalLikes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-300">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmarks
                  </span>
                  <span className="font-semibold">{profile.stats.totalBookmarks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievements */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getRarityColor(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(achievement.unlockedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Genres */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {profile.stats.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-red-600 text-white rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                      {getActivityIcon(activity.type)}
                    </div>
                    {activity.thumbnail && (
                      <img
                        src={activity.thumbnail}
                        alt={activity.title}
                        className="w-12 h-7 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="capitalize text-gray-300">{activity.type}</span>{' '}
                        <span className="font-medium">{activity.title}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {activity.creator} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}