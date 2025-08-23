export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: SubscriptionCategory;
  recurrence: RecurrenceType;
  nextDueDate: Date;
  startDate: Date;
  createdAt: Date;
  isPaid: boolean;
  color: string;
  description?: string;
  notes?: string;
  isFreeTrial?: boolean;
  trialEndDate?: Date;
  previousAmount?: number;
  autoRenew?: boolean;
  reminderDays?: number[];
}

export type SubscriptionCategory = 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Rent' 
  | 'Education' 
  | 'Health' 
  | 'Transport' 
  | 'Food' 
  | 'Other';

export type RecurrenceType = 'Weekly' | 'Monthly' | 'Yearly';

export interface User {
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
}

export interface SpendingAnalytics {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<SubscriptionCategory, number>;
  monthlyTrend: { month: string; amount: number }[];
  savingsOpportunities: {
    unusedSubscriptions: Subscription[];
    priceIncreases: Subscription[];
    trialEnding: Subscription[];
  };
  budgetInsights: {
    percentageUsed: number;
    remainingBudget: number;
    overspending: boolean;
    recommendations: string[];
  };
}

export interface Notification {
  id: string;
  type: 'reminder' | 'price_increase' | 'trial_ending' | 'overdue' | 'budget_alert';
  title: string;
  message: string;
  subscriptionId?: string;
  createdAt: Date;
  isRead: boolean;
  scheduledFor?: Date;
}