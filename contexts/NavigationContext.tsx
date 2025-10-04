'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Breadcrumb {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationState {
  currentSection: 'home' | 'patron' | 'creator';
  breadcrumbs: Breadcrumb[];
  canGoBack: boolean;
}

interface NavigationContextType {
  state: NavigationState;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  setBackUrl: (url: string) => void;
  goBack: () => void;
  navigateToSection: (section: 'home' | 'patron' | 'creator') => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [backUrl, setBackUrl] = useState<string | null>(null);

  // Determine current section based on pathname
  const getCurrentSection = useCallback((): 'home' | 'patron' | 'creator' => {
    if (pathname.startsWith('/creator')) return 'creator';
    if (pathname.startsWith('/patron') || pathname.startsWith('/dashboard')) return 'patron';
    return 'home';
  }, [pathname]);

  const [currentSection, setCurrentSection] = useState<'home' | 'patron' | 'creator'>(getCurrentSection());

  useEffect(() => {
    setCurrentSection(getCurrentSection());
  }, [pathname, getCurrentSection]);

  const handleGoBack = useCallback(() => {
    if (backUrl) {
      router.push(backUrl);
      return;
    }

    // Default back navigation based on current section
    if (currentSection === 'creator') {
      router.push('/creator/dashboard');
    } else if (currentSection === 'patron') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [backUrl, currentSection, router]);

  const handleNavigateToSection = useCallback((section: 'home' | 'patron' | 'creator') => {
    switch (section) {
      case 'creator':
        router.push('/creator/dashboard');
        break;
      case 'patron':
        router.push('/dashboard');
        break;
      case 'home':
        router.push('/');
        break;
    }
  }, [router]);

  const state: NavigationState = {
    currentSection,
    breadcrumbs,
    canGoBack: backUrl !== null,
  };

  const value: NavigationContextType = {
    state,
    setBreadcrumbs,
    setBackUrl,
    goBack: handleGoBack,
    navigateToSection: handleNavigateToSection,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
