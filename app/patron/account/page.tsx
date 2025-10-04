'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { auth } from '@/lib/api';
import {
  Settings,
  User,
  Mail,
  Lock,
  Bell,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Monitor,
  Moon,
  Sun,
  Volume2,
  Download,
  Zap
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedAt: string;
  isCreator: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      newContent: boolean;
      creatorUpdates: boolean;
      recommendations: boolean;
    };
    playback: {
      autoplay: boolean;
      quality: 'auto' | '720p' | '1080p' | '4k';
      volume: number;
      subtitles: boolean;
    };
    privacy: {
      profileVisible: boolean;
      watchHistoryVisible: boolean;
      allowRecommendations: boolean;
    };
  };
}

type TabType = 'profile' | 'security' | 'notifications' | 'playback' | 'privacy' | 'advanced';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, setUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadProfile();
  }, [token, router]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Mock profile data - replace with actual API call
      const mockProfile: UserProfile = {
        id: '1',
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        avatar: 'https://picsum.photos/seed/user1/200/200',
        bio: 'Love watching reactions and discovering new content!',
        joinedAt: '2023-06-15',
        isCreator: user?.isCreator || false,
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            newContent: true,
            creatorUpdates: true,
            recommendations: false,
          },
          playback: {
            autoplay: true,
            quality: 'auto',
            volume: 80,
            subtitles: false,
          },
          privacy: {
            profileVisible: true,
            watchHistoryVisible: false,
            allowRecommendations: true,
          },
        },
      };

      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        email: mockProfile.email,
        bio: mockProfile.bio,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (category: keyof UserProfile['preferences'], field: string, value: any) => {
    if (!profile) return;

    setProfile(prev => prev ? {
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...(prev.preferences[category] as any),
          [field]: value
        }
      }
    } : null);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (profile) {
        setProfile(prev => prev ? {
          ...prev,
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
        } : null);

        setUser({
          ...user!,
          name: formData.name,
          email: formData.email,
        });
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password. Please check your current password.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm.' });
      return;
    }

    setSaving(true);
    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear auth and redirect
      await auth.logout();
      router.push('/');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
      setSaving(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'security' as TabType, label: 'Security', icon: Shield },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'playback' as TabType, label: 'Playback', icon: Monitor },
    { id: 'privacy' as TabType, label: 'Privacy', icon: Eye },
    { id: 'advanced' as TabType, label: 'Advanced', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-blue-500/20">
                <Settings className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <p className="text-gray-400">Manage your profile and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success'
            ? 'bg-green-900/20 border border-green-500/20 text-green-400'
            : 'bg-red-900/20 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/50 min-h-screen border-r border-gray-800">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-gray-400">Member since {formatJoinDate(profile.joinedAt)}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-6">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                      <Camera className="h-4 w-4" />
                      <span>Change Avatar</span>
                    </button>
                    <p className="text-sm text-gray-400 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

              <div className="space-y-8">
                {/* Change Password */}
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                    >
                      {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                      <span>{saving ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400">Add extra security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Delivery Methods</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">Receive notifications via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={profile.preferences.notifications.email}
                          onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-400">Receive push notifications</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={profile.preferences.notifications.push}
                          onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Content Notifications</h3>

                  <div className="space-y-4">
                    {[
                      { key: 'newContent', label: 'New Content', description: 'Notify when creators upload new content' },
                      { key: 'creatorUpdates', label: 'Creator Updates', description: 'Updates from creators you follow' },
                      { key: 'recommendations', label: 'Recommendations', description: 'Personalized content recommendations' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={profile.preferences.notifications[item.key as keyof typeof profile.preferences.notifications]}
                            onChange={(e) => handlePreferenceChange('notifications', item.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'playback' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Playback Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Video Settings</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autoplay</p>
                        <p className="text-sm text-gray-400">Automatically play next video</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={profile.preferences.playback.autoplay}
                          onChange={(e) => handlePreferenceChange('playback', 'autoplay', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Video Quality</label>
                      <select
                        value={profile.preferences.playback.quality}
                        onChange={(e) => handlePreferenceChange('playback', 'quality', e.target.value)}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="auto">Auto</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="4k">4K</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Volume: {profile.preferences.playback.volume}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={profile.preferences.playback.volume}
                        onChange={(e) => handlePreferenceChange('playback', 'volume', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Subtitles</p>
                        <p className="text-sm text-gray-400">Show subtitles when available</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={profile.preferences.playback.subtitles}
                          onChange={(e) => handlePreferenceChange('playback', 'subtitles', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>

                  <div className="space-y-4">
                    {[
                      { key: 'profileVisible', label: 'Public Profile', description: 'Allow others to view your profile' },
                      { key: 'watchHistoryVisible', label: 'Watch History', description: 'Show your recently watched content' },
                      { key: 'allowRecommendations', label: 'Personalized Recommendations', description: 'Use your data to improve recommendations' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={profile.preferences.privacy[item.key as keyof typeof profile.preferences.privacy]}
                            onChange={(e) => handlePreferenceChange('privacy', item.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Advanced Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Theme & Language</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', icon: Sun, label: 'Light' },
                          { value: 'dark', icon: Moon, label: 'Dark' },
                          { value: 'system', icon: Monitor, label: 'System' },
                        ].map((theme) => {
                          const Icon = theme.icon;
                          return (
                            <button
                              key={theme.value}
                              onClick={() => handlePreferenceChange('theme' as any, 'theme', theme.value)}
                              className={`flex items-center space-x-2 p-3 rounded-lg transition ${
                                profile.preferences.theme === theme.value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-800 text-gray-400 hover:text-white'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{theme.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
                      <select
                        value={profile.preferences.language}
                        onChange={(e) => handlePreferenceChange('language' as any, 'language', e.target.value)}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/20">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-red-400 font-medium">Delete Account</p>
                      <p className="text-sm text-gray-400 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Delete Account</h3>
            <p className="text-gray-400 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <p className="text-gray-400 mb-4">
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
              placeholder="Type DELETE"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={saving || deleteConfirm !== 'DELETE'}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition disabled:opacity-50"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>{saving ? 'Deleting...' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}