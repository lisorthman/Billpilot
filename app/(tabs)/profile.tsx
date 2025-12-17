import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import { User, Settings, CreditCard, Download, CircleHelp as HelpCircle, LogOut, Edit3, Shield, Smartphone, ChevronRight, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { subscriptions } = useSubscriptionStore();
  const { user, updateUserProfile, logout } = useAuthStore();

  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(user?.monthlyBudget?.toString() || '500');

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');

  const handleBudgetSave = async () => {
    const newBudget = parseFloat(budgetValue);
    if (isNaN(newBudget) || newBudget <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    if (user) {
      await updateUserProfile({ monthlyBudget: newBudget });
      setEditingBudget(false);
      Alert.alert('Success', 'Budget updated successfully!');
    }
  };

  const handleNameSave = async () => {
    if (!nameValue.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (user) {
      await updateUserProfile({ name: nameValue.trim() });
      setEditingName(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        },
      ]
    );
  };

  const stats = {
    totalSubscriptions: subscriptions.length,
    totalMonthly: subscriptions.reduce((sum, sub) => {
      switch (sub.recurrence) {
        case 'Monthly': return sum + sub.amount;
        case 'Yearly': return sum + (sub.amount / 12);
        case 'Weekly': return sum + ((sub.amount * 52) / 12);
        default: return sum;
      }
    }, 0),
  };

  const menuItems = [
    {
      icon: Settings,
      title: 'Account Settings',
      subtitle: 'Manage your account preferences',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage your payment methods',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: Smartphone,
      title: 'App Preferences',
      subtitle: 'Customize your app experience',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: Download,
      title: 'Export Data',
      subtitle: 'Download your subscription data',
      onPress: () => Alert.alert('Export Data', 'Your data will be exported as CSV file'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Support', 'Email us at support@billpilot.com'),
    },
  ];

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <User size={32} color="#3B82F6" />
          </View>

          <View style={styles.userInfo}>
            {editingName ? (
              <View style={styles.nameEditContainer}>
                <Input
                  value={nameValue}
                  onChangeText={setNameValue}
                  placeholder="Your Name"
                  containerStyle={{ marginBottom: 0, flex: 1, marginRight: 8 }}
                />
                <TouchableOpacity onPress={handleNameSave} style={styles.saveIconBtn}>
                  <Check size={20} color="#10B981" />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (editingName) {
                setEditingName(false);
                setNameValue(user.name);
              } else {
                setEditingName(true);
                setNameValue(user.name);
              }
            }}
          >
            <Edit3 size={20} color={editingName ? "#6B7280" : "#3B82F6"} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/subscriptions/list')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{stats.totalSubscriptions}</Text>
            <Text style={styles.statLabel}>Active Subscriptions (View All)</Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatCurrency(stats.totalMonthly)}</Text>
            <Text style={styles.statLabel}>Monthly Spending</Text>
          </View>
        </View>

        {/* Budget Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Budget</Text>
            <TouchableOpacity
              style={styles.editBudgetButton}
              onPress={() => setEditingBudget(!editingBudget)}
            >
              <Edit3 size={16} color="#3B82F6" />
              <Text style={styles.editBudgetText}>{editingBudget ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {editingBudget ? (
            <View style={styles.budgetEdit}>
              <Input
                value={budgetValue}
                onChangeText={setBudgetValue}
                keyboardType="numeric"
                placeholder="Enter budget amount"
              />
              <View style={styles.budgetActions}>
                <Button
                  title="Save"
                  onPress={handleBudgetSave}
                  style={styles.budgetButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.budgetDisplay}>
              <Text style={styles.budgetAmount}>
                {formatCurrency(user?.monthlyBudget || 0)}
              </Text>
              <Text style={styles.budgetDescription}>
                You're currently spending {formatCurrency(stats.totalMonthly)} per month
              </Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>BillPilot v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: '#EFF6FF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveIconBtn: {
    padding: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statsContainer: {
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
    marginHorizontal: 6,
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
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
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
  editBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBudgetText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 4,
  },
  budgetEdit: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetActions: {
    marginTop: 12,
  },
  budgetButton: {
    width: '100%',
  },
  budgetDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  budgetDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});