import axios from 'axios';
import { useAuthStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (data: { name: string; email: string; password: string; password_confirmation: string; account_type?: 'patron' | 'creator' }) => {
    const response = await api.post('/auth/register', { ...data, account_type: data.account_type || 'patron' });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  connectCreatorPlatform: (type: 'creator' | 'patron' = 'patron') => {
    // Store return URL for after OAuth
    localStorage.setItem('oauth_return', window.location.pathname);
    // Redirect to Laravel backend OAuth endpoint
    window.location.href = `${API_BASE_URL.replace('/api/v1', '')}/auth/patreon/${type}`;
  },

  handleOAuthCallback: async () => {
    // Exchange session token for API token
    try {
      const response = await api.post('/auth/exchange-token');
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        // Store user in zustand store
        useAuthStore.getState().setUser(response.data.user);
        useAuthStore.getState().setToken(response.data.token);

        // Redirect to stored return URL or appropriate dashboard
        const returnUrl = localStorage.getItem('oauth_return') ||
          (response.data.user.isCreator ? '/creator/dashboard' : '/dashboard');
        localStorage.removeItem('oauth_return');
        window.location.href = returnUrl;
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      window.location.href = '/auth/login?error=token_exchange_failed';
    }
  },

  connectDiscord: () => {
    window.location.href = `${API_BASE_URL.replace('/api/v1', '')}/auth/discord`;
  },

  connectGoogle: () => {
    window.location.href = `${API_BASE_URL.replace('/api/v1', '')}/auth/google`;
  },

  disconnectDiscord: () => api.post('/auth/discord/disconnect'),

  disconnectGoogle: () => api.post('/auth/google/disconnect'),

  getUser: () => api.get('/user'),

  logout: () => {
    localStorage.removeItem('auth_token');
    return api.post('/auth/logout');
  },
};

// Creator APIs
export const creators = {
  list: () => api.get('/creators'),

  getContent: (creatorId: string, params?: any) =>
    api.get(`/creators/${creatorId}/content`, { params }),

  getSeries: (creatorId: string) =>
    api.get(`/creators/${creatorId}/series`),

  getSeriesContent: (creatorId: string, seriesSlug: string) =>
    api.get(`/creators/${creatorId}/series/${seriesSlug}`),
};

// Content APIs
export const content = {
  getDetails: (contentId: string) =>
    api.get(`/content/${contentId}`),

  updateProgress: (contentId: string, watchedSeconds: number, totalSeconds?: number) =>
    api.post(`/content/${contentId}/progress`, {
      watched_seconds: watchedSeconds,
      total_seconds: totalSeconds,
    }),

  markCompleted: (contentId: string) =>
    api.post(`/content/${contentId}/mark-completed`),
};

// Patron APIs
export const patron = {
  getContinueWatching: () =>
    api.get('/patron/continue-watching'),

  getRecentlyWatched: () =>
    api.get('/patron/recently-watched'),

  getMyAccess: () =>
    api.get('/patron/my-access'),

  verifyAccess: (creatorId: string) =>
    api.post('/patron/verify-access', { creator_id: creatorId }),
};

// Creator Dashboard APIs
export const creatorDashboard = {
  getStats: () => api.get('/creator/stats'),

  getContent: (params?: any) =>
    api.get('/creator/content', { params }),

  uploadContent: (data: FormData) =>
    api.post('/creator/content', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateContent: (contentId: string, data: any) =>
    api.put(`/creator/content/${contentId}`, data),

  deleteContent: (contentId: string) =>
    api.delete(`/creator/content/${contentId}`),

  getAnalytics: (params?: any) =>
    api.get('/creator/analytics', { params }),

  getPatrons: (params?: any) =>
    api.get('/creator/patrons', { params }),
};

export default api;