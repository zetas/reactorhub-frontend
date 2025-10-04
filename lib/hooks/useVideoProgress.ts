import { useState, useEffect, useCallback, useRef } from 'react';
import { content as contentApi } from '@/lib/api';
import { useWatchStore } from '@/lib/store';

export interface VideoProgressData {
  contentId: string;
  watchedSeconds: number;
  totalSeconds: number;
  progressPercentage: number;
  isCompleted: boolean;
  lastWatchedAt: Date;
}

export interface UseVideoProgressOptions {
  /** Content ID */
  contentId: string;
  /** How often to save progress (in milliseconds) */
  saveInterval?: number;
  /** Minimum progress change to trigger save (in seconds) */
  minProgressChange?: number;
  /** Auto-mark as completed when reaching this percentage */
  completionThreshold?: number;
  /** Whether to automatically save progress */
  autoSave?: boolean;
}

export interface UseVideoProgressReturn {
  /** Current progress data */
  progress: VideoProgressData | null;
  /** Whether progress is being loaded */
  isLoading: boolean;
  /** Whether progress is being saved */
  isSaving: boolean;
  /** Error message if any */
  error: string | null;
  /** Update progress manually */
  updateProgress: (watchedSeconds: number, totalSeconds: number) => Promise<void>;
  /** Mark content as completed */
  markCompleted: () => Promise<void>;
  /** Reset progress */
  resetProgress: () => void;
  /** Save current progress immediately */
  saveProgress: () => Promise<void>;
}

export const useVideoProgress = ({
  contentId,
  saveInterval = 10000, // 10 seconds
  minProgressChange = 5, // 5 seconds
  completionThreshold = 90, // 90%
  autoSave = true
}: UseVideoProgressOptions): UseVideoProgressReturn => {
  const [progress, setProgress] = useState<VideoProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateProgress: updateStoreProgress } = useWatchStore();
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedProgressRef = useRef<number>(0);
  const pendingProgressRef = useRef<{ watchedSeconds: number; totalSeconds: number } | null>(null);

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, you'd fetch the progress from the API
        // For now, we'll simulate it
        const response = await contentApi.getDetails(contentId);
        const contentData = response.data.data;
        
        if (contentData.watched_seconds !== undefined) {
          const progressData: VideoProgressData = {
            contentId,
            watchedSeconds: contentData.watched_seconds || 0,
            totalSeconds: contentData.duration_seconds || 0,
            progressPercentage: contentData.duration_seconds 
              ? (contentData.watched_seconds / contentData.duration_seconds) * 100 
              : 0,
            isCompleted: contentData.is_completed || false,
            lastWatchedAt: contentData.last_watched_at ? new Date(contentData.last_watched_at) : new Date()
          };
          setProgress(progressData);
          lastSavedProgressRef.current = progressData.watchedSeconds;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load progress');
        console.error('Failed to load video progress:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (contentId) {
      loadProgress();
    }
  }, [contentId]);

  // Save progress to backend
  const saveProgressToBackend = useCallback(async (watchedSeconds: number, totalSeconds: number) => {
    try {
      setIsSaving(true);
      setError(null);

      await contentApi.updateProgress(contentId, watchedSeconds, totalSeconds);
      
      const progressPercentage = totalSeconds > 0 ? (watchedSeconds / totalSeconds) * 100 : 0;
      const isCompleted = progressPercentage >= completionThreshold;

      const updatedProgress: VideoProgressData = {
        contentId,
        watchedSeconds,
        totalSeconds,
        progressPercentage,
        isCompleted,
        lastWatchedAt: new Date()
      };

      setProgress(updatedProgress);
      updateStoreProgress(contentId, progressPercentage);
      lastSavedProgressRef.current = watchedSeconds;

      // Auto-mark as completed if threshold reached
      if (isCompleted && !progress?.isCompleted) {
        await contentApi.markCompleted(contentId);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save progress');
      console.error('Failed to save video progress:', err);
    } finally {
      setIsSaving(false);
    }
  }, [contentId, completionThreshold, progress?.isCompleted, updateStoreProgress]);

  // Debounced save function
  const debouncedSave = useCallback((watchedSeconds: number, totalSeconds: number) => {
    pendingProgressRef.current = { watchedSeconds, totalSeconds };

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const pending = pendingProgressRef.current;
      if (pending) {
        saveProgressToBackend(pending.watchedSeconds, pending.totalSeconds);
        pendingProgressRef.current = null;
      }
    }, saveInterval);
  }, [saveInterval, saveProgressToBackend]);

  // Update progress
  const updateProgress = useCallback(async (watchedSeconds: number, totalSeconds: number) => {
    const progressChange = Math.abs(watchedSeconds - lastSavedProgressRef.current);
    
    // Update local state immediately
    const progressPercentage = totalSeconds > 0 ? (watchedSeconds / totalSeconds) * 100 : 0;
    const isCompleted = progressPercentage >= completionThreshold;

    const updatedProgress: VideoProgressData = {
      contentId,
      watchedSeconds,
      totalSeconds,
      progressPercentage,
      isCompleted,
      lastWatchedAt: new Date()
    };

    setProgress(updatedProgress);
    updateStoreProgress(contentId, progressPercentage);

    // Save to backend if auto-save is enabled and significant progress change
    if (autoSave && progressChange >= minProgressChange) {
      debouncedSave(watchedSeconds, totalSeconds);
    }
  }, [contentId, completionThreshold, autoSave, minProgressChange, debouncedSave, updateStoreProgress]);

  // Mark as completed
  const markCompleted = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);

      await contentApi.markCompleted(contentId);

      if (progress) {
        const completedProgress: VideoProgressData = {
          ...progress,
          progressPercentage: 100,
          isCompleted: true,
          lastWatchedAt: new Date()
        };
        setProgress(completedProgress);
        updateStoreProgress(contentId, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as completed');
      console.error('Failed to mark video as completed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [contentId, progress, updateStoreProgress]);

  // Reset progress
  const resetProgress = useCallback(() => {
    const resetProgressData: VideoProgressData = {
      contentId,
      watchedSeconds: 0,
      totalSeconds: progress?.totalSeconds || 0,
      progressPercentage: 0,
      isCompleted: false,
      lastWatchedAt: new Date()
    };
    setProgress(resetProgressData);
    lastSavedProgressRef.current = 0;
    updateStoreProgress(contentId, 0);
  }, [contentId, progress?.totalSeconds, updateStoreProgress]);

  // Save progress immediately
  const saveProgress = useCallback(async () => {
    if (progress) {
      await saveProgressToBackend(progress.watchedSeconds, progress.totalSeconds);
    }
  }, [progress, saveProgressToBackend]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save any pending progress
      const pending = pendingProgressRef.current;
      if (pending && autoSave) {
        saveProgressToBackend(pending.watchedSeconds, pending.totalSeconds);
      }
    };
  }, [autoSave, saveProgressToBackend]);

  return {
    progress,
    isLoading,
    isSaving,
    error,
    updateProgress,
    markCompleted,
    resetProgress,
    saveProgress
  };
};