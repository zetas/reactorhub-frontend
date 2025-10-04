'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Users, Clock, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function MobileNavigation() {
  const pathname = usePathname();

  // Only show mobile navigation for patron pages
  if (!pathname?.startsWith('/patron') && !pathname?.startsWith('/dashboard')) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Browse', href: '/patron/browse', icon: Film },
    { name: 'Subscriptions', href: '/patron/subscriptions', icon: Users },
    { name: 'History', href: '/patron/history', icon: Clock },
    { name: 'Profile', href: '/patron/account', icon: User },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 md:hidden safe-area-bottom"
      aria-label="Mobile navigation"
      role="navigation"
    >
      <div className="flex justify-around">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors touch-target min-w-0 flex-1',
              pathname === item.href
                ? 'text-red-600'
                : 'text-gray-400 hover:text-white active:text-red-400'
            )}
            aria-current={pathname === item.href ? 'page' : undefined}
            aria-label={`Navigate to ${item.name}`}
          >
            <item.icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}