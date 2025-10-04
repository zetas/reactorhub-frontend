import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

// Test component that uses the navigation context
function TestComponent() {
  const { state, setBreadcrumbs, setBackUrl, goBack, navigateToSection } = useNavigation();

  return (
    <div>
      <div data-testid="current-section">{state.currentSection}</div>
      <div data-testid="breadcrumbs-count">{state.breadcrumbs.length}</div>
      <div data-testid="can-go-back">{state.canGoBack.toString()}</div>
      
      <button
        data-testid="set-breadcrumbs"
        onClick={() => setBreadcrumbs([
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings', isActive: true }
        ])}
      >
        Set Breadcrumbs
      </button>
      
      <button
        data-testid="set-back-url"
        onClick={() => setBackUrl('/dashboard')}
      >
        Set Back URL
      </button>
      
      <button data-testid="go-back" onClick={goBack}>
        Go Back
      </button>
      
      <button
        data-testid="navigate-creator"
        onClick={() => navigateToSection('creator')}
      >
        Navigate to Creator
      </button>
    </div>
  );
}

describe('NavigationContext', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
    mockPush.mockClear();
  });

  it('should determine current section based on pathname', () => {
    mockUsePathname.mockReturnValue('/creator/dashboard');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('current-section')).toHaveTextContent('creator');
  });

  it('should set breadcrumbs correctly', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('breadcrumbs-count')).toHaveTextContent('0');
    
    fireEvent.click(screen.getByTestId('set-breadcrumbs'));
    
    expect(screen.getByTestId('breadcrumbs-count')).toHaveTextContent('2');
  });

  it('should handle back navigation with custom URL', () => {
    mockUsePathname.mockReturnValue('/patron/settings');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    fireEvent.click(screen.getByTestId('set-back-url'));
    expect(screen.getByTestId('can-go-back')).toHaveTextContent('true');
    
    fireEvent.click(screen.getByTestId('go-back'));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle default back navigation for creator section', () => {
    mockUsePathname.mockReturnValue('/creator/analytics');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    fireEvent.click(screen.getByTestId('go-back'));
    expect(mockPush).toHaveBeenCalledWith('/creator/dashboard');
  });

  it('should navigate to different sections', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    fireEvent.click(screen.getByTestId('navigate-creator'));
    expect(mockPush).toHaveBeenCalledWith('/creator/dashboard');
  });

  it('should detect patron section for /dashboard path', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('current-section')).toHaveTextContent('patron');
  });

  it('should detect home section for root path', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    expect(screen.getByTestId('current-section')).toHaveTextContent('home');
  });
});