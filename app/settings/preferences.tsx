import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Moon, Globe, DollarSign, Languages } from 'lucide-react-native';

export default function PreferencesScreen() {
    const router = useRouter();

    const [preferences, setPreferences] = useState({
        darkMode: false,
        compactMode: false,
        currency: 'USD ($)',
        language: 'English',
    });

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>App Preferences</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Moon size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Dark Mode</Text>
                            <Text style={styles.settingDescription}>Toggle dark theme appearance</Text>
                        </View>
                        <Switch
                            value={preferences.darkMode}
                            onValueChange={() => togglePreference('darkMode')}
                            trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Globe size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Compact View</Text>
                            <Text style={styles.settingDescription}>Show more items on screen</Text>
                        </View>
                        <Switch
                            value={preferences.compactMode}
                            onValueChange={() => togglePreference('compactMode')}
                            trackColor={{ false: '#F3F4F6', true: '#3B82F6' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localization</Text>

                    <TouchableOpacity style={styles.selectorItem}>
                        <View style={styles.settingIcon}>
                            <DollarSign size={20} color="#10B981" />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Primary Currency</Text>
                            <Text style={styles.settingDescription}>{preferences.currency}</Text>
                        </View>
                        <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectorItem}>
                        <View style={styles.settingIcon}>
                            <Languages size={20} color="#8B5CF6" />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>App Language</Text>
                            <Text style={styles.settingDescription}>{preferences.language}</Text>
                        </View>
                        <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Some changes may require app restart to take full effect.
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
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        marginLeft: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    selectorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
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
    },
    settingDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoBox: {
        padding: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        marginTop: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#3B82F6',
        textAlign: 'center',
        lineHeight: 20,
    },
});
