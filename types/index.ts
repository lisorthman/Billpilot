export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: SubscriptionCategory;
  recurrence: RecurrenceType;
  nextDueDate: Date;
  createdAt: Date;
  isPaid: boolean;
  color: string;
  description?: string;
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
}

export interface SpendingAnalytics {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<SubscriptionCategory, number>;
  monthlyTrend: { month: string; amount: number }[];
}