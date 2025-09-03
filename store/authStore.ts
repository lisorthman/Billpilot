import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  avatar?: string;
  notificationPreferences: {
    reminderDays: number[];
    priceIncreaseAlerts: boolean;
    trialEndAlerts: boolean;
    overdueAlerts: boolean;
  };
  currency: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    monthlyBudget: number;
    currency?: string;
    timezone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data.data;
          
          // Store token in AsyncStorage
          await AsyncStorage.setItem('authToken', token);
          
          set({ user, token, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Login failed', 
            isLoading: false 
          });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data.data;
          
          await AsyncStorage.setItem('authToken', token);
          
          set({ user, token, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Registration failed', 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          await AsyncStorage.removeItem('authToken');
        } catch (error) {
          console.error('Error removing auth token:', error);
        }
        set({ user: null, token: null });
      },
      
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.data, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to fetch profile', 
            isLoading: false 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'billpilot-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

