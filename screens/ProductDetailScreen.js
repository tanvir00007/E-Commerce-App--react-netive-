import React, { useContext } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { CartContext } from '../CartContext';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);

  return (
    <View style={styles.container}>
      {/* Big Product Image */}
      <Image
        source={
          typeof product.image === 'string'
            ? { uri: product.image }
            : product.image
        }
        style={styles.image}
        resizeMode="contain"
      />

      {/* Name & Description */}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
      </Text>
      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>

      {/* Add to Cart Button */}
      <Button title="Add to Cart" onPress={() => addToCart(product)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', marginBottom: 20 },
  price: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
});
