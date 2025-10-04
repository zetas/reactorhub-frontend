'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface ContentCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  progress?: number;
  duration?: string;
  type?: 'episode' | 'series' | 'movie';
  seriesName?: string;
  episodeNumber?: string;
  creatorName?: string;
  isPaid?: boolean;
  tierRequired?: number;
}

export default function ContentCard({
  id,
  title,
  thumbnail,
  progress = 0,
  duration,
  type = 'episode',
  seriesName,
  episodeNumber,
  creatorName,
  isPaid = false,
  tierRequired = 1,
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsInList(!isInList);
  };

  return (
    <Link
      href={`/watch/${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-800 rounded-md overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play data-testid="mock-icon" className="h-12 w-12 text-gray-600" />
            </div>
          )}

          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center space-x-2 mb-2" role="group" aria-label="content actions">
                  <button
                    aria-label="Play"
                    className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition"
                  >
                    <Play data-testid="mock-icon" className="h-4 w-4" fill="black" />
                  </button>
                  <button
                    onClick={handleAddToList}
                    aria-label={isInList ? 'Remove from My List' : 'Add to My List'}
                    className="bg-gray-800 border border-gray-600 text-white rounded-full p-2 hover:border-white transition"
                  >
                    {isInList ? (
                      <Check data-testid="mock-icon" className="h-4 w-4" />
                    ) : (
                      <Plus data-testid="mock-icon" className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    aria-label="More info"
                    className="bg-gray-800 border border-gray-600 text-white rounded-full p-2 hover:border-white transition"
                  >
                    <Info data-testid="mock-icon" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700" aria-hidden>
              <div
                role="progressbar"
                aria-label="watch progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.max(0, Math.round(progress)))}
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Paid Badge */}
          {isPaid && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              Tier {tierRequired}+
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
          {seriesName && (
            <p className="text-xs text-gray-400">{seriesName}</p>
          )}
          {episodeNumber && (
            <p className="text-xs text-gray-400">Episode {episodeNumber}</p>
          )}
          {creatorName && (
            <p className="text-xs text-gray-500">by {creatorName}</p>
          )}
          {duration && (
            <p className="text-xs text-gray-500">{duration}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
