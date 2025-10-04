'use client';

import { useRouter } from 'next/navigation';
import { CreatorSummary } from '@/lib/services/browse';
import { User } from 'lucide-react';

interface CreatorRowProps {
  title: string;
  creators: CreatorSummary[];
}

const formatPatronCount = (count?: number) => {
  if (count == null) return undefined;
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k patrons`;
  }
  return `${count} patrons`;
};

export default function CreatorRow({ title, creators }: CreatorRowProps) {
  const router = useRouter();

  if (creators.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-12" aria-labelledby={`creator-row-${title}`}>
      <div className="max-w-7xl mx-auto">
        <h2 id={`creator-row-${title}`} className="text-2xl font-semibold mb-4">
          {title}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent snap-x snap-mandatory">
          {creators.map((creator) => (
            <button
              key={creator.id}
              type="button"
              onClick={() => router.push(`/creator/${creator.slug ?? creator.id}`)}
              className="w-48 flex-shrink-0 snap-start space-y-3 rounded-xl bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 text-left transition hover:from-gray-800 hover:to-gray-700"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                {creator.thumbnail ? (
                  <img
                    src={creator.thumbnail}
                    alt={creator.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    <User className="h-10 w-10" aria-hidden />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm truncate">{creator.name}</p>
                {creator.campaignName && (
                  <p className="text-xs text-gray-400 truncate">{creator.campaignName}</p>
                )}
                {formatPatronCount(creator.patronCount) && (
                  <p className="text-xs text-gray-500">{formatPatronCount(creator.patronCount)}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
