import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, SubscriptionCategory, RecurrenceType, User } from '@/types';

interface SubscriptionStore {
  subscriptions: Subscription[];
  user: User | null;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  markAsPaid: (id: string) => void;
  setUser: (user: User) => void;
  getUpcomingBills: () => Subscription[];
  getTotalMonthlyAmount: () => number;
  getSpendingByCategory: () => Record<SubscriptionCategory, number>;
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
    }),
    {
      name: 'billpilot-storage',
    }
  )
);