import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

interface User {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  avatar?: string;
  notificationPreferences: {
    reminderDays: number[];
    priceIncreaseAlerts: boolean;
    trialEndAlerts: boolean;
    overdueAlerts: boolean;
  };
  currency: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthStore {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    monthlyBudget: number;
    currency?: string;
    timezone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: (uid: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({
              user: { ...userData, id: firebaseUser.uid },
              firebaseUser,
              isLoading: false
            });
          } else {
            throw new Error('User profile not found');
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false
          });
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Create user with Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );
          const firebaseUser = userCredential.user;

          // Update Firebase Auth profile
          await updateProfile(firebaseUser, {
            displayName: userData.name,
          });

          // Create user profile in Firestore
          const newUser: User = {
            id: firebaseUser.uid,
            name: userData.name,
            email: userData.email,
            monthlyBudget: userData.monthlyBudget,
            notificationPreferences: {
              reminderDays: [3, 1, 0],
              priceIncreaseAlerts: true,
              trialEndAlerts: true,
              overdueAlerts: true,
            },
            currency: userData.currency || 'USD',
            timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

          set({ user: newUser, firebaseUser, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false
          });
        }
      },

      logout: async () => {
        try {
          await firebaseSignOut(auth);
          await AsyncStorage.removeItem('authToken');
        } catch (error) {
          console.error('Error signing out:', error);
        }
        set({ user: null, firebaseUser: null });
      },

      fetchProfile: async (uid: string) => {
        set({ isLoading: true, error: null });
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: { ...userData, id: uid }, isLoading: false });
          } else {
            throw new Error('User profile not found');
          }
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch profile',
            isLoading: false
          });
        }
      },

      updateUserProfile: async (updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');

          const userRef = doc(db, 'users', currentUser.id);
          const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() };

          // Remove id for firestore update if present to avoid duplication/errors
          const { id, ...firestoreData } = updatedUser;

          await setDoc(userRef, firestoreData, { merge: true });

          set({ user: updatedUser, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update profile',
            isLoading: false
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'billpilot-auth',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);



