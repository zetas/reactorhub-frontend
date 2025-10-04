import React from 'react'
import { jest } from '@jest/globals'

// Mock Next.js router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
}

// Mock useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

// Mock Zustand stores
jest.mock('@/lib/store', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    setUser: jest.fn(),
    setToken: jest.fn(),
    logout: jest.fn(),
  })),
  useUIStore: jest.fn(() => ({
    isSidebarOpen: false,
    isSearchOpen: false,
    activeView: 'patron',
    toggleSidebar: jest.fn(),
    toggleSearch: jest.fn(),
    setActiveView: jest.fn(),
  })),
  useWatchStore: jest.fn(() => ({
    currentlyWatching: null,
    continueWatching: [],
    myList: [],
    updateProgress: jest.fn(),
    addToList: jest.fn(),
    removeFromList: jest.fn(),
    setContinueWatching: jest.fn(),
  })),
}))

// Mock API module
jest.mock('@/lib/api', () => ({
  auth: {
    connectCreatorPlatform: jest.fn(),
    getUser: jest.fn(),
    logout: jest.fn(),
  },
  creators: {
    list: jest.fn(),
    getContent: jest.fn(),
    getSeries: jest.fn(),
    getSeriesContent: jest.fn(),
  },
  content: {
    getDetails: jest.fn(),
    updateProgress: jest.fn(),
    markCompleted: jest.fn(),
  },
  patron: {
    getContinueWatching: jest.fn(),
    getRecentlyWatched: jest.fn(),
    getMyAccess: jest.fn(),
    verifyAccess: jest.fn(),
  },
  creatorDashboard: {
    getStats: jest.fn(),
    getContent: jest.fn(),
    uploadContent: jest.fn(),
    updateContent: jest.fn(),
    deleteContent: jest.fn(),
    getAnalytics: jest.fn(),
    getPatrons: jest.fn(),
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const MockIcon = ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="mock-icon" />
  )

  return new Proxy({}, {
    get: () => MockIcon,
  })
})

// Mock @headlessui/react
jest.mock('@headlessui/react', () => ({
  Menu: {
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Items: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Item: ({ children, ...props }: any) => <div {...props}>{children(props)}</div>,
  },
  Transition: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

export const resetMocks = () => {
  jest.clearAllMocks()
  mockRouter.push.mockClear()
  mockRouter.replace.mockClear()
  mockRouter.prefetch.mockClear()
}