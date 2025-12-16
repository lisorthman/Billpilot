import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { SubscriptionCategory, RecurrenceType } from '@/types';
import { getNextDueDate } from '@/utils/formatters';
import { useRouter } from 'expo-router';
import { ChevronDown, Calendar } from 'lucide-react-native';

// Category color mapping
const getCategoryColor = (category: SubscriptionCategory): string => {
  const colors: Record<SubscriptionCategory, string> = {
    Entertainment: '#8B5CF6',
    Utilities: '#10B981',
    Rent: '#F59E0B',
    Education: '#3B82F6',
    Health: '#EF4444',
    Transport: '#6366F1',
    Food: '#F97316',
    Other: '#6B7280',
  };
  return colors[category];
};

const categories: SubscriptionCategory[] = [
  'Entertainment', 'Utilities', 'Rent', 'Education', 'Health', 'Transport', 'Food', 'Other'
];

const recurrenceOptions: RecurrenceType[] = ['Weekly', 'Monthly', 'Yearly'];

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const { createSubscription } = useSubscriptionStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Entertainment' as SubscriptionCategory,
    recurrence: 'Monthly' as RecurrenceType,
    description: '',
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showRecurrencePicker, setShowRecurrencePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to add a subscription');
        setIsLoading(false);
        return;
      }

      const startDate = new Date();
      const nextDueDate = getNextDueDate(startDate, formData.recurrence);

      await createSubscription(user.id, {
        name: formData.name.trim(),
        amount,
        category: formData.category,
        recurrence: formData.recurrence,
        nextDueDate,
        startDate,
        isPaid: false,
        description: formData.description.trim(),
        color: getCategoryColor(formData.category),
      });

      Alert.alert(
        'Success',
        'Subscription added successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryPicker = () => (
    <View style={styles.pickerContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.pickerOption,
            formData.category === category && styles.pickerOptionSelected,
          ]}
          onPress={() => {
            setFormData({ ...formData, category });
            setShowCategoryPicker(false);
          }}
        >
          <Text style={[
            styles.pickerOptionText,
            formData.category === category && styles.pickerOptionTextSelected,
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const RecurrencePicker = () => (
    <View style={styles.pickerContainer}>
      {recurrenceOptions.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.pickerOption,
            formData.recurrence === option && styles.pickerOptionSelected,
          ]}
          onPress={() => {
            setFormData({ ...formData, recurrence: option });
            setShowRecurrencePicker(false);
          }}
        >
          <Text style={[
            styles.pickerOptionText,
            formData.recurrence === option && styles.pickerOptionTextSelected,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Subscription</Text>
          <Text style={styles.subtitle}>Track a new bill or subscription</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Subscription Name *"
            placeholder="e.g. Netflix, Spotify, Rent"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Input
            label="Amount *"
            placeholder="0.00"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="numeric"
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.selectorText}>{formData.category}</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            {showCategoryPicker && <CategoryPicker />}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Billing Frequency *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowRecurrencePicker(!showRecurrencePicker)}
            >
              <Text style={styles.selectorText}>{formData.recurrence}</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            {showRecurrencePicker && <RecurrencePicker />}
          </View>

          <Input
            label="Description (Optional)"
            placeholder="Add notes about this subscription"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Calendar size={20} color="#3B82F6" />
            <Text style={styles.previewTitle}>Preview</Text>
          </View>
          <Text style={styles.previewText}>
            {formData.name || 'Subscription Name'} - ${formData.amount || '0.00'} / {formData.recurrence.toLowerCase()}
          </Text>
          <Text style={styles.previewCategory}>Category: {formData.category}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
          <Button
            title="Add Subscription"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
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
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#374151',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  pickerOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});