import React, { useEffect, useState } from 'react';
import { CartProvider } from './CartContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import MainTabNavigator from './navigation/MainTabNavigator'; // Tab Navigation
import CartIcon from './components/CartIcon'; // ✅ Import CartIcon

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user');
        setIsLoggedIn(!!savedUser);
      } catch (e) {
        console.log('Login check error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (isLoading) return null;

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Login'}>
          
          {/* Login Screen */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          {/* Main Bottom Tab Navigator */}
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />

          {/* Product Detail Screen with Cart Icon */}
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={({ navigation }) => ({
              title: 'Product Details',
              headerRight: () => <CartIcon navigation={navigation} />, // ✅ CartIcon Added
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
