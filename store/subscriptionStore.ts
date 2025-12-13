import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, SubscriptionCategory, RecurrenceType, User, SpendingAnalytics, Notification } from '@/types';
import api from '../services/api';

interface SubscriptionStore {
  subscriptions: Subscription[];
  user: User | null;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  // Local methods (existing functionality)
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  markAsPaid: (id: string) => void;
  setUser: (user: User) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  
  // API methods (new functionality)
  fetchSubscriptions: () => Promise<void>;
  createSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => Promise<void>;
  updateSubscriptionAPI: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscriptionAPI: (id: string) => Promise<void>;
  markAsPaidAPI: (id: string) => Promise<void>;
  
  // Utility methods
  getUpcomingBills: () => Subscription[];
  getTotalMonthlyAmount: () => number;
  getSpendingByCategory: () => Record<SubscriptionCategory, number>;
  getSavingsOpportunities: () => SpendingAnalytics['savingsOpportunities'];
  getBudgetInsights: () => SpendingAnalytics['budgetInsights'];
  checkForPriceIncreases: () => void;
  checkForTrialEnding: () => void;
  
  // Error handling
  clearError: () => void;
}

const categoryColors: Record<SubscriptionCategory, string> = {
  Entertainment: '#8B5CF6',
  Utilities: '#10B981',
  Rent: '#F59E0B',
  Education: '#3B82F6',
  Health: '#EF4444',
  Transport: '#6366F1',
  Food: '#F97316',
  Other: '#6B7280',
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      user: null,
      notifications: [],
      isLoading: false,
      error: null,
      
      // API Methods
      fetchSubscriptions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/subscriptions');
          set({ subscriptions: response.data.data, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to fetch subscriptions', 
            isLoading: false 
          });
        }
      },
      
      createSubscription: async (subscription) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/subscriptions', subscription);
          const newSubscription = response.data.data;
          set((state) => ({
            subscriptions: [...state.subscriptions, newSubscription],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to create subscription', 
            isLoading: false 
          });
        }
      },
      
      updateSubscriptionAPI: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(`/subscriptions/${id}`, updates);
          const updatedSubscription = response.data.data;
          set((state) => ({
            subscriptions: state.subscriptions.map((sub) =>
              sub.id === id ? updatedSubscription : sub
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to update subscription', 
            isLoading: false 
          });
        }
      },
      
      deleteSubscriptionAPI: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/subscriptions/${id}`);
          set((state) => ({
            subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to delete subscription', 
            isLoading: false 
          });
        }
      },
      
      markAsPaidAPI: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await api.patch(`/subscriptions/${id}/mark-paid`);
          set((state) => ({
            subscriptions: state.subscriptions.map((sub) =>
              sub.id === id ? { ...sub, isPaid: true } : sub
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to mark as paid', 
            isLoading: false 
          });
        }
      },
      
      // Local Methods (existing functionality - kept as fallback)
      addSubscription: (subscription) => {
        const newSubscription: Subscription = {
          ...subscription,
          id: Date.now().toString(),
          createdAt: new Date(),
          color: categoryColors[subscription.category],
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));
      },
      
      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        }));
      },
      
      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },
      
      markAsPaid: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, isPaid: true } : sub
          ),
        }));
      },
      
      setUser: (user) => {
        set({ user });
      },
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          ),
        }));
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      // Utility methods (existing functionality)
      getUpcomingBills: () => {
        const subscriptions = get().subscriptions;
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return subscriptions
          .filter((sub) => new Date(sub.nextDueDate) <= sevenDaysFromNow)
          .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
      },
      
      getTotalMonthlyAmount: () => {
        return get().subscriptions.reduce((total, sub) => {
          switch (sub.recurrence) {
            case 'Monthly':
              return total + sub.amount;
            case 'Yearly':
              return total + sub.amount / 12;
            case 'Weekly':
              return total + (sub.amount * 52) / 12;
            default:
              return total;
          }
        }, 0);
      },
      
      getSpendingByCategory: () => {
        const subscriptions = get().subscriptions;
        const spending: Record<SubscriptionCategory, number> = {
          Entertainment: 0,
          Utilities: 0,
          Rent: 0,
          Education: 0,
          Health: 0,
          Transport: 0,
          Food: 0,
          Other: 0,
        };
        
        subscriptions.forEach((sub) => {
          let monthlyAmount = sub.amount;
          if (sub.recurrence === 'Yearly') monthlyAmount = sub.amount / 12;
          if (sub.recurrence === 'Weekly') monthlyAmount = (sub.amount * 52) / 12;
          
          spending[sub.category] += monthlyAmount;
        });
        
        return spending;
      },

      getSavingsOpportunities: () => {
        const subscriptions = get().subscriptions;
        const now = new Date();
        
        return {
          unusedSubscriptions: subscriptions.filter(sub => 
            sub.createdAt < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) && 
            sub.amount > 0
          ),
          priceIncreases: subscriptions.filter(sub => 
            sub.previousAmount && sub.amount > sub.previousAmount
          ),
          trialEnding: subscriptions.filter(sub => 
            sub.isFreeTrial && sub.trialEndDate && 
            sub.trialEndDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
          ),
        };
      },

      getBudgetInsights: () => {
        const user = get().user;
        const totalMonthly = get().getTotalMonthlyAmount();
        
        if (!user) {
          return {
            percentageUsed: 0,
            remainingBudget: 0,
            overspending: false,
            recommendations: [],
          };
        }

        const percentageUsed = (totalMonthly / user.monthlyBudget) * 100;
        const remainingBudget = user.monthlyBudget - totalMonthly;
        const overspending = totalMonthly > user.monthlyBudget;

        const recommendations: string[] = [];
        if (overspending) {
          recommendations.push('Consider canceling unused subscriptions');
          recommendations.push('Review your entertainment subscriptions');
        }
        if (percentageUsed > 80) {
          recommendations.push('You\'re approaching your budget limit');
        }

        return {
          percentageUsed,
          remainingBudget,
          overspending,
          recommendations,
        };
      },

      checkForPriceIncreases: () => {
        const subscriptions = get().subscriptions;
        subscriptions.forEach(sub => {
          if (sub.previousAmount && sub.amount > sub.previousAmount) {
            const increase = sub.amount - sub.previousAmount;
            get().addNotification({
              type: 'price_increase',
              title: 'Price Increase Alert',
              message: `${sub.name} increased by ${increase.toFixed(2)}`,
              subscriptionId: sub.id,
              isRead: false,
            });
          }
        });
      },

      checkForTrialEnding: () => {
        const subscriptions = get().subscriptions;
        const now = new Date();
        subscriptions.forEach(sub => {
          if (sub.isFreeTrial && sub.trialEndDate) {
            const daysUntilTrialEnds = Math.ceil(
              (sub.trialEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
            );
            if (daysUntilTrialEnds <= 3 && daysUntilTrialEnds > 0) {
              get().addNotification({
                type: 'trial_ending',
                title: 'Free Trial Ending Soon',
                message: `${sub.name} free trial ends in ${daysUntilTrialEnds} days`,
                subscriptionId: sub.id,
                isRead: false,
              });
            }
          }
        });
      },
    }),
    {
      name: 'billpilot-storage',
    }
  )
);