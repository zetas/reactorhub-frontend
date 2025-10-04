'use client';

import { ContentSummary } from '@/lib/services/browse';
import ContentCard from '@/components/ContentCard';

interface ContentGridProps {
  title?: string;
  items: ContentSummary[];
  loading?: boolean;
  emptyMessage?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
}

export default function ContentGrid({
  title,
  items,
  loading = false,
  emptyMessage = 'No content available',
  columns = 4,
  showLoadMore = false,
  onLoadMore,
  loadMoreLabel = 'Load More',
}: ContentGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
      case 6: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 mb-10" aria-label="Loading content">
        <div className="max-w-7xl mx-auto">
          {title && (
            <h2 className="text-2xl font-semibold mb-6">{title}</h2>
          )}
          <div className={`grid ${getGridCols()} gap-4`}>
            {Array.from({ length: columns * 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video bg-gray-800 rounded-md animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 mb-10" aria-label="Empty content">
        <div className="max-w-7xl mx-auto">
          {title && (
            <h2 className="text-2xl font-semibold mb-6">{title}</h2>
          )}
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">{emptyMessage}</div>
            <p className="text-gray-500 text-sm">Try adjusting your filters or check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="px-4 sm:px-6 lg:px-8 mb-10" 
      aria-labelledby={title ? `grid-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined}
    >
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 id={`grid-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-2xl font-semibold mb-6">
            {title}
          </h2>
        )}
        
        <div className={`grid ${getGridCols()} gap-4 mb-8`}>
          {items.map((item) => (
            <div key={item.id} className="w-full">
              <ContentCard
                id={item.id}
                title={item.title}
                thumbnail={item.thumbnail ?? undefined}
                progress={item.progress}
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

        {showLoadMore && onLoadMore && (
          <div className="text-center">
            <button
              onClick={onLoadMore}
              type="button"
              className="inline-flex items-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-white bg-transparent hover:bg-gray-800 hover:border-gray-500 transition-colors"
            >
              {loadMoreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}