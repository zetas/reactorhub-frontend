'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, Users, ExternalLink, Calendar, Star } from 'lucide-react';

interface CreatorRequest {
  id: string;
  creator_name: string;
  youtube_channel?: string;
  creator_platform_url?: string;
  description?: string;
  request_count: number;
  status: 'pending' | 'contacted' | 'onboarded' | 'declined';
  last_requested_at: string;
}

interface RequestFormData {
  creator_name: string;
  youtube_channel: string;
  creator_platform_url: string;
  description: string;
}

export default function DiscoverPage() {
  const [mostRequested, setMostRequested] = useState<CreatorRequest[]>([]);
  const [searchResults, setSearchResults] = useState<CreatorRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RequestFormData>({
    creator_name: '',
    youtube_channel: '',
    creator_platform_url: '',
    description: ''
  });

  useEffect(() => {
    loadMostRequested();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchCreators();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadMostRequested = async () => {
    try {
      const response = await fetch('/api/v1/public/creator-requests/most-requested');
      if (response.ok) {
        const data = await response.json();
        setMostRequested(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load most requested creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCreators = async () => {
    try {
      const response = await fetch(`/api/v1/public/creator-requests/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      }
    } catch (error) {
      console.error('Failed to search creators:', error);
    }
  };

  const handleRequestCreator = async (creatorName: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        // Redirect to login
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch('/api/v1/creator-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ creator_name: creatorName })
      });

      if (response.ok) {
        // Refresh the data
        loadMostRequested();
        if (searchQuery.trim()) {
          searchCreators();
        }
      }
    } catch (error) {
      console.error('Failed to request creator:', error);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.creator_name.trim()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch('/api/v1/creator-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Reset form and close modal
        setFormData({
          creator_name: '',
          youtube_channel: '',
          creator_platform_url: '',
          description: ''
        });
        setShowRequestForm(false);
        
        // Refresh data
        loadMostRequested();
      }
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'onboarded': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover New Creators</h1>
          <p className="text-xl text-gray-300 mb-8">
            Help us bring your favorite creators to Reactor by requesting them below
          </p>
          
          <button
            onClick={() => setShowRequestForm(true)}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Request a Creator
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requested creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((request) => (
                <CreatorRequestCard
                  key={request.id}
                  request={request}
                  onRequest={() => handleRequestCreator(request.creator_name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Most Requested */}
        <div>
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-2xl font-bold">Most Requested Creators</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : mostRequested.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostRequested.map((request, index) => (
                <CreatorRequestCard
                  key={request.id}
                  request={request}
                  rank={index + 1}
                  onRequest={() => handleRequestCreator(request.creator_name)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No creator requests yet</p>
              <p className="text-gray-500">Be the first to request a creator!</p>
            </div>
          )}
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Request a Creator</h3>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Creator Name *</label>
                <input
                  type="text"
                  required
                  value={formData.creator_name}
                  onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Enter creator name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">YouTube Channel</label>
                <input
                  type="url"
                  value={formData.youtube_channel}
                  onChange={(e) => setFormData({ ...formData, youtube_channel: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://youtube.com/@creator"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Creator Platform URL</label>
                <input
                  type="url"
                  value={formData.creator_platform_url}
                  onChange={(e) => setFormData({ ...formData, creator_platform_url: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="https://creator-platform.com/creator"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  rows={3}
                  placeholder="Why would you like to see this creator on Reactor?"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CreatorRequestCard({ 
  request, 
  rank, 
  onRequest 
}: { 
  request: CreatorRequest; 
  rank?: number; 
  onRequest: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'onboarded': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {rank && (
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                #{rank}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-white mb-2">{request.creator_name}</h3>
          {request.description && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{request.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {request.request_count} requests
          </span>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(request.last_requested_at)}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {request.youtube_channel && (
            <a
              href={request.youtube_channel}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {request.creator_platform_url && (
            <a
              href={request.creator_platform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {request.status === 'pending' && (
          <button
            onClick={onRequest}
            className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            <Star className="h-3 w-3 mr-1" />
            +1
          </button>
        )}
      </div>
    </div>
  );
}