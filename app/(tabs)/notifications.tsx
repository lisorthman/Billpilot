import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Clock, TriangleAlert as AlertTriangle, TrendingUp, Settings } from 'lucide-react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: false,
    reminderDays: 3,
    priceAlerts: true,
    budgetAlerts: true,
    weeklyReports: true,
  });

  const updateNotification = (key: string, value: any) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const notificationItems = [
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      key: 'pushEnabled',
      type: 'switch',
      value: notifications.pushEnabled,
    },
    {
      icon: Clock,
      title: 'Bill Reminders',
      description: `Remind me ${notifications.reminderDays} days before due date`,
      key: 'reminderDays',
      type: 'selector',
      value: notifications.reminderDays,
      options: [1, 2, 3, 5, 7],
    },
    {
      icon: AlertTriangle,
      title: 'Price Increase Alerts',
      description: 'Notify when subscription prices change',
      key: 'priceAlerts',
      type: 'switch',
      value: notifications.priceAlerts,
    },
    {
      icon: TrendingUp,
      title: 'Budget Alerts',
      description: 'Warn when approaching budget limits',
      key: 'budgetAlerts',
      type: 'switch',
      value: notifications.budgetAlerts,
    },
    {
      icon: Settings,
      title: 'Weekly Reports',
      description: 'Send spending summary every week',
      key: 'weeklyReports',
      type: 'switch',
      value: notifications.weeklyReports,
    },
  ];

  const recentNotifications = [
    {
      id: '1',
      title: 'Netflix Payment Due',
      message: 'Your Netflix subscription of $15.99 is due in 2 days',
      time: '2 hours ago',
      type: 'reminder',
      read: false,
    },
    {
      id: '2',
      title: 'Budget Alert',
      message: 'You\'ve used 80% of your monthly subscription budget',
      time: '1 day ago',
      type: 'warning',
      read: true,
    },
    {
      id: '3',
      title: 'Spotify Payment Successful',
      message: 'Your Spotify Premium subscription has been renewed',
      time: '3 days ago',
      type: 'success',
      read: true,
    },
    {
      id: '4',
      title: 'Adobe Price Increase',
      message: 'Adobe Creative Cloud will increase to $29.99/month starting next billing cycle',
      time: '1 week ago',
      type: 'price_alert',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell size={16} color="#3B82F6" />;
      case 'warning':
        return <AlertTriangle size={16} color="#F59E0B" />;
      case 'success':
        return <TrendingUp size={16} color="#10B981" />;
      case 'price_alert':
        return <AlertTriangle size={16} color="#EF4444" />;
      default:
        return <Bell size={16} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Manage your notification preferences</Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          {notificationItems.map((item, index) => (
            <View key={index} style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.settingIcon}>
                  <item.icon size={20} color="#3B82F6" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                <View style={styles.settingControl}>
                  {item.type === 'switch' ? (
                    <Switch
                      value={Boolean(item.value)}
                      onValueChange={(value) => updateNotification(item.key, value)}
                      trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <TouchableOpacity style={styles.selector}>
                      <Text style={styles.selectorText}>{item.value} days</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {recentNotifications.map((notification) => (
            <TouchableOpacity key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <View style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </View>
                <View style={styles.notificationText}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadTitle,
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Test Notification</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Settings size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Advanced Settings</Text>
          </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingControl: {
    marginLeft: 12,
  },
  selector: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    position: 'relative',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#1F2937',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
});