// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getCart } from '../redux/Slicer/cartSlice';
import { getWishlist, removeFromWishlist, clearWishlist } from '../redux/Slicer/wishlistSlice'; // ✅ Redux Wishlist
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Redux se wishlist items lo
    const { items: wishlistItems, wishlistCount, loading } = useSelector((state) => state.wishlist);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [addedItems, setAddedItems] = useState({});

    // ✅ Page load par wishlist fetch karo
    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    // ✅ Navbar dark
    useEffect(() => {
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        }
        return () => {
            if (navbar) {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
                navbar.style.boxShadow = '';
            }
        };
    }, []);

    // ✅ Handle add to cart from wishlist - FIXED: Added amount field
    const handleAddToCart = async (item) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Get coffee data
        const coffeeData = item.coffee || item;
        const coffeeId = coffeeData._id || item._id || item.id;
        
        // Calculate amount (use discountPrice if available, otherwise use price)
        const amount = coffeeData.discountPrice || coffeeData.price;

        try {
            const result = await dispatch(addToCart({
                coffeeId: coffeeId,
                quantity: 1,
                amount: amount // ✅ Added amount field
            }));

            if (addToCart.fulfilled.match(result)) {
                await dispatch(getCart());
                setAddedItems(prev => ({ ...prev, [item._id || item.id]: true }));
                setTimeout(() => {
                    setAddedItems(prev => ({ ...prev, [item._id || item.id]: false }));
                }, 1500);
            }
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    // ✅ Handle add all to cart - FIXED: Added amount field
    const handleAddAllToCart = async () => {
        if (wishlistItems.length === 0) return;

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            for (const item of wishlistItems) {
                const coffeeData = item.coffee || item;
                const coffeeId = coffeeData._id || item._id || item.id;
                const amount = coffeeData.discountPrice || coffeeData.price;
                
                await dispatch(addToCart({
                    coffeeId: coffeeId,
                    quantity: 1,
                    amount: amount // ✅ Added amount field
                }));
            }
            await dispatch(getCart());
        } catch (error) {
            console.error("Add all to cart error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = (itemId) => {
        dispatch(removeFromWishlist(itemId))
            .unwrap()
            .then(() => {
                // Success - automatically removed from state
            })
            .catch((error) => {
                console.error("Failed to remove:", error);
            });
    };

    const handleClearWishlist = () => {
        if (window.confirm('Remove all items from wishlist?')) {
            // ✅ Saare items ek-ek karke remove karo
            wishlistItems.forEach(item => {
                dispatch(removeFromWishlist(item._id));
            });
        }
    };

    const handleContinueShopping = () => {
        navigate("/menu");
    };

    // ✅ Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ✅ Empty state
    if (wishlistItems.length === 0) {
        return (
            <>
                <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className=" bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center shadow-2xl shadow-black/5">
                            <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/40  rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/30">
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
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                    My <span className="text-[#0D7C53]">Wishlist</span>
                                </h1>
                                <p className="text-sm text-gray-500">{wishlistItems.length} items</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleClearWishlist}
                                className="text-sm sm:text-base text-red-500 hover:text-red-600 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50/50  border border-red-200/50 hover:bg-red-100/50 transition-all flex-shrink-0"
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

                    {/* Wishlist Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Wishlist Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {wishlistItems.map((item) => {
                                // ✅ Backend se item ka structure
                                const coffeeData = item.coffee || item;
                                const itemId = item._id;
                                const coffeeId = coffeeData._id || itemId;
                                
                                // Calculate display price
                                const displayPrice = coffeeData.discountPrice || coffeeData.price || 0;
                                const originalPrice = coffeeData.price;

                                return (
                                    <div
                                        key={itemId}
                                        className="group  bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex gap-3 sm:gap-4">
                                            {/* Image */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-gray-100/50 border border-white/20">
                                                <img
                                                    src={coffeeData.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=☕'}
                                                    alt={coffeeData.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">
                                                            {coffeeData.name}
                                                        </h3>
                                                        <p className="text-[12px] sm:text-base text-gray-500 truncate">
                                                            {coffeeData.description || 'Coffee'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(itemId)}
                                                        className="p-1 rounded-full bg-red-200 hover:bg-red-300 transition-all opacity-80 group-hover:opacity-100 flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 hover:text-red-700" />
                                                    </button>
                                                </div>

                                                {/* Price Section */}
                                                <div className="flex flex-row items-center justify-between mt-1 sm:mt-2 gap-2">
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                        <span className="font-bold text-[#0D7C53] text-sm sm:text-base md:text-lg">
                                                            ₹{displayPrice.toFixed(2)}
                                                        </span>
                                                        {coffeeData.discountPrice && coffeeData.discountPrice < coffeeData.price && (
                                                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                                                ₹{originalPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Add to Cart Button */}
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${addedItems[itemId]
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gradient-to-r from-[#0D7C53] to-green-600 text-white hover:shadow-lg hover:scale-[1.02]'
                                                            }`}
                                                    >
                                                        {addedItems[itemId] ? (
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
                                );
                            })}
                        </div>

                        {/* Wishlist Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24  bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/5">
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
                                            ₹{wishlistItems.reduce((sum, item) => {
                                                const coffee = item.coffee || item;
                                                const price = coffee.discountPrice || coffee.price || 0;
                                                return sum + price;
                                            }, 0).toFixed(2)}
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

            <style>{`
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
                    .xs\\:inline { display: inline; }
                    .xs\\:hidden { display: none; }
                }
                @media (max-width: 479px) {
                    .xs\\:inline { display: none; }
                    .xs\\:hidden { display: inline; }
                }
                
            `}</style>
        </>
    );
};

export default WishlistPage;