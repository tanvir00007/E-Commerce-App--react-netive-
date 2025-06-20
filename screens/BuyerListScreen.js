import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function BuyerListScreen() {
  const [buyers, setBuyers] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });

  const loadBuyers = async () => {
    try {
      const data = await AsyncStorage.getItem('@buyers');
      if (data) {
        setBuyers(JSON.parse(data));
      } else {
        setBuyers([]);
      }
    } catch (e) {
      console.log('Failed to load buyers', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBuyers();
    }, [])
  );

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleAddBuyer = async () => {
    if (!form.name || !form.address || !form.phone || !form.email) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newBuyers = [...buyers, form];
    try {
      await AsyncStorage.setItem('@buyers', JSON.stringify(newBuyers));
      setBuyers(newBuyers);
      setForm({ name: '', address: '', phone: '', email: '' });
    } catch (e) {
      console.log('Failed to save buyer', e);
      Alert.alert('Error', 'Failed to save buyer');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.address}</Text>
      <Text>{item.phone}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Buyer</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={(text) => handleChange('address', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />
      <Button title="Add Buyer" onPress={handleAddBuyer} />

      <FlatList
        data={buyers}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
});
