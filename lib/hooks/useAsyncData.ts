import { useState, useEffect, useCallback } from 'react';

// Generic hook for async data fetching with loading states
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
}

// Hook specifically for loading states with mock data
export function useMockData<T>(
  mockDataFn: () => T,
  delay: number = 1000
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockDataFn());
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [mockDataFn, delay]);

  return { data, isLoading };
}