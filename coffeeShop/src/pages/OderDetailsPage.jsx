import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    ShoppingBag,
    CheckCircle,
    Coffee,
    Clock
} from "lucide-react";

const OrderDetailsPage = () => {
    const navigate = useNavigate();

    // ✅ NAVBAR DARK - Same as WishlistPage (IMMEDIATELY DARK)
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

    // Temporary Data
    const order = {
        _id: "ORD-2026-001",
        paymentId: "PAY_123456789",
        orderStatus: "Paid",
        createdAt: "24 June 2026",
        totalAmount: 856,

        items: [
            {
                _id: 1,
                name: "Iced Latte",
                quantity: 2,
                price: 267,
                image: "https://i.ibb.co/h1gscyD4/coffee1.jpg",
            },
            {
                _id: 2,
                name: "Cappuccino",
                quantity: 1,
                price: 322,
                image: "https://i.ibb.co/h1gscyD4/coffee1.jpg",
            },
        ],
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 pb-10 overflow-hidden">

                {/* Glass Background - Same as WishlistPage */}
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

                    {/* Header - Same style as WishlistPage */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg backdrop-blur-xl bg-white/30 border border-white/40 shadow-md hover:shadow-lg transition-all"
                            >
                                <ArrowLeft size={20} className="text-gray-700" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                    Order <span className="text-[#0D7C53]">Details</span>
                                </h1>
                                <p className="text-sm text-gray-500">Track your order status</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100/60 backdrop-blur-sm border border-green-200/50 rounded-full text-green-700 text-[10px] sm:text-sm font-medium">
                                <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    {/* Success Message - Glassmorphism Style */}
                    <div className="backdrop-blur-xl bg-green-50/60 border border-green-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg shadow-black/5">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100/80 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={28} className="sm:w-8 sm:h-8 text-green-600" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-lg sm:text-xl font-bold text-green-700">
                                    Order Placed Successfully 🎉
                                </h2>
                                <p className="text-sm sm:text-base text-green-600 mt-0.5 sm:mt-1">
                                    Your payment has been completed successfully.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                        {/* Left Section */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">

                            {/* Order Information - Glassmorphism Card */}
                            <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                    <div className="p-1.5 sm:p-2 bg-amber-100/60 rounded-lg">
                                        <Package size={18} className="sm:w-5 sm:h-5 text-amber-600" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                        Order Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </p>
                                        <p className="font-semibold text-sm sm:text-base text-gray-800 mt-0.5">
                                            {order._id}
                                        </p>
                                    </div>

                                    <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                            Order Date
                                        </p>
                                        <p className="font-semibold text-sm sm:text-base text-gray-800 mt-0.5 flex items-center gap-1.5">
                                            <Clock size={14} className="text-gray-400" />
                                            {order.createdAt}
                                        </p>
                                    </div>

                                    <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                            Payment ID
                                        </p>
                                        <p className="font-semibold text-sm sm:text-base text-gray-800 mt-0.5 truncate">
                                            {order.paymentId}
                                        </p>
                                    </div>

                                    <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                            Status
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 mt-0.5 rounded-full bg-green-100/60 text-green-700 text-[10px] sm:text-xs font-medium border border-green-200/50">
                                            <CheckCircle size={12} className="sm:w-3 sm:h-3" />
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Purchased Items - Glassmorphism Card */}
                            <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                    <div className="p-1.5 sm:p-2 bg-amber-100/60 rounded-lg">
                                        <ShoppingBag size={18} className="sm:w-5 sm:h-5 text-amber-600" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                        Ordered Items
                                    </h2>
                                    <span className="ml-auto text-xs sm:text-sm text-gray-500">
                                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                                    </span>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full sm:w-20 md:w-24 h-20 sm:h-20 md:h-24 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                                            {item.name}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                                Qty: {item.quantity}
                                                            </span>
                                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                                ₹{item.price} each
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-[#0D7C53] text-sm sm:text-base md:text-lg flex-shrink-0">
                                                        ₹{item.price * item.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Order Summary (Same style as Wishlist Summary) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/5">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Total Items</span>
                                        <span className="font-medium text-gray-800">
                                            {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Order Status</span>
                                        <span className="text-green-600 font-semibold flex items-center gap-1">
                                            <CheckCircle size={14} />
                                            Paid
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Transaction ID</span>
                                        <span className="text-sm sm:text-base text-gray-600 truncate max-w-[120px] sm:max-w-[150px]">
                                            {order.paymentId}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="font-medium text-gray-800">Online</span>
                                    </div>

                                    <div className="border-t border-gray-200/50 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                        <div className="flex justify-between text-lg sm:text-xl font-bold">
                                            <span className="text-gray-800">Total Paid</span>
                                            <span className="text-[#0D7C53]">
                                                ₹{order.totalAmount}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <button
                                    onClick={() => navigate('/menu')}
                                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
                                >
                                    <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span>Order Again</span>
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full mt-2 sm:mt-3 text-center text-[10px] sm:text-sm text-gray-500 hover:text-[#0D7C53] transition-all"
                                >
                                    ← Back to Orders
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Animations - Same as WishlistPage */}
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

export default OrderDetailsPage;