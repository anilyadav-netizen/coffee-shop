import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getMyOrders } from "../redux/Slicer/paymentSlice";
import {
    ArrowLeft,
    Package,
    ShoppingBag,
    CheckCircle,
    Coffee,
    Clock,
    Calendar,
    CreditCard
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const OrderDetailsPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // ✅ Get orders from Redux
    const { orders, loading } = useSelector((state) => state.payment);
    
    // ✅ State for selected order (from navigation state or first order)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    // ✅ Process orders when they arrive
    useEffect(() => {
        if (orders && orders.length > 0) {
            // Check if we have a specific order from navigation state
            const orderFromState = location.state?.order;
            
            if (orderFromState) {
                // Find the full order data from the orders list
                const fullOrder = orders.find(o => o._id === orderFromState._id);
                if (fullOrder) {
                    setSelectedOrder(fullOrder);
                    setOrderItems(fullOrder.products || []);
                } else {
                    // If not found, use the first order
                    setSelectedOrder(orders[0]);
                    setOrderItems(orders[0].products || []);
                }
            } else {
                // Use the first order by default
                setSelectedOrder(orders[0]);
                setOrderItems(orders[0].products || []);
            }
        }
    }, [orders, location.state]);

    // ✅ NAVBAR DARK - Same as WishlistPage
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

    // ✅ Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ✅ Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ✅ No orders state
    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center shadow-2xl shadow-black/5">
                        <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/30">
                                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-[#0D7C53]" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                                No Orders Found
                            </h2>
                            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 sm:mb-8 px-2">
                                You haven't placed any orders yet. Start exploring our menu and place your first order!
                            </p>
                            <button
                                onClick={() => navigate('/menu')}
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                            >
                                <Coffee size={18} className="sm:w-5 sm:h-5" />
                                Browse Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ No selected order
    if (!selectedOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">No order selected</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="mt-4 px-4 py-2 bg-[#0D7C53] text-white rounded-lg"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Calculate total items
    const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

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
                                <p className="text-sm text-gray-500">#{selectedOrder._id?.slice(-8) || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <span className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm border rounded-full text-[10px] sm:text-sm font-medium ${
                                selectedOrder.status === 'paid' 
                                    ? 'bg-green-100/60 border-green-200/50 text-green-700'
                                    : 'bg-yellow-100/60 border-yellow-200/50 text-yellow-700'
                            }`}>
                                <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                                {selectedOrder.status || 'Processing'}
                            </span>
                        </div>
                    </div>

                    {/* Success Message */}
                    {selectedOrder.status === 'paid' && (
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
                                        Your payment has been completed successfully on {formatDate(selectedOrder.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                        {/* Left Section - Order Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">

                            {/* Order Information */}
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
                                        <p className="font-semibold text-sm sm:text-base text-gray-800 mt-0.5 truncate">
                                            {selectedOrder._id}
                                        </p>
                                    </div>

                                    <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                            Order Date
                                        </p>
                                        <p className="font-semibold text-sm sm:text-base text-gray-800 mt-0.5 flex items-center gap-1.5">
                                            <Calendar size={14} className="text-gray-400" />
                                            {formatDate(selectedOrder.createdAt)}
                                        </p>
                                    </div>

                                    {selectedOrder.razorpayPaymentId && (
                                        <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                                Payment ID
                                            </p>
                                            <p className="font-semibold text-sm sm:text-base text-gray-800 mt-0.5 truncate flex items-center gap-1.5">
                                                <CreditCard size={14} className="text-gray-400" />
                                                {selectedOrder.razorpayPaymentId}
                                            </p>
                                        </div>
                                    )}

                                    <div className="backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30">
                                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                                            Status
                                        </p>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 mt-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${
                                            selectedOrder.status === 'paid'
                                                ? 'bg-green-100/60 text-green-700 border-green-200/50'
                                                : 'bg-yellow-100/60 text-yellow-700 border-yellow-200/50'
                                        }`}>
                                            <CheckCircle size={12} className="sm:w-3 sm:h-3" />
                                            {selectedOrder.status || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Purchased Items */}
                            <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                                    <div className="p-1.5 sm:p-2 bg-amber-100/60 rounded-lg">
                                        <ShoppingBag size={18} className="sm:w-5 sm:h-5 text-amber-600" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                        Ordered Items
                                    </h2>
                                    <span className="ml-auto text-xs sm:text-sm text-gray-500">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    {orderItems.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 backdrop-blur-sm bg-white/20 rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300"
                                        >
                                            <img
                                                src={item.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=☕'}
                                                alt={item.name}
                                                className="w-full sm:w-20 md:w-24 h-20 sm:h-20 md:h-24 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=☕';
                                                }}
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                                            {item.name}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                                Qty: {item.quantity || 1}
                                                            </span>
                                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                                ₹{item.price || 0} each
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-[#0D7C53] text-sm sm:text-base md:text-lg flex-shrink-0">
                                                        ₹{(item.price || 0) * (item.quantity || 1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24 backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/5">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Total Items</span>
                                        <span className="font-medium text-gray-800">{totalItems}</span>
                                    </div>

                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Order Status</span>
                                        <span className={`font-semibold flex items-center gap-1 ${
                                            selectedOrder.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            <CheckCircle size={14} />
                                            {selectedOrder.status || 'Processing'}
                                        </span>
                                    </div>

                                    {selectedOrder.razorpayPaymentId && (
                                        <div className="flex justify-between text-sm sm:text-base">
                                            <span className="text-gray-500">Transaction ID</span>
                                            <span className="text-sm sm:text-base text-gray-600 truncate max-w-[120px] sm:max-w-[150px]">
                                                {selectedOrder.razorpayPaymentId.slice(-8)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="font-medium text-gray-800">Online (Razorpay)</span>
                                    </div>

                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Order Date</span>
                                        <span className="text-gray-600 text-right text-xs sm:text-sm">
                                            {formatDate(selectedOrder.createdAt)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200/50 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                        <div className="flex justify-between text-lg sm:text-xl font-bold">
                                            <span className="text-gray-800">Total Paid</span>
                                            <span className="text-[#0D7C53]">
                                                ₹{selectedOrder.amount || 0}
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
                                    onClick={() => navigate('/orders')}
                                    className="w-full mt-2 sm:mt-3 text-center text-[10px] sm:text-sm text-gray-500 hover:text-[#0D7C53] transition-all"
                                >
                                    ← Back to Orders
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Animations */}
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