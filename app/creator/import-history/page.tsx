'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download, Upload, CheckCircle, XCircle, Clock, AlertTriangle,
  Calendar, Filter, Search, MoreVertical, ExternalLink, Play,
  FileVideo, Image, FileText, Database, RefreshCw, Trash2,
  Eye, Edit3, Archive, Zap, Activity, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigation } from '@/contexts/NavigationContext';

interface ImportRecord {
  id: string;
  import_type: 'creator_post' | 'video_file' | 'metadata_batch' | 'thumbnail_batch';
  source_title: string;
  source_url?: string;
  creator_post_id?: string;
  status: 'completed' | 'failed' | 'processing' | 'pending';
  imported_at: string;
  completed_at?: string;
  file_size?: number; // bytes
  duration?: number; // seconds for videos
  items_imported: number;
  items_total: number;
  error_message?: string;
  imported_content: {
    videos: number;
    thumbnails: number;
    metadata: number;
  };
  patron_engagement?: {
    views: number;
    likes: number;
    comments: number;
  };
  quality_metrics?: {
    video_quality: string;
    audio_quality: string;
    processing_time: number; // seconds
  };
}

interface ImportStats {
  total_imports: number;
  successful_imports: number;
  failed_imports: number;
  total_content_imported: number;
  total_storage_used: number; // GB
  avg_processing_time: number; // seconds
  most_active_day: string;
  recent_activity: number; // imports in last 7 days
}

export default function ImportHistoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBreadcrumbs } = useNavigation();

  const [importHistory, setImportHistory] = useState<ImportRecord[]>([]);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed' | 'processing'>('all');
  const [filterType, setFilterType] = useState<'all' | 'creator_post' | 'video_file' | 'metadata_batch'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'size' | 'duration'>('recent');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Creator Dashboard', href: '/creator/dashboard' },
      { label: 'Import History', href: '/creator/import-history' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Temporarily bypass auth check for demo purposes
    // if (!user?.isCreator) {
    //   router.push('/creator/onboarding');
    //   return;
    // }
    loadImportHistory();
  }, [user, sortBy, filterStatus, filterType]);

  const loadImportHistory = async () => {
    try {
      setIsLoading(true);

      // Mock import statistics
      const mockStats: ImportStats = {
        total_imports: 156,
        successful_imports: 142,
        failed_imports: 14,
        total_content_imported: 89,
        total_storage_used: 45.2,
        avg_processing_time: 180,
        most_active_day: 'Tuesday',
        recent_activity: 12
      };

      // Mock import history data
      const mockHistory: ImportRecord[] = [
        {
          id: '1',
          import_type: 'creator_post',
          source_title: 'Breaking Bad S01E02 - Cat in the Bag Reaction',
          source_url: 'https://creator-platform.com/posts/breaking-bad-s01e02',
          creator_post_id: 'post_abc123',
          status: 'completed',
          imported_at: '2024-01-15T14:30:00.000Z',
          completed_at: '2024-01-15T14:35:00.000Z',
          file_size: 2147483648, // 2GB
          duration: 2880, // 48 minutes
          items_imported: 3,
          items_total: 3,
          imported_content: {
            videos: 1,
            thumbnails: 1,
            metadata: 1
          },
          patron_engagement: {
            views: 8500,
            likes: 650,
            comments: 89
          },
          quality_metrics: {
            video_quality: '1080p',
            audio_quality: '320kbps',
            processing_time: 300
          }
        },
        {
          id: '2',
          import_type: 'video_file',
          source_title: 'Avatar S01E01 - The Boy in the Iceberg (Director Upload)',
          status: 'processing',
          imported_at: '2024-01-15T15:00:00.000Z',
          file_size: 3221225472, // 3GB
          duration: 1800, // 30 minutes
          items_imported: 1,
          items_total: 3,
          imported_content: {
            videos: 1,
            thumbnails: 0,
            metadata: 0
          },
          quality_metrics: {
            video_quality: '4K',
            audio_quality: '320kbps',
            processing_time: 0
          }
        },
        {
          id: '3',
          import_type: 'creator_post',
          source_title: 'The Office S01E01 - Pilot Episode First Watch',
          source_url: 'https://creator-platform.com/posts/office-pilot',
          creator_post_id: 'post_def456',
          status: 'completed',
          imported_at: '2024-01-14T20:15:00.000Z',
          completed_at: '2024-01-14T20:22:00.000Z',
          file_size: 1610612736, // 1.5GB
          duration: 1320, // 22 minutes
          items_imported: 4,
          items_total: 4,
          imported_content: {
            videos: 1,
            thumbnails: 2,
            metadata: 1
          },
          patron_engagement: {
            views: 12400,
            likes: 890,
            comments: 156
          },
          quality_metrics: {
            video_quality: '1080p',
            audio_quality: '256kbps',
            processing_time: 420
          }
        },
        {
          id: '4',
          import_type: 'metadata_batch',
          source_title: 'Stranger Things Series - Metadata Update',
          status: 'completed',
          imported_at: '2024-01-14T16:45:00.000Z',
          completed_at: '2024-01-14T16:48:00.000Z',
          items_imported: 8,
          items_total: 8,
          imported_content: {
            videos: 0,
            thumbnails: 0,
            metadata: 8
          },
          quality_metrics: {
            video_quality: 'N/A',
            audio_quality: 'N/A',
            processing_time: 180
          }
        },
        {
          id: '5',
          import_type: 'creator_post',
          source_title: 'Game of Thrones S01E01 - Winter is Coming',
          source_url: 'https://creator-platform.com/posts/got-winter-coming',
          creator_post_id: 'post_ghi789',
          status: 'failed',
          imported_at: '2024-01-14T12:30:00.000Z',
          file_size: 2684354560, // 2.5GB
          duration: 3600, // 60 minutes
          items_imported: 0,
          items_total: 3,
          error_message: 'Video format not supported. Please upload MP4 or MOV files.',
          imported_content: {
            videos: 0,
            thumbnails: 0,
            metadata: 0
          }
        },
        {
          id: '6',
          import_type: 'thumbnail_batch',
          source_title: 'Marvel Phase 4 - Thumbnail Generation',
          status: 'completed',
          imported_at: '2024-01-13T18:20:00.000Z',
          completed_at: '2024-01-13T18:25:00.000Z',
          items_imported: 15,
          items_total: 15,
          imported_content: {
            videos: 0,
            thumbnails: 15,
            metadata: 0
          },
          quality_metrics: {
            video_quality: 'N/A',
            audio_quality: 'N/A',
            processing_time: 300
          }
        }
      ];

      setImportStats(mockStats);
      setImportHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load import history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = importHistory.filter(record => {
    const matchesSearch = record.source_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesType = filterType === 'all' || record.import_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'size':
        return (b.file_size || 0) - (a.file_size || 0);
      case 'duration':
        return (b.duration || 0) - (a.duration || 0);
      case 'recent':
      default:
        return new Date(b.imported_at).getTime() - new Date(a.imported_at).getTime();
    }
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(1)}GB`;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(0)}MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creator_post': return <Download className="w-4 h-4 text-purple-400" />;
      case 'video_file': return <FileVideo className="w-4 h-4 text-blue-400" />;
      case 'metadata_batch': return <Database className="w-4 h-4 text-green-400" />;
      case 'thumbnail_batch': return <Image className="w-4 h-4 text-yellow-400" />;
      default: return <Upload className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const retryImport = (recordId: string) => {
    // In real app, this would trigger a retry
    console.log('Retrying import:', recordId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!importStats) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Import History</h1>
            <p className="text-gray-400">Track all content imports and processing activities</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <button 
              onClick={loadImportHistory}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Imports</p>
                  <p className="text-2xl font-bold">{importStats.total_imports}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Successful</p>
                  <p className="text-2xl font-bold">{importStats.successful_imports}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FileVideo className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Content Items</p>
                  <p className="text-2xl font-bold">{importStats.total_content_imported}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Archive className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Storage Used</p>
                  <p className="text-2xl font-bold">{importStats.total_storage_used}GB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Processing Performance</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Processing Time:</span>
                <span className="text-white">{formatDuration(importStats.avg_processing_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate:</span>
                <span className="text-green-400">
                  {((importStats.successful_imports / importStats.total_imports) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Failed Imports:</span>
                <span className="text-red-400">{importStats.failed_imports}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Activity Insights</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Most Active Day:</span>
                <span className="text-white">{importStats.most_active_day}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recent Activity (7d):</span>
                <span className="text-blue-400">{importStats.recent_activity} imports</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg per Week:</span>
                <span className="text-white">{Math.round(importStats.total_imports / 12)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition-colors">
                Import from Creator Platform
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors">
                Bulk Metadata Update
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors">
                Generate Thumbnails
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search imports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="creator_post">Creator Posts</option>
            <option value="video_file">Video Files</option>
            <option value="metadata_batch">Metadata</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="recent">Most Recent</option>
            <option value="size">Largest Files</option>
            <option value="duration">Longest Duration</option>
          </select>
        </div>

        {/* Import History List */}
        <div className="space-y-4">
          {sortedHistory.map((record) => (
            <div key={record.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    {getTypeIcon(record.import_type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{record.source_title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span>Imported: {formatDateTime(record.imported_at)}</span>
                      {record.completed_at && (
                        <span>Completed: {formatDateTime(record.completed_at)}</span>
                      )}
                    </div>
                    
                    {record.source_url && (
                      <div className="flex items-center gap-2 text-sm text-purple-400">
                        <ExternalLink className="w-4 h-4" />
                        <a href={record.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          View Source
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Import Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-white ml-2">{formatFileSize(record.file_size)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white ml-2">{formatDuration(record.duration)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Items:</span>
                  <span className="text-white ml-2">{record.items_imported} / {record.items_total}</span>
                </div>
                {record.quality_metrics && (
                  <div>
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white ml-2">{record.quality_metrics.video_quality}</span>
                  </div>
                )}
              </div>

              {/* Content Breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <FileVideo className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{record.imported_content.videos}</div>
                  <div className="text-xs text-gray-400">Videos</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <Image className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{record.imported_content.thumbnails}</div>
                  <div className="text-xs text-gray-400">Thumbnails</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                  <Database className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{record.imported_content.metadata}</div>
                  <div className="text-xs text-gray-400">Metadata</div>
                </div>
              </div>

              {/* Patron Engagement (if available) */}
              {record.patron_engagement && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-purple-300 mb-2">Patron Engagement</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{record.patron_engagement.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{record.patron_engagement.likes.toLocaleString()} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">{record.patron_engagement.comments.toLocaleString()} comments</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {record.error_message && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Import Failed</p>
                      <p className="text-red-300 text-sm">{record.error_message}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => retryImport(record.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                    >
                      Retry Import
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedHistory.length === 0 && (
          <div className="text-center py-12">
            <Download className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No import records found</h3>
            <p className="text-gray-500">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Start importing content to see your history here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}