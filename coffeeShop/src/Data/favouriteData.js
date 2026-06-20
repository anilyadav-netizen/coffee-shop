// data/favouriteData.js
export const FAVOURITE_ITEMS = [
    {
        id: 101,
        categoryId: 1,
        name: "Creamy Ice Coffee",
        price: 5.8,
        originalPrice: 8.0,
        points: 50,
        isFeatured: true,
        description: "Smooth and creamy iced coffee",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop&auto=format",
        rating: 4.8,
        reviews: 124,
        isFavourite: true
    },
    {
        id: 102,
        categoryId: 1,
        name: "Hot Creamy Cappuccino",
        price: 12.6,
        originalPrice: null,
        points: 50,
        isFeatured: true,
        description: "Rich espresso with creamy steamed milk",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop&auto=format",
        rating: 4.9,
        reviews: 98,
        isFavourite: true
    },
    {
        id: 201,
        categoryId: 2,
        name: "Classic Burger",
        price: 9.9,
        originalPrice: 12.0,
        points: 30,
        isFeatured: true,
        description: "Juicy beef patty with fresh lettuce and cheese",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop&auto=format",
        rating: 4.7,
        reviews: 87,
        isFavourite: true
    },
    {
        id: 301,
        categoryId: 3,
        name: "Chocolate Cake",
        price: 6.5,
        originalPrice: 8.0,
        points: 30,
        isFeatured: true,
        description: "Rich chocolate cake with ganache",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&auto=format",
        rating: 4.9,
        reviews: 156,
        isFavourite: true
    },
    {
        id: 303,
        categoryId: 3,
        name: "Tiramisu",
        price: 8.0,
        originalPrice: 10.0,
        points: 40,
        isFeatured: false,
        description: "Italian coffee flavored dessert",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop&auto=format",
        rating: 4.8,
        reviews: 112,
        isFavourite: true
    },
    {
        id: 401,
        categoryId: 4,
        name: "Family Combo",
        price: 25.0,
        originalPrice: 30.0,
        points: 100,
        isFeatured: true,
        description: "2 pizzas + 1 salad + 4 drinks",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop&auto=format",
        rating: 4.6,
        reviews: 67,
        isFavourite: true
    },
    {
        id: 502,
        categoryId: 5,
        name: "Mango Smoothie",
        price: 6.0,
        originalPrice: 7.5,
        points: 28,
        isFeatured: false,
        description: "Fresh mango smoothie (Summer special)",
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=300&fit=crop&auto=format",
        rating: 4.5,
        reviews: 45,
        isFavourite: true
    }
];

// Helper function to get favourite items
export const getFavouriteItems = () => {
    return FAVOURITE_ITEMS;
};

// Helper function to toggle favourite status
export const toggleFavourite = (itemId) => {
    const item = FAVOURITE_ITEMS.find(item => item.id === itemId);
    if (item) {
        item.isFavourite = !item.isFavourite;
    }
    return FAVOURITE_ITEMS;
};

// Helper function to check if item is favourite
export const isItemFavourite = (itemId) => {
    const item = FAVOURITE_ITEMS.find(item => item.id === itemId);
    return item ? item.isFavourite : false;
};

// Get favourite count
export const getFavouriteCount = () => {
    return FAVOURITE_ITEMS.filter(item => item.isFavourite).length;
};