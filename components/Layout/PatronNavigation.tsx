'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment, useRef, useEffect } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import {
  Home, Film, Users, Clock, Settings, Search, Bell, User, LogOut,
  Menu, X, Crown, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigation } from '@/contexts/NavigationContext';
import Breadcrumbs from './Breadcrumbs';
import MobileNavigation from './MobileNavigation';
import { ThemeToggle } from '@/components/ui';
import { useKeyboardNavigation, focusUtils } from '@/hooks/useKeyboardNavigation';
import NotificationDropdown from '@/components/Notifications/NotificationDropdown';

export default function PatronNavigation({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { navigateToSection } = useNavigation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for mobile sidebar
  useKeyboardNavigation({
    onEscape: () => {
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    },
    enabled: sidebarOpen
  });

  // Focus management for sidebar
  useEffect(() => {
    if (sidebarOpen && sidebarRef.current) {
      // Focus the first focusable element in the sidebar
      setTimeout(() => {
        focusUtils.focusFirst(sidebarRef.current!);
      }, 100);
    }
  }, [sidebarOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Subscriptions', href: '/patron/subscriptions', icon: Users },
    { name: 'Discover Creators', href: '/patron/browse', icon: Film },
    { name: 'Watch History', href: '/patron/history', icon: Clock },
    { name: 'Settings', href: '/patron/account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800" id="mobile-sidebar" ref={sidebarRef}>
            <SidebarContent navigation={navigation} pathname={pathname} closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col surface-secondary">
          <SidebarContent navigation={navigation} pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-2 sm:gap-x-4 border-b border-primary surface-primary mobile-padding shadow-sm safe-area-top">
          <button
            type="button"
            className="touch-target -m-2.5 p-2.5 text-tertiary hover:text-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </button>

          {/* Search */}
          <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 sm:w-5 text-tertiary ml-2 sm:ml-3" aria-hidden="true" />
              <input
                className="input h-full pl-8 sm:pl-10 pr-0 mobile-text"
                placeholder="Search creators, series, episodes..."
                type="search"
                aria-label="Search creators, series, and episodes"
                role="searchbox"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
            {/* Switch to Creator View */}
            <button
              onClick={() => navigateToSection('creator')}
              className="hidden sm:flex items-center space-x-1 text-sm text-tertiary hover:text-primary transition-colors touch-target"
              aria-label="Switch to creator dashboard view"
            >
              <Crown className="h-4 w-4" aria-hidden="true" />
              <span>Creator View</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="compact" className="text-tertiary hover:text-primary" />

            {/* Notifications */}
            <NotificationDropdown />

            {/* Profile dropdown */}
            <HeadlessMenu as="div" className="relative">
              <HeadlessMenu.Button 
                className="touch-target -m-1.5 flex items-center p-1.5"
                aria-label="Open user menu"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
                </div>
              </HeadlessMenu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-gray-700 focus:outline-none">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/patron/account"
                        className={clsx(
                          active ? 'bg-gray-700' : '',
                          'block px-4 py-2 text-sm text-gray-300 hover:text-white'
                        )}
                      >
                        Your Profile
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href="/patron/account"
                        className={clsx(
                          active ? 'bg-gray-700' : '',
                          'block px-4 py-2 text-sm text-gray-300 hover:text-white'
                        )}
                      >
                        Settings
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    <div className="px-4 py-2">
                      <div className="text-xs text-gray-400 mb-2">Theme</div>
                      <ThemeToggle variant="dropdown" />
                    </div>
                  </HeadlessMenu.Item>
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        className={clsx(
                          active ? 'bg-gray-700' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </HeadlessMenu.Items>
              </Transition>
            </HeadlessMenu>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4 sm:py-6 pb-20 md:pb-6 safe-area-bottom surface-primary">
          <div className="mobile-padding">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNavigation />
    </div>
  );
}

function SidebarContent({ 
  navigation, 
  pathname, 
  closeSidebar 
}: { 
  navigation: any[], 
  pathname: string | null,
  closeSidebar?: () => void 
}) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (closeSidebar && event.currentTarget.contains(event.target as Node)) {
      focusUtils.trapFocus(event.currentTarget as HTMLElement, event.nativeEvent);
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-primary">
        <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1 -m-1">
          <span className="text-xl font-bold text-red-600 drop-shadow-none">ReeActor</span>
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-medium">PATRON</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-4" aria-label="Main navigation">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item, index) => (
                <li key={item.name} className="animate-slide-in-left" style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={clsx(
                      pathname === item.href
                        ? 'surface-tertiary text-primary'
                        : 'text-secondary hover:text-primary hover:surface-tertiary',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 hover-lift'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    <item.icon className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}