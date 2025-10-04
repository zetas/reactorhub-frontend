'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'new_content' | 'creator_update' | 'system' | 'achievement' | 'reminder';
  title: string;
  message: string;
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  contentId?: string;
  contentTitle?: string;
  contentThumbnail?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'new_content',
    title: 'New Episode Available!',
    message: 'ReactorMike just uploaded "Breaking Bad S01E02 - Cat in the Bag"',
    creatorId: 'creator-1',
    creatorName: 'ReactorMike',
    creatorAvatar: 'https://via.placeholder.com/100x100/6b46c1/ffffff?text=RM',
    contentId: 'bb-s01e02',
    contentTitle: 'Breaking Bad S01E02 - Cat in the Bag',
    contentThumbnail: 'https://via.placeholder.com/320x180/1a1a1a/ffffff?text=Breaking+Bad+S01E02',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/watch/bb-s01e02',
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'creator_update',
    title: 'Creator Announcement',
    message: 'MovieFanatic posted an update about upcoming Marvel Phase 5 reactions',
    creatorId: 'creator-2',
    creatorName: 'MovieFanatic',
    creatorAvatar: 'https://via.placeholder.com/100x100/ef4444/ffffff?text=MF',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    actionUrl: '/creator/creator-2',
    priority: 'medium'
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You\'ve watched 10 complete series! You earned the "Series Binger" badge.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: true,
    actionUrl: '/patron/profile',
    priority: 'medium'
  },
  {
    id: 'notif-4',
    type: 'new_content',
    title: 'New Series Started!',
    message: 'ReactorMike started a new series: "The Office Reactions"',
    creatorId: 'creator-1',
    creatorName: 'ReactorMike',
    creatorAvatar: 'https://via.placeholder.com/100x100/6b46c1/ffffff?text=RM',
    contentId: 'office-series',
    contentTitle: 'The Office Reactions',
    contentThumbnail: 'https://via.placeholder.com/320x180/1a1a1a/ffffff?text=The+Office',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    actionUrl: '/series/office-series',
    priority: 'high'
  },
  {
    id: 'notif-5',
    type: 'reminder',
    title: 'Continue Watching',
    message: 'You left off at 15:30 in "Inception - Mind-Blown First Watch"',
    contentId: 'inception-reaction',
    contentTitle: 'Inception - Mind-Blown First Watch',
    contentThumbnail: 'https://via.placeholder.com/320x180/1a1a1a/ffffff?text=Inception+Reaction',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    actionUrl: '/watch/inception-reaction?t=930',
    priority: 'low'
  },
  {
    id: 'notif-6',
    type: 'system',
    title: 'Platform Update',
    message: 'New features added: Dark mode toggle and improved mobile navigation!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    priority: 'low'
  }
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}