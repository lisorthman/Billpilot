import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function AccountSettingsScreen() {
    const router = useRouter();
    const { user, updateUserProfile } = useAuthStore();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setIsUpdating(true);
        try {
            await updateUserProfile({ name: name.trim() });
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.title}>Account Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <Input
                            placeholder="Your Name"
                            value={name}
                            onChangeText={setName}
                            leftIcon={<User size={20} color="#9CA3AF" />}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <Input
                            placeholder="Your Email"
                            value={email}
                            editable={false}
                            leftIcon={<Mail size={20} color="#9CA3AF" />}
                        />
                        <Text style={styles.helperText}>Email cannot be changed yet.</Text>
                    </View>

                    <Button
                        title={isUpdating ? "Updating..." : "Save Changes"}
                        onPress={handleUpdateProfile}
                        disabled={isUpdating || name === user?.name}
                    />
                </View>

                <View style={[styles.section, styles.securitySection]}>
                    <Text style={styles.sectionTitle}>Security</Text>

                    <TouchableOpacity
                        style={styles.securityItem}
                        onPress={() => Alert.alert('Change Password', 'Password reset email sent!')}
                    >
                        <View style={styles.securityIcon}>
                            <Lock size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.securityText}>
                            <Text style={styles.securityTitle}>Change Password</Text>
                            <Text style={styles.securityDescription}>Update your login security</Text>
                        </View>
                        <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.securityItem}
                        onPress={() => Alert.alert('Two-Factor Auth', 'Feature coming soon!')}
                    >
                        <View style={styles.securityIcon}>
                            <ShieldCheck size={20} color="#10B981" />
                        </View>
                        <View style={styles.securityText}>
                            <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                            <Text style={styles.securityDescription}>Add an extra layer of security</Text>
                        </View>
                        <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
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
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    securitySection: {
        paddingHorizontal: 12,
    },
    securityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    securityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    securityText: {
        flex: 1,
    },
    securityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    securityDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
});
