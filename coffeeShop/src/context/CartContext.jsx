// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('coffeehub_cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('coffeehub_cart', JSON.stringify(cartItems));
        calculateTotals();
    }, [cartItems]);

    const calculateTotals = () => {
        const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalItems(items);
        setTotalPrice(price);
    };

    // Add item to cart
    const addToCart = (item, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            } else {
                // Add new item
                return [...prevItems, { ...item, quantity }];
            }
        });

        // Open cart when item is added (optional)
        // setIsCartOpen(true);
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Update item quantity
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Toggle cart open/close
    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Open cart
    const openCart = () => {
        setIsCartOpen(true);
    };

    // Close cart
    const closeCart = () => {
        setIsCartOpen(false);
    };

    const value = {
        cartItems,
        totalItems,
        totalPrice,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        setCartItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};