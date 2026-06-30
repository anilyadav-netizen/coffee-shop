import React, { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaClock,
    FaMapMarkerAlt,
    FaPhone,
    FaUser,
    FaCreditCard,
    FaBox,
    FaTruck,
    FaShippingFast,
    FaCheckCircle,
    FaSpinner,
    FaTimesCircle,
    FaStore,
    FaHome,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getMyOrders } from "../../redux/Slicer/paymentSlice";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.payment);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orders?.length === 0) {
            dispatch(getMyOrders());
        } else {
            const foundOrder = orders?.find((o) => o._id === id);
            if (foundOrder) {
                // Map order data from backend
                const mappedOrder = {
                    _id: foundOrder._id,
                    customerName: foundOrder.deliveryAddress?.fullName || foundOrder.user?.name || "Guest",
                    customerPhone: foundOrder.deliveryAddress?.phone || foundOrder.user?.phone || "N/A",
                    customerEmail: foundOrder.user?.email || "N/A",
                    orderType: foundOrder.orderType || "dine_in",
                    totalPrice: foundOrder.amount || 0,
                    paymentStatus: foundOrder.paymentStatus || foundOrder.payment?.status || "pending",
                    orderStatus: foundOrder.orderStatus || "pending",
                    createdAt: foundOrder.createdAt || new Date().toISOString(),
                    products: foundOrder.products || [],
                    deliveryAddress: foundOrder.deliveryAddress || null,
                    tracking: foundOrder.tracking || [],
                    payment: foundOrder.payment || null,
                };
                setOrder(mappedOrder);
            }
        }
    }, [dispatch, orders, id]);

    // Get status step for timeline
    const getStatusStep = (status) => {
        const steps = ["pending", "preparing", "packed", "shipped", "delivered"];
        const index = steps.indexOf(status?.toLowerCase());
        return index !== -1 ? index : 0;
    };

    // Status badge
    const statusBadge = {
        pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400",
        preparing: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
        packed: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
        shipped: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
        delivered: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
        cancelled: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
    };

    const paymentBadge = {
        paid: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
        pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400",
        failed: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
    };

    const orderTypeIcon = {
        dine_in: <FaStore className="w-5 h-5" />,
        takeaway: <FaBox className="w-5 h-5" />,
        delivery: <FaTruck className="w-5 h-5" />,
    };

    const orderTypeLabel = {
        dine_in: "Dine-in",
        takeaway: "Takeaway",
        delivery: "Delivery",
    };

    const statusIcons = {
        pending: <FaClock className="w-5 h-5" />,
        preparing: <FaSpinner className="w-5 h-5 animate-spin" />,
        packed: <FaShippingFast className="w-5 h-5" />,
        shipped: <FaTruck className="w-5 h-5" />,
        delivered: <FaCheckCircle className="w-5 h-5" />,
        cancelled: <FaTimesCircle className="w-5 h-5" />,
    };

    // Calculate status steps for tracking
    const statusSteps = [
        { key: "pending", label: "Order Placed", icon: <FaClock /> },
        { key: "preparing", label: "Preparing", icon: <FaSpinner /> },
        { key: "packed", label: "Packed", icon: <FaShippingFast /> },
        { key: "shipped", label: "Shipped", icon: <FaTruck /> },
        { key: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
    ];

    const currentStep = getStatusStep(order?.orderStatus);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#4F46E5] dark:border-dark-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If order not found
    if (!order) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl">
                <button
                    onClick={() => navigate("/admin/orders")}
                    className="inline-flex items-center gap-2 text-[#4F46E5] dark:text-dark-primary hover:underline mb-6"
                >
                    <FaArrowLeft />
                    Back to Orders
                </button>
                <div className="text-center py-16">
                    <FaBox className="mx-auto text-6xl text-[#64748B] dark:text-dark-text mb-4" />
                    <h2 className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">Order Not Found</h2>
                    <p className="text-[#64748B] dark:text-dark-text mt-2">The order you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 md:p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl">
            {/* Back Button */}
            <button
                onClick={() => navigate("/admin/orders")}
                className="inline-flex items-center gap-2 text-[#4F46E5] dark:text-dark-primary hover:underline mb-6 transition-colors"
            >
                <FaArrowLeft />
                Back to Orders
            </button>

            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-dark-border">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] dark:text-dark-heading">
                        Order #{order._id?.slice(-8)}
                    </h1>
                    <p className="text-sm text-[#64748B] dark:text-dark-text">
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusBadge[order.orderStatus] ||
                            "bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        {statusIcons[order.orderStatus]}
                        {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                    </span>
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${paymentBadge[order.paymentStatus] ||
                            "bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        <FaCreditCard />
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Type */}
                    <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-lg p-4 border border-[#E2E8F0] dark:border-dark-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#4F46E5] dark:bg-dark-primary rounded-lg text-white">
                                {orderTypeIcon[order.orderType] || <FaBox />}
                            </div>
                            <div>
                                <p className="text-sm text-[#64748B] dark:text-dark-text">Order Type</p>
                                <p className="font-semibold text-[#0F172A] dark:text-dark-heading">
                                    {orderTypeLabel[order.orderType] || order.orderType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading mb-4 flex items-center gap-2">
                            <FaBox />
                            Order Items ({order.products?.length || 0})
                        </h3>
                        <div className="space-y-3">
                            {order.products?.map((item, index) => {
                                const product = item.coffee || item.product || {};
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-3 bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-lg border border-[#E2E8F0] dark:border-dark-border"
                                    >
                                        <img
                                            src={product.image || "https://via.placeholder.com/80"}
                                            alt={product.name || "Product"}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-[#0F172A] dark:text-dark-heading">
                                                {product.name || "Product"}
                                            </h4>
                                            <p className="text-sm text-[#64748B] dark:text-dark-text">
                                                Qty: {item.quantity || 1} × ₹{item.price || 0}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[#0F172A] dark:text-dark-heading">
                                                ₹{item.subtotal || (item.price * item.quantity) || 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-lg p-4 border border-[#E2E8F0] dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading mb-3">
                            Order Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[#64748B] dark:text-dark-text">
                                <span>Subtotal</span>
                                <span>₹{order.totalPrice || 0}</span>
                            </div>
                            <div className="flex justify-between text-[#64748B] dark:text-dark-text">
                                <span>Delivery Fee</span>
                                <span>₹{order.orderType === "delivery" ? 40 : 0}</span>
                            </div>
                            <div className="flex justify-between text-[#64748B] dark:text-dark-text">
                                <span>Tax (GST)</span>
                                <span>₹{Math.round((order.totalPrice || 0) * 0.05)}</span>
                            </div>
                            <div className="border-t border-[#E2E8F0] dark:border-dark-border pt-2 mt-2">
                                <div className="flex justify-between font-bold text-[#0F172A] dark:text-dark-heading text-lg">
                                    <span>Total</span>
                                    <span>
                                        ₹{(order.totalPrice || 0) +
                                            (order.orderType === "delivery" ? 40 : 0) +
                                            Math.round((order.totalPrice || 0) * 0.05)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - 1/3 */}
                <div className="space-y-6">
                    {/* Customer Details */}
                    <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-lg p-4 border border-[#E2E8F0] dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading mb-3 flex items-center gap-2">
                            <FaUser />
                            Customer Details
                        </h3>
                        <div className="space-y-2">
                            <p className="text-[#0F172A] dark:text-dark-heading font-medium">
                                {order.customerName}
                            </p>
                            <p className="text-[#64748B] dark:text-dark-text flex items-center gap-2">
                                <FaPhone className="w-4 h-4" />
                                {order.customerPhone}
                            </p>
                            {order.customerEmail && order.customerEmail !== "N/A" && (
                                <p className="text-[#64748B] dark:text-dark-text">
                                    {order.customerEmail}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {order.deliveryAddress && (
                        <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-lg p-4 border border-[#E2E8F0] dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading mb-3 flex items-center gap-2">
                                <FaMapMarkerAlt />
                                Delivery Address
                            </h3>
                            <div className="space-y-1 text-[#64748B] dark:text-dark-text">
                                <p className="flex items-center gap-2">
                                    <FaHome className="w-4 h-4" />
                                    {order.deliveryAddress.type === "home" ? "Home" : "Work"}
                                </p>
                                <p>{order.deliveryAddress.addressLine1}</p>
                                {order.deliveryAddress.addressLine2 && (
                                    <p>{order.deliveryAddress.addressLine2}</p>
                                )}
                                <p>
                                    {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                                    {order.deliveryAddress.pincode}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Order Tracking Timeline */}
                    <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-lg p-4 border border-[#E2E8F0] dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading mb-4 flex items-center gap-2">
                            <FaClock />
                            Order Tracking
                        </h3>
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E2E8F0] dark:border-dark-border"></div>

                            {/* Status Steps */}
                            <div className="space-y-6">
                                {statusSteps.map((step, index) => {
                                    const isCompleted = index <= currentStep;
                                    const isCurrent = index === currentStep;
                                    const isCancelled = order.orderStatus === "cancelled" && index < currentStep;

                                    return (
                                        <div key={step.key} className="flex items-start gap-4 relative">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${isCompleted && !isCancelled
                                                    ? "bg-emerald-500 text-white"
                                                    : isCurrent && !isCancelled
                                                        ? "bg-[#4F46E5] dark:bg-dark-primary text-white"
                                                        : "bg-[#E2E8F0] dark:bg-dark-border text-[#64748B] dark:text-dark-text"
                                                    } ${isCancelled ? "bg-red-500 text-white" : ""}`}
                                            >
                                                {isCompleted && !isCurrent && !isCancelled ? (
                                                    <FaCheckCircle />
                                                ) : (
                                                    step.icon
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`font-medium ${isCompleted && !isCancelled
                                                        ? "text-[#0F172A] dark:text-dark-heading"
                                                        : "text-[#64748B] dark:text-dark-text"
                                                        } ${isCancelled ? "text-red-500" : ""}`}
                                                >
                                                    {step.label}
                                                </p>
                                                {isCurrent && !isCancelled && (
                                                    <p className="text-sm text-[#4F46E5] dark:text-dark-primary">
                                                        In Progress...
                                                    </p>
                                                )}
                                                {isCancelled && index < currentStep && (
                                                    <p className="text-sm text-red-500">Cancelled</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tracking Updates */}
                        {order.tracking?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-dark-border">
                                <h4 className="text-sm font-medium text-[#64748B] dark:text-dark-text mb-2">
                                    Updates
                                </h4>
                                {order.tracking.map((track, idx) => (
                                    <div key={idx} className="text-sm text-[#64748B] dark:text-dark-text mb-1">
                                        <span className="font-medium">{track.status?.toUpperCase()}:</span>{" "}
                                        {track.message} - {formatDate(track.time)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cancel Order Button */}
                    {order.orderStatus === "pending" && (
                        <button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                            <FaTimesCircle />
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;