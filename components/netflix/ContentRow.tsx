'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { ContentSummary } from '@/lib/services/browse';
import ContentCard from '@/components/ContentCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface ContentRowProps {
  title: string;
  items: ContentSummary[];
  actionLabel?: string;
  onActionClick?: () => void;
  trailingAction?: ReactNode;
  enableScrollButtons?: boolean;
  showProgress?: boolean;
  onItemClick?: (item: ContentSummary) => void;
  onItemHover?: (item: ContentSummary) => void;
  onItemHoverLeave?: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function ContentRow({
  title,
  items,
  actionLabel = 'View All',
  onActionClick,
  trailingAction,
  enableScrollButtons = false,
  showProgress = false,
  onItemClick,
  onItemHover,
  onItemHoverLeave,
  isLoading = false,
  error,
}: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Update scroll button states
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current || !enableScrollButtons) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Initialize scroll button states
  useEffect(() => {
    if (enableScrollButtons) {
      // Set initial state - assume we can scroll right if we have items
      setCanScrollRight(items.length > 0);
      setCanScrollLeft(false);
      
      // Update based on actual scroll state
      setTimeout(updateScrollButtons, 0);
    }
  }, [items, enableScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = isMobile ? 300 : 600;
    const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;
    
    container.scrollBy({
      left: scrollValue,
      behavior: 'smooth'
    });
  };

  const handleItemClick = (item: ContentSummary) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleItemHover = (item: ContentSummary) => {
    if (onItemHover) {
      onItemHover(item);
    }
  };

  const handleItemHoverLeave = () => {
    if (onItemHoverLeave) {
      onItemHoverLeave();
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex gap-4" data-testid="content-row-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-60 flex-shrink-0">
                <div className="aspect-video bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-10" aria-labelledby={`row-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 id={`row-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-2xl font-semibold">
            {title}
          </h2>
          {(onActionClick || trailingAction) && (
            <div className="flex items-center space-x-3">
              {trailingAction}
              {onActionClick && (
                <button
                  onClick={onActionClick}
                  type="button"
                  className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {actionLabel}
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          {/* Scroll buttons */}
          {enableScrollButtons && (
            <>
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 rounded-full p-2 transition-all duration-200 ${
                  !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                } hidden sm:flex items-center justify-center`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 rounded-full p-2 transition-all duration-200 ${
                  !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
                } hidden sm:flex items-center justify-center`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent snap-x snap-mandatory"
            onScroll={updateScrollButtons}
            data-testid="scroll-container"
          >
            {items.map((item) => (
              <div 
                key={item.id} 
                className="w-60 flex-shrink-0 snap-start"
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => handleItemHover(item)}
                onMouseLeave={handleItemHoverLeave}
              >
                <ContentCard
                  id={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail ?? undefined}
                  progress={showProgress ? item.progress : undefined}
                  duration={item.durationLabel}
                  seriesName={item.seriesName ?? undefined}
                  episodeNumber={item.episodeLabel ?? undefined}
                  creatorName={item.creatorName ?? undefined}
                  isPaid={item.isPaid}
                  tierRequired={item.tierRequired ?? undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
