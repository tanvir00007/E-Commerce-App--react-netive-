import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../CartContext'; // ✅ Import Cart Context

// Products Data
const PRODUCTS = [
  {
    id: '1',
    name: 'Jasmin Rice-20 lbs',
    price: 59.99,
    image: require('../assets/jesminrice.png'),
  },
  {
    id: '2',
    name: 'NAZ- Broken Jasmin Rice - 25 lbs',
    price: 99.99,
    image: require('../assets/brokenrice.png'),
  },
  {
    id: '3',
    name: 'Star Ansi',
    price: 29.99,
    image: require('../assets/staransi.png'),
  },
  {
    id: '4',
    name: 'NAZ- Red Chilli',
    price: 49.99,
    image: require('../assets/chilli.png'),
  },
  {
    id: '5',
    name: 'Vimto',
    price: 49.99,
    image: require('../assets/vimto.png'),
  },
  {
    id: '6',
    name: 'Cola',
    price: 49.99,
    image: require('../assets/cola.png'),
  },
  {
    id: '7',
    name: 'Can',
    price: 49.99,
    image: require('../assets/can.png'),
  },
];

export default function ProductListScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  const { addToCart } = useContext(CartContext); // ✅ Use addToCart

  useEffect(() => {
    const loadUsername = async () => {
      const savedUser = await AsyncStorage.getItem('@user');
      if (savedUser) {
        setUsername(savedUser);
      }
    };
    loadUsername();
  }, []);

  const handleLogout = async () => {
    try {
      const remember = await AsyncStorage.getItem('@rememberMe');
      if (remember !== 'true') {
        await AsyncStorage.multiRemove(['@credentials', '@rememberMe']);
      }
      await AsyncStorage.removeItem('@user');
    } catch (e) {
      console.log('Logout error:', e);
    }
    navigation.replace('Login');
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(PRODUCTS);
    } else {
      const filtered = PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  // ✅ Updated renderProduct
  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      {/* Tap product for details */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        style={{ alignItems: 'center' }}
      >
        <Image
          source={
            typeof item.image === 'string'
              ? { uri: item.image }
              : item.image
          }
          style={styles.image}
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Welcome and Logout */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {username}</Text>
        <Button title="Logout" color="#ff4444" onPress={handleLogout} />
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* View Order History Button */}
      <Button
        title="View Order History"
        onPress={() => navigation.navigate('Orders')}  // Navigate to Orders Tab
        color="#007bff"
        style={{ marginBottom: 10 }}
      />

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  header: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 200,
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
