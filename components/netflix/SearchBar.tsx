'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  autoFocus?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchBar({
  placeholder = 'Search content...',
  value = '',
  onChange,
  onSubmit,
  onClear,
  loading = false,
  autoFocus = false,
  className,
  size = 'md',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 text-sm';
      case 'md': return 'h-10 text-base';
      case 'lg': return 'h-12 text-lg';
      default: return 'h-10 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(internalValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('relative', className)}>
      <div
        className={clsx(
          'relative flex items-center',
          'bg-gray-900 border border-gray-700 rounded-lg',
          'transition-colors duration-200',
          isFocused ? 'border-white/50 bg-gray-800' : 'hover:border-gray-600',
          getSizeClasses()
        )}
      >
        <div className="absolute left-3 flex items-center pointer-events-none">
          <Search 
            className={clsx(getIconSize(), 'text-gray-400')} 
            aria-hidden="true"
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className={clsx(
            'w-full pl-10 pr-10 bg-transparent',
            'text-white placeholder-gray-400',
            'focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getSizeClasses()
          )}
          aria-label="Search"
        />

        {internalValue && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className={clsx(
              'absolute right-3 flex items-center justify-center',
              'text-gray-400 hover:text-white transition-colors',
              'focus:outline-none focus:text-white'
            )}
            aria-label="Clear search"
          >
            <X className={getIconSize()} />
          </button>
        )}

        {loading && (
          <div className="absolute right-3 flex items-center">
            <div
              className={clsx(
                'animate-spin rounded-full border-2 border-gray-600 border-t-white',
                size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </form>
  );
}

// Compact search bar for navigation
interface CompactSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function CompactSearchBar({ 
  onSearch, 
  placeholder = 'Search...' 
}: CompactSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsExpanded(false);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      {!isExpanded ? (
        <button
          onClick={handleToggle}
          className="p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query) setIsExpanded(false);
              }}
              placeholder={placeholder}
              className="w-48 h-8 pl-8 pr-8 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/50"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}