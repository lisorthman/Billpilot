import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { History, CircleDollarSign, Calendar as CalendarIcon, List } from 'lucide-react-native';
import { Calendar, DateData } from 'react-native-calendars';

export default function HistoryScreen() {
    const { history, fetchHistory, isLoading } = useSubscriptionStore();
    const { user } = useAuthStore();
    const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');
    const [selectedDate, setSelectedDate] = React.useState('');

    useEffect(() => {
        if (user) {
            fetchHistory(user.id);
        }
    }, [user]);

    // Group history by date for calendar markers
    const markedDates = React.useMemo(() => {
        const marks: any = {};
        history.forEach(item => {
            const dateStr = new Date(item.date).toISOString().split('T')[0];
            if (!marks[dateStr]) {
                marks[dateStr] = { marked: true, dotColor: '#3B82F6' };
            }
        });
        // Highlight selected date
        if (selectedDate) {
            marks[selectedDate] = {
                ...(marks[selectedDate] || {}),
                selected: true,
                selectedColor: '#3B82F6',
            };
        }
        return marks;
    }, [history, selectedDate]);

    // Filter history for selected date in calendar view
    const filteredHistory = React.useMemo(() => {
        if (viewMode === 'list' || !selectedDate) return history;
        return history.filter(item =>
            new Date(item.date).toISOString().split('T')[0] === selectedDate
        );
    }, [history, viewMode, selectedDate]);

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
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.title}>Payment History</Text>
                        <Text style={styles.subtitle}>Track your past payments</Text>
                    </View>
                    <View style={styles.viewToggle}>
                        <TouchableOpacity
                            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
                            onPress={() => setViewMode('list')}
                        >
                            <List size={20} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
                            onPress={() => setViewMode('calendar')}
                        >
                            <CalendarIcon size={20} color={viewMode === 'calendar' ? '#FFFFFF' : '#6B7280'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {viewMode === 'calendar' && (
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        theme={{
                            selectedDayBackgroundColor: '#3B82F6',
                            todayTextColor: '#3B82F6',
                            arrowColor: '#3B82F6',
                            dotColor: '#3B82F6',
                        }}
                    />
                    <View style={styles.selectedDateHeader}>
                        <Text style={styles.selectedDateTitle}>
                            {selectedDate ? formatDate(new Date(selectedDate)) : 'Select a date'}
                        </Text>
                    </View>
                </View>
            )}

            {isLoading && history.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : filteredHistory.length > 0 ? (
                <FlatList
                    data={filteredHistory}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.centerContainer}>
                    <History size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>
                        {viewMode === 'calendar' && selectedDate
                            ? 'No payments on this date'
                            : 'No payment history yet'}
                    </Text>
                    <Text style={styles.emptySubtext}>
                        {viewMode === 'calendar' && selectedDate
                            ? 'Select another date to view payments'
                            : 'Payments will appear here when you mark bills as paid'}
                    </Text>
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
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 2,
    },
    toggleButton: {
        padding: 8,
        borderRadius: 6,
    },
    activeToggle: {
        backgroundColor: '#3B82F6',
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
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    selectedDateHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    selectedDateTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100, // Add padding for bottom tabs
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
