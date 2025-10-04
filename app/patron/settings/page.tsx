'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Play, 
  Download,
  Eye,
  Trash2,
  LogOut,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    publicProfile: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    autoplay: boolean;
    autoplayNext: boolean;
    playbackQuality: 'auto' | '720p' | '1080p';
    subtitles: boolean;
    volume: number;
  };
  notifications: {
    newContent: boolean;
    creatorUpdates: boolean;
    recommendations: boolean;
    email: boolean;
    push: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    showWatchHistory: boolean;
    showLikes: boolean;
    showBookmarks: boolean;
    allowRecommendations: boolean;
    dataCollection: boolean;
  };
  account: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: number; // minutes
  };
}

export default function PatronSettingsPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const { user } = authStore;
  const logout = authStore.logout;
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Mock settings data - in real app this would be an API call
      const mockSettings: UserSettings = {
        profile: {
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          bio: 'Love watching first-time reactions to my favorite movies and shows!',
          location: 'San Francisco, CA',
          website: 'https://alexjohnson.blog',
          publicProfile: true
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'America/Los_Angeles',
          autoplay: true,
          autoplayNext: true,
          playbackQuality: 'auto',
          subtitles: false,
          volume: 80
        },
        notifications: {
          newContent: true,
          creatorUpdates: true,
          recommendations: false,
          email: true,
          push: true,
          weeklyDigest: true
        },
        privacy: {
          showWatchHistory: true,
          showLikes: true,
          showBookmarks: false,
          allowRecommendations: true,
          dataCollection: true
        },
        account: {
          twoFactorEnabled: false,
          loginAlerts: true,
          sessionTimeout: 60
        }
      };

      setSettings(mockSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setIsSaving(true);
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      logout();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Settings not found</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-2 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={settings.profile.location}
                        onChange={(e) => updateSettings('profile', 'location', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input
                        type="url"
                        value={settings.profile.website}
                        onChange={(e) => updateSettings('profile', 'website', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={settings.profile.bio}
                      onChange={(e) => updateSettings('profile', 'bio', e.target.value)}
                      rows={4}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="publicProfile"
                      checked={settings.profile.publicProfile}
                      onChange={(e) => updateSettings('profile', 'publicProfile', e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                    />
                    <label htmlFor="publicProfile" className="text-sm">
                      Make my profile public
                    </label>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Viewing Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <select
                        value={settings.preferences.theme}
                        onChange={(e) => updateSettings('preferences', 'theme', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => updateSettings('preferences', 'language', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Playback Quality</label>
                      <select
                        value={settings.preferences.playbackQuality}
                        onChange={(e) => updateSettings('preferences', 'playbackQuality', e.target.value)}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      >
                        <option value="auto">Auto</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Volume ({settings.preferences.volume}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.preferences.volume}
                        onChange={(e) => updateSettings('preferences', 'volume', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="autoplay"
                        checked={settings.preferences.autoplay}
                        onChange={(e) => updateSettings('preferences', 'autoplay', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                      <label htmlFor="autoplay" className="text-sm">
                        Autoplay videos
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="autoplayNext"
                        checked={settings.preferences.autoplayNext}
                        onChange={(e) => updateSettings('preferences', 'autoplayNext', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                      <label htmlFor="autoplayNext" className="text-sm">
                        Autoplay next episode
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="subtitles"
                        checked={settings.preferences.subtitles}
                        onChange={(e) => updateSettings('preferences', 'subtitles', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                      <label htmlFor="subtitles" className="text-sm">
                        Show subtitles when available
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">New Content</h3>
                        <p className="text-sm text-gray-400">Get notified when creators you follow upload new content</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.newContent}
                        onChange={(e) => updateSettings('notifications', 'newContent', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Creator Updates</h3>
                        <p className="text-sm text-gray-400">Get notified about creator announcements and updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.creatorUpdates}
                        onChange={(e) => updateSettings('notifications', 'creatorUpdates', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Recommendations</h3>
                        <p className="text-sm text-gray-400">Get personalized content recommendations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.recommendations}
                        onChange={(e) => updateSettings('notifications', 'recommendations', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => updateSettings('notifications', 'email', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => updateSettings('notifications', 'push', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Weekly Digest</h3>
                        <p className="text-sm text-gray-400">Get a weekly summary of new content</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyDigest}
                        onChange={(e) => updateSettings('notifications', 'weeklyDigest', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show Watch History</h3>
                        <p className="text-sm text-gray-400">Allow others to see what you've watched</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showWatchHistory}
                        onChange={(e) => updateSettings('privacy', 'showWatchHistory', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show Likes</h3>
                        <p className="text-sm text-gray-400">Allow others to see what you've liked</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showLikes}
                        onChange={(e) => updateSettings('privacy', 'showLikes', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show Bookmarks</h3>
                        <p className="text-sm text-gray-400">Allow others to see your bookmarked content</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showBookmarks}
                        onChange={(e) => updateSettings('privacy', 'showBookmarks', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Allow Recommendations</h3>
                        <p className="text-sm text-gray-400">Use your viewing history to improve recommendations</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowRecommendations}
                        onChange={(e) => updateSettings('privacy', 'allowRecommendations', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Data Collection</h3>
                        <p className="text-sm text-gray-400">Allow collection of usage data to improve the platform</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.dataCollection}
                        onChange={(e) => updateSettings('privacy', 'dataCollection', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Account Security</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.account.twoFactorEnabled}
                        onChange={(e) => updateSettings('account', 'twoFactorEnabled', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Login Alerts</h3>
                        <p className="text-sm text-gray-400">Get notified when someone logs into your account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.account.loginAlerts}
                        onChange={(e) => updateSettings('account', 'loginAlerts', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                      <select
                        value={settings.account.sessionTimeout}
                        onChange={(e) => updateSettings('account', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={480}>8 hours</option>
                        <option value={1440}>24 hours</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                    
                    <div className="space-y-4">
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                      
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">Delete Account</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, including watch history, bookmarks, and preferences.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}