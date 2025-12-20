import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, FileText, Lock, Eye, Trash2 } from 'lucide-react-native';

export default function PrivacyScreen() {
    const router = useRouter();

    const menuItems = [
        {
            icon: FileText,
            title: 'Privacy Policy',
            subtitle: 'Read our data handling practices',
            onPress: () => Alert.alert('Privacy Policy', 'Standard privacy policy content would be displayed here.')
        },
        {
            icon: Shield,
            title: 'Terms of Service',
            subtitle: 'Our commitment and your responsibilities',
            onPress: () => Alert.alert('Terms of Service', 'Standard terms of service content would be displayed here.')
        },
        {
            icon: Eye,
            title: 'Data Usage',
            subtitle: 'How we use your subscription data',
            onPress: () => Alert.alert('Data Usage', 'We only use your data to provide bill tracking and insights. We never sell your personal information.')
        }
    ];

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Request Submitted', 'Your account deletion request has been submitted.') }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Privacy & Security</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoSection}>
                    <View style={styles.privacyShield}>
                        <Shield size={48} color="#3B82F6" />
                    </View>
                    <Text style={styles.infoTitle}>Your Privacy Matters</Text>
                    <Text style={styles.infoSubtitle}>
                        BillPilot uses industry-standard encryption to protect your data. We never share your personal information with third parties.
                    </Text>
                </View>

                <View style={styles.section}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, index !== menuItems.length - 1 && styles.borderBottom]}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuIcon}>
                                <item.icon size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.menuText}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                            </View>
                            <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.section, { marginTop: 8 }]}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
                        <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
                            <Trash2 size={20} color="#EF4444" />
                        </View>
                        <View style={styles.menuText}>
                            <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Delete Account</Text>
                            <Text style={styles.menuSubtitle}>Permanently remove all your data</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Last updated: December 2025
                    </Text>
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
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    content: {
        padding: 20,
    },
    infoSection: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    privacyShield: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    infoSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
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
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    footer: {
        marginTop: 12,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#9CA3AF',
    },
});
