import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState('');

  const CORRECT_PASSWORD = 'abc123';

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user');
        if (savedUser) {
          navigation.replace('Main');  // ✅ Corrected: navigate to Main Tab
        }
      } catch (error) {
        console.log('Login check error:', error);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    if (password !== CORRECT_PASSWORD) {
      Alert.alert('Error', 'Invalid password');
      return;
    }

    try {
      if (rememberMe) {
        await AsyncStorage.setItem('@user', username);
      } else {
        await AsyncStorage.removeItem('@user');
      }
      navigation.replace('Main');  // ✅ Corrected: navigate to Main Tab
    } catch (error) {
      console.log('Login save error:', error);
      Alert.alert('Error', 'Failed to save login info.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Naz HS INC</Text>

      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.remember}>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
        <Text style={styles.rememberText}>Remember Me</Text>
      </View>

      <Button title="Login" onPress={handleLogin} color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 30, fontWeight: 'bold', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
});
