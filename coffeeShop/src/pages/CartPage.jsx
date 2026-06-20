// src/components/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    ShoppingCart,
    X,
    Plus,
    Minus,
    Trash2,
    ArrowRight,
    Coffee,
    ShoppingBag,
    Heart,
    Sparkles,
    ChevronLeft
} from "lucide-react";


const CartPage = () => {
    const {
        cartItems,
        totalItems,
        totalPrice,
        removeFromCart,
        updateQuantity,
        clearCart,
        closeCart
    } = useCart();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        navigate(-1);
    };

    const handleCheckout = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/checkout');
        }, 1000);
    };

    const handleContinueShopping = () => {
        navigate("/menu");
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center shadow-2xl shadow-black/5">
                            <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/30">
                                    <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-[#0D7C53]" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                                    Your Cart is Empty
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 sm:mb-8 px-2">
                                    Looks like you haven't added any items to your cart yet.
                                    Start exploring our delicious coffee collection!
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
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 pb-10 overflow-hidden">
                
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

                <div className="max-w-7xl mx-auto relative z-10 mt-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                           
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                    Your <span className="text-[#0D7C53]">Cart</span>
                                </h1>
                            </div>
                        </div>
                        <button
                            onClick={clearCart}
                            className="text-sm sm:text-base text-red-500 hover:text-red-600 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50/50 backdrop-blur-sm border border-red-200/50 hover:bg-red-100/50 transition-all flex-shrink-0"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {cartItems.map((item) => (
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
                                                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[12px] sm:text-sm text-gray-500 truncate">
                                                        {item.category || 'Coffee'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 rounded-full  bg-red-200 hover:bg-red-300 transition-all opacity-80 group-hover:opacity-100 flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 hover:text-red-600" />
                                                </button>
                                            </div>

                                            {/* Price & Quantity - Side by Side */}
                                            <div className="flex flex-row items-center justify-between mt-2 sm:mt-3 gap-2">
                                                {/* Price - Left Side */}
                                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                    <span className="font-bold text-[#0D7C53] text-sm sm:text-base md:text-lg">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    {item.originalPrice && (
                                                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                                            ₹{(item.originalPrice * item.quantity).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls - Right Side */}
                                                <div className="flex items-center gap-1 sm:gap-2 bg-white/50 backdrop-blur-sm rounded-full p-0.5 sm:p-1 border border-white/30 flex-shrink-0">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
                                                    >
                                                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
                                                    </button>
                                                    <span className="w-5 sm:w-6 md:w-8 text-center font-semibold text-sm sm:text-base text-gray-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#0D7C53] hover:bg-green-700 flex items-center justify-center transition-all duration-300"
                                                    >
                                                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/5">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-gray-800">₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Delivery Fee</span>
                                        <span className="font-medium text-gray-800">
                                            {totalPrice > 500 ? 'FREE' : '₹50.00'}
                                        </span>
                                    </div>
                                    {totalPrice > 500 && (
                                        <div className="flex justify-between text-[10px] sm:text-xs text-green-600 bg-green-50/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-200/50">
                                            <span>🎉 Free delivery on orders above ₹500</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200/50 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                        <div className="flex justify-between text-base sm:text-lg font-bold">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-[#0D7C53]">
                                                ₹{(totalPrice + (totalPrice > 500 ? 0 : 50)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <div className="flex gap-1 sm:gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon code"
                                            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/40 backdrop-blur-sm border border-white/30 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent placeholder:text-xs sm:placeholder:text-sm"
                                        />
                                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0D7C53]/10 text-[#0D7C53] rounded-full text-[12px] sm:text-sm font-semibold hover:bg-[#0D7C53] hover:text-white transition-all duration-300 whitespace-nowrap">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 text-base sm:text-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span>Proceed to Checkout</span>
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3">
                                    🔒 Secure checkout • Free delivery on orders above ₹500
                                </p>

                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full mt-2 sm:mt-3 text-center text-[10px] sm:text-sm text-gray-500 hover:text-[#0D7C53] transition-all"
                                >
                                    ← Continue Shopping
                                </button> */}
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
            `}</style>
        </>
    );
};

export default CartPage;