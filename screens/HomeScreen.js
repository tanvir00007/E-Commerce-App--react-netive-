import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  // State to store form input
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    father: '',
    mother: '',
  });

  // Update form field values dynamically
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Check if all fields are filled
  const validateForm = () => {
    const fields = Object.values(form);
    return fields.every(field => field.trim() !== '');
  };

  // Save data and navigate to Profile screen
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      // Save the form as a string into AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(form));

      // Navigate to Profile screen
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Storage Error', 'Failed to save data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Profile Form</Text>

      {/* Input fields for profile data */}
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={form.name}
        onChangeText={text => handleChange('name', text)}
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={text => handleChange('phone', text)}
      />
      <TextInput
        placeholder="Address"
        style={styles.input}
        value={form.address}
        onChangeText={text => handleChange('address', text)}
      />
      <TextInput
        placeholder="Father's Name"
        style={styles.input}
        value={form.father}
        onChangeText={text => handleChange('father', text)}
      />
      <TextInput
        placeholder="Mother's Name"
        style={styles.input}
        value={form.mother}
        onChangeText={text => handleChange('mother', text)}
      />

      {/* Submit button */}
      <View style={styles.button}>
        <Button title="Save & View Profile" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default HomeScreen;
