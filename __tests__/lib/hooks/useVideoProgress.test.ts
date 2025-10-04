import { renderHook, act, waitFor } from '@testing-library/react';
import { useVideoProgress } from '@/lib/hooks/useVideoProgress';
import { content as contentApi } from '@/lib/api';
import { useWatchStore } from '@/lib/store';

// Mock the API
jest.mock('@/lib/api', () => ({
  content: {
    getDetails: jest.fn(),
    updateProgress: jest.fn(),
    markCompleted: jest.fn()
  }
}));

// Mock the store
jest.mock('@/lib/store', () => ({
  useWatchStore: jest.fn()
}));

const mockContentApi = contentApi as jest.Mocked<typeof contentApi>;
const mockUseWatchStore = useWatchStore as jest.MockedFunction<typeof useWatchStore>;

describe('useVideoProgress', () => {
  const mockUpdateProgress = jest.fn();
  const contentId = 'test-content-id';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    mockUseWatchStore.mockReturnValue({
      updateProgress: mockUpdateProgress,
      currentlyWatching: null,
      continueWatching: [],
      myList: [],
      addToList: jest.fn(),
      removeFromList: jest.fn(),
      setContinueWatching: jest.fn()
    });

    mockContentApi.getDetails.mockResolvedValue({
      data: {
        data: {
          id: contentId,
          title: 'Test Video',
          watched_seconds: 30,
          duration_seconds: 300,
          is_completed: false,
          last_watched_at: '2023-01-01T00:00:00Z'
        }
      }
    } as any);

    mockContentApi.updateProgress.mockResolvedValue({ data: {} } as any);
    mockContentApi.markCompleted.mockResolvedValue({ data: {} } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial Loading', () => {
    it('loads progress data on mount', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.progress).toBeNull();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockContentApi.getDetails).toHaveBeenCalledWith(contentId);
      expect(result.current.progress).toEqual({
        contentId,
        watchedSeconds: 30,
        totalSeconds: 300,
        progressPercentage: 10,
        isCompleted: false,
        lastWatchedAt: new Date('2023-01-01T00:00:00Z')
      });
    });

    it('handles loading error', async () => {
      const errorMessage = 'Failed to load content';
      mockContentApi.getDetails.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.progress).toBeNull();
    });

    it('handles content without progress data', async () => {
      mockContentApi.getDetails.mockResolvedValue({
        data: {
          data: {
            id: contentId,
            title: 'Test Video'
            // No watched_seconds or duration_seconds
          }
        }
      } as any);

      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.progress).toBeNull();
    });
  });

  describe('Progress Updates', () => {
    it('updates progress locally', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ contentId, autoSave: false })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateProgress(60, 300);
      });

      expect(result.current.progress).toEqual({
        contentId,
        watchedSeconds: 60,
        totalSeconds: 300,
        progressPercentage: 20,
        isCompleted: false,
        lastWatchedAt: expect.any(Date)
      });
    });

    it('auto-saves progress when significant change occurs', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: true, 
          minProgressChange: 5,
          saveInterval: 1000
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update with significant change (30 -> 40 = 10 seconds change)
      await act(async () => {
        await result.current.updateProgress(40, 300);
      });

      // Fast-forward the debounce timer
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockContentApi.updateProgress).toHaveBeenCalledWith(contentId, 40, 300);
      });
    });

    it('does not auto-save for small progress changes', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: true, 
          minProgressChange: 10
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update with small change (30 -> 35 = 5 seconds change)
      await act(async () => {
        await result.current.updateProgress(35, 300);
      });

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockContentApi.updateProgress).not.toHaveBeenCalled();
    });

    it('marks as completed when threshold is reached', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          completionThreshold: 90,
          autoSave: true,
          minProgressChange: 1
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update to 90% completion
      await act(async () => {
        await result.current.updateProgress(270, 300);
      });

      expect(result.current.progress?.isCompleted).toBe(true);
      expect(result.current.progress?.progressPercentage).toBe(90);
    });

    it('updates store progress', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ contentId, autoSave: false })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateProgress(90, 300);
      });

      // Store should be updated with progress percentage (90/300 = 30%)
      expect(mockUpdateProgress).toHaveBeenCalledWith(contentId, 30);
    });
  });

  describe('Manual Actions', () => {
    it('marks content as completed', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markCompleted();
      });

      expect(mockContentApi.markCompleted).toHaveBeenCalledWith(contentId);
      expect(result.current.progress?.isCompleted).toBe(true);
      expect(result.current.progress?.progressPercentage).toBe(100);
      expect(mockUpdateProgress).toHaveBeenCalledWith(contentId, 100);
    });

    it('handles mark completed error', async () => {
      const errorMessage = 'Failed to mark completed';
      mockContentApi.markCompleted.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markCompleted();
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('resets progress', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.progress).toEqual({
        contentId,
        watchedSeconds: 0,
        totalSeconds: 300,
        progressPercentage: 0,
        isCompleted: false,
        lastWatchedAt: expect.any(Date)
      });
      expect(mockUpdateProgress).toHaveBeenCalledWith(contentId, 0);
    });

    it('saves progress immediately', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.saveProgress();
      });

      expect(mockContentApi.updateProgress).toHaveBeenCalledWith(contentId, 30, 300);
    });
  });

  describe('Debounced Saving', () => {
    it('debounces multiple rapid updates', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: true, 
          minProgressChange: 1,
          saveInterval: 1000
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Make multiple rapid updates
      await act(async () => {
        await result.current.updateProgress(35, 300);
        await result.current.updateProgress(40, 300);
        await result.current.updateProgress(45, 300);
      });

      // Only the last update should be saved after debounce
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockContentApi.updateProgress).toHaveBeenCalledTimes(1);
        expect(mockContentApi.updateProgress).toHaveBeenCalledWith(contentId, 45, 300);
      });
    });

    it('cancels previous debounced save when new update comes', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: true, 
          minProgressChange: 1,
          saveInterval: 1000
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateProgress(35, 300);
      });

      // Advance time partially
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Make another update before first one saves
      await act(async () => {
        await result.current.updateProgress(40, 300);
      });

      // Complete the debounce period
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockContentApi.updateProgress).toHaveBeenCalledTimes(1);
        expect(mockContentApi.updateProgress).toHaveBeenCalledWith(contentId, 40, 300);
      });
    });
  });

  describe('Error Handling', () => {
    it('handles save progress error', async () => {
      const errorMessage = 'Failed to save progress';
      mockContentApi.updateProgress.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.saveProgress();
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('clears error on successful operation', async () => {
      // First, cause an error
      mockContentApi.updateProgress.mockRejectedValue(new Error('Save failed'));

      const { result } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.saveProgress();
      });

      expect(result.current.error).toBe('Save failed');

      // Then, make it succeed
      mockContentApi.updateProgress.mockResolvedValue({ data: {} } as any);

      await act(async () => {
        await result.current.saveProgress();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Cleanup', () => {
    it('clears timeouts on unmount', () => {
      const { unmount } = renderHook(() => 
        useVideoProgress({ contentId })
      );

      // Just verify unmount doesn't throw errors
      expect(() => unmount()).not.toThrow();
    });

    it('saves pending progress on unmount', async () => {
      const { result, unmount } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: true, 
          minProgressChange: 1,
          saveInterval: 1000
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Make an update that would be debounced
      await act(async () => {
        await result.current.updateProgress(50, 300);
      });

      // Unmount before debounce completes
      unmount();

      // Should still save the pending progress
      expect(mockContentApi.updateProgress).toHaveBeenCalledWith(contentId, 50, 300);
    });
  });

  describe('Custom Options', () => {
    it('uses custom save interval', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: true, 
          minProgressChange: 1,
          saveInterval: 2000
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateProgress(35, 300);
      });

      // Should not save after 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(mockContentApi.updateProgress).not.toHaveBeenCalled();

      // Should save after 2 seconds
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockContentApi.updateProgress).toHaveBeenCalled();
      });
    });

    it('uses custom completion threshold', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          completionThreshold: 80
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Update to 80% completion
      await act(async () => {
        await result.current.updateProgress(240, 300);
      });

      expect(result.current.progress?.isCompleted).toBe(true);
    });

    it('respects autoSave false', async () => {
      const { result } = renderHook(() => 
        useVideoProgress({ 
          contentId, 
          autoSave: false,
          minProgressChange: 1
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateProgress(100, 300);
      });

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockContentApi.updateProgress).not.toHaveBeenCalled();
    });
  });
});