import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { formatCurrency } from '@/utils/formatters';
import { Plus, TrendingUp, CircleAlert as AlertCircle, LogOut, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AuthModal from '@/components/AuthModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    subscriptions,
    user,
    getUpcomingBills,
    getTotalMonthlyAmount,
    getBudgetInsights,
    getSavingsOpportunities,
    fetchSubscriptions,
    isLoading,
    error
  } = useSubscriptionStore();

  const { user: authUser, logout } = useAuthStore();

  useEffect(() => {
    // If user is authenticated, fetch subscriptions from API
    if (authUser) {
      fetchSubscriptions(authUser.id);
    }
  }, [authUser]);

  const totalMonthly = getTotalMonthlyAmount();
  const upcomingBills = getUpcomingBills();
  const budgetInsights = getBudgetInsights();
  const savingsOpportunities = getSavingsOpportunities();

  const handleLogout = async () => {
    await logout();
    // Clear local subscription data
    // You might want to add a clearSubscriptions method to your store
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Fetch user profile and subscriptions
    if (authUser) {
      fetchSubscriptions(authUser.id);
    }
  };

  // Show loading state while fetching data
  if (isLoading && subscriptions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading your subscriptions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show auth modal if no user is logged in
  if (!authUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authHeader}>
            <Text style={styles.appTitle}>BillPilot</Text>
            <Text style={styles.appSubtitle}>Manage your subscriptions smartly</Text>
          </View>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => setShowAuthModal(true)}
          >
            <User size={20} color="#FFFFFF" />
            <Text style={styles.authButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Logout */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {authUser.name}</Text>
            <Text style={styles.subtitle}>Manage your subscriptions</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Budget Overview */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
            <TrendingUp size={20} color="#10B981" />
          </View>

          <View style={styles.budgetAmount}>
            <Text style={styles.totalAmount}>{formatCurrency(totalMonthly)}</Text>
            <Text style={styles.budgetLimit}>of {formatCurrency(authUser.monthlyBudget)}</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(budgetInsights.percentageUsed, 100)}%` }]} />
          </View>

          <View style={styles.budgetFooter}>
            <Text style={[styles.remainingText, budgetInsights.remainingBudget < 0 && styles.overBudget]}>
              {budgetInsights.remainingBudget >= 0
                ? `${formatCurrency(budgetInsights.remainingBudget)} remaining`
                : `${formatCurrency(Math.abs(budgetInsights.remainingBudget))} over budget`
              }
            </Text>
            <Text style={styles.percentageText}>{budgetInsights.percentageUsed.toFixed(1)}%</Text>
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
                onPress={() => router.push(`/subscription/${subscription.id}`)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logoutButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
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