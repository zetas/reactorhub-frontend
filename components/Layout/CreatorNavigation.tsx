'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import {
  Home, BarChart3, Film, Users, Settings, RefreshCw, Bell, User, LogOut,
  Menu, X, Eye, HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigation } from '@/contexts/NavigationContext';
import Breadcrumbs from './Breadcrumbs';
import NotificationDropdown from '@/components/Notifications/NotificationDropdown';

export default function CreatorNavigation({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { navigateToSection } = useNavigation();

  const navigation = [
    { name: 'Dashboard', href: '/creator/dashboard', icon: Home },
    { name: 'Analytics', href: '/creator/analytics', icon: BarChart3 },
    { name: 'Content Library', href: '/creator/content', icon: Film },
    { name: 'Patrons', href: '/creator/patrons', icon: Users },
    { name: 'Sync Status', href: '/creator/sync', icon: RefreshCw },
    { name: 'Settings', href: '/creator/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800">
            <SidebarContent navigation={navigation} pathname={pathname} closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <SidebarContent navigation={navigation} pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          {/* Title */}
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold text-white">Creator Dashboard</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Switch to Patron View */}
            <button
              onClick={() => navigateToSection('patron')}
              className="hidden sm:flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Patron View</span>
            </button>

            {/* Help */}
            <button className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300">
              <span className="sr-only">Help</span>
              <HelpCircle className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Profile dropdown */}
            <HeadlessMenu as="div" className="relative">
              <HeadlessMenu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
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
                        href="/creator/settings"
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
                        href="/creator/settings"
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
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
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
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-700">
        <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md p-1 -m-1">
          <span className="text-xl font-bold text-red-600 drop-shadow-none">ReactorHub</span>
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-medium">CREATOR</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={clsx(
                      pathname === item.href
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}