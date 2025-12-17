import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subscription } from '@/types';
import { formatCurrency, formatDate, getDaysUntilDue } from '@/utils/formatters';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
  showDueDate?: boolean;
}

export function SubscriptionCard({ subscription, onPress, showDueDate = true }: SubscriptionCardProps) {
  const daysUntilDue = getDaysUntilDue(subscription.nextDueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue < 7 && daysUntilDue >= 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryIndicator, { backgroundColor: subscription.color }]} />
          <View style={styles.titleSection}>
            <Text style={styles.name} numberOfLines={1}>{subscription.name}</Text>
            <Text style={styles.category}>{subscription.category}</Text>
          </View>
          <View style={styles.amountSection}>
            <Text style={styles.amount}>{formatCurrency(subscription.amount)}</Text>
            <Text style={styles.recurrence}>/{subscription.recurrence.toLowerCase()}</Text>
          </View>
        </View>

        {showDueDate && (
          <View style={styles.footer}>
            <Text style={[
              styles.dueDate,
              isOverdue && styles.overdue,
              isDueSoon && styles.dueSoon,
            ]}>
              {isOverdue
                ? `Overdue by ${Math.abs(daysUntilDue)} days`
                : daysUntilDue === 0
                  ? 'Due today'
                  : `Due ${formatDate(subscription.nextDueDate)}${isDueSoon ? ` (${daysUntilDue} days)` : ''}`
              }
            </Text>
            {subscription.isPaid && (
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  recurrence: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dueDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  overdue: {
    color: '#EF4444',
    fontWeight: '600',
  },
  dueSoon: {
    color: '#EF4444',
    fontWeight: '600',
  },
  paidBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});