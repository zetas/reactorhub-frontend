'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, 
  Play, Pause, Settings, Download, Upload, Wifi, WifiOff,
  Calendar, Filter, Search, MoreVertical, ExternalLink,
  Zap, Database, Cloud, Activity, Info
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigation } from '@/contexts/NavigationContext';

interface SyncJob {
  id: string;
  type: 'creator_platform_import' | 'video_processing' | 'metadata_sync' | 'thumbnail_generation';
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number; // 0-100
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  items_total?: number;
  items_processed?: number;
  estimated_time_remaining?: number; // seconds
  creator_post_id?: string;
  video_url?: string;
}

interface SyncStats {
  total_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  running_jobs: number;
  last_sync: string;
  next_scheduled_sync: string;
  creator_platform_connection_status: 'connected' | 'disconnected' | 'error';
  storage_used: number; // GB
  storage_limit: number; // GB
}

export default function SyncStatusPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBreadcrumbs } = useNavigation();

  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Creator Dashboard', href: '/creator/dashboard' },
      { label: 'Sync Status', href: '/creator/sync' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Temporarily bypass auth check for demo purposes
    // if (!user?.isCreator) {
    //   router.push('/creator/onboarding');
    //   return;
    // }
    loadSyncData();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadSyncData();
      }, 5000); // Refresh every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadSyncData = async () => {
    try {
      setIsLoading(true);

      // Mock sync data
      const mockStats: SyncStats = {
        total_jobs: 24,
        completed_jobs: 20,
        failed_jobs: 2,
        running_jobs: 2,
        last_sync: '2024-01-15T14:30:00.000Z',
        next_scheduled_sync: '2024-01-15T18:00:00.000Z',
        creator_platform_connection_status: 'connected',
        storage_used: 45.2,
        storage_limit: 100
      };

      const mockJobs: SyncJob[] = [
        {
          id: '1',
          type: 'creator_platform_import',
          title: 'Import Breaking Bad S01E02 Reaction',
          description: 'Importing new Creator Platform post with reaction video',
          status: 'running',
          progress: 65,
          started_at: '2024-01-15T14:25:00.000Z',
          items_total: 1,
          items_processed: 0,
          estimated_time_remaining: 180,
          creator_post_id: 'post_abc123',
          video_url: 'https://creator-platform.com/posts/breaking-bad-s01e02'
        },
        {
          id: '2',
          type: 'video_processing',
          title: 'Process Avatar S01E01 Video',
          description: 'Converting and optimizing video for streaming',
          status: 'running',
          progress: 85,
          started_at: '2024-01-15T14:20:00.000Z',
          items_total: 3,
          items_processed: 2,
          estimated_time_remaining: 120
        },
        {
          id: '3',
          type: 'thumbnail_generation',
          title: 'Generate Thumbnails - The Office S01E01',
          description: 'Creating video thumbnails and preview images',
          status: 'completed',
          progress: 100,
          started_at: '2024-01-15T14:15:00.000Z',
          completed_at: '2024-01-15T14:18:00.000Z',
          items_total: 5,
          items_processed: 5
        },
        {
          id: '4',
          type: 'metadata_sync',
          title: 'Sync Metadata - Stranger Things Series',
          description: 'Updating video metadata and descriptions',
          status: 'completed',
          progress: 100,
          started_at: '2024-01-15T14:10:00.000Z',
          completed_at: '2024-01-15T14:12:00.000Z',
          items_total: 8,
          items_processed: 8
        },
        {
          id: '5',
          type: 'creator_platform_import',
          title: 'Import Game of Thrones S01E01',
          description: 'Failed to import due to video format issues',
          status: 'failed',
          progress: 25,
          started_at: '2024-01-15T13:45:00.000Z',
          error_message: 'Unsupported video format. Please upload MP4 or MOV files.',
          creator_post_id: 'post_def456'
        },
        {
          id: '6',
          type: 'video_processing',
          title: 'Process Marvel Phase 4 Retrospective',
          description: 'Video processing failed due to file corruption',
          status: 'failed',
          progress: 15,
          started_at: '2024-01-15T13:30:00.000Z',
          error_message: 'Video file appears to be corrupted. Please re-upload the original file.'
        },
        {
          id: '7',
          type: 'creator_platform_import',
          title: 'Import The Dark Knight Analysis',
          description: 'Waiting for Creator Platform API rate limit reset',
          status: 'pending',
          progress: 0,
          items_total: 1,
          items_processed: 0,
          creator_post_id: 'post_ghi789'
        }
      ];

      setSyncStats(mockStats);
      setSyncJobs(mockJobs);
    } catch (error) {
      console.error('Failed to load sync data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = syncJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'paused': return <Pause className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creator_platform_import': return <Download className="w-4 h-4" />;
      case 'video_processing': return <Play className="w-4 h-4" />;
      case 'metadata_sync': return <Database className="w-4 h-4" />;
      case 'thumbnail_generation': return <Activity className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const retryJob = (jobId: string) => {
    // In real app, this would trigger a retry API call
    console.log('Retrying job:', jobId);
  };

  const cancelJob = (jobId: string) => {
    // In real app, this would cancel the job
    console.log('Cancelling job:', jobId);
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

  if (!syncStats) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sync Status</h1>
            <p className="text-gray-400">Monitor Creator Platform content synchronization and processing</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>
            
            <button 
              onClick={loadSyncData}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Now
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
                  <p className="text-gray-400 text-sm">Total Jobs</p>
                  <p className="text-2xl font-bold">{syncStats.total_jobs}</p>
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
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold">{syncStats.completed_jobs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Failed</p>
                  <p className="text-2xl font-bold">{syncStats.failed_jobs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Running</p>
                  <p className="text-2xl font-bold">{syncStats.running_jobs}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status & Storage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Creator Platform Connection</h3>
            <div className="flex items-center gap-3 mb-4">
              {syncStats.creator_platform_connection_status === 'connected' ? (
                <>
                  <Wifi className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">Disconnected</span>
                </>
              )}
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="text-white">{formatDateTime(syncStats.last_sync)}</span>
              </div>
              <div className="flex justify-between">
                <span>Next Scheduled:</span>
                <span className="text-white">{formatDateTime(syncStats.next_scheduled_sync)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Storage Usage</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Used Storage</span>
                <span className="text-white">{syncStats.storage_used}GB / {syncStats.storage_limit}GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full" 
                  style={{ width: `${(syncStats.storage_used / syncStats.storage_limit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <span>{((syncStats.storage_limit - syncStats.storage_used)).toFixed(1)}GB remaining</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sync jobs..."
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
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Sync Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    {getTypeIcon(job.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{job.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{job.description}</p>
                    
                    {job.creator_post_id && (
                      <div className="flex items-center gap-2 text-sm text-purple-400">
                        <ExternalLink className="w-4 h-4" />
                        <span>Creator Platform Post: {job.creator_post_id}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {job.status === 'running' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Started:</span>
                  <span className="text-white ml-2">
                    {job.started_at ? formatDateTime(job.started_at) : 'Not started'}
                  </span>
                </div>
                
                {job.completed_at && (
                  <div>
                    <span className="text-gray-400">Completed:</span>
                    <span className="text-white ml-2">{formatDateTime(job.completed_at)}</span>
                  </div>
                )}
                
                {job.estimated_time_remaining && job.status === 'running' && (
                  <div>
                    <span className="text-gray-400">Time Remaining:</span>
                    <span className="text-white ml-2">{formatTimeRemaining(job.estimated_time_remaining)}</span>
                  </div>
                )}
                
                {job.items_total && (
                  <div>
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white ml-2">{job.items_processed || 0} / {job.items_total}</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {job.error_message && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Error</p>
                      <p className="text-red-300 text-sm">{job.error_message}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => retryJob(job.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No sync jobs found</h3>
            <p className="text-gray-500">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'All sync jobs are up to date'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}