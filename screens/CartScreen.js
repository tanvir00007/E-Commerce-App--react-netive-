import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import { CartContext } from '../CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🆕 Added for saving orders

export default function CartScreen() {
  const {
    cartItems,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useContext(CartContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔐 Login simulation

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in before checking out.',
        [
          {
            text: 'Login',
            onPress: () => setIsLoggedIn(true),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add some products before checking out.');
      return;
    }

    try {
      // 📝 Save Order to AsyncStorage
      const existingOrders = await AsyncStorage.getItem('@orders');
      const parsedOrders = existingOrders ? JSON.parse(existingOrders) : [];

      const newOrders = [...parsedOrders, cartItems];

      await AsyncStorage.setItem('@orders', JSON.stringify(newOrders));

      Alert.alert('Order Placed', 'Your order has been saved.', [
        { text: 'OK', onPress: () => clearCart() },
      ]);
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert('Error', 'Something went wrong while saving your order.');
    }
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.controls}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => decreaseQuantity(item.id)}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyCount}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => increaseQuantity(item.id)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Text style={styles.total}>
            Total: ${getTotalPrice().toFixed(2)}
          </Text>

          <Button
            title={isLoggedIn ? 'CHECKOUT' : 'LOGIN TO CHECKOUT'}
            onPress={handleCheckout}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', fontSize: 18, marginTop: 20 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 10,
  },
  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 16,
  },
});
