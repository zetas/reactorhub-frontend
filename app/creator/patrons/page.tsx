'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Search, Filter, Mail, Gift, Star, Calendar,
  DollarSign, TrendingUp, TrendingDown, UserPlus, Crown,
  MessageCircle, Bell, MoreVertical, Eye, Award, Heart,
  Download, ArrowUp, ArrowDown, ChevronUp, ChevronDown
} from 'lucide-react';
import { creatorDashboard } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { placeholders, handleImageError } from '@/lib/placeholders';

interface Patron {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: string;
  tier_color: string;
  monthly_amount: number;
  total_contributed: number;
  joined_date: string;
  last_activity: string;
  status: 'active' | 'paused' | 'declined';
  engagement_score: number;
  favorite_content?: string;
  total_watch_time: number;
  messages_sent: number;
}

interface TierSummary {
  name: string;
  color: string;
  count: number;
  monthly_revenue: number;
  avg_engagement: number;
  retention_rate: number;
}

interface PatronStats {
  total_patrons: number;
  active_patrons: number;
  monthly_revenue: number;
  avg_contribution: number;
  new_this_month: number;
  churn_rate: number;
  lifetime_value: number;
}

export default function CreatorPatronsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [patrons, setPatrons] = useState<Patron[]>([]);
  const [tierSummary, setTierSummary] = useState<TierSummary[]>([]);
  const [stats, setStats] = useState<PatronStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'declined'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'tier' | 'amount' | 'joined' | 'activity'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPatrons, setSelectedPatrons] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    // Check if user is authenticated before loading patrons
    // This prevents prefetch from loading data for unauthenticated users
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('No auth token, skipping patrons load');
      setIsLoading(false);
      return;
    }

    if (!user?.isCreator) {
      router.push('/creator/onboarding');
      return;
    }
    loadPatrons();
  }, [user]);

  const loadPatrons = async () => {
    try {
      setIsLoading(true);

      // Mock data - in real app this would be API calls
      const mockPatrons: Patron[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          avatar: placeholders.avatar(40, 'Alex Johnson'),
          tier: 'VIP',
          tier_color: 'bg-purple-500',
          monthly_amount: 25,
          total_contributed: 300,
          joined_date: '2023-03-15T00:00:00.000Z',
          last_activity: '2024-01-18T14:30:00.000Z',
          status: 'active',
          engagement_score: 0.89,
          favorite_content: 'Breaking Bad Series',
          total_watch_time: 45600, // 12.6 hours
          messages_sent: 23
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          avatar: placeholders.avatar(40, 'Sarah Chen'),
          tier: 'Premium',
          tier_color: 'bg-blue-500',
          monthly_amount: 10,
          total_contributed: 120,
          joined_date: '2023-06-20T00:00:00.000Z',
          last_activity: '2024-01-17T09:15:00.000Z',
          status: 'active',
          engagement_score: 0.76,
          favorite_content: 'Marvel Movies',
          total_watch_time: 28800, // 8 hours
          messages_sent: 12
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          email: 'mike@example.com',
          tier: 'Basic',
          tier_color: 'bg-green-500',
          monthly_amount: 5,
          total_contributed: 60,
          joined_date: '2023-09-10T00:00:00.000Z',
          last_activity: '2024-01-16T20:45:00.000Z',
          status: 'active',
          engagement_score: 0.62,
          total_watch_time: 18000, // 5 hours
          messages_sent: 5
        },
        {
          id: '4',
          name: 'Emily Watson',
          email: 'emily@example.com',
          avatar: placeholders.avatar(40, 'Emily Watson'),
          tier: 'Premium',
          tier_color: 'bg-blue-500',
          monthly_amount: 10,
          total_contributed: 40,
          joined_date: '2023-12-01T00:00:00.000Z',
          last_activity: '2024-01-10T11:20:00.000Z',
          status: 'paused',
          engagement_score: 0.45,
          total_watch_time: 7200, // 2 hours
          messages_sent: 2
        }
      ];

      const mockTierSummary: TierSummary[] = [
        {
          name: 'VIP',
          color: 'bg-purple-500',
          count: 45,
          monthly_revenue: 1125,
          avg_engagement: 0.82,
          retention_rate: 0.95
        },
        {
          name: 'Premium',
          color: 'bg-blue-500',
          count: 125,
          monthly_revenue: 1250,
          avg_engagement: 0.68,
          retention_rate: 0.88
        },
        {
          name: 'Basic',
          color: 'bg-green-500',
          count: 320,
          monthly_revenue: 1600,
          avg_engagement: 0.52,
          retention_rate: 0.75
        }
      ];

      const mockStats: PatronStats = {
        total_patrons: 490,
        active_patrons: 445,
        monthly_revenue: 3975,
        avg_contribution: 8.93,
        new_this_month: 23,
        churn_rate: 0.08,
        lifetime_value: 156.50
      };

      setPatrons(mockPatrons);
      setTierSummary(mockTierSummary);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load patrons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (patronId: string) => {
    // Navigate to messaging interface
    router.push(`/creator/messages/${patronId}`);
  };

  const handleBulkMessage = () => {
    if (selectedPatrons.length > 0) {
      router.push(`/creator/messages/compose?patrons=${selectedPatrons.join(',')}`);
    }
  };

  const togglePatronSelection = (patronId: string) => {
    setSelectedPatrons(prev => {
      const newSelection = prev.includes(patronId)
        ? prev.filter(id => id !== patronId)
        : [...prev, patronId];

      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedPatrons = patrons
    .filter(patron => {
      const matchesSearch = patron.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patron.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = filterTier === 'all' || patron.tier === filterTier;
      const matchesStatus = filterStatus === 'all' || patron.status === filterStatus;

      return matchesSearch && matchesTier && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'tier':
          aValue = a.tier;
          bValue = b.tier;
          break;
        case 'amount':
          aValue = a.monthly_amount;
          bValue = b.monthly_amount;
          break;
        case 'joined':
          aValue = new Date(a.joined_date).getTime();
          bValue = new Date(b.joined_date).getTime();
          break;
        case 'activity':
          aValue = new Date(a.last_activity).getTime();
          bValue = new Date(b.last_activity).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'paused': return 'text-yellow-500 bg-yellow-500/10';
      case 'declined': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Patron Management</h1>
            <p className="text-gray-400 mt-1">
              Connect with your supporters and manage your community
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/creator/messages/compose')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.total_patrons}</p>
              <p className="text-sm text-gray-400">Total Patrons</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="h-8 w-8 text-green-500" />
                <span className="text-sm text-green-500">+{stats.new_this_month}</span>
              </div>
              <p className="text-2xl font-bold">{stats.active_patrons}</p>
              <p className="text-sm text-gray-400">Active Patrons</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.monthly_revenue)}</p>
              <p className="text-sm text-gray-400">Monthly Revenue</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Gift className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.avg_contribution)}</p>
              <p className="text-sm text-gray-400">Avg. Contribution</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{Math.round((1 - stats.churn_rate) * 100)}%</p>
              <p className="text-sm text-gray-400">Retention Rate</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.lifetime_value)}</p>
              <p className="text-sm text-gray-400">Lifetime Value</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-2xl font-bold">
                {Math.round(tierSummary.reduce((sum, tier) => sum + tier.avg_engagement * tier.count, 0) / stats.total_patrons * 100)}%
              </p>
              <p className="text-sm text-gray-400">Avg. Engagement</p>
            </div>
          </div>
        )}

        {/* Tier Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tierSummary.map((tier) => (
            <div key={tier.name} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${tier.color} mr-3`} />
                  <h3 className="font-semibold">{tier.name} Tier</h3>
                </div>
                <Crown className={`h-5 w-5 ${tier.color.replace('bg-', 'text-')}`} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Patrons</p>
                  <p className="font-medium">{tier.count}</p>
                </div>
                <div>
                  <p className="text-gray-400">Revenue</p>
                  <p className="font-medium">{formatCurrency(tier.monthly_revenue)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Engagement</p>
                  <p className="font-medium">{Math.round(tier.avg_engagement * 100)}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Retention</p>
                  <p className="font-medium">{Math.round(tier.retention_rate * 100)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patrons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Tiers</option>
                {tierSummary.map(tier => (
                  <option key={tier.name} value={tier.name}>{tier.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {selectedPatrons.length} patron{selectedPatrons.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBulkMessage}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Send Message
              </button>
              <button
                onClick={() => {
                  setSelectedPatrons([]);
                  setShowBulkActions(false);
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Patrons Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedPatrons.length === filteredAndSortedPatrons.length && filteredAndSortedPatrons.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPatrons(filteredAndSortedPatrons.map(p => p.id));
                      setShowBulkActions(true);
                    } else {
                      setSelectedPatrons([]);
                      setShowBulkActions(false);
                    }
                  }}
                  className="rounded"
                />
              </div>
              <div className="col-span-3">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center hover:text-white transition"
                >
                  Patron
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('tier')}
                  className="flex items-center hover:text-white transition"
                >
                  Tier
                  {sortBy === 'tier' && (
                    sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center hover:text-white transition"
                >
                  Contribution
                  {sortBy === 'amount' && (
                    sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('activity')}
                  className="flex items-center hover:text-white transition"
                >
                  Last Active
                  {sortBy === 'activity' && (
                    sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {filteredAndSortedPatrons.map((patron) => (
              <PatronRow
                key={patron.id}
                patron={patron}
                isSelected={selectedPatrons.includes(patron.id)}
                onSelect={() => togglePatronSelection(patron.id)}
                onMessage={() => handleSendMessage(patron.id)}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredAndSortedPatrons.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchQuery || filterTier !== 'all' || filterStatus !== 'all'
                ? 'No patrons match your filters'
                : 'No patrons yet'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterTier !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start creating content to attract your first patrons'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Patron Row Component
function PatronRow({
  patron,
  isSelected,
  onSelect,
  onMessage
}: {
  patron: Patron;
  isSelected: boolean;
  onSelect: () => void;
  onMessage: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}m ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'paused': return 'text-yellow-500 bg-yellow-500/10';
      case 'declined': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  return (
    <div className="p-4 hover:bg-gray-750 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Checkbox */}
        <div className="col-span-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded"
          />
        </div>

        {/* Patron Info */}
        <div className="col-span-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
            {patron.avatar ? (
              <img
                src={patron.avatar}
                alt={patron.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 40, 40)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white truncate">{patron.name}</h3>
            <p className="text-sm text-gray-400 truncate">{patron.email}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {new Date(patron.joined_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Tier */}
        <div className="col-span-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${patron.tier_color} mr-2`} />
            <span className="font-medium">{patron.tier}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {Math.round(patron.engagement_score * 100)}% engagement
          </div>
        </div>

        {/* Contribution */}
        <div className="col-span-2">
          <div className="text-sm font-medium">{formatCurrency(patron.monthly_amount)}/month</div>
          <div className="text-xs text-gray-400">
            {formatCurrency(patron.total_contributed)} total
          </div>
        </div>

        {/* Last Active */}
        <div className="col-span-2">
          <div className="text-sm">{getRelativeTime(patron.last_activity)}</div>
          <div className="text-xs text-gray-400">
            {formatWatchTime(patron.total_watch_time)} watched
          </div>
        </div>

        {/* Status */}
        <div className="col-span-1">
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(patron.status)}`}>
            {patron.status}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-1 relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg z-20 min-w-40">
              <button
                onClick={() => { onMessage(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </button>
              <button
                onClick={() => setShowMenu(false)}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-600 flex items-center"
              >
                <Gift className="h-4 w-4 mr-2" />
                Send Gift
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}