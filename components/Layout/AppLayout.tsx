'use client';

import { usePathname } from 'next/navigation';
import { NavigationProvider } from '@/contexts/NavigationContext';
import HomeNavbar from './HomeNavbar';
import PatronNavigation from './PatronNavigation';
import CreatorNavigation from './CreatorNavigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine which layout to use based on the current path
  const getLayoutType = () => {
    if (pathname?.startsWith('/creator')) {
      return 'creator';
    } else if (pathname?.startsWith('/patron') || pathname?.startsWith('/dashboard')) {
      return 'patron';
    } else if (pathname?.startsWith('/auth')) {
      return 'auth';
    } else {
      return 'home';
    }
  };

  const layoutType = getLayoutType();

  return (
    <NavigationProvider>
      {layoutType === 'home' && (
        <>
          <HomeNavbar />
          <div className="pt-16">
            {children}
          </div>
        </>
      )}
      
      {layoutType === 'patron' && (
        <PatronNavigation>
          {children}
        </PatronNavigation>
      )}
      
      {layoutType === 'creator' && (
        <CreatorNavigation>
          {children}
        </CreatorNavigation>
      )}
      
      {layoutType === 'auth' && (
        <div className="min-h-screen bg-gray-900">
          {children}
        </div>
      )}
    </NavigationProvider>
  );
}