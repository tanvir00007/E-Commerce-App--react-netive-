import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null); // For user data
  const [loading, setLoading] = useState(true); // For loading indicator

  useEffect(() => {
    // Load data from AsyncStorage when screen is mounted
    const loadProfile = async () => {
      try {
        const data = await AsyncStorage.getItem('userProfile');
        if (data) {
          setProfile(JSON.parse(data));
        }
      } catch (error) {
        console.log('Error loading profile:', error);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : profile ? (
        <>
          <Text>Name: {profile.name}</Text>
          <Text>Phone: {profile.phone}</Text>
          <Text>Address: {profile.address}</Text>
          <Text>Father: {profile.father}</Text>
          <Text>Mother: {profile.mother}</Text>
        </>
      ) : (
        <Text>No profile data found.</Text>
      )}

      <View style={styles.button}>
        <Button title="Back to Home" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;
