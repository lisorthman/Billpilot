import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { SubscriptionCategory, RecurrenceType } from '@/types';
import { getNextDueDate } from '@/utils/formatters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, Calendar, ArrowLeft } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Category color mapping (duplicated for now, could be shared utility)
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

export default function EditSubscriptionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { subscriptions, updateSubscriptionAPI } = useSubscriptionStore();

    const subscription = subscriptions.find(sub => sub.id === id);

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: 'Entertainment' as SubscriptionCategory,
        recurrence: 'Monthly' as RecurrenceType,
        description: '',
        nextDueDate: new Date(),
    });

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showRecurrencePicker, setShowRecurrencePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        if (subscription) {
            setFormData({
                name: subscription.name,
                amount: subscription.amount.toString(),
                category: subscription.category,
                recurrence: subscription.recurrence,
                description: subscription.description || '',
                nextDueDate: subscription.nextDueDate instanceof Date
                    ? subscription.nextDueDate
                    : new Date(subscription.nextDueDate),
            });
            setIsInitializing(false);
        } else if (!isInitializing) {
            Alert.alert('Error', 'Subscription not found');
            router.back();
        }
    }, [subscription]);

    // Helper to format date for display
    const getFormattedDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData({ ...formData, nextDueDate: selectedDate });
        }
    };

    if (isInitializing || !subscription) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B5CF6" />
            </SafeAreaView>
        );
    }

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
            // Logic for next due date:
            // Use the user-selected date (formData.nextDueDate).
            // Only auto-recalculate if recurrence changes AND the user hasn't manually picked a new date?
            // Actually, if the user explicitly picks a date, we should respect it.
            // If they change recurrence, we *could* auto-update, but that might overwrite their manual pick.
            // Let's trust the formData.nextDueDate as the source of truth,
            // assuming the user updates it if they change recurrence, or we leave it to them.
            // HOWEVER: If they change recurrence, the "next" date implies a new cycle.
            // Let's stick to the Add Subscription logic: just take whatever is in formData.nextDueDate.
            // If they change recurrence but not the date, the next bill is that date, and subsequence ones follow the new recurrence.

            const nextDueDate = formData.nextDueDate;

            await updateSubscriptionAPI(subscription.id, {
                name: formData.name.trim(),
                amount,
                category: formData.category,
                recurrence: formData.recurrence,
                description: formData.description.trim(),
                color: getCategoryColor(formData.category),
                nextDueDate: nextDueDate instanceof Date ? nextDueDate : new Date(nextDueDate),
            });

            Alert.alert(
                'Success',
                'Subscription updated successfully!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to update subscription. Please try again.');
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Subscription</Text>
                    <View style={{ width: 40 }} />
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

                    {/* Date Picker Section */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Next Due Date *</Text>
                        <TouchableOpacity
                            style={styles.selector}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.selectorText}>
                                {getFormattedDate(formData.nextDueDate)}
                            </Text>
                            <Calendar size={20} color="#6B7280" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.nextDueDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                            />
                        )}
                        <Text style={styles.helperText}>
                            Scheduled for {getFormattedDate(formData.nextDueDate)}
                        </Text>
                    </View>

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

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Cancel"
                        variant="outline"
                        onPress={() => router.back()}
                        style={styles.cancelButton}
                    />
                    <Button
                        title="Save Changes"
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
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
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        marginLeft: 4,
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
