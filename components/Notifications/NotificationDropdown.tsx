'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { 
  Bell, 
  X, 
  Play, 
  User, 
  Award, 
  Clock, 
  Settings,
  Trash2,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'new_content':
      return <Play className="h-4 w-4 text-red-500" />;
    case 'creator_update':
      return <User className="h-4 w-4 text-blue-500" />;
    case 'achievement':
      return <Award className="h-4 w-4 text-yellow-500" />;
    case 'reminder':
      return <Clock className="h-4 w-4 text-orange-500" />;
    case 'system':
      return <Settings className="h-4 w-4 text-gray-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
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
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return time.toLocaleDateString();
  }
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete, onClose }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(notification.id);
  };

  const content = (
    <div 
      className={`group relative p-4 hover:bg-gray-700 transition-colors cursor-pointer border-l-2 ${
        notification.read 
          ? 'border-transparent' 
          : notification.priority === 'high' 
            ? 'border-red-500' 
            : notification.priority === 'medium'
              ? 'border-yellow-500'
              : 'border-blue-500'
      } ${!notification.read ? 'bg-gray-800/50' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Creator Avatar or Icon */}
        <div className="flex-shrink-0">
          {notification.creatorAvatar ? (
            <img
              src={notification.creatorAvatar}
              alt={notification.creatorName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              {getNotificationIcon(notification.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {/* Content thumbnail for content notifications */}
              {notification.contentThumbnail && (
                <div className="mt-2">
                  <img
                    src={notification.contentThumbnail}
                    alt={notification.contentTitle}
                    className="w-16 h-9 object-cover rounded"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(notification.timestamp)}
                </span>
                {notification.actionUrl && (
                  <ExternalLink className="h-3 w-3 text-gray-500" />
                )}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
              aria-label="Delete notification"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return (
      <Link href={notification.actionUrl}>
        {content}
      </Link>
    );
  }

  return content;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 10); // Show only recent 10

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="touch-target -m-2.5 p-2.5 text-tertiary hover:text-primary relative"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <>
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    onClose={() => setIsOpen(false)}
                  />
                ))}
              </>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  We'll notify you when there's something new!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <Link
                  href="/notifications"
                  className="text-sm text-blue-400 hover:text-blue-300"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}