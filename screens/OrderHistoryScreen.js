import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // ✅ Import useFocusEffect

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);

  // ✅ Load orders every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        try {
          const savedOrders = await AsyncStorage.getItem('@orders');
          if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
          } else {
            setOrders([]); // Reset if no orders
          }
        } catch (e) {
          console.log('Failed to load orders', e);
        }
      };

      loadOrders();
    }, [])
  );

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No previous orders found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.orderTitle}>Order #{index + 1}</Text>
            {item.map((product) => (
              <Text key={product.id} style={styles.productItem}>
                {product.name} × {product.quantity}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#777',
  },
  card: {
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  productItem: {
    fontSize: 16,
    marginBottom: 4,
  },
});
