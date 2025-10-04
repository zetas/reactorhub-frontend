'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark for ReactorHub
  };

  // Resolve the actual theme to apply
  const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Apply theme to document
  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#111827' : '#FFFFFF');
      }
    }
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reactorhub-theme', newTheme);
    }
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme from localStorage or default to system
    const savedTheme = (typeof window !== 'undefined' 
      ? localStorage.getItem('reactorhub-theme') as Theme 
      : null) || 'system';
    
    const resolved = resolveTheme(savedTheme);
    setThemeState(savedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (savedTheme === 'system') {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: 'system',
        resolvedTheme: 'dark',
        setTheme: () => {},
        toggleTheme: () => {},
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme-aware utility hooks
export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  
  return {
    // Surface colors
    surface: {
      primary: resolvedTheme === 'dark' ? '#111827' : '#FFFFFF',
      secondary: resolvedTheme === 'dark' ? '#1F2937' : '#F9FAFB',
      tertiary: resolvedTheme === 'dark' ? '#374151' : '#F3F4F6',
      elevated: resolvedTheme === 'dark' ? '#1F2937' : '#FFFFFF',
    },
    // Text colors
    text: {
      primary: resolvedTheme === 'dark' ? '#F9FAFB' : '#111827',
      secondary: resolvedTheme === 'dark' ? '#D1D5DB' : '#4B5563',
      tertiary: resolvedTheme === 'dark' ? '#9CA3AF' : '#6B7280',
      inverse: resolvedTheme === 'dark' ? '#111827' : '#FFFFFF',
    },
    // Border colors
    border: {
      primary: resolvedTheme === 'dark' ? '#374151' : '#E5E7EB',
      secondary: resolvedTheme === 'dark' ? '#4B5563' : '#D1D5DB',
      focus: resolvedTheme === 'dark' ? '#60A5FA' : '#3B82F6',
    },
  };
}