import {
    FaCoffee,
    FaUtensils,
    FaBirthdayCake,
    FaThLarge,
    FaLeaf
} from "react-icons/fa";

// ========== CATEGORIES ==========
export const CATEGORIES = [
    { id: 1, name: "Beverages", icon: FaCoffee },
    { id: 2, name: "Foods", icon: FaUtensils },
    { id: 3, name: "Desserts", icon: FaBirthdayCake },
    { id: 4, name: "Combos", icon: FaThLarge },
    { id: 5, name: "Seasonal", icon: FaLeaf }
];

// ========== MENU ITEMS ==========
export const MENU_ITEMS = {
    1: [ // Beverages
        {
            id: 101,
            name: "Creamy Ice Coffee",
            price: 5.8,
            originalPrice: 8.0,
            points: 50,
            isFeatured: true,
            description: "Smooth and creamy iced coffee with a hint of caramel",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 102,
            name: "Hot Creamy Cappuccino",
            price: 12.6,
            originalPrice: null,
            points: 50,
            isFeatured: true,
            description: "Rich espresso with creamy steamed milk",
            image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 103,
            name: "Latte Ombe",
            price: 8.5,
            originalPrice: 10.0,
            points: 30,
            isFeatured: false,
            description: "Smooth latte with a beautiful ombre effect",
            image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 104,
            name: "Cold Brew Coffee",
            price: 6.0,
            originalPrice: 7.5,
            points: 25,
            isFeatured: false,
            description: "Smooth cold brew with no bitterness",
            image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 105,
            name: "Mocha Frappuccino",
            price: 7.9,
            originalPrice: 9.5,
            points: 35,
            isFeatured: false,
            description: "Chocolate and coffee blended with ice",
            image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b6f?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 106,
            name: "Matcha Latte",
            price: 6.5,
            originalPrice: 8.0,
            points: 28,
            isFeatured: false,
            description: "Healthy matcha green tea with milk",
            image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 107,
            name: "Turkish Coffee",
            price: 4.5,
            originalPrice: null,
            points: 20,
            isFeatured: false,
            description: "Traditional Turkish coffee with foam",
            image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 108,
            name: "Affogato",
            price: 9.0,
            originalPrice: 11.0,
            points: 40,
            isFeatured: false,
            description: "Vanilla ice cream drowned in hot espresso",
            image: "https://images.unsplash.com/photo-1593614498458-6dacd51ba30b?w=300&h=300&fit=crop&auto=format"
        }
    ],

    2: [ // Foods
        {
            id: 201,
            name: "Classic Burger",
            price: 9.9,
            originalPrice: 12.0,
            points: 30,
            isFeatured: true,
            description: "Juicy beef patty with fresh lettuce and cheese",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 202,
            name: "Chicken Sandwich",
            price: 7.5,
            originalPrice: 9.0,
            points: 25,
            isFeatured: false,
            description: "Grilled chicken with avocado and greens",
            image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 203,
            name: "Margherita Pizza",
            price: 11.5,
            originalPrice: 14.0,
            points: 35,
            isFeatured: false,
            description: "Fresh mozzarella with basil and tomato sauce",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 204,
            name: "Caesar Salad",
            price: 6.5,
            originalPrice: 8.0,
            points: 20,
            isFeatured: false,
            description: "Crisp romaine with parmesan and dressing",
            image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 205,
            name: "Pasta Alfredo",
            price: 10.5,
            originalPrice: 12.5,
            points: 30,
            isFeatured: false,
            description: "Creamy fettuccine with garlic parmesan sauce",
            image: "https://images.unsplash.com/photo-1645112411342-4665a5b869b2?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 206,
            name: "Fish Tacos",
            price: 8.0,
            originalPrice: 9.5,
            points: 25,
            isFeatured: false,
            description: "Grilled fish with salsa and fresh veggies",
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 207,
            name: "Steak & Fries",
            price: 14.5,
            originalPrice: 17.0,
            points: 45,
            isFeatured: false,
            description: "Grilled steak with crispy fries",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 208,
            name: "Veggie Wrap",
            price: 5.5,
            originalPrice: 7.0,
            points: 18,
            isFeatured: false,
            description: "Fresh vegetables with hummus in a wrap",
            image: "https://images.unsplash.com/photo-1625938144745-ba7f5a3bf1d4?w=300&h=300&fit=crop&auto=format"
        }
    ],

    3: [ // Desserts
        {
            id: 301,
            name: "Chocolate Cake",
            price: 6.5,
            originalPrice: 8.0,
            points: 30,
            isFeatured: true,
            description: "Rich chocolate cake with ganache",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 302,
            name: "Cheesecake",
            price: 7.0,
            originalPrice: 9.0,
            points: 35,
            isFeatured: false,
            description: "Creamy New York style cheesecake",
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 303,
            name: "Tiramisu",
            price: 8.0,
            originalPrice: 10.0,
            points: 40,
            isFeatured: false,
            description: "Italian coffee flavored dessert",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 304,
            name: "Brownie Sundae",
            price: 5.5,
            originalPrice: 7.0,
            points: 25,
            isFeatured: false,
            description: "Warm brownie with vanilla ice cream",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 305,
            name: "Fruit Tart",
            price: 4.5,
            originalPrice: 6.0,
            points: 20,
            isFeatured: false,
            description: "Fresh fruit on creamy custard",
            image: "https://images.unsplash.com/photo-1519915028121-7d3463d20e13?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 306,
            name: "Ice Cream",
            price: 3.5,
            originalPrice: 4.5,
            points: 15,
            isFeatured: false,
            description: "Choice of 6 flavors",
            image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 307,
            name: "Creme Brulee",
            price: 9.0,
            originalPrice: 11.0,
            points: 45,
            isFeatured: false,
            description: "Classic vanilla custard with caramelized sugar",
            image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 308,
            name: "Pancakes",
            price: 5.0,
            originalPrice: 6.5,
            points: 22,
            isFeatured: false,
            description: "Fluffy pancakes with maple syrup",
            image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&h=300&fit=crop&auto=format"
        }
    ],

    4: [ // Combos
        {
            id: 401,
            name: "Family Combo",
            price: 25.0,
            originalPrice: 30.0,
            points: 100,
            isFeatured: true,
            description: "2 pizzas + 1 salad + 4 drinks",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 402,
            name: "Date Night Special",
            price: 18.5,
            originalPrice: 22.0,
            points: 75,
            isFeatured: false,
            description: "1 pizza + 2 drinks + 1 dessert",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 403,
            name: "Breakfast Combo",
            price: 10.0,
            originalPrice: 12.5,
            points: 40,
            isFeatured: false,
            description: "Coffee + sandwich + juice",
            image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 404,
            name: "Office Lunch",
            price: 12.5,
            originalPrice: 15.0,
            points: 50,
            isFeatured: false,
            description: "Pasta + salad + drink",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 405,
            name: "Party Platter",
            price: 35.0,
            originalPrice: 42.0,
            points: 150,
            isFeatured: false,
            description: "5 snacks + 2 dips + 3 drinks",
            image: "https://images.unsplash.com/photo-1547586696-e22b094a3c87?w=300&h=300&fit=crop&auto=format"
        }
    ],

    5: [ // Seasonal
        {
            id: 501,
            name: "Pumpkin Spice Latte",
            price: 7.5,
            originalPrice: 9.0,
            points: 35,
            isFeatured: true,
            description: "Limited edition pumpkin spice with cinnamon",
            image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b6f?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 502,
            name: "Mango Smoothie",
            price: 6.0,
            originalPrice: 7.5,
            points: 28,
            isFeatured: false,
            description: "Fresh mango smoothie (Summer special)",
            image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 503,
            name: "Gingerbread Cookie",
            price: 3.5,
            originalPrice: 4.5,
            points: 15,
            isFeatured: false,
            description: "Festive gingerbread cookie (Winter special)",
            image: "https://images.unsplash.com/photo-1565608083347-c0cd7d9b5f1f?w=300&h=300&fit=crop&auto=format"
        },
        {
            id: 504,
            name: "Watermelon Juice",
            price: 4.0,
            originalPrice: 5.0,
            points: 18,
            isFeatured: false,
            description: "Fresh watermelon juice (Summer special)",
            image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop&auto=format"
        }
    ]
};

// ========== HELPER FUNCTIONS ==========

// Get category by ID
export const getCategoryById = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId);
};

// Get items by category ID
export const getItemsByCategory = (categoryId) => {
    return MENU_ITEMS[categoryId] || [];
};

// Get category name by ID
export const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : "Unknown";
};

// Get total items count in a category
export const getCategoryItemCount = (categoryId) => {
    return getItemsByCategory(categoryId).length;
};