'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, Film, Image, Link, Calendar, Users, DollarSign,
  Eye, EyeOff, Settings, Play, X, Check, AlertCircle,
  Clock, Tag, BookOpen, Youtube, Twitch, Video
} from 'lucide-react';
import { creatorDashboard } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface UploadFormData {
  title: string;
  description: string;
  video_url: string;
  video_platform: 'youtube' | 'vimeo' | 'twitch';
  thumbnail: File | null;
  custom_thumbnail_url: string;
  type: 'episode' | 'movie';
  series_id: string;
  episode_number: number | null;
  season_number: number | null;
  is_premium: boolean;
  tier_access: string[];
  tags: string[];
  scheduled_at: string;
  status: 'draft' | 'published' | 'scheduled';
}

interface Series {
  id: string;
  title: string;
  slug: string;
  episode_count: number;
}

interface TierOption {
  id: string;
  name: string;
  color: string;
}

export default function ContentUploadPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    video_url: '',
    video_platform: 'youtube',
    thumbnail: null,
    custom_thumbnail_url: '',
    type: 'movie',
    series_id: '',
    episode_number: null,
    season_number: null,
    is_premium: false,
    tier_access: ['Free'],
    tags: [],
    scheduled_at: '',
    status: 'draft'
  });

  const [series, setSeries] = useState<Series[]>([]);
  const [tierOptions, setTierOptions] = useState<TierOption[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<{ url: string; platform: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'details' | 'media' | 'settings' | 'review'>('details');

  useEffect(() => {
    if (!user?.isCreator) {
      router.push('/creator/onboarding');
      return;
    }
    loadFormData();
  }, [user]);

  const loadFormData = async () => {
    try {
      // Mock data - in real app this would be API calls
      setSeries([
        {
          id: '1',
          title: 'Breaking Bad Complete Series',
          slug: 'breaking-bad',
          episode_count: 62
        },
        {
          id: '2',
          title: 'Marvel Cinematic Universe',
          slug: 'mcu',
          episode_count: 28
        },
        {
          id: '3',
          title: 'Studio Ghibli Collection',
          slug: 'ghibli',
          episode_count: 12
        }
      ]);

      setTierOptions([
        { id: 'free', name: 'Free', color: 'bg-gray-500' },
        { id: 'basic', name: 'Basic ($5)', color: 'bg-blue-500' },
        { id: 'premium', name: 'Premium ($10)', color: 'bg-purple-500' },
        { id: 'vip', name: 'VIP ($25)', color: 'bg-gold-500' }
      ]);
    } catch (error) {
      console.error('Failed to load form data:', error);
    }
  };

  const handleInputChange = (field: keyof UploadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, video_url: url }));

    // Auto-detect platform and set preview
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractVideoId(url, 'youtube');
      if (videoId) {
        setFormData(prev => ({ ...prev, video_platform: 'youtube' }));
        setVideoPreview({ url: `https://www.youtube.com/embed/${videoId}`, platform: 'youtube' });
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = extractVideoId(url, 'vimeo');
      if (videoId) {
        setFormData(prev => ({ ...prev, video_platform: 'vimeo' }));
        setVideoPreview({ url: `https://player.vimeo.com/video/${videoId}`, platform: 'vimeo' });
      }
    } else if (url.includes('twitch.tv')) {
      setFormData(prev => ({ ...prev, video_platform: 'twitch' }));
      setVideoPreview({ url, platform: 'twitch' });
    } else {
      setVideoPreview(null);
    }
  };

  const extractVideoId = (url: string, platform: 'youtube' | 'vimeo'): string | null => {
    if (platform === 'youtube') {
      const regexes = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      ];
      for (const regex of regexes) {
        const match = url.match(regex);
        if (match) return match[1];
      }
    } else if (platform === 'vimeo') {
      const regex = /(?:vimeo\.com\/)(\d+)/;
      const match = url.match(regex);
      if (match) return match[1];
    }
    return null;
  };

  const handleThumbnailUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.video_url.trim()) newErrors.video_url = 'Video URL is required';
    if (formData.type === 'episode' && !formData.series_id) {
      newErrors.series_id = 'Series selection is required for episodes';
    }
    if (formData.status === 'scheduled' && !formData.scheduled_at) {
      newErrors.scheduled_at = 'Schedule date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create FormData for file upload
      const uploadData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'thumbnail' && value instanceof File) {
          uploadData.append(key, value);
        } else if (key === 'tags' || key === 'tier_access') {
          uploadData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== '') {
          uploadData.append(key, value.toString());
        }
      });

      await creatorDashboard.uploadContent(uploadData);

      // Success - redirect to content management
      router.push('/creator/content');
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ general: 'Upload failed. Please try again.' });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center space-x-4 mb-8">
      {[
        { key: 'details', label: 'Details', icon: Film },
        { key: 'media', label: 'Media', icon: Image },
        { key: 'settings', label: 'Settings', icon: Settings },
        { key: 'review', label: 'Review', icon: Eye }
      ].map((step, index) => {
        const isActive = currentStep === step.key;
        const isCompleted = ['details', 'media', 'settings', 'review'].indexOf(currentStep) > index;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive
                  ? 'border-red-600 bg-red-600 text-white'
                  : isCompleted
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-600 text-gray-400'
              }`}
            >
              {isCompleted && !isActive ? (
                <Check className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                isActive ? 'text-red-600' : isCompleted ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
            {index < 3 && (
              <div
                className={`w-8 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  if (isLoading && uploadProgress > 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <Upload className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Uploading Content</h2>
              <p className="text-gray-400 mt-2">Please wait while we process your content...</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-400">
                {uploadProgress < 30 && 'Uploading files...'}
                {uploadProgress >= 30 && uploadProgress < 60 && 'Processing video...'}
                {uploadProgress >= 60 && uploadProgress < 90 && 'Generating thumbnails...'}
                {uploadProgress >= 90 && 'Finalizing...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Upload Content</h1>
            <p className="text-gray-400 mt-1">Share your latest reaction with your audience</p>
          </div>
          <button
            onClick={() => router.push('/creator/content')}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white transition"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-500">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg">
          {/* Details Step */}
          {currentStep === 'details' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Content Details</h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your video title..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your reaction, thoughts, or what viewers can expect..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="movie"
                        checked={formData.type === 'movie'}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="mr-2"
                      />
                      <span>Movie/Standalone</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="episode"
                        checked={formData.type === 'episode'}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="mr-2"
                      />
                      <span>Series Episode</span>
                    </label>
                  </div>
                </div>

                {/* Series Selection (if episode) */}
                {formData.type === 'episode' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Series *</label>
                      <select
                        value={formData.series_id}
                        onChange={(e) => handleInputChange('series_id', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      >
                        <option value="">Select a series...</option>
                        {series.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                      {errors.series_id && <p className="text-red-500 text-sm mt-1">{errors.series_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Season Number</label>
                        <input
                          type="number"
                          value={formData.season_number || ''}
                          onChange={(e) => handleInputChange('season_number', e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="1"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Episode Number</label>
                        <input
                          type="number"
                          value={formData.episode_number || ''}
                          onChange={(e) => handleInputChange('episode_number', e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="1"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add tags..."
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep('media')}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Next: Media
                </button>
              </div>
            </div>
          )}

          {/* Media Step */}
          {currentStep === 'media' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Media Content</h2>

              <div className="space-y-6">
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL *</label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">Supported platforms:</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-red-500">
                          <Youtube className="h-4 w-4 mr-1" />
                          YouTube
                        </div>
                        <div className="flex items-center text-blue-500">
                          <Video className="h-4 w-4 mr-1" />
                          Vimeo
                        </div>
                        <div className="flex items-center text-purple-500">
                          <Twitch className="h-4 w-4 mr-1" />
                          Twitch
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.video_url && <p className="text-red-500 text-sm mt-1">{errors.video_url}</p>}
                </div>

                {/* Video Preview */}
                {videoPreview && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Preview</label>
                    <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                      <iframe
                        src={videoPreview.url}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Thumbnail (Optional)</label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-red-600 cursor-pointer transition"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload thumbnail</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                      className="hidden"
                    />

                    {/* URL Alternative */}
                    <div className="text-center text-gray-500">or</div>
                    <input
                      type="url"
                      value={formData.custom_thumbnail_url}
                      onChange={(e) => handleInputChange('custom_thumbnail_url', e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />

                    {/* Thumbnail Preview */}
                    {(thumbnailPreview || formData.custom_thumbnail_url) && (
                      <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden max-w-md">
                        <img
                          src={thumbnailPreview || formData.custom_thumbnail_url}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('settings')}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Next: Settings
                </button>
              </div>
            </div>
          )}

          {/* Settings Step */}
          {currentStep === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Publishing Settings</h2>

              <div className="space-y-6">
                {/* Premium Content */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_premium}
                      onChange={(e) => {
                        handleInputChange('is_premium', e.target.checked);
                        if (!e.target.checked) {
                          handleInputChange('tier_access', ['Free']);
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="font-medium">Premium Content</span>
                  </label>
                  <p className="text-sm text-gray-400 mt-1">
                    Restrict access to paying patrons only
                  </p>
                </div>

                {/* Tier Access */}
                {formData.is_premium && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Available to Tiers</label>
                    <div className="space-y-2">
                      {tierOptions.filter(tier => tier.id !== 'free').map(tier => (
                        <label key={tier.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.tier_access.includes(tier.name)}
                            onChange={(e) => {
                              const newTiers = e.target.checked
                                ? [...formData.tier_access.filter(t => t !== 'Free'), tier.name]
                                : formData.tier_access.filter(t => t !== tier.name);
                              handleInputChange('tier_access', newTiers);
                            }}
                            className="mr-3"
                          />
                          <div className={`w-3 h-3 rounded-full ${tier.color} mr-2`} />
                          <span>{tier.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publishing Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Publishing Status</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="mr-3"
                      />
                      <span>Save as Draft</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="mr-3"
                      />
                      <span>Publish Immediately</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="scheduled"
                        checked={formData.status === 'scheduled'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="mr-3"
                      />
                      <span>Schedule for Later</span>
                    </label>
                  </div>
                </div>

                {/* Schedule Date */}
                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Schedule Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    {errors.scheduled_at && <p className="text-red-500 text-sm mt-1">{errors.scheduled_at}</p>}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep('media')}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('review')}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Review & Publish</h2>

              <div className="space-y-6">
                {/* Content Preview */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Content Preview</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Title:</p>
                      <p className="font-medium">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Type:</p>
                      <p className="font-medium capitalize">{formData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Platform:</p>
                      <p className="font-medium capitalize">{formData.video_platform}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Access:</p>
                      <p className="font-medium">
                        {formData.is_premium ? formData.tier_access.join(', ') : 'Free'}
                      </p>
                    </div>
                  </div>
                  {formData.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-400">Description:</p>
                      <p className="text-sm mt-1">{formData.description}</p>
                    </div>
                  )}
                  {formData.tags.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-400 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span key={tag} className="bg-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Publishing Info */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Publishing Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Status:</p>
                      <p className="font-medium capitalize">{formData.status}</p>
                    </div>
                    {formData.status === 'scheduled' && (
                      <div>
                        <p className="text-sm text-gray-400">Scheduled For:</p>
                        <p className="font-medium">
                          {new Date(formData.scheduled_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep('settings')}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : formData.status === 'published' ? 'Publish Now' : 'Save Content'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}