import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
    createOrder,
    verifyPayment,
    getMyOrders
} from "../redux/Slicer/paymentSlice";
import {
    getCart,
    removeCartItem,
    increaseQuantity,
    decreaseQuantity,
    clearCartState
} from '../redux/Slicer/cartSlice';
import {
    Plus,
    Minus,
    Trash2,
    ArrowRight,
    Coffee,
    ShoppingBag,
} from "lucide-react";

import AddressModal from '../Admin/adcomponent/AddressModel';

const CartPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // ✅ Order type state - Default to "delivery"
    const [orderType, setOrderType] = useState("delivery");

    // ✅ Address modal state
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    // Get cart data from Redux store
    const { cartItems, totalItems, totalPrice, loading } = useSelector((state) => state.cart);

    // Get payment state from Redux store
    const { order, paymentStatus, paymentError, loading: paymentProcessing } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    // ✅ Navbar force dark
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

    // ✅ Handle display of backend errors from Redux state
    useEffect(() => {
        if (paymentError) {
            setError(paymentError);
            setPaymentLoading(false);
        }
    }, [paymentError]);

    // ✅ Increase quantity
    const handleIncrease = async (coffeeId) => {
        if (!coffeeId) {
            console.error("❌ No coffeeId provided");
            setError("Invalid item ID");
            return;
        }

        setError(null);
        console.log("🔼 Increasing quantity for coffeeId:", coffeeId);

        try {
            const result = await dispatch(increaseQuantity(coffeeId)).unwrap();
            console.log("✅ Increase successful:", result);

            if (result.error) {
                setError(result.error);
            }
        } catch (error) {
            console.error("❌ Failed to increase:", error);
            setError(error || "Failed to increase quantity. Please try again.");

            try {
                await dispatch(getCart()).unwrap();
                console.log("✅ Cart refetched after error");
            } catch (refetchError) {
                console.error("❌ Failed to refetch cart:", refetchError);
            }
        }
    };

    // ✅ Decrease quantity
    const handleDecrease = async (coffeeId) => {
        if (!coffeeId) {
            console.error("❌ No coffeeId provided");
            setError("Invalid item ID");
            return;
        }

        setError(null);
        console.log("🔽 Decreasing quantity for coffeeId:", coffeeId);

        try {
            const result = await dispatch(decreaseQuantity(coffeeId)).unwrap();
            console.log("✅ Decrease successful:", result);

            if (result.error) {
                setError(result.error);
            }
        } catch (error) {
            console.error("❌ Failed to decrease:", error);
            setError(error || "Failed to decrease quantity. Please try again.");

            try {
                await dispatch(getCart()).unwrap();
                console.log("✅ Cart refetched after error");
            } catch (refetchError) {
                console.error("❌ Failed to refetch cart:", refetchError);
            }
        }
    };

    // ✅ Remove item
    const handleRemove = async (coffeeId) => {
        if (!coffeeId) {
            console.error("❌ No coffeeId provided");
            setError("Invalid item ID");
            return;
        }

        setError(null);
        console.log("🗑️ Removing item with coffeeId:", coffeeId);

        try {
            await dispatch(removeCartItem(coffeeId)).unwrap();
            console.log("✅ Remove successful");
        } catch (error) {
            console.error("❌ Failed to remove:", error);
            setError(error || "Failed to remove item. Please try again.");

            try {
                await dispatch(getCart()).unwrap();
            } catch (refetchError) {
                console.error("❌ Failed to refetch cart:", refetchError);
            }
        }
    };

    // ✅ Clear cart
    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            setError(null);
            try {
                for (const item of cartItems) {
                    const coffeeId = item.coffee?._id;
                    if (coffeeId) {
                        await dispatch(removeCartItem(coffeeId)).unwrap();
                    }
                }
                console.log("✅ Cart cleared successfully");
                await dispatch(getCart()).unwrap();
            } catch (error) {
                console.error("❌ Failed to clear cart:", error);
                setError("Failed to clear cart. Please try again.");
            }
        }
    };

    const handleContinueShopping = () => {
        navigate("/menu");
    };

    const handleSaveAddress = (address) => {
        console.log("📦 Address saved:", address);
        setDeliveryAddress(address);
        setIsAddressModalOpen(false);
        // After saving address, proceed with payment
        processPayment(address);
    };

    // ✅ FIXED: Process Payment with correct amount field
    const processPayment = async (address) => {
        console.log("========== PROCESS PAYMENT ==========");
        console.log("Address:", address);
        console.log("Order Type:", orderType);
        console.log("Cart Items:", cartItems);
        console.log("Total Price:", totalPrice);

        try {
            setPaymentLoading(true);
            setError(null);

            console.log("🔄 Creating payment order...");

            // ✅ Calculate delivery fee based on order type
            const deliveryFee = calculateDeliveryFee(totalPrice, orderType);
            const totalAmount = totalPrice + deliveryFee;

            console.log("💰 Total Amount to charge:", totalAmount);
            console.log("📦 Delivery Fee:", deliveryFee);

            // ✅ FIXED: Use 'amount' instead of 'totalAmount' - matches backend expectation
            const orderPayload = {
                amount: totalAmount,  // ✅ This matches the backend field name
                orderType: orderType
            };

            // ✅ Add deliveryAddress only if it's a delivery order
            if (orderType === "delivery" && address) {
                orderPayload.deliveryAddress = address;
            }

            console.log("📦 Order Payload being sent:", JSON.stringify(orderPayload, null, 2));

            // ✅ Create order with updated payload
            const result = await dispatch(createOrder(orderPayload)).unwrap();
            console.log("✅ Order creation result:", result);

            const orderData = result.order;
            console.log("✅ Order created successfully:", orderData);

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Rn6mAmy8ydPszM";

            // ✅ Initialize Razorpay options
            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                order_id: orderData.id,
                name: "Coffee Shop",
                description:
                    orderType === "dine_in"
                        ? `Dine-in order for ${totalItems} item(s)`
                        : `Delivery order for ${totalItems} item(s)`,
                image: "https://example.com/logo.png",
                prefill: {
                    name: "Customer",
                    email: "customer@example.com",
                    contact: "9999999999"
                },
                notes: {
                    orderType: orderType,
                    deliveryAddress: address ? JSON.stringify(address) : 'N/A'
                },
                theme: {
                    color: "#0D7C53"
                },
                handler: async function (response) {
                    console.log("✅ Payment successful:", response);

                    try {
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };

                        await dispatch(verifyPayment(verificationData)).unwrap();
                        console.log("✅ Payment verified successfully");
                        alert("🎉 Payment successful! Your order has been placed.");
                        await dispatch(getCart()).unwrap();
                        navigate("/orderDetails");

                    } catch (error) {
                        console.error("❌ Payment verification failed:", error);
                        setError(error?.message || "Payment verification failed. Please contact support.");
                        setPaymentLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("❌ Razorpay modal closed by user");
                        setPaymentLoading(false);
                    }
                }
            };

            // ✅ Check if Razorpay is loaded
            if (typeof window.Razorpay === 'undefined') {
                console.error("❌ Razorpay SDK not loaded!");
                setError("Payment gateway not loaded. Please refresh and try again.");
                setPaymentLoading(false);
                return;
            }

            const razorpay = new window.Razorpay(options);

            razorpay.on('payment.failed', function (response) {
                console.error("❌ Payment failed:", response.error);
                setError(response.error?.description || "Payment failed. Please try again.");
                setPaymentLoading(false);
            });

            razorpay.open();

        } catch (error) {
            console.error("❌ Payment processing failed:", error);
            console.error("Error details:", error.response?.data || error.message);
            setError(error?.response?.data?.message || error?.message || "Failed to process payment. Please try again.");
            setPaymentLoading(false);
        }
    };

    // ✅ Handle Checkout - Opens address modal for delivery, proceeds directly for dine-in
    const handleCheckout = async () => {
        console.log("========== CHECKOUT START ==========");
        console.log("Order Type:", orderType);
        console.log("Cart Items:", cartItems);
        console.log("Total Items:", totalItems);
        console.log("Total Price:", totalPrice);

        // ✅ Check if cart is empty
        if (cartItems.length === 0) {
            setError("Your cart is empty. Please add items before checking out.");
            return;
        }

        // ✅ Check order type
        if (orderType === "delivery") {
            console.log("📦 Delivery order - Opening Address Modal");
            // Open Address Modal
            setIsAddressModalOpen(true);
            return;
        }

        // ✅ For dine_in, continue with payment flow
        if (orderType === "dine_in") {
            console.log("☕ Dine-in order - Proceeding to payment");
            await processPayment(null); // No address needed for dine-in
        }
    };

    /**
     * ✅ Calculate delivery fee based on order type and subtotal
     */
    const calculateDeliveryFee = (subtotal, type) => {
        if (type === "dine_in") {
            return 0; // Free delivery for dine-in
        }
        // For delivery
        return subtotal > 500 ? 0 : 50; // Free if subtotal > 500, else ₹50
    };

    /**
     * ✅ Get delivery fee display text
     */
    const getDeliveryFeeDisplay = (subtotal, type) => {
        const fee = calculateDeliveryFee(subtotal, type);
        if (type === "dine_in") {
            return "FREE";
        }
        return fee === 0 ? 'FREE' : `₹${fee}.00`;
    };

    /**
     * ✅ Calculate total amount
     */
    const calculateTotal = (subtotal, type) => {
        return subtotal + calculateDeliveryFee(subtotal, type);
    };

    // ✅ Loading state
    if (loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ✅ Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/30 border border-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center shadow-2xl shadow-black/5">
                        <div className="flex flex-col items-center justify-center py-8 sm:py-16">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/40 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/30">
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
        );
    }

    // ✅ Calculate dynamic values based on order type
    const deliveryFee = calculateDeliveryFee(totalPrice, orderType);
    const totalAmount = calculateTotal(totalPrice, orderType);
    const deliveryFeeDisplay = getDeliveryFeeDisplay(totalPrice, orderType);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-[#FBF3EA] to-[#F5E6D3] pt-20 sm:pt-24 px-3 sm:px-4 pb-10 overflow-hidden">

                {/* Background decorations */}
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
                    {/* Error Message */}
                    {(error || paymentError) && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error || paymentError}
                            <button
                                onClick={() => {
                                    setError(null);
                                }}
                                className="ml-2 text-red-700 font-bold"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                                    Your <span className="text-[#0D7C53]">Cart</span>
                                </h1>
                                <p className="text-sm text-gray-500">{totalItems} items</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearCart}
                            className="text-sm sm:text-base text-red-500 hover:text-red-600 font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-50/50 border border-red-200/50 hover:bg-red-100/50 transition-all flex-shrink-0"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {cartItems.map((item) => {
                                const coffeeId = item.coffee?._id;
                                if (!coffeeId) {
                                    console.warn("⚠️ Item missing coffee._id:", item);
                                    return null;
                                }

                                return (
                                    <div
                                        key={coffeeId}
                                        className="group bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md shadow-black/5 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex gap-3 sm:gap-4">
                                            {/* Image */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-gray-100/50 border border-white/20">
                                                <img
                                                    src={item.coffee?.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=☕'}
                                                    alt={item.coffee?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">
                                                            {item.coffee?.name}
                                                        </h3>
                                                        <p className="text-[12px] sm:text-sm text-gray-500 truncate">
                                                            {item.coffee?.category || 'Coffee'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(coffeeId)}
                                                        className="p-1 rounded-full bg-red-200 hover:bg-red-300 transition-all opacity-80 group-hover:opacity-100 flex-shrink-0"
                                                        disabled={loading || paymentLoading}
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 hover:text-red-600" />
                                                    </button>
                                                </div>

                                                {/* Price & Quantity */}
                                                <div className="flex flex-row items-center justify-between mt-2 sm:mt-3 gap-2">
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                        <span className="font-bold text-[#0D7C53] text-sm sm:text-base md:text-lg">
                                                            ₹{(item.coffee?.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-1 sm:gap-2 bg-white/50 rounded-full p-0.5 sm:p-1 border border-white/30 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleDecrease(coffeeId)}
                                                            disabled={loading || paymentLoading}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
                                                        </button>
                                                        <span className="w-5 sm:w-6 md:w-8 text-center font-semibold text-sm sm:text-base text-gray-800">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrease(coffeeId)}
                                                            disabled={loading || paymentLoading}
                                                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#0D7C53] hover:bg-green-700 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 sm:top-24 bg-white/30 border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/5">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                                    Order Summary
                                </h3>

                                {/* ✅ Choose Order Type Section */}
                                <div className="mb-5">
                                    <h4 className="text-base font-semibold text-gray-800 mb-3">
                                        Choose Order Type
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Delivery Option */}
                                        <label
                                            className={`cursor-pointer rounded-xl border p-3 transition-all ${orderType === "delivery"
                                                ? "border-[#0D7C53] bg-green-50 shadow-sm"
                                                : "border-gray-200 bg-white/40 hover:border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="orderType"
                                                value="delivery"
                                                checked={orderType === "delivery"}
                                                onChange={(e) => setOrderType(e.target.value)}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    🚚 Delivery
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    Deliver to your address
                                                </span>
                                            </div>
                                        </label>

                                        {/* Dine In Option */}
                                        <label
                                            className={`cursor-pointer rounded-xl border p-3 transition-all ${orderType === "dine_in"
                                                ? "border-[#0D7C53] bg-green-50 shadow-sm"
                                                : "border-gray-200 bg-white/40 hover:border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="orderType"
                                                value="dine_in"
                                                checked={orderType === "dine_in"}
                                                onChange={(e) => setOrderType(e.target.value)}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    ☕ Dine In
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    Enjoy at our cafe
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-gray-800">₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-500">Delivery Fee</span>
                                        <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-800'
                                            }`}>
                                            {deliveryFeeDisplay}
                                        </span>
                                    </div>
                                    {totalPrice > 500 && orderType === "delivery" && (
                                        <div className="flex justify-between text-[10px] sm:text-xs text-green-600 bg-green-50/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-200/50">
                                            <span>🎉 Free delivery on orders above ₹500</span>
                                        </div>
                                    )}
                                    {orderType === "dine_in" && (
                                        <div className="flex justify-between text-[10px] sm:text-xs text-green-600 bg-green-50/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-200/50">
                                            <span>☕ Free delivery for dine-in orders</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200/50 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                        <div className="flex justify-between text-base sm:text-lg font-bold">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-[#0D7C53]">
                                                ₹{totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <div className="flex gap-1 sm:gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon code"
                                            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/40 border border-white/30 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent placeholder:text-xs sm:placeholder:text-sm"
                                        />
                                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0D7C53]/10 text-[#0D7C53] rounded-full text-[12px] sm:text-sm font-semibold hover:bg-[#0D7C53] hover:text-white transition-all duration-300 whitespace-nowrap">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* ✅ Updated Proceed to Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={paymentLoading || loading || cartItems.length === 0}
                                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg"
                                >
                                    {paymentLoading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : loading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Loading Cart...
                                        </>
                                    ) : (
                                        <>
                                            <span>Proceed to Checkout</span>
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Payment status */}
                                {paymentLoading && (
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Please wait while we process your payment...
                                    </p>
                                )}

                                {/* Order type indicator */}
                                <div className="mt-3 text-center">
                                    <span className="text-xs text-gray-400">
                                        {orderType === "dine_in"
                                            ? "☕ Dine-in order"
                                            : "🚚 Delivery order"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Address Modal */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSaveAddress={handleSaveAddress}
            />

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
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-pulse-slow-delay { animation: pulse-slow-delay 10s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </>
    );
};

export default CartPage;