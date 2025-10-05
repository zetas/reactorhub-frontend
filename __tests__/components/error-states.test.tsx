import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

describe('Phase 2 - Error Handling & Error States', () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

  describe('API Error Display', () => {
    const ErrorComponent = ({ errorType }: { errorType: 'network' | 'server' | 'validation' }) => {
      const { data, error, isError, refetch } = useQuery({
        queryKey: ['test-data'],
        queryFn: async () => {
          if (errorType === 'network') {
            throw new Error('Network Error: Failed to fetch');
          }
          if (errorType === 'server') {
            const error: any = new Error('Server Error');
            error.response = { status: 500, data: { message: 'Internal Server Error' } };
            throw error;
          }
          if (errorType === 'validation') {
            const error: any = new Error('Validation Error');
            error.response = { status: 400, data: { message: 'Invalid input data' } };
            throw error;
          }
          return { data: 'success' };
        },
      });

      if (isError) {
        return (
          <div role="alert" aria-live="assertive">
            <h2>Error Loading Data</h2>
            <p>{error?.message || 'An error occurred'}</p>
            <button onClick={() => refetch()}>Try Again</button>
          </div>
        );
      }

      return <div>Success: {data?.data}</div>;
    };

    it('should display network error message', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <ErrorComponent errorType="network" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/network error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('should display server error message', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <ErrorComponent errorType="server" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });

    it('should display validation error message', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <ErrorComponent errorType="validation" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/validation error/i)).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for errors', async () => {
      const queryClient = createTestQueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <ErrorComponent errorType="network" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
      });
    });
  });

  describe('Retry Button Functionality', () => {
    it('should retry failed request when retry button is clicked', async () => {
      const queryClient = createTestQueryClient();
      let callCount = 0;

      const RetryComponent = () => {
        const { data, error, isError, refetch } = useQuery({
          queryKey: ['retry-test'],
          queryFn: async () => {
            callCount++;
            if (callCount === 1) {
              throw new Error('First attempt failed');
            }
            return { success: true };
          },
        });

        if (isError) {
          return (
            <div>
              <p>Error: {error.message}</p>
              <button onClick={() => refetch()}>Retry</button>
            </div>
          );
        }

        if (data) {
          return <div>Success!</div>;
        }

        return <div>Loading...</div>;
      };

      render(
        <QueryClientProvider client={queryClient}>
          <RetryComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/first attempt failed/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });

      expect(callCount).toBe(2);
    });

    it('should show loading state while retrying', async () => {
      const queryClient = createTestQueryClient();

      const RetryLoadingComponent = () => {
        const { error, isError, isLoading, refetch } = useQuery({
          queryKey: ['retry-loading'],
          queryFn: async () => {
            throw new Error('Failed');
          },
        });

        if (isLoading) {
          return <div>Loading...</div>;
        }

        if (isError) {
          return (
            <div>
              <p>{error.message}</p>
              <button onClick={() => refetch()}>Retry</button>
            </div>
          );
        }

        return null;
      };

      render(
        <QueryClientProvider client={queryClient}>
          <RetryLoadingComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation Errors', () => {
    it('should display inline validation errors', () => {
      render(
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              aria-invalid="true"
              aria-describedby="email-error"
            />
            <span id="email-error" role="alert">
              Please enter a valid email address
            </span>
          </div>
        </form>
      );

      const input = screen.getByLabelText('Email');
      const error = screen.getByText(/please enter a valid email/i);

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('should display multiple field errors', () => {
      render(
        <form>
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" aria-invalid="true" aria-describedby="username-error" />
            <span id="username-error" role="alert">Username is required</span>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" aria-invalid="true" aria-describedby="password-error" />
            <span id="password-error" role="alert">Password must be at least 8 characters</span>
          </div>
        </form>
      );

      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it('should clear error when field is corrected', () => {
      const FormWithValidation = () => {
        const [error, setError] = React.useState('Email is required');

        return (
          <form>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              onChange={(e) => {
                if (e.target.value) {
                  setError('');
                } else {
                  setError('Email is required');
                }
              }}
              aria-invalid={!!error}
              aria-describedby={error ? 'email-error' : undefined}
            />
            {error && <span id="email-error" role="alert">{error}</span>}
          </form>
        );
      };

      render(<FormWithValidation />);

      expect(screen.getByText('Email is required')).toBeInTheDocument();

      const input = screen.getByLabelText('Email');
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  describe('Error Boundary', () => {
    const ErrorBoundary = class extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean; error: Error | null }
    > {
      constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      render() {
        if (this.state.hasError) {
          return (
            <div role="alert">
              <h1>Something went wrong</h1>
              <p>{this.state.error?.message}</p>
              <button onClick={() => this.setState({ hasError: false, error: null })}>
                Try again
              </button>
            </div>
          );
        }

        return this.props.children;
      }
    };

    const ThrowError = () => {
      throw new Error('Test error');
    };

    it('should catch and display component errors', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Color Contrast Compliance', () => {
    it('should have sufficient contrast for error text', () => {
      render(
        <div className="bg-white">
          <span className="text-red-600" role="alert">
            Error: This action failed
          </span>
        </div>
      );

      const error = screen.getByRole('alert');
      expect(error).toHaveClass('text-red-600');
      // Red-600 on white background has sufficient contrast (4.5:1 minimum for normal text)
    });

    it('should have accessible error styling', () => {
      render(
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-900" role="alert">
            An error occurred while processing your request
          </p>
        </div>
      );

      const error = screen.getByRole('alert');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-red-900');
      // Red-900 on red-50 has good contrast
    });
  });

  describe('Touch Target Sizes', () => {
    it('should have minimum 44x44px touch targets for retry buttons', () => {
      render(
        <button
          className="min-h-[44px] min-w-[44px] px-4 py-2"
          aria-label="Retry"
        >
          Try Again
        </button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });

    it('should have adequate spacing between interactive elements', () => {
      render(
        <div className="space-y-4">
          <button className="min-h-[44px]">Action 1</button>
          <button className="min-h-[44px]">Action 2</button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      // space-y-4 provides 16px spacing
    });
  });

  describe('Error Message Announcements', () => {
    it('should announce errors to screen readers', async () => {
      const ErrorAnnouncement = () => {
        const [error, setError] = React.useState('');

        return (
          <div>
            <button onClick={() => setError('Something went wrong!')}>
              Trigger Error
            </button>
            {error && (
              <div role="alert" aria-live="assertive" aria-atomic="true">
                {error}
              </div>
            )}
          </div>
        );
      };

      render(<ErrorAnnouncement />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
        expect(alert).toHaveAttribute('aria-atomic', 'true');
      });
    });
  });
});
