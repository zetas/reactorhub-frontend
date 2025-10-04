'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Lock, 
  Crown, 
  Heart, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Loader2,
  ExternalLink 
} from 'lucide-react';

interface PatronAccessData {
  hasAccess: boolean;
  requiredTier: string;
  requiredAmount: number;
  currentTier: string | null;
  currentAmount: number;
  isPatron: boolean;
  message: string;
}

interface PatronAuthProps {
  contentId: string;
  requiredTier: string;
  creatorId: string;
  onAccessGranted?: (accessData: PatronAccessData) => void;
  onAccessDenied?: (accessData: PatronAccessData) => void;
  onAuthRequired?: () => void;
  onError?: (error: { message: string; code?: string }) => void;
  loadingMessage?: string;
  showSuccessMessage?: boolean;
  showPatronInfo?: boolean;
  tierBenefits?: string[];
  forceRefresh?: boolean;
  cacheTimeout?: number;
  compact?: boolean;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  className?: string;
}

interface CacheEntry {
  data: PatronAccessData;
  timestamp: number;
}

// Simple in-memory cache
const accessCache = new Map<string, CacheEntry>();

// Export cache clearing function for testing
export const clearCache = () => {
  accessCache.clear();
};

export default function PatronAuth({
  contentId,
  requiredTier,
  creatorId,
  onAccessGranted,
  onAccessDenied,
  onAuthRequired,
  onError,
  loadingMessage = 'Checking access...',
  showSuccessMessage = false,
  showPatronInfo = false,
  tierBenefits = [],
  forceRefresh = false,
  cacheTimeout = 300000, // 5 minutes
  compact = false,
  theme,
  className = '',
}: PatronAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [accessData, setAccessData] = useState<PatronAccessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mountedRef = useRef(true);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Generate cache key
  const getCacheKey = useCallback(() => {
    return `${contentId}-${requiredTier}-${creatorId}`;
  }, [contentId, requiredTier, creatorId]);

  // Check access with caching
  const checkAccess = useCallback(async () => {
    if (!mountedRef.current) return;

    const cacheKey = getCacheKey();
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = accessCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        setAccessData(cached.data);
        setIsLoading(false);
        
        if (cached.data.hasAccess && onAccessGranted) {
          onAccessGranted(cached.data);
        } else if (!cached.data.hasAccess && onAccessDenied) {
          onAccessDenied(cached.data);
        }
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch('/api/patron/access-check', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contentId,
          requiredTier,
          creatorId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PatronAccessData = await response.json();
      
      if (!mountedRef.current) return;

      // Cache the result
      accessCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      setAccessData(data);
      setIsLoading(false);

      // Call appropriate callback
      if (data.hasAccess && onAccessGranted) {
        onAccessGranted(data);
      } else if (!data.hasAccess && onAccessDenied) {
        onAccessDenied(data);
      }

    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);

      if (onError) {
        onError({
          message: errorMessage,
          code: 'ACCESS_CHECK_FAILED',
        });
      }
    }
  }, [
    contentId,
    requiredTier,
    creatorId,
    forceRefresh,
    cacheTimeout,
    getCacheKey,
    onAccessGranted,
    onAccessDenied,
    onError,
  ]);

  // Initial access check
  useEffect(() => {
    checkAccess();
    
    return () => {
      mountedRef.current = false;
    };
  }, [checkAccess]);

  // Handle retry
  const handleRetry = () => {
    checkAccess();
  };

  // Handle upgrade click
  const handleUpgrade = () => {
    const upgradeUrl = `https://www.creator-platform.com/user?u=${creatorId}&fan_landing=true`;
    if (typeof window !== 'undefined') {
      window.open(upgradeUrl, '_blank');
    }
  };

  // Handle become patron click
  const handleBecomePatron = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      const patronUrl = `https://www.creator-platform.com/user?u=${creatorId}`;
      if (typeof window !== 'undefined') {
        window.open(patronUrl, '_blank');
      }
    }
  };

  // Apply custom theme
  const themeStyles = theme ? {
    '--primary-color': theme.primaryColor || '#ff424d',
    '--background-color': theme.backgroundColor || '#000000',
    '--text-color': theme.textColor || '#ffffff',
  } as React.CSSProperties : {};

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center p-6 bg-black/80 rounded-lg ${compact ? 'p-4' : ''} ${className}`}
        style={themeStyles}
        role="region"
        aria-label="Patron authentication"
        data-testid="patron-auth-loading"
      >
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
          <span className="text-white text-sm">{loadingMessage}</span>
        </div>
        <div role="status" aria-live="polite" className="sr-only">
          {loadingMessage}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`p-6 bg-red-900/20 border border-red-500/30 rounded-lg ${compact ? 'p-4' : ''} ${className}`}
        style={themeStyles}
        role="region"
        aria-label="Patron authentication"
        data-testid="error-state"
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-400 font-semibold">Something went wrong</h3>
        </div>
        <p className="text-red-300 text-sm mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          tabIndex={0}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
        <div role="status" aria-live="polite" className="sr-only">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!accessData) return null;

  // Access granted
  if (accessData.hasAccess) {
    if (showSuccessMessage) {
      return (
        <div
          className={`p-6 bg-green-900/20 border border-green-500/30 rounded-lg ${compact ? 'p-4' : ''} ${className}`}
          style={themeStyles}
          role="region"
          aria-label="Patron authentication"
          data-testid="access-granted"
        >
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-green-400 font-semibold">Access Granted</h3>
          </div>
          <p className="text-green-300 text-sm">You have access to this content!</p>
          
          {showPatronInfo && accessData.currentTier && (
            <div className="mt-4 p-3 bg-green-800/20 rounded-lg" data-testid="patron-info">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{accessData.currentTier} Patron</span>
              </div>
            </div>
          )}
          
          <div role="status" aria-live="polite" className="sr-only">
            Access granted. You can view this content.
          </div>
        </div>
      );
    }
    
    // Silent success - just call callback
    return null;
  }

  // Access denied - existing patron needs upgrade
  if (accessData.isPatron) {
    return (
      <div
        className={`p-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg ${compact ? 'p-4' : ''} ${isMobile ? 'mobile-layout' : ''} ${className}`}
        style={themeStyles}
        role="region"
        aria-label="Patron authentication"
        data-testid="upgrade-prompt"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h3 className="text-yellow-400 font-semibold text-lg">Upgrade Required</h3>
        </div>
        
        <p className="text-yellow-300 mb-4">
          {accessData.message || `You need to upgrade to ${accessData.requiredTier} tier to access this content.`}
        </p>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white text-sm">Current tier: <span className="font-semibold">{accessData.currentTier}</span></p>
            <p className="text-white text-sm">Required tier: <span className="font-semibold">{accessData.requiredTier}</span></p>
          </div>
        </div>
        
        <button
          onClick={handleUpgrade}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
          tabIndex={0}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Upgrade to {accessData.requiredTier}
        </button>
        
        <div role="status" aria-live="polite" className="sr-only">
          Upgrade required to {accessData.requiredTier} tier for access.
        </div>
      </div>
    );
  }

  // Access denied - not a patron
  return (
    <div
      className={`p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg ${compact ? 'p-4 compact' : ''} ${isMobile ? 'mobile-layout' : ''} ${className}`}
      style={themeStyles}
      role="region"
      aria-label="Patron authentication"
      data-testid="patron-signup"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600/20 rounded-full">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <h3 className="text-blue-400 font-semibold text-xl mb-2">Become a Patron</h3>
        <p className="text-blue-300 mb-6">
          Support this creator and get access to exclusive content starting at {accessData.requiredTier}.
        </p>
        
        {tierBenefits.length > 0 && (
          <div className="mb-6" data-testid="tier-benefits">
            <h4 className="text-white font-medium mb-3">What you'll get:</h4>
            <ul className="space-y-2">
              {tierBenefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2 text-blue-200 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          onClick={handleBecomePatron}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-4"
          tabIndex={0}
        >
          <Heart className="w-4 h-4 mr-2" />
          Become a Patron
        </button>
        
        <p className="text-blue-300 text-xs">
          Support this creator and unlock exclusive content
        </p>
      </div>
      
      <div role="status" aria-live="polite" className="sr-only">
        Patron access required. Become a patron to view this content.
      </div>
    </div>
  );
}