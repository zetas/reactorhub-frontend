'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { clsx } from 'clsx';

export interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'compact';
  className?: string;
}

export function ThemeToggle({ variant = 'button', className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={clsx(
          'touch-target p-2 rounded-lg transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          className
        )}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-blue-600" />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    const themes = [
      { key: 'light', label: 'Light', icon: Sun },
      { key: 'dark', label: 'Dark', icon: Moon },
      { key: 'system', label: 'System', icon: Monitor },
    ] as const;

    return (
      <div 
        className={clsx('space-y-1', className)}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {themes.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={clsx(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
              'dark:focus:ring-offset-gray-900',
              theme === key
                ? 'bg-brand-primary text-white'
                : 'text-gray-700 dark:text-gray-300'
            )}
            aria-label={`Switch to ${label.toLowerCase()} theme`}
            aria-pressed={theme === key}
            role="radio"
            aria-checked={theme === key}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
            {theme === key && (
              <div className="ml-auto h-2 w-2 rounded-full bg-white" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Default button variant
  return (
    <div 
      className={clsx('flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1', className)}
      role="radiogroup"
      aria-label="Theme selection"
    >
      <button
        onClick={() => setTheme('light')}
        className={clsx(
          'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
        aria-label="Switch to light theme"
        aria-pressed={theme === 'light'}
        role="radio"
        aria-checked={theme === 'light'}
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
        <span>Light</span>
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={clsx(
          'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
        aria-label="Switch to dark theme"
        aria-pressed={theme === 'dark'}
        role="radio"
        aria-checked={theme === 'dark'}
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
        <span>Dark</span>
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={clsx(
          'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
        aria-label="Switch to system theme"
        aria-pressed={theme === 'system'}
        role="radio"
        aria-checked={theme === 'system'}
      >
        <Monitor className="h-4 w-4" aria-hidden="true" />
        <span>Auto</span>
      </button>
    </div>
  );
}

// Animated theme toggle for hero sections
export function AnimatedThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'relative touch-target p-3 rounded-full transition-all duration-300',
        'bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-600 dark:to-purple-600',
        'hover:scale-110 hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary',
        'dark:focus:ring-offset-gray-900',
        className
      )}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative" aria-hidden="true">
        <Sun 
          className={clsx(
            'h-5 w-5 text-white transition-all duration-300',
            resolvedTheme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          )}
        />
        <Moon 
          className={clsx(
            'absolute inset-0 h-5 w-5 text-white transition-all duration-300',
            resolvedTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          )}
        />
      </div>
    </button>
  );
}