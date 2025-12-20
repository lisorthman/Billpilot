import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, TriangleAlert as AlertTriangle, TrendingUp, Mail, FileText, Clock } from 'lucide-react-native';

export default function NotificationSettingsScreen() {
    const router = useRouter();

    const [notificationSettings, setNotificationSettings] = useState({
        pushEnabled: true,
        emailEnabled: false,
        reminderDays: 3,
        priceAlerts: true,
        budgetAlerts: true,
        weeklyReports: true,
    });

    const updateNotificationSetting = (key: string, value: boolean) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
        // Here you would typically save to backend
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Notification Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingIcon}>
                                <Bell size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Push Notifications</Text>
                                <Text style={styles.settingDescription}>Receive alerts on this device</Text>
                            </View>
                            <Switch
                                value={notificationSettings.pushEnabled}
                                onValueChange={(val) => updateNotificationSetting('pushEnabled', val)}
                                trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingIcon}>
                                <Clock size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Bill Reminders</Text>
                                <Text style={styles.settingDescription}>Remind me {notificationSettings.reminderDays} days before due date</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.selector}
                                onPress={() => {
                                    // Cycle through options: 1 -> 2 -> 3 -> 5 -> 7 -> 1
                                    const options = [1, 2, 3, 5, 7];
                                    const currentIndex = options.indexOf(notificationSettings.reminderDays);
                                    const nextIndex = (currentIndex + 1) % options.length;
                                    updateNotificationSetting('reminderDays', options[nextIndex]);
                                }}
                            >
                                <Text style={styles.selectorText}>{notificationSettings.reminderDays} days</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingIcon}>
                                <Mail size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Email Notifications</Text>
                                <Text style={styles.settingDescription}>Get updates via email</Text>
                            </View>
                            <Switch
                                value={notificationSettings.emailEnabled}
                                onValueChange={(val) => updateNotificationSetting('emailEnabled', val)}
                                trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingIcon}>
                                <AlertTriangle size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Price Alerts</Text>
                                <Text style={styles.settingDescription}>Notify when prices change</Text>
                            </View>
                            <Switch
                                value={notificationSettings.priceAlerts}
                                onValueChange={(val) => updateNotificationSetting('priceAlerts', val)}
                                trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingIcon}>
                                <TrendingUp size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Budget Alerts</Text>
                                <Text style={styles.settingDescription}>Warn when near budget limit</Text>
                            </View>
                            <Switch
                                value={notificationSettings.budgetAlerts}
                                onValueChange={(val) => updateNotificationSetting('budgetAlerts', val)}
                                trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingContent}>
                            <View style={styles.settingIcon}>
                                <FileText size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Weekly Reports</Text>
                                <Text style={styles.settingDescription}>Receive weekly spending summaries</Text>
                            </View>
                            <Switch
                                value={notificationSettings.weeklyReports}
                                onValueChange={(val) => updateNotificationSetting('weeklyReports', val)}
                                trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
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
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    settingItem: {
        padding: 8,
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
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
});
