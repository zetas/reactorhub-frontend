import { useQuery } from '@tanstack/react-query';
import { ContinueWatchingResponse } from '@/types/continueWatching';
import api from '@/lib/api';

const CONTINUE_WATCHING_KEY = 'continueWatching';
const REFETCH_INTERVAL = 30000; // 30 seconds

interface UseContinueWatchingOptions {
  limit?: number;
  enabled?: boolean;
}

export const useContinueWatching = (options: UseContinueWatchingOptions = {}) => {
  const { limit = 12, enabled = true } = options;

  return useQuery<ContinueWatchingResponse, Error>({
    queryKey: [CONTINUE_WATCHING_KEY, limit],
    queryFn: async () => {
      const response = await api.get<ContinueWatchingResponse>(
        `/patron/continue-watching?limit=${limit}`
      );
      return response.data;
    },
    enabled,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};

// Hook to update watch progress (for when user resumes watching)
export const useUpdateWatchProgress = () => {
  // This would integrate with React Query mutations
  // For now, just a placeholder that could call the Laravel API
  const updateProgress = async (
    contentId: string,
    progressSeconds: number,
    totalSeconds: number
  ) => {
    await api.post(`/patron/watch-progress`, {
      content_id: contentId,
      progress_seconds: progressSeconds,
      total_seconds: totalSeconds,
    });
  };

  return { updateProgress };
};
