'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function CreatorSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    syncEnabled: true,
    publicProfile: true,
    analyticsSharing: false
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Creator Settings</h1>

      {/* Profile Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 mr-2 text-gray-400" />
          <h2 className="text-xl font-semibold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-600"
              placeholder="Your creator name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-600"
              rows={3}
              placeholder="Tell viewers about your content"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 mr-2 text-gray-400" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-300">Email notifications</span>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-300">New patron alerts</span>
            <input
              type="checkbox"
              checked={settings.syncEnabled}
              onChange={(e) => setSettings({ ...settings, syncEnabled: e.target.checked })}
              className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 mr-2 text-gray-400" />
          <h2 className="text-xl font-semibold">Privacy</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-300">Public profile</span>
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={(e) => setSettings({ ...settings, publicProfile: e.target.checked })}
              className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-300">Share analytics data</span>
            <input
              type="checkbox"
              checked={settings.analyticsSharing}
              onChange={(e) => setSettings({ ...settings, analyticsSharing: e.target.checked })}
              className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}