'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Users, Lock, Unlock, Eye, EyeOff, Settings,
  Search, Filter, MoreVertical, Plus, Edit3, Trash2,
  Crown, Star, Gift, Calendar, Clock, AlertTriangle,
  CheckCircle, XCircle, UserCheck, UserX, Ban
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigation } from '@/contexts/NavigationContext';

interface AccessTier {
  id: string;
  name: string;
  description: string;
  color: string;
  patron_count: number;
  content_access: string[];
  features: string[];
  is_active: boolean;
  created_at: string;
}

interface PatronAccess {
  id: string;
  patron_name: string;
  patron_email: string;
  creator_platform_id: string;
  current_tier: string;
  access_level: 'full' | 'limited' | 'blocked';
  last_active: string;
  joined_date: string;
  total_watch_time: number; // minutes
  favorite_series: string[];
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
}

interface AccessRule {
  id: string;
  name: string;
  description: string;
  rule_type: 'content_restriction' | 'time_limit' | 'geographic' | 'device_limit';
  conditions: Record<string, any>;
  affected_tiers: string[];
  is_active: boolean;
  created_at: string;
}

export default function AccessControlPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setBreadcrumbs } = useNavigation();

  const [activeTab, setActiveTab] = useState<'tiers' | 'patrons' | 'rules'>('tiers');
  const [accessTiers, setAccessTiers] = useState<AccessTier[]>([]);
  const [patronAccess, setPatronAccess] = useState<PatronAccess[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Creator Dashboard', href: '/creator/dashboard' },
      { label: 'Access Control', href: '/creator/access-control' }
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    // Temporarily bypass auth check for demo purposes
    // if (!user?.isCreator) {
    //   router.push('/creator/onboarding');
    //   return;
    // }
    loadAccessData();
  }, [user]);

  const loadAccessData = async () => {
    try {
      setIsLoading(true);

      // Mock access tiers
      const mockTiers: AccessTier[] = [
        {
          id: '1',
          name: 'Free Tier',
          description: 'Basic access to public reaction content',
          color: 'bg-gray-500',
          patron_count: 8420,
          content_access: ['Public reactions', 'Basic episodes'],
          features: ['720p quality', 'Standard support'],
          is_active: true,
          created_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'Premium Patron',
          description: 'Enhanced access with early releases and exclusive content',
          color: 'bg-purple-500',
          patron_count: 2150,
          content_access: ['All reactions', 'Early access', 'Exclusive series'],
          features: ['1080p quality', 'Priority support', 'Discord access'],
          is_active: true,
          created_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '3',
          name: 'VIP Patron',
          description: 'Ultimate access with behind-the-scenes content',
          color: 'bg-yellow-500',
          patron_count: 580,
          content_access: ['All content', 'Behind-the-scenes', 'Director commentary'],
          features: ['4K quality', 'Direct creator access', 'Monthly Q&A'],
          is_active: true,
          created_at: '2024-01-01T00:00:00.000Z'
        }
      ];

      // Mock patron access data
      const mockPatrons: PatronAccess[] = [
        {
          id: '1',
          patron_name: 'Alex Johnson',
          patron_email: 'alex.johnson@email.com',
          creator_platform_id: 'creator-platform_123456',
          current_tier: 'Premium Patron',
          access_level: 'full',
          last_active: '2024-01-15T14:30:00.000Z',
          joined_date: '2023-06-15T00:00:00.000Z',
          total_watch_time: 2840, // minutes
          favorite_series: ['Breaking Bad', 'Avatar: The Last Airbender'],
          status: 'active'
        },
        {
          id: '2',
          patron_name: 'Sarah Chen',
          patron_email: 'sarah.chen@email.com',
          creator_platform_id: 'creator-platform_789012',
          current_tier: 'VIP Patron',
          access_level: 'full',
          last_active: '2024-01-15T16:45:00.000Z',
          joined_date: '2023-03-20T00:00:00.000Z',
          total_watch_time: 4520,
          favorite_series: ['The Office', 'Stranger Things', 'Game of Thrones'],
          status: 'active'
        },
        {
          id: '3',
          patron_name: 'Mike Rodriguez',
          patron_email: 'mike.rodriguez@email.com',
          creator_platform_id: 'creator-platform_345678',
          current_tier: 'Free Tier',
          access_level: 'limited',
          last_active: '2024-01-10T12:15:00.000Z',
          joined_date: '2023-11-08T00:00:00.000Z',
          total_watch_time: 680,
          favorite_series: ['The Office'],
          status: 'active'
        },
        {
          id: '4',
          patron_name: 'Emma Wilson',
          patron_email: 'emma.wilson@email.com',
          creator_platform_id: 'creator-platform_901234',
          current_tier: 'Premium Patron',
          access_level: 'blocked',
          last_active: '2024-01-05T09:30:00.000Z',
          joined_date: '2023-08-12T00:00:00.000Z',
          total_watch_time: 1250,
          favorite_series: ['Breaking Bad'],
          status: 'blocked',
          notes: 'Blocked for sharing account credentials'
        }
      ];

      // Mock access rules
      const mockRules: AccessRule[] = [
        {
          id: '1',
          name: 'Geographic Restriction - Premium Content',
          description: 'Restrict premium content access to specific regions',
          rule_type: 'geographic',
          conditions: { allowed_countries: ['US', 'CA', 'UK', 'AU'] },
          affected_tiers: ['Premium Patron', 'VIP Patron'],
          is_active: true,
          created_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          name: 'Device Limit - VIP Tier',
          description: 'Limit VIP patrons to 3 concurrent devices',
          rule_type: 'device_limit',
          conditions: { max_devices: 3 },
          affected_tiers: ['VIP Patron'],
          is_active: true,
          created_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '3',
          name: 'Time-based Access - Early Releases',
          description: 'Premium patrons get 24h early access to new content',
          rule_type: 'time_limit',
          conditions: { early_access_hours: 24 },
          affected_tiers: ['Premium Patron', 'VIP Patron'],
          is_active: true,
          created_at: '2024-01-01T00:00:00.000Z'
        }
      ];

      setAccessTiers(mockTiers);
      setPatronAccess(mockPatrons);
      setAccessRules(mockRules);
    } catch (error) {
      console.error('Failed to load access data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatrons = patronAccess.filter(patron => {
    const matchesSearch = patron.patron_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patron.patron_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patron.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'blocked': return <Ban className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'text-green-400';
      case 'limited': return 'text-yellow-400';
      case 'blocked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'VIP Patron': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'Premium Patron': return <Star className="w-4 h-4 text-purple-400" />;
      default: return <Gift className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Access Control</h1>
            <p className="text-gray-400">Manage patron access tiers and permissions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Add Access Rule
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tiers' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Access Tiers
          </button>
          <button
            onClick={() => setActiveTab('patrons')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'patrons' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Patron Management
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rules' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Access Rules
          </button>
        </div>

        {/* Access Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accessTiers.map((tier) => (
              <div key={tier.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                    <div>
                      <h3 className="font-medium text-white">{tier.name}</h3>
                      <p className="text-sm text-gray-400">{tier.description}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Patrons:</span>
                    <span className="text-white font-medium">{tier.patron_count.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Content Access:</p>
                    <div className="space-y-1">
                      {tier.content_access.map((access, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-gray-300">{access}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Features:</p>
                    <div className="space-y-1">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Star className="w-3 h-3 text-purple-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {tier.is_active ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm">Inactive</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Patron Management Tab */}
        {activeTab === 'patrons' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patrons..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Patrons List */}
            <div className="space-y-4">
              {filteredPatrons.map((patron) => (
                <div key={patron.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {patron.patron_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">{patron.patron_name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{patron.patron_email}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            {getTierIcon(patron.current_tier)}
                            <span className="text-gray-300">{patron.current_tier}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(patron.status)}
                            <span className={getAccessLevelColor(patron.access_level)}>
                              {patron.access_level.charAt(0).toUpperCase() + patron.access_level.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-400">Joined:</span>
                      <span className="text-white ml-2">{formatDate(patron.joined_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Active:</span>
                      <span className="text-white ml-2">{formatDate(patron.last_active)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Watch Time:</span>
                      <span className="text-white ml-2">{formatWatchTime(patron.total_watch_time)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Creator Platform ID:</span>
                      <span className="text-white ml-2">{patron.creator_platform_id}</span>
                    </div>
                  </div>

                  {patron.favorite_series.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Favorite Series:</p>
                      <div className="flex flex-wrap gap-2">
                        {patron.favorite_series.map((series, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                            {series}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {patron.notes && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-300 text-sm">{patron.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            {accessRules.map((rule) => (
              <div key={rule.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-white mb-1">{rule.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{rule.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                        {rule.rule_type.replace('_', ' ').toUpperCase()}
                      </span>
                      {rule.is_active ? (
                        <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-300 rounded text-xs">
                          INACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Affected Tiers:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {rule.affected_tiers.map((tier, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs">
                          {tier}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white ml-2">{formatDate(rule.created_at)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Rule Conditions:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(rule.conditions, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {((activeTab === 'patrons' && filteredPatrons.length === 0) ||
          (activeTab === 'tiers' && accessTiers.length === 0) ||
          (activeTab === 'rules' && accessRules.length === 0)) && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              {activeTab === 'patrons' ? 'No patrons found' : 
               activeTab === 'tiers' ? 'No access tiers configured' : 
               'No access rules defined'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'patrons' && (searchQuery || filterStatus !== 'all') 
                ? 'Try adjusting your search or filters' 
                : `Configure ${activeTab} to manage patron access`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}