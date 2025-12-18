import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { History, CircleDollarSign } from 'lucide-react-native';

export default function HistoryScreen() {
    const { history, fetchHistory, isLoading } = useSubscriptionStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchHistory(user.id);
        }
    }, [user]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.historyItem}>
            <View style={styles.iconContainer}>
                <CircleDollarSign size={24} color="#10B981" />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.subscriptionName}</Text>
                <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
            </View>
            <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Payment History</Text>
                <Text style={styles.subtitle}>Track your past payments</Text>
            </View>

            {isLoading && history.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : history.length > 0 ? (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.centerContainer}>
                    <History size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>No payment history yet</Text>
                    <Text style={styles.emptySubtext}>Payments will appear here when you mark bills as paid</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 20,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
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
    listContent: {
        padding: 20,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ECFDF5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    itemDate: {
        fontSize: 14,
        color: '#6B7280',
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#10B981',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
