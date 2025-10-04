'use client';

import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

export default function Breadcrumbs() {
  const { state, goBack } = useNavigation();

  if (state.breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
      {state.canGoBack && (
        <button
          onClick={goBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors mr-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      
      {state.breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" data-testid="chevron-right" />}
          
          {item.isActive ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}