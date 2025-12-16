import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Button } from '@/components/Button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
    ArrowLeft,
    Calendar,
    Trash2,
    CheckCircle,
    CreditCard,
    Repeat,
    Tag,
    Edit3
} from 'lucide-react-native';

export default function SubscriptionDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const {
        subscriptions,
        deleteSubscriptionAPI,
        markAsPaidAPI,
        isLoading
    } = useSubscriptionStore();

    const [isDeleting, setIsDeleting] = useState(false);

    const subscription = subscriptions.find(sub => sub.id === id);

    useEffect(() => {
        if (!subscription && !isLoading) {
            Alert.alert(
                'Error',
                'Subscription not found',
                [{ text: 'Go Back', onPress: () => router.back() }]
            );
        }
    }, [subscription, isLoading, router]);

    if (!subscription) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B5CF6" />
                </View>
            </SafeAreaView>
        );
    }

    const handleDelete = async () => {
        Alert.alert(
            'Delete Subscription',
            'Are you sure you want to delete this subscription? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await deleteSubscriptionAPI(subscription.id);
                            // Force navigation to root/home to avoid stack issues
                            router.replace('/');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete subscription');
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const handleMarkAsPaid = async () => {
        try {
            // Optimistic update could be handled here or rely on store
            await markAsPaidAPI(subscription.id);
            Alert.alert('Success', 'Marked as paid!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const handleEdit = () => {
        router.push(`/subscription/edit/${subscription.id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Details</Text>
                    <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                        <Edit3 size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Main Card */}
                <View style={styles.mainCard}>
                    <View style={[styles.categoryIcon, { backgroundColor: subscription.color }]}>
                        <Tag size={32} color="#FFFFFF" />
                    </View>
                    <Text style={styles.amount}>{formatCurrency(subscription.amount)}</Text>
                    <Text style={styles.recurrence}>per {subscription.recurrence.toLowerCase()}</Text>
                    <Text style={styles.name}>{subscription.name}</Text>

                    {subscription.isPaid && (
                        <View style={styles.paidBadge}>
                            <CheckCircle size={16} color="#10B981" />
                            <Text style={styles.paidText}>Paid</Text>
                        </View>
                    )}
                </View>

                {/* Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Information</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Calendar size={20} color="#6B7280" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Next Due Date</Text>
                            <Text style={styles.infoValue}>{formatDate(subscription.nextDueDate)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <CreditCard size={20} color="#6B7280" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Category</Text>
                            <Text style={styles.infoValue}>{subscription.category}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Repeat size={20} color="#6B7280" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Billing Cycle</Text>
                            <Text style={styles.infoValue}>{subscription.recurrence}</Text>
                        </View>
                    </View>

                    {subscription.description ? (
                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionLabel}>Notes</Text>
                            <Text style={styles.descriptionText}>{subscription.description}</Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <Button
                    title={subscription.isPaid ? "Paid" : "Mark as Paid"}
                    onPress={handleMarkAsPaid}
                    variant={subscription.isPaid ? "outline" : "primary"}
                    disabled={subscription.isPaid}
                    style={styles.actionButton}
                />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
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
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    editButton: {
        padding: 8,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    amount: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    recurrence: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    paidBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    paidText: {
        color: '#10B981',
        fontWeight: '600',
        marginLeft: 6,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    infoIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    descriptionBox: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    descriptionLabel: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 20,
        paddingBottom: 34,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 16,
    },
    actionButton: {
        flex: 1,
    },
    deleteButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
