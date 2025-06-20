import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import BuyerListScreen from '../screens/BuyerListScreen';
import CartIcon from '../components/CartIcon'; // ✅ Import CartIcon
import { Ionicons } from '@expo/vector-icons'; // Icons for tabs

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerRight: () =>
          route.name === 'Home' ? <CartIcon navigation={navigation} /> : null,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Cart') iconName = 'cart-outline';
          else if (route.name === 'Orders') iconName = 'receipt-outline';
          else if (route.name === 'Buyers') iconName = 'people-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
      <Tab.Screen
        name="Buyers"
        component={BuyerListScreen}
        options={{ title: 'Buyers' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ title: 'Order History' }}
      />
    </Tab.Navigator>
  );
}
