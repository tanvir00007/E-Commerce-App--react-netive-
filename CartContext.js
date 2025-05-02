import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const CART_KEY = '@myapp_cart';


  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.id === productId);
      if (item.quantity > 1) {
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter((item) => item.id !== productId);
      }
    });
  };
  


  // 🔄 Load cart data on first mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_KEY);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.log('Failed to load cart', e);
      }
    };
    loadCart();
  }, []);

  // 💾 Save cart data whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.log('Failed to save cart', e);
      }
    };
    if (cartItems.length > 0) {
      saveCart();
    } else {
      AsyncStorage.removeItem(CART_KEY); // cleanup if cart is empty
    }
  }, [cartItems]);

  // ✅ Core Functions
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.id === productId);
      if (item.quantity > 1) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter((item) => item.id !== productId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemsCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
    }, 0);
  };
  

  return (
    <CartContext.Provider
  value={{
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getItemsCount,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
  }}
>

      {children}
    </CartContext.Provider>
  );
};
