// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('coffeehub_wishlist');
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('coffeehub_wishlist', JSON.stringify(wishlistItems));
        setWishlistCount(wishlistItems.length);
    }, [wishlistItems]);

    // Add item to wishlist
    const addToWishlist = (item) => {
        setWishlistItems(prevItems => {
            // Check if item already exists
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems; // Item already in wishlist
            }
            return [...prevItems, { ...item, addedAt: new Date().toISOString() }];
        });
    };

    // Remove item from wishlist
    const removeFromWishlist = (itemId) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Toggle wishlist (add if not exists, remove if exists)
    const toggleWishlist = (item) => {
        const existingItem = wishlistItems.find(i => i.id === item.id);
        if (existingItem) {
            removeFromWishlist(item.id);
            return false; // Removed
        } else {
            addToWishlist(item);
            return true; // Added
        }
    };

    // Check if item is in wishlist
    const isInWishlist = (itemId) => {
        return wishlistItems.some(item => item.id === itemId);
    };

    // Clear entire wishlist
    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const value = {
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        setWishlistItems
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};