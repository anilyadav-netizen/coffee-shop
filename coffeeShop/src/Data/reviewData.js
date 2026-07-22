// data/reviewData.js

export const REVIEWS_DATA = [
    {
        id: 1,
        name: "Arjun Mehta",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-15",
        review: "Absolutely love the coffee here! The ambiance is perfect for working or catching up with friends. Their caramel latte is my go-to drink. The baristas are incredibly skilled and always friendly.",
        location: "Mumbai, India"
    },
    {
        id: 2,
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-14",
        review: "Best coffee shop in town! The cold brew is amazing and the staff is super welcoming. I love coming here every morning before work. Their pastries are freshly baked too!",
        location: "Delhi, India"
    },
    {
        id: 3,
        name: "Vikram Singh",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format",
        rating: 4,
        date: "2024-12-13",
        review: "Great place to hang out with friends. The cappuccino is perfectly brewed and the seating is comfortable. Would definitely recommend the hazelnut latte.",
        location: "Bangalore, India"
    },
    {
        id: 4,
        name: "Neha Reddy",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-12",
        review: "The mocha frappuccino is to die for! The atmosphere is cozy and perfect for reading or working. They have great WiFi and plenty of power outlets. My favorite coffee spot!",
        location: "Hyderabad, India"
    },
    {
        id: 5,
        name: "Rahul Kapoor",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
        rating: 4,
        date: "2024-12-11",
        review: "Excellent coffee and service. The cappuccino was perfectly made with beautiful latte art. The cheesecake was also delicious. Will definitely visit again!",
        location: "Pune, India"
    },
    {
        id: 6,
        name: "Ananya Desai",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-10",
        review: "This place is a hidden gem! The coffee is always fresh, and the staff remembers your order. The outdoor seating area is beautiful, especially during sunset. Highly recommend!",
        location: "Chennai, India"
    },
    {
        id: 7,
        name: "Suresh Kumar",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&auto=format",
        rating: 3,
        date: "2024-12-09",
        review: "Good coffee but the service was a bit slow during peak hours. The place was crowded but the quality of coffee made up for it. The hazelnut latte was really good.",
        location: "Kolkata, India"
    },
    {
        id: 8,
        name: "Meera Patel",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-08",
        review: "The perfect place for coffee lovers! Their single-origin coffee is exceptional. The baristas are knowledgeable and passionate about coffee. A must-visit for true coffee connoisseurs!",
        location: "Ahmedabad, India"
    },
    {
        id: 9,
        name: "Amit Joshi",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
        rating: 4,
        date: "2024-12-07",
        review: "Visited with family and everyone loved the food and drinks. The iced coffee was refreshing and the sandwiches were perfectly prepared. Great value for money.",
        location: "Jaipur, India"
    },
    {
        id: 10,
        name: "Kavya Nair",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-06",
        review: "CoffeeHub is my happy place! The staff is incredibly friendly, and the coffee is always consistent. The seasonal specials are always interesting to try. Can't get enough of this place!",
        location: "Kochi, India"
    },
    {
        id: 11,
        name: "Ravi Shankar",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&auto=format",
        rating: 4,
        date: "2024-12-05",
        review: "Great coffee and even better service! The matcha latte was perfect and the staff helped me choose the right drink. The ambiance is relaxing and perfect for weekend mornings.",
        location: "Chandigarh, India"
    },
    {
        id: 12,
        name: "Sana Khan",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&auto=format",
        rating: 5,
        date: "2024-12-04",
        review: "I'm a regular here and they never disappoint. The caramel macchiato is my absolute favorite! The staff knows me by name and always makes my day with their warm welcome.",
        location: "Lucknow, India"
    }
];

// ========== HELPER FUNCTIONS ==========

// ✅ CORRECT: Named exports with 'export' keyword
export const getReviews = () => {
    return REVIEWS_DATA;
};

export const getReviewsByRating = (rating) => {
    return REVIEWS_DATA.filter(review => review.rating === rating);
};

export const getRecentReviews = (limit = 4) => {
    const sorted = [...REVIEWS_DATA].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    return sorted.slice(0, limit);
};

export const getTopRatedReviews = (limit = 4) => {
    const sorted = [...REVIEWS_DATA].sort((a, b) => b.rating - a.rating);
    return sorted.slice(0, limit);
};

export const getReviewStats = () => {
    const total = REVIEWS_DATA.length;
    const avgRating = REVIEWS_DATA.reduce((acc, curr) => acc + curr.rating, 0) / total;
    const ratingCounts = {
        5: REVIEWS_DATA.filter(r => r.rating === 5).length,
        4: REVIEWS_DATA.filter(r => r.rating === 4).length,
        3: REVIEWS_DATA.filter(r => r.rating === 3).length,
        2: REVIEWS_DATA.filter(r => r.rating === 2).length,
        1: REVIEWS_DATA.filter(r => r.rating === 1).length
    };

    return {
        total,
        avgRating: avgRating.toFixed(1),
        ratingCounts
    };
};

export const searchReviews = (query) => {
    const searchTerm = query.toLowerCase().trim();
    return REVIEWS_DATA.filter(review =>
        review.name.toLowerCase().includes(searchTerm) ||
        review.review.toLowerCase().includes(searchTerm) ||
        review.location.toLowerCase().includes(searchTerm)
    );
};

export const getReviewById = (id) => {
    return REVIEWS_DATA.find(review => review.id === id);
};

export const getTotalReviews = () => {
    return REVIEWS_DATA.length;
};

export const getRandomReviews = (limit = 4) => {
    const shuffled = [...REVIEWS_DATA].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
};