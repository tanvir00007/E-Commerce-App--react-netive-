import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../CartContext'; // ✅ Import Cart Context

// Products Data with categories
const PRODUCTS = [
  {
    id: '1',
    category: 'Rice',
    name: 'Jasmin Rice-20 lbs',
    price: 59.99,
    image: require('../assets/jesminrice.png'),
  },
  {
    id: '2',
    category: 'Rice',
    name: 'NAZ- Broken Jasmin Rice - 25 lbs',
    price: 99.99,
    image: require('../assets/brokenrice.png'),
  },
  {
    id: '3',
    category: 'Spices',
    name: 'Star Ansi',
    price: 29.99,
    image: require('../assets/staransi.png'),
  },
  {
    id: '4',
    category: 'Spices',
    name: 'NAZ- Red Chilli',
    price: 49.99,
    image: require('../assets/chilli.png'),
  },
  {
    id: '5',
    category: 'Drinks',
    name: 'Vimto',
    price: 49.99,
    image: require('../assets/vimto.png'),
  },
  {
    id: '6',
    category: 'Drinks',
    name: 'Cola',
    price: 49.99,
    image: require('../assets/cola.png'),
  },
  {
    id: '7',
    category: 'Drinks',
    name: 'Can',
    price: 49.99,
    image: require('../assets/can.png'),
  },
];

const CATEGORIES = ['Rice', 'Drinks', 'Spices'];

export default function ProductListScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  const {
    addToCart,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

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

  const sections = CATEGORIES.map((cat) => ({
    title: cat,
    data: filteredProducts.filter((p) => p.category === cat),
  })).filter((s) => s.data.length > 0);

  const getQuantity = (productId) => {
    const item = cartItems.find((p) => p.id === productId);
    return item ? item.quantity : 0;
  };

  const renderProduct = ({ item }) => {
    const qty = getQuantity(item.id);
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { product: item })}
          style={{ alignItems: 'center' }}
        >
          <Image
            source={
              typeof item.image === 'string' ? { uri: item.image } : item.image
            }
            style={styles.image}
          />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyCount}>{qty}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => (qty === 0 ? addToCart(item) : increaseQuantity(item.id))}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
      <SectionList
        sections={sections}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
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
  category: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyButton: {
    backgroundColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 10,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

