import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  isCreator: boolean;
  creatorPlatformConnected: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
        set({ token });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  activeView: 'patron' | 'creator';
  toggleSidebar: () => void;
  toggleSearch: () => void;
  setActiveView: (view: 'patron' | 'creator') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  activeView: 'patron',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setActiveView: (view) => set({ activeView: view }),
}));

interface WatchState {
  currentlyWatching: {
    contentId: string;
    progress: number;
    timestamp: number;
  } | null;
  continueWatching: any[];
  myList: string[];
  updateProgress: (contentId: string, progress: number) => void;
  addToList: (contentId: string) => void;
  removeFromList: (contentId: string) => void;
  setContinueWatching: (items: any[]) => void;
}

export const useWatchStore = create<WatchState>()(
  persist(
    (set) => ({
      currentlyWatching: null,
      continueWatching: [],
      myList: [],
      updateProgress: (contentId, progress) =>
        set({
          currentlyWatching: {
            contentId,
            progress,
            timestamp: Date.now(),
          },
        }),
      addToList: (contentId) =>
        set((state) => ({
          myList: [...state.myList.filter((id) => id !== contentId), contentId],
        })),
      removeFromList: (contentId) =>
        set((state) => ({
          myList: state.myList.filter((id) => id !== contentId),
        })),
      setContinueWatching: (items) => set({ continueWatching: items }),
    }),
    {
      name: 'watch-storage',
      partialize: (state) => ({ myList: state.myList, currentlyWatching: state.currentlyWatching }),
    }
  )
);