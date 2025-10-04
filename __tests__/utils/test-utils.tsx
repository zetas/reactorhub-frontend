import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Custom render with router mock
export const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const RouterProvider = ({ children }: { children: React.ReactNode }) => {
    return <AllTheProviders>{children}</AllTheProviders>
  }

  return render(ui, { wrapper: RouterProvider, ...options })
}

// Mock data generators
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  isCreator: false,
  creatorPlatformConnected: true,
}

export const mockCreator = {
  id: '1',
  name: 'Test Creator',
  avatar: 'https://example.com/avatar.jpg',
  description: 'A test creator',
  patron_count: 100,
}

export const mockContentItem = {
  id: '1',
  title: 'Test Episode',
  thumbnail: 'https://example.com/thumbnail.jpg',
  duration: '10:30',
  type: 'episode' as const,
  series_name: 'Test Series',
  episode_number: '1',
  creator_name: 'Test Creator',
  watched_seconds: 300,
  total_seconds: 630,
  progress: 47,
}

// Helper functions
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {}

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

export const mockAxiosResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
})