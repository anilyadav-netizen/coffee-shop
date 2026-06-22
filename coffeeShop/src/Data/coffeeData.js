// src/data/coffeeData.js

import coffee1 from '../assets/Images/coffee1.jpg'
import coffee2 from '../assets/Images/coffee2.jpg'
import coffee3 from '../assets/Images/coffee3.jpg'
import coffee4 from '../assets/Images/coffee4.jpg'
import coffee5 from '../assets/Images/coffee5.jpg'
import coffee6 from '../assets/Images/coffee6.jpg'
import coffee7 from '../assets/Images/coffee7.jpg'

import {
    FaCoffee,
    FaUtensils,
    FaBirthdayCake,
    FaThLarge,
    FaLeaf
} from "react-icons/fa";

// ✅ Fake ObjectId Generator (24 characters hex string)
const generateObjectId = (num) => {
    // 24 character hex string (MongoDB ObjectId format)
    const prefix = '67a1b2c3d4e5f6a7b8c9d';
    const suffix = num.toString().padStart(3, '0');
    return prefix + suffix;
};

export const COFFEE_PRODUCTS = [
    {
        id: generateObjectId(1),  // "67a1b2c3d4e5f6a7b8c9d001"
        name: "Classic Espresso",
        image: coffee1,
        price: 149,
        discountPrice: 119,
    },
    {
        id: generateObjectId(2),  // "67a1b2c3d4e5f6a7b8c9d002"
        name: "Creamy Latte",
        image: coffee2,
        price: 199,
        discountPrice: 159,
    },
    {
        id: generateObjectId(3),  // "67a1b2c3d4e5f6a7b8c9d003"
        name: "Classic Cappuccino",
        image: coffee3,
        price: 219,
        discountPrice: 175,
    },
    {
        id: generateObjectId(4),  // "67a1b2c3d4e5f6a7b8c9d004"
        name: "Caramel Macchiato",
        image: coffee4,
        price: 249,
        discountPrice: null,
    },
    {
        id: generateObjectId(5),  // "67a1b2c3d4e5f6a7b8c9d005"
        name: "Mocha Delight",
        image: coffee5,
        price: 239,
        discountPrice: 191,
    },
    {
        id: generateObjectId(6),  // "67a1b2c3d4e5f6a7b8c9d006"
        name: "Americano",
        image: coffee6,
        price: 169,
        discountPrice: null,
    },
    {
        id: generateObjectId(7),  // "67a1b2c3d4e5f6a7b8c9d007"
        name: "Cold Coffee",
        image: coffee7,
        price: 179,
        discountPrice: 143,
    },
    {
        id: generateObjectId(8),  // "67a1b2c3d4e5f6a7b8c9d008"
        name: "Caramel Frappe",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=60",
        price: 269,
        discountPrice: 215,
    },
    {
        id: generateObjectId(9),  // "67a1b2c3d4e5f6a7b8c9d009"
        name: "Iced Vanilla Latte",
        image: "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=400&q=60",
        price: 229,
        discountPrice: null,
    },
    {
        id: generateObjectId(10), // "67a1b2c3d4e5f6a7b8c9d010"
        name: "Cold Brew",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=60",
        price: 249,
        discountPrice: 199,
    },
    {
        id: generateObjectId(11), // "67a1b2c3d4e5f6a7b8c9d011"
        name: "Affogato",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=60",
        price: 289,
        discountPrice: null,
    },
    {
        id: generateObjectId(12), // "67a1b2c3d4e5f6a7b8c9d012"
        name: "Flat White",
        image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&q=60",
        price: 219,
        discountPrice: 175,
    },
];

export const CATEGORIES = [
    { id: 1, name: "Beverages", icon: FaCoffee },
    { id: 2, name: "Foods", icon: FaUtensils },
    { id: 3, name: "Desserts", icon: FaBirthdayCake },
    { id: 5, name: "Combos", icon: FaThLarge },
    { id: 6, name: "Seasonal", icon: FaLeaf },
    // ✅ Duplicate remove karo
];

export const getDiscountPercentage = (price, discountPrice) => {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
};

export const getProductById = (id) => {
    return COFFEE_PRODUCTS.find(product => product.id === id);
};

export const getDiscountedProducts = () => {
    return COFFEE_PRODUCTS.filter(product => product.discountPrice !== null);
};

export default COFFEE_PRODUCTS;