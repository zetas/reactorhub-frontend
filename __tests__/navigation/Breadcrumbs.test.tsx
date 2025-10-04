import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigation } from '@/contexts/NavigationContext';
import Breadcrumbs from '@/components/Layout/Breadcrumbs';

// Mock the navigation context
jest.mock('@/contexts/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockGoBack = jest.fn();

describe('Breadcrumbs', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  it('should render nothing when no breadcrumbs are set', () => {
    mockUseNavigation.mockReturnValue({
      state: {
        currentSection: 'patron',
        breadcrumbs: [],
        canGoBack: false,
      },
      setBreadcrumbs: jest.fn(),
      setBackUrl: jest.fn(),
      goBack: mockGoBack,
      navigateToSection: jest.fn(),
    });

    const { container } = render(<Breadcrumbs />);
    expect(container.firstChild).toBeNull();
  });

  it('should render breadcrumbs with back button when canGoBack is true', () => {
    mockUseNavigation.mockReturnValue({
      state: {
        currentSection: 'patron',
        breadcrumbs: [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings', isActive: true }
        ],
        canGoBack: true,
      },
      setBreadcrumbs: jest.fn(),
      setBackUrl: jest.fn(),
      goBack: mockGoBack,
      navigateToSection: jest.fn(),
    });

    render(<Breadcrumbs />);

    // Should show back button
    const backButton = screen.getByLabelText('Go back');
    expect(backButton).toBeInTheDocument();

    // Should show breadcrumb items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Active item should not be a link
    const activeItem = screen.getByText('Settings');
    expect(activeItem.tagName).toBe('SPAN');

    // Non-active item should be a link
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
  });

  it('should call goBack when back button is clicked', () => {
    mockUseNavigation.mockReturnValue({
      state: {
        currentSection: 'creator',
        breadcrumbs: [
          { label: 'Dashboard', href: '/creator/dashboard' },
          { label: 'Analytics', href: '/creator/analytics', isActive: true }
        ],
        canGoBack: true,
      },
      setBreadcrumbs: jest.fn(),
      setBackUrl: jest.fn(),
      goBack: mockGoBack,
      navigateToSection: jest.fn(),
    });

    render(<Breadcrumbs />);

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should render breadcrumbs without back button when canGoBack is false', () => {
    mockUseNavigation.mockReturnValue({
      state: {
        currentSection: 'patron',
        breadcrumbs: [
          { label: 'Dashboard', href: '/dashboard', isActive: true }
        ],
        canGoBack: false,
      },
      setBreadcrumbs: jest.fn(),
      setBackUrl: jest.fn(),
      goBack: mockGoBack,
      navigateToSection: jest.fn(),
    });

    render(<Breadcrumbs />);

    // Should not show back button
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();

    // Should show breadcrumb item
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render multiple breadcrumb items with separators', () => {
    mockUseNavigation.mockReturnValue({
      state: {
        currentSection: 'creator',
        breadcrumbs: [
          { label: 'Dashboard', href: '/creator/dashboard' },
          { label: 'Content', href: '/creator/content' },
          { label: 'Upload', href: '/creator/content/upload', isActive: true }
        ],
        canGoBack: false,
      },
      setBreadcrumbs: jest.fn(),
      setBackUrl: jest.fn(),
      goBack: mockGoBack,
      navigateToSection: jest.fn(),
    });

    render(<Breadcrumbs />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();

    // Should have chevron separators (2 separators for 3 items)
    const chevrons = screen.getAllByTestId('chevron-right');
    expect(chevrons).toHaveLength(2);
  });
});