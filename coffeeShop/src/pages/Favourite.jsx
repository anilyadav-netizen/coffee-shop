import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavouriteItems, toggleFavourite, getFavouriteCount } from '../data/favouriteData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
    Heart,
    Star,
    Trash2,
    ShoppingBag,
    TrendingUp,
    ChevronRight,
    Coffee,
    Utensils,
    Cake,
    Package,
    Leaf,
    X,
    Search
} from 'lucide-react';

const Favourite = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [favourites, setFavourites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [addedItems, setAddedItems] = useState({});

    // Category mapping for icons
    const categoryIcons = {
        1: <Coffee className="w-4 h-4" />,
        2: <Utensils className="w-4 h-4" />,
        3: <Cake className="w-4 h-4" />,
        4: <Package className="w-4 h-4" />,
        5: <Leaf className="w-4 h-4" />
    };

    const categoryNames = {
        1: 'Beverages',
        2: 'Foods',
        3: 'Desserts',
        4: 'Combos',
        5: 'Seasonal'
    };

    useEffect(() => {
        const loadFavourites = () => {
            const items = getFavouriteItems();
            setFavourites(items.filter(item => item.isFavourite));
            setIsLoading(false);
        };
        loadFavourites();
    }, []);

    // ✅ Handle Add to Cart
    const handleAddToCart = (item, e) => {
        e.stopPropagation();
        
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            image: item.image,
            category: categoryNames[item.categoryId] || 'Coffee',
            quantity: 1
        };
        
        addToCart(cartItem);
        
        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    // ✅ Handle Wishlist Toggle
    const handleWishlistToggle = (item, e) => {
        e.stopPropagation();
        
        const wishlistItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            image: item.image,
            category: categoryNames[item.categoryId] || 'Coffee',
            description: item.description || 'Premium coffee blend',
            likes: item.rating || 0
        };
        
        toggleWishlist(wishlistItem);
    };

    const handleRemoveFavourite = (itemId) => {
        toggleFavourite(itemId);
        setFavourites(favourites.filter(item => item.id !== itemId));
    };

    const handleItemClick = (item) => {
        navigate(`/menu/${item.categoryId}`);
    };

    const handleViewAll = () => {
        navigate('/menu');
    };

    // Filter favourites by category
    const filteredFavourites = selectedCategory === 'all'
        ? favourites
        : favourites.filter(item => item.categoryId === parseInt(selectedCategory));

    const categories = ['all', ...new Set(favourites.map(item => item.categoryId))];

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading favourites...</p>
                </div>
            </div>
        );
    }

    if (favourites.length === 0) {
        return (
            <section className="relative py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5 max-w-2xl mx-auto">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-[#0D7C53]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-16 h-16 text-[#0D7C53]" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                                0
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">No Favourites Yet</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Start exploring our delicious menu and add your favourite items by clicking the heart icon.
                        </p>
                        <button
                            onClick={handleViewAll}
                            className="px-8 py-3 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            Explore Menu
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes pulse-slow {
                        0%, 100% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                    @keyframes pulse-slow-delay {
                        0%, 100% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.15); opacity: 0.7; }
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 8s ease-in-out infinite;
                    }
                    .animate-pulse-slow-delay {
                        animation: pulse-slow-delay 10s ease-in-out infinite;
                    }
                `}</style>
            </section>
        );
    }

    return (
        <section className="relative px-4 overflow-hidden pb-5">
            {/* Glass Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] animate-pulse-slow-delay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-20 left-10 text-6xl rotate-12 animate-float">🫘</div>
                    <div className="absolute bottom-32 right-20 text-6xl -rotate-12 animate-float-delay">🫘</div>
                    <div className="absolute top-1/3 right-1/4 text-4xl rotate-45 animate-float-slow">☕</div>
                    <div className="absolute bottom-1/4 left-1/3 text-5xl -rotate-45 animate-float-delay">🫘</div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[104rem] mx-auto relative z-10">
                {/* Header - Glass Effect */}
                <div className="backdrop-blur-xl rounded-3xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#0D7C53]">All Time Favourites</h2>
                                    <p className="text-gray-500 text-sm">Items Customer love the most</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleViewAll}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#0D7C53]/20 backdrop-blur-sm text-[#0D7C53] rounded-full font-medium hover:bg-[#0D7C53] hover:text-white transition-all duration-300 border border-white/30"
                        >
                            View All Menu
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Favourites Grid */}
                {filteredFavourites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFavourites.map((item) => {
                            const isWishlisted = isInWishlist(item.id);
                            const isAdded = addedItems[item.id];
                            
                            return (
                                <div
                                    key={item.id}
                                    className="group backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/5 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 relative"
                                >
                                    {/* Image Container */}
                                    <div
                                        className="relative h-56 overflow-hidden bg-gray-100/50 cursor-pointer"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                                            }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* ✅ Wishlist Icon - Top Right on Image */}
                                        <button
                                            onClick={(e) => handleWishlistToggle(item, e)}
                                            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
                                        >
                                            <Heart 
                                                size={18} 
                                                className={`transition-colors ${
                                                    isWishlisted 
                                                        ? 'fill-red-500 text-red-500' 
                                                        : 'text-gray-400 hover:text-red-500'
                                                }`}
                                            />
                                        </button>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/30">
                                            {categoryIcons[item.categoryId]}
                                            <span className="text-gray-700">{categoryNames[item.categoryId]}</span>
                                        </div>

                                        {/* Rating Badge */}
                                        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/20">
                                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                            {item.rating || 4.5}
                                        </div>

                                        {/* Quick View Button */}
                                        <button
                                            onClick={() => handleItemClick(item)}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md text-gray-800 px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#0D7C53] hover:text-white shadow-md border border-white/30"
                                        >
                                            View Item
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3
                                                className="font-bold text-gray-800 text-lg group-hover:text-[#0D7C53] transition-colors cursor-pointer line-clamp-1"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                {item.name}
                                            </h3>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">({item.reviews || 24})</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-[#0D7C53]">
                                                    ₹{item.price.toFixed(2)}
                                                </span>
                                                {item.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{item.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100/60 backdrop-blur-sm px-2 py-1 rounded-full">
                                                <TrendingUp size={12} />
                                                {item.points} Pts
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={(e) => handleAddToCart(item, e)}
                                            className={`w-full mt-4 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                                                isAdded
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gradient-to-r from-[#0D7C53] to-green-600 text-white hover:shadow-lg hover:shadow-[#0D7C53]/30'
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <span>Added ✓</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                    Add to Cart
                                                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl shadow-black/5 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gray-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">No Items in this Category</h3>
                            <p className="text-gray-500 mt-2">Try selecting a different category</p>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style >{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes pulse-slow-delay {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(15deg); }
                }
                
                @keyframes float-delay {
                    0%, 100% { transform: translateY(0px) rotate(-12deg); }
                    50% { transform: translateY(20px) rotate(-15deg); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(45deg); }
                    50% { transform: translateY(-15px) rotate(50deg); }
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-pulse-slow-delay {
                    animation: pulse-slow-delay 10s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delay {
                    animation: float-delay 7s ease-in-out infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 9s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default Favourite;