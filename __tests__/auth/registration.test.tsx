import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignupPage from '@/app/auth/signup/page';
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

describe('Creator Platform OAuth Signup', () => {
  it('should display account type selection', () => {
    render(<SignupPage />);
    
    expect(screen.getByText('Choose your account type')).toBeInTheDocument();
    expect(screen.getByText('I want to watch')).toBeInTheDocument();
    expect(screen.getByText("I'm a creator")).toBeInTheDocument();
  });

  it('should require account type selection before enabling signup', () => {
    render(<SignupPage />);

    // Find the button element that contains the "Continue" text
    const signupButton = screen.getByText('Continue').closest('button');
    expect(signupButton).toBeDisabled();
    expect(screen.getByText('Please select your account type first')).toBeInTheDocument();
  });

  it('should enable signup button when patron type is selected', () => {
    render(<SignupPage />);

    const patronButton = screen.getByText('I want to watch');
    fireEvent.click(patronButton);

    const signupButton = screen.getByText('Join as a Viewer').closest('button');
    expect(signupButton).not.toBeDisabled();
  });

  it('should enable signup button when creator type is selected', () => {
    render(<SignupPage />);

    const creatorButton = screen.getByText("I'm a creator");
    fireEvent.click(creatorButton);

    const signupButton = screen.getByText('Continue as Creator').closest('button');
    expect(signupButton).not.toBeDisabled();
  });

  it('should initiate Creator Platform OAuth for patron signup', async () => {
    render(<SignupPage />);

    // Select patron type
    const patronButton = screen.getByText('I want to watch');
    fireEvent.click(patronButton);

    // Click signup button
    const signupButton = screen.getByText('Join as a Viewer').closest('button');
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('selected_account_type', 'patron');
      expect(mockConnectCreatorPlatform).toHaveBeenCalledWith('patron');
    });
  });

  it('should initiate Creator Platform OAuth for creator signup', async () => {
    render(<SignupPage />);

    // Select creator type
    const creatorButton = screen.getByText("I'm a creator");
    fireEvent.click(creatorButton);

    // Click signup button
    const signupButton = screen.getByText('Continue as Creator').closest('button');
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('selected_account_type', 'creator');
      expect(mockConnectCreatorPlatform).toHaveBeenCalledWith('creator');
    });
  });

  it('should show loading state during OAuth redirect', async () => {
    render(<SignupPage />);

    // Select patron type
    const patronButton = screen.getByText('I want to watch');
    fireEvent.click(patronButton);

    // Click signup button
    const signupButton = screen.getByText('Join as a Viewer').closest('button');
    fireEvent.click(signupButton);

    // Should show connecting state
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });
});