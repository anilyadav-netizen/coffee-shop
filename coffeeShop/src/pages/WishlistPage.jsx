// src/pages/WishlistPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
    Heart,
    ShoppingBag,
    Trash2,
    ArrowRight,
    Coffee,
    ShoppingCart,
    ChevronLeft,
    X
} from 'lucide-react';


const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [addedItems, setAddedItems] = useState({});

    // Handle add to cart from wishlist
    const handleAddToCart = (item) => {
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.discountPrice || item.price,
            originalPrice: item.price,
            image: item.image,
            category: item.category || 'Coffee',
            quantity: 1
        };

        addToCart(cartItem);

        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    // Handle add all to cart
    const handleAddAllToCart = () => {
        if (wishlistItems.length === 0) return;

        setIsLoading(true);
        wishlistItems.forEach(item => {
            const cartItem = {
                id: item.id,
                name: item.name,
                price: item.discountPrice || item.price,
                originalPrice: item.price,
                image: item.image,
                category: item.category || 'Coffee',
                quantity: 1
            };
            addToCart(cartItem);
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    // Handle remove from wishlist
    const handleRemove = (itemId) => {
        removeFromWishlist(itemId);
    };

    // Handle continue shopping
    const handleContinueShopping = () => {
        navigate("/menu");
    };

    // Empty state
    if (wishlistItems.length === 0) {
        return (
            <>
                <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center shadow-2xl shadow-black/5">
                            <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/30">
                                    <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#0D7C53]" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                                    Your Wishlist is Empty
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 sm:mb-8 px-2">
                                    Start adding your favourite coffee items by clicking the heart icon on any product.
                                </p>
                                <button
                                    onClick={handleContinueShopping}
                                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                                >
                                    <Coffee size={18} className="sm:w-5 sm:h-5" />
                                    Browse Menu
                                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 pb-10 overflow-hidden">

                {/* Glass Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EDE0D4]/20 via-transparent to-[#D4B896]/10" />
                    <div className="absolute top-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-400/15 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-700/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-slow-delay" />
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute top-20 left-10 text-4xl sm:text-6xl rotate-12 animate-float">🫘</div>
                        <div className="absolute bottom-32 right-20 text-4xl sm:text-6xl -rotate-12 animate-float-delay">☕</div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 mt-8">
                    {/* Header - Exactly Like CartPage */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            {/* <button
                                onClick={() => navigate(-1)}
                                className="p-1.5 sm:p-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/30 hover:bg-white/50 transition-all flex-shrink-0"
                            >
                                <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-gray-700" />
                            </button> */}
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                    My <span className="text-[#0D7C53]">Wishlist</span>
                                </h1>
                                {/* <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {wishlistItems.length} items saved
                                </p> */}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    if (window.confirm('Remove all items from wishlist?')) {
                                        clearWishlist();
                                    }
                                }}
                                className="text-sm sm:text-base text-red-500 hover:text-red-600 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50/50 backdrop-blur-sm border border-red-200/50 hover:bg-red-100/50 transition-all flex-shrink-0"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={handleAddAllToCart}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0D7C53] text-white rounded-full font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl text-[10px] sm:text-sm disabled:opacity-70 flex-shrink-0"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Add All to Cart</span>
                                        <span className="xs:hidden text-sm sm:text-base">Add All</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Wishlist Grid - Exactly Like CartPage */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Wishlist Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {wishlistItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex gap-3 sm:gap-4">
                                        {/* Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-gray-100/50 border border-white/20">
                                            <img
                                                src={item.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=☕'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-800 text-base sm:text-base truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[12px] sm:text-sm text-gray-500 truncate">
                                                        {item.category || 'Coffee'}
                                                    </p>
                                                </div>
                                                {/* ✅ Delete Button - Red Color like CartPage */}
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="p-1 rounded-full bg-red-200 hover:bg-red-300 transition-all opacity-80 group-hover:opacity-100 flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 hover:text-red-700" />
                                                </button>
                                            </div>

                                            {/* Price Section - No Quantity */}
                                            <div className="flex flex-row items-center justify-between mt-2 sm:mt-3 gap-2">
                                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                    <span className="font-bold text-[#0D7C53] text-sm sm:text-base md:text-lg">
                                                        ₹{(item.discountPrice || item.price).toFixed(2)}
                                                    </span>
                                                    {item.discountPrice && (
                                                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                                            ₹{item.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Add to Cart Button - Small */}
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${addedItems[item.id]
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gradient-to-r from-[#0D7C53] to-green-600 text-white hover:shadow-lg hover:scale-[1.02]'
                                                        }`}
                                                >
                                                    {addedItems[item.id] ? (
                                                        <>
                                                            <span>Added ✓</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart size={14} className="sm:w-3.5 sm:h-3.5" />
                                                            Add
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary - Same as CartPage */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/5">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                                    Wishlist Summary
                                </h3>

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Total Items</span>
                                        <span className="font-medium text-gray-800">{wishlistItems.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Estimated Total</span>
                                        <span className="font-medium text-gray-800">
                                            ₹{wishlistItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200/50 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                        <div className="flex justify-between text-lg sm:text-xl font-bold">
                                            <span className="text-gray-800">Items</span>
                                            <span className="text-[#0D7C53]">
                                                {wishlistItems.length} items
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Add All to Cart Button */}
                                <button
                                    onClick={handleAddAllToCart}
                                    disabled={isLoading}
                                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 text-sm sm:text-base"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Adding All...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span>Add All to Cart</span>
                                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3">
                                    ❤️ {wishlistItems.length} items in your wishlist
                                </p>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full mt-2 sm:mt-3 text-center text-[10px] sm:text-sm text-gray-500 hover:text-[#0D7C53] transition-all"
                                >
                                    ← Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
                
                @media (min-width: 480px) {
                    .xs\:inline { display: inline; }
                    .xs\:hidden { display: none; }
                }
                @media (max-width: 479px) {
                    .xs\:inline { display: none; }
                    .xs\:hidden { display: inline; }
                }
            `}</style>
        </>
    );
};

export default WishlistPage;