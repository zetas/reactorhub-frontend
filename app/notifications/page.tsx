'use client';

import React, { useState } from 'react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { 
  Bell, 
  Play, 
  User, 
  Award, 
  Clock, 
  Settings,
  Trash2,
  CheckCheck,
  Filter,
  Search,
  X
} from 'lucide-react';
import Link from 'next/link';

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'new_content':
      return <Play className="h-5 w-5 text-red-500" />;
    case 'creator_update':
      return <User className="h-5 w-5 text-blue-500" />;
    case 'achievement':
      return <Award className="h-5 w-5 text-yellow-500" />;
    case 'reminder':
      return <Clock className="h-5 w-5 text-orange-500" />;
    case 'system':
      return <Settings className="h-5 w-5 text-gray-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return time.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const content = (
    <div 
      className={`p-6 bg-gray-800 rounded-lg border-l-4 ${
        notification.read 
          ? 'border-transparent' 
          : notification.priority === 'high' 
            ? 'border-red-500' 
            : notification.priority === 'medium'
              ? 'border-yellow-500'
              : 'border-blue-500'
      } ${!notification.read ? 'bg-gray-800/80' : 'bg-gray-800/40'} hover:bg-gray-700 transition-colors`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon/Avatar */}
        <div className="flex-shrink-0">
          {notification.creatorAvatar ? (
            <img
              src={notification.creatorAvatar}
              alt={notification.creatorName}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
              {getNotificationIcon(notification.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                {notification.title}
              </h3>
              <p className="text-gray-400 mt-1">
                {notification.message}
              </p>
              
              {/* Content preview for content notifications */}
              {notification.contentThumbnail && (
                <div className="mt-4 flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                  <img
                    src={notification.contentThumbnail}
                    alt={notification.contentTitle}
                    className="w-20 h-11 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{notification.contentTitle}</p>
                    <p className="text-xs text-gray-400">
                      {notification.creatorName && `by ${notification.creatorName}`}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  {formatTimeAgo(notification.timestamp)}
                </span>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={handleMarkAsRead}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <CheckCheck className="h-4 w-4" />
                      <span>Mark as read</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(notification.id)}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Unread indicator */}
            {!notification.read && (
              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return (
      <Link href={notification.actionUrl} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Apply type/read filter
    if (filter === 'unread' && notification.read) return false;
    if (filter !== 'all' && filter !== 'unread' && notification.type !== filter) return false;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.creatorName?.toLowerCase().includes(query) ||
        notification.contentTitle?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'new_content', label: 'New Content', count: notifications.filter(n => n.type === 'new_content').length },
    { value: 'creator_update', label: 'Creator Updates', count: notifications.filter(n => n.type === 'creator_update').length },
    { value: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
    { value: 'reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'reminder').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                <Bell className="h-8 w-8 text-red-500" />
                <span>Notifications</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Stay updated with the latest content and announcements
              </p>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          {notifications.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-2xl font-bold text-white">{notifications.length}</span>
                    <p className="text-sm text-gray-400">Total notifications</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-red-500">{unreadCount}</span>
                    <p className="text-sm text-gray-400">Unread</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-600 rounded-full text-xs">
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No notifications yet</h3>
              <p className="text-gray-500">
                We'll notify you when there's something new!
              </p>
            </div>
          ) : (
            <div className="text-center py-16">
              <Filter className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No notifications match your filters</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}