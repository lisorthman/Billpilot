import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, Filter } from 'lucide-react-native';

export default function SubscriptionsListScreen() {
    const router = useRouter();
    const { viewMode = 'management' } = useLocalSearchParams<{ viewMode?: string }>();
    const { subscriptions } = useSubscriptionStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.category.toLowerCase().includes(searchQuery.toLowerCase());

        if (viewMode === 'trials') {
            return matchesSearch && sub.isFreeTrial;
        }

        return matchesSearch;
    }).sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {viewMode === 'trials' ? 'Free Trials' : 'All Subscriptions'}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchContainer}>
                <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search subscriptions..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.countText}>{filteredSubscriptions.length} Active Subscriptions</Text>

                {filteredSubscriptions.map((subscription) => (
                    <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        onPress={() => router.push(`/subscription/${subscription.id}?viewMode=${viewMode}`)}
                    />
                ))}

                {filteredSubscriptions.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {viewMode === 'trials' ? 'No active free trials found' : 'No subscriptions found'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        margin: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    content: {
        padding: 20,
        paddingTop: 0,
        paddingBottom: 100,
    },
    countText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
    },
});
