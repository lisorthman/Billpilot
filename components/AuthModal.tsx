import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      await login(email, password);
    } else {
      if (!name || !email || !password || !monthlyBudget) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      await register({
        name,
        email,
        password,
        monthlyBudget: parseFloat(monthlyBudget),
        currency: 'USD',
        timezone: 'UTC',
      });
    }
    
    if (!error) {
      onClose();
      clearForm();
    }
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setMonthlyBudget('');
    clearError();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearForm();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {isLogin ? 'Login' : 'Create Account'}
          </Text>
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Monthly Budget ($)"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              keyboardType="numeric"
            />
          )}
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginBottom: 15,
  },
  toggleText: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
});

