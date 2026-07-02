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
    X,
    CheckCircle,
    Loader2
} from "lucide-react";

import { getTables } from '../redux/Slicer/tableSlice';

// ✅ IMPORT ADDRESS MODAL
import AddressModal from '../Admin/adcomponent/AddressModel';

const CartPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // ✅ Order type state - Default to "delivery"
    const [orderType, setOrderType] = useState("delivery");

    // ✅ Table selection state (Integrated in CartPage)
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null); // { tableId, tableNumber, seats }
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [tablesLoading, setTablesLoading] = useState(false);
    
    // ✅ Table filter state
    const [tableFilter, setTableFilter] = useState('all');
    
    // ✅ Track if payment is already being processed to prevent double calls
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // ✅ Address modal state
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    // Get cart data from Redux store
    const { cartItems, totalItems, totalPrice, loading } = useSelector((state) => state.cart);

    // Get payment state from Redux store
    const { order, paymentStatus, paymentError, loading: paymentProcessing } = useSelector((state) => state.payment);

    // Get tables from Redux store
    const { tables, loading: tablesReduxLoading, error: tablesError } = useSelector(
        (state) => state.table
    );
    console.log(tables)

    const tableList = tables?.tables || [];

    // ✅ Filtered tables based on status
    const filteredTables = tableList.filter(table => {
        if (tableFilter === 'all') return true;
        return table.status === tableFilter;
    });

    // ✅ Fetch tables when modal opens
    useEffect(() => {
        if (isTableModalOpen) {
            console.log("Dispatching getTables...");
            dispatch(getTables());
        }
    }, [isTableModalOpen, dispatch]);

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

    // ✅ Reset table selection when switching order type
    useEffect(() => {
        if (orderType !== 'dine_in') {
            setSelectedTable(null);
            setSelectedTableId(null);
        }
    }, [orderType]);

    // ✅ Handle display of backend errors from Redux state
    useEffect(() => {
        if (paymentError) {
            setError(paymentError);
            setPaymentLoading(false);
            setIsProcessingPayment(false);
        }
    }, [paymentError]);

    // ✅ Reset selection when modal closes
    useEffect(() => {
        if (!isTableModalOpen) {
            setSelectedTableId(null);
        }
    }, [isTableModalOpen]);

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

    // ✅ Handle Address Save (Delivery)
    const handleSaveAddress = (address) => {
        console.log("📦 Address saved:", address);
        setDeliveryAddress(address);
        setIsAddressModalOpen(false);
        // After saving address, proceed with payment
        processPayment(address);
    };

    // ✅ Handle table selection
    const handleTableSelect = (tableId) => {
        setSelectedTableId(tableId);
        console.log('✅ Table selected:', tableId);
    };

    // ✅ Handle confirm table selection - FIXED: Only set table and close modal, don't process payment here
    const handleConfirmTable = () => {
        if (selectedTableId) {
            const selectedTableData = tableList.find(
                (table) => table._id === selectedTableId
            );
            if (selectedTableData) {
                console.log('✅ Confirming table:', selectedTableData);
                setSelectedTable({
                    tableId: selectedTableData._id,
                    tableNumber: selectedTableData.tableNumber,
                    seats: selectedTableData.seats,
                });
                setIsTableModalOpen(false);
                setError(null);
                // ✅ Don't process payment here - let the checkout button handle it
                // This prevents double processing
            }
        }
    };

    // ✅ Process Payment with table selection
    const processPayment = async (address) => {
        // ✅ Prevent multiple payment processing calls
        if (isProcessingPayment) {
            console.log("⚠️ Payment already processing, skipping...");
            return;
        }

        console.log("========== PROCESS PAYMENT ==========");
        console.log("Address:", address);
        console.log("Order Type:", orderType);
        console.log("Selected Table:", selectedTable);
        console.log("Cart Items:", cartItems);
        console.log("Total Price:", totalPrice);

        // ✅ Validate table selection for dine-in
        if (orderType === "dine_in" && !selectedTable) {
            setError("Please select a table before proceeding.");
            setIsTableModalOpen(true);
            return;
        }

        try {
            setIsProcessingPayment(true);
            setPaymentLoading(true);
            setError(null);

            console.log("🔄 Creating payment order...");

            // ✅ Calculate delivery fee based on order type
            const deliveryFee = calculateDeliveryFee(totalPrice, orderType);
            const totalAmount = totalPrice + deliveryFee;

            console.log("💰 Total Amount to charge:", totalAmount);
            console.log("📦 Delivery Fee:", deliveryFee);

            // ✅ Build order payload
            const orderPayload = {
                amount: totalAmount,
                orderType: orderType
            };

            // ✅ Add deliveryAddress only if it's a delivery order
            if (orderType === "delivery" && address) {
                orderPayload.deliveryAddress = address;
            }

            // ✅ Add table details for dine-in
            if (orderType === "dine_in" && selectedTable) {
                orderPayload.tableId = selectedTable.tableId;
                orderPayload.tableNumber = selectedTable.tableNumber;
            }

            console.log("📦 Order Payload being sent:", JSON.stringify(orderPayload, null, 2));

            // ✅ Create order
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
                        ? `Dine-in at Table ${selectedTable?.tableNumber || 'N/A'}`
                        : `Delivery order for ${totalItems} item(s)`,
                image: "https://example.com/logo.png",
                prefill: {
                    name: "Customer",
                    email: "customer@example.com",
                    contact: "9999999999"
                },
                notes: {
                    orderType: orderType,
                    deliveryAddress: address ? JSON.stringify(address) : 'N/A',
                    tableNumber: selectedTable?.tableNumber || 'N/A',
                    tableId: selectedTable?.tableId || 'N/A'
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
                        setIsProcessingPayment(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("❌ Razorpay modal closed by user");
                        setPaymentLoading(false);
                        setIsProcessingPayment(false);
                    }
                }
            };

            // ✅ Check if Razorpay is loaded
            if (typeof window.Razorpay === 'undefined') {
                console.error("❌ Razorpay SDK not loaded!");
                setError("Payment gateway not loaded. Please refresh and try again.");
                setPaymentLoading(false);
                setIsProcessingPayment(false);
                return;
            }

            const razorpay = new window.Razorpay(options);

            razorpay.on('payment.failed', function (response) {
                console.error("❌ Payment failed:", response.error);
                setError(response.error?.description || "Payment failed. Please try again.");
                setPaymentLoading(false);
                setIsProcessingPayment(false);
            });

            razorpay.open();

        } catch (error) {
            console.error("❌ Payment processing failed:", error);
            console.error("Error details:", error.response?.data || error.message);
            setError(error?.response?.data?.message || error?.message || "Failed to process payment. Please try again.");
            setPaymentLoading(false);
            setIsProcessingPayment(false);
        }
    };

    // ✅ Handle Checkout - FIXED: Only open modal if no table selected
    const handleCheckout = async () => {
        console.log("Checkout button clicked");
        console.log("Order Type:", orderType);
        console.log("Cart Items:", cartItems);
        console.log("Total Items:", totalItems);
        console.log("Total Price:", totalPrice);

        // ✅ Check if cart is empty
        if (cartItems.length === 0) {
            setError("Your cart is empty. Please add items before checking out.");
            return;
        }

        // ✅ DINE IN - Check if table is selected
        if (orderType === "dine_in") {
            if (selectedTable) {
                console.log("☕ Table already selected:", selectedTable);
                // ✅ Table is already selected, proceed directly to payment
                await processPayment(null);
            } else {
                console.log("☕ No table selected - Opening Table Selection Modal");
                setIsTableModalOpen(true);
            }
            return;
        }

        // ✅ DELIVERY - Show Address Modal
        if (orderType === "delivery") {
            console.log("📦 Delivery order - Opening Address Modal");
            setIsAddressModalOpen(true);
            return;
        }
    };

    /**
     * ✅ Calculate delivery fee based on order type and subtotal
     */
    const calculateDeliveryFee = (subtotal, type) => {
        if (type === "dine_in") {
            return 0; // Free for dine-in
        }
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

    // ✅ Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-500';
            case 'occupied':
                return 'bg-red-500';
            case 'reserved':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    // ✅ Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'occupied':
                return 'Occupied';
            case 'reserved':
                return 'Reserved';
            default:
                return status;
        }
    };

    // ✅ Get available tables only
    const availableTables = tableList.filter(
        (table) => table.status === 'available'
    );

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

                                    {/* ✅ Show selected table for dine-in */}
                                    {orderType === "dine_in" && selectedTable && (
                                        <div className="mt-3 p-3 bg-green-50/70 border border-green-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Coffee className="w-4 h-4 text-[#0D7C53]" />
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        Table {selectedTable.tableNumber}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-green-600 bg-green-200/50 px-2 py-0.5 rounded-full">
                                                    {selectedTable.seats} seats
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedTable(null);
                                                    setSelectedTableId(null);
                                                    setIsTableModalOpen(true);
                                                }}
                                                className="mt-2 text-xs text-[#0D7C53] hover:text-green-700 font-medium underline-offset-2 hover:underline"
                                            >
                                                Change Table
                                            </button>
                                        </div>
                                    )}

                                    {/* ✅ Show table selection prompt for dine-in */}
                                    {orderType === "dine_in" && !selectedTable && (
                                        <div className="mt-3 p-3 bg-yellow-50/70 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-700">
                                                ⚠️ Please select a table
                                            </p>
                                        </div>
                                    )}
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

                                {/* ✅ Proceed to Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={
                                        paymentLoading ||
                                        loading ||
                                        cartItems.length === 0 ||
                                        isProcessingPayment
                                    }
                                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg"
                                >
                                    {paymentLoading || isProcessingPayment ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : loading ? (
                                        <>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Loading Cart...
                                        </>
                                    ) : orderType === "dine_in" && !selectedTable ? (
                                        <>
                                            <span>Select Table</span>
                                            <Coffee />
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
                                            ? `☕ Dine-in order ${selectedTable ? `- Table ${selectedTable.tableNumber}` : ''}`
                                            : "🚚 Delivery order"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Table Selection Modal - Integrated in CartPage */}
            {isTableModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-dark-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#0D7C53]/10 rounded-lg">
                                    <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-[#0D7C53]" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-dark-heading">
                                        Select a Table
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text">
                                        Choose your table for dine-in
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsTableModalOpen(false)}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                            </button>
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-gray-100 dark:border-dark-border">
                            <div className="flex flex-wrap gap-2">
                                {['all', 'available', 'occupied', 'reserved'].map((status) => {
                                    const count = status === 'all'
                                        ? tableList.length
                                        : tableList.filter(t => t.status === status).length;

                                    const statusColors = {
                                        all: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                                        available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                                        occupied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                                        reserved: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    };

                                    const activeColors = {
                                        all: 'bg-gray-800 text-white dark:bg-gray-600 dark:text-white',
                                        available: 'bg-green-600 text-white dark:bg-green-700',
                                        occupied: 'bg-red-600 text-white dark:bg-red-700',
                                        reserved: 'bg-yellow-600 text-white dark:bg-yellow-700'
                                    };

                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setTableFilter(status)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                                    ${tableFilter === status
                                                    ? activeColors[status]
                                                    : statusColors[status]
                                                }`}
                                        >
                                            <span className="capitalize">{status === 'all' ? 'All' : status}</span>
                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tableFilter === status
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-200/50 text-gray-600 dark:bg-gray-600/50 dark:text-gray-400'
                                                }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                            {/* ✅ FORCE RENDER CHECK */}
                            <div className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2">
                                Total Tables: {filteredTables.length} | Selected: {selectedTableId || 'None'}
                            </div>

                            {tablesReduxLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-10 h-10 text-[#0D7C53] animate-spin" />
                                    <p className="mt-3 text-gray-500 dark:text-dark-text text-sm">Loading tables...</p>
                                </div>
                            ) : tablesError ? (
                                <div className="text-center py-8">
                                    <p className="text-red-500 text-sm">Failed to load tables.</p>
                                    <button
                                        onClick={() => dispatch(getTables())}
                                        className="mt-3 px-4 py-2 bg-[#0D7C53] text-white rounded-lg text-sm"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : filteredTables.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Coffee className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-heading mb-2">
                                        {tableFilter === 'all' ? 'No Tables Available' : `No ${tableFilter} Tables`}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-dark-text">
                                        {tableFilter === 'all'
                                            ? 'All tables are currently occupied.'
                                            : `There are no ${tableFilter} tables at the moment.`}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {filteredTables.map((table) => {
                                            // Get status colors
                                            const statusColors = {
                                                available: {
                                                    bg: 'border-green-200 hover:border-green-500 dark:border-green-900/30',
                                                    selected: 'border-green-600 bg-green-50 dark:bg-green-900/20',
                                                    badge: 'bg-green-500',
                                                    text: 'text-green-700 dark:text-green-400'
                                                },
                                                occupied: {
                                                    bg: 'border-red-200 hover:border-red-500 dark:border-red-900/30',
                                                    selected: 'border-red-600 bg-red-50 dark:bg-red-900/20',
                                                    badge: 'bg-red-500',
                                                    text: 'text-red-700 dark:text-red-400'
                                                },
                                                reserved: {
                                                    bg: 'border-yellow-200 hover:border-yellow-500 dark:border-yellow-900/30',
                                                    selected: 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
                                                    badge: 'bg-yellow-500',
                                                    text: 'text-yellow-700 dark:text-yellow-400'
                                                }
                                            };

                                            const colors = statusColors[table.status] || statusColors.available;
                                            const isSelected = selectedTableId === table._id;

                                            return (
                                                <button
                                                    key={table._id}
                                                    onClick={() => {
                                                        console.log("🔥 Table clicked:", table._id);
                                                        handleTableSelect(table._id);
                                                    }}
                                                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 group hover:shadow-lg
                                            ${isSelected
                                                            ? colors.selected
                                                            : `${colors.bg} hover:bg-gray-50 dark:hover:bg-gray-800`
                                                        }
                                        `}
                                                >
                                                    {/* Status Badge - Top Right */}
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${colors.badge}`}>
                                                            {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                                                        </span>
                                                    </div>

                                                    {/* Table Number */}
                                                    <div className="text-center">
                                                        <div className={`text-2xl sm:text-3xl font-bold transition-colors 
                                                ${isSelected
                                                                ? `text-[#0D7C53] dark:text-green-400`
                                                                : `text-gray-700 dark:text-dark-heading group-hover:text-[#0D7C53] dark:group-hover:text-green-400`
                                                            }`}
                                                        >
                                                            Table {table.tableNumber}
                                                        </div>
                                                        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-dark-text">
                                                            <span>🪑 {table.seats} seats</span>
                                                        </div>
                                                    </div>

                                                    {/* Selection Indicator */}
                                                    {isSelected && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <div className="w-6 h-6 bg-[#0D7C53] rounded-full flex items-center justify-center shadow-lg">
                                                                <CheckCircle className="w-4 h-4 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Table Legend */}
                                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-dark-text">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                            <span>Available</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                            <span>Occupied</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                            <span>Reserved</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-gray-800/30">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setIsTableModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmTable}
                                    disabled={!selectedTableId || tablesReduxLoading}
                                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 
                            ${selectedTableId && !tablesReduxLoading
                                            ? 'bg-gradient-to-r from-[#0D7C53] to-green-600 text-white hover:shadow-lg hover:scale-[1.02]'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {tablesReduxLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Confirm Table
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Address Modal - For Delivery */}
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
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
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
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </>
    );
};

export default CartPage;