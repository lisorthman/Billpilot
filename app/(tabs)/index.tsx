import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { formatCurrency } from '@/utils/formatters';
import { Plus, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { 
    subscriptions, 
    user, 
    setUser, 
    getUpcomingBills, 
    getTotalMonthlyAmount,
    addSubscription 
  } = useSubscriptionStore();

  useEffect(() => {
    // Initialize demo user and data
    if (!user) {
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        monthlyBudget: 500,
      });
    }

    // Add demo subscriptions if empty
    if (subscriptions.length === 0) {
      const demoSubscriptions = [
        {
          name: 'Netflix',
          amount: 15.99,
          category: 'Entertainment' as const,
          recurrence: 'Monthly' as const,
          nextDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          isPaid: false,
        },
        {
          name: 'Spotify',
          amount: 9.99,
          category: 'Entertainment' as const,
          recurrence: 'Monthly' as const,
          nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          isPaid: true,
        },
        {
          name: 'Electric Bill',
          amount: 85.50,
          category: 'Utilities' as const,
          recurrence: 'Monthly' as const,
          nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isPaid: false,
        },
        {
          name: 'Adobe Creative Cloud',
          amount: 239.88,
          category: 'Education' as const,
          recurrence: 'Yearly' as const,
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isPaid: false,
        },
      ];

      demoSubscriptions.forEach(sub => addSubscription(sub));
    }
  }, [user, subscriptions.length]);

  const totalMonthly = getTotalMonthlyAmount();
  const upcomingBills = getUpcomingBills();
  const budgetUsed = user ? (totalMonthly / user.monthlyBudget) * 100 : 0;
  const remainingBudget = user ? user.monthlyBudget - totalMonthly : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.subtitle}>Manage your subscriptions</Text>
          </View>
        </View>

        {/* Budget Overview */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
            <TrendingUp size={20} color="#10B981" />
          </View>
          
          <View style={styles.budgetAmount}>
            <Text style={styles.totalAmount}>{formatCurrency(totalMonthly)}</Text>
            <Text style={styles.budgetLimit}>of {formatCurrency(user?.monthlyBudget || 0)}</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(budgetUsed, 100)}%` }]} />
          </View>
          
          <View style={styles.budgetFooter}>
            <Text style={[styles.remainingText, remainingBudget < 0 && styles.overBudget]}>
              {remainingBudget >= 0 
                ? `${formatCurrency(remainingBudget)} remaining`
                : `${formatCurrency(Math.abs(remainingBudget))} over budget`
              }
            </Text>
            <Text style={styles.percentageText}>{budgetUsed.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{subscriptions.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingBills.length}</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatCurrency(totalMonthly * 12)}</Text>
            <Text style={styles.statLabel}>Yearly</Text>
          </View>
        </View>

        {/* Upcoming Bills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bills</Text>
            {upcomingBills.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {upcomingBills.length > 0 ? (
            upcomingBills.slice(0, 3).map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onPress={() => {/* Navigate to subscription details */}}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <AlertCircle size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No upcoming bills</Text>
              <Text style={styles.emptySubtitle}>All your bills are up to date!</Text>
            </View>
          )}
        </View>

        {/* Quick Add Button */}
        <TouchableOpacity 
          style={styles.quickAddButton}
          onPress={() => router.push('/(tabs)/add')}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.quickAddText}>Add Subscription</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  budgetAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  budgetLimit: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  overBudget: {
    color: '#EF4444',
  },
  percentageText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  quickAddButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});