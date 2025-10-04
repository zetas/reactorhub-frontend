import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/auth/login/page';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/lib/api');
jest.mock('@/lib/store');

const mockPush = jest.fn();
const mockSetUser = jest.fn();
const mockSetToken = jest.fn();
const mockConnectCreatorPlatform = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  
  (useAuthStore as jest.Mock).mockReturnValue({
    setUser: mockSetUser,
    setToken: mockSetToken,
  });

  (auth as any).connectCreatorPlatform = mockConnectCreatorPlatform;
  
  jest.clearAllMocks();
  
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

describe('Creator Platform OAuth Login', () => {
  it('should display account type selection', () => {
    render(<LoginPage />);

    expect(screen.getByText('Choose your account type')).toBeInTheDocument();
    expect(screen.getByText('I want to watch')).toBeInTheDocument();
    expect(screen.getByText("I'm a creator")).toBeInTheDocument();
  });

  it('should require account type selection before enabling login', () => {
    render(<LoginPage />);

    const loginButton = screen.getByText('Continue').closest('button');
    expect(loginButton).toBeDisabled();
  });

  it('should enable login button when patron type is selected', () => {
    render(<LoginPage />);

    const patronButton = screen.getByText('I want to watch');
    fireEvent.click(patronButton);

    const loginButton = screen.getByText('Sign in as Viewer').closest('button');
    expect(loginButton).not.toBeDisabled();
  });

  it('should enable login button when creator type is selected', () => {
    render(<LoginPage />);

    const creatorButton = screen.getByText("I'm a creator");
    fireEvent.click(creatorButton);

    const loginButton = screen.getByText('Sign in as Creator').closest('button');
    expect(loginButton).not.toBeDisabled();
  });

  it('should initiate Creator Platform OAuth for patron login', async () => {
    render(<LoginPage />);

    // Select patron type
    const patronButton = screen.getByText('I want to watch');
    fireEvent.click(patronButton);

    // Click login button
    const loginButton = screen.getByText('Sign in as Viewer').closest('button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('selected_account_type', 'patron');
      expect(mockConnectCreatorPlatform).toHaveBeenCalledWith('patron');
    });
  });

  it('should initiate Creator Platform OAuth for creator login', async () => {
    render(<LoginPage />);

    // Select creator type
    const creatorButton = screen.getByText("I'm a creator");
    fireEvent.click(creatorButton);

    // Click login button
    const loginButton = screen.getByText('Sign in as Creator').closest('button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('selected_account_type', 'creator');
      expect(mockConnectCreatorPlatform).toHaveBeenCalledWith('creator');
    });
  });

  it('should show loading state during OAuth redirect', async () => {
    render(<LoginPage />);

    // Select patron type
    const patronButton = screen.getByText('I want to watch');
    fireEvent.click(patronButton);

    // Click login button
    const loginButton = screen.getByText('Sign in as Viewer').closest('button');
    fireEvent.click(loginButton);

    // Should show connecting state
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('should display welcome back message', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('should have link to signup page', () => {
    render(<LoginPage />);
    
    const signupLink = screen.getByText('Sign up');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/auth/signup');
  });
});