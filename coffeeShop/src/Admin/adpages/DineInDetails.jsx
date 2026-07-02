import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../redux/Slicer/adminOrder';

// ✅ Saare icons ko ek jagah se import karo
import { 
  FaArrowLeft, 
  FaUtensils, 
  FaUser, 
  FaRupeeSign,
  FaClock,
  FaSpinner,
  FaHourglassHalf,
  FaTimesCircle,
  FaPrint,
  FaDownload,
  FaBan,
  FaEdit,
  FaSave,
  FaTimes,
  FaReceipt,
  FaHistory,
  FaUsers,
  FaMobileAlt,
  FaCreditCard,
  FaWallet,
  FaInfoCircle,
  FaCheckCircle,
  FaCoffee,
  FaTools // ✅ FaKitchenSet ki jagah FaTools use karo
} from 'react-icons/fa';

import {
  MdTableRestaurant,
  MdPayment,
  MdNotes,
  MdCheckCircleOutline,
  MdOutlineCheckCircle,
  MdOutlineReceipt
} from 'react-icons/md';

import { GiKnifeFork } from 'react-icons/gi';
import { BsThreeDotsVertical } from 'react-icons/bs';

const DineInDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { orders, loading } = useSelector((state) => state.adminOrder);
    const [order, setOrder] = useState(null);
    const [kitchenNotes, setKitchenNotes] = useState('');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const notesRef = useRef(null);

    useEffect(() => {
        if (orders.length === 0) {
            dispatch(getAllOrders());
        }
    }, [dispatch, orders.length]);

    useEffect(() => {
        if (orders.length > 0) {
            const foundOrder = orders.find(o => o._id === id);
            if (foundOrder) {
                setOrder(foundOrder);
                setKitchenNotes(foundOrder.kitchenNotes || '');
            }
        }
    }, [orders, id]);

    // Status configuration
    const statusConfig = {
        pending: {
            icon: <FaHourglassHalf className="text-yellow-500" />,
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
            label: 'Pending',
            nextActions: ['confirm'],
            canCancel: true
        },
        confirmed: {
            icon: <FaCheckCircle className="text-blue-500" />,
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            label: 'Confirmed',
            nextActions: ['prepare'],
            canCancel: true
        },
        preparing: {
            icon: <FaSpinner className="text-indigo-500 animate-spin" />,
            color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
            borderColor: 'border-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
            label: 'Preparing',
            nextActions: ['ready'],
            canCancel: true
        },
        ready: {
            icon: <FaCheckCircle className="text-green-500" />,
            color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            borderColor: 'border-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            label: 'Ready to Serve',
            nextActions: ['serve'],
            canCancel: false
        },
        served: {
            icon: <FaCheckCircle className="text-teal-500" />,
            color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
            borderColor: 'border-teal-500',
            bgColor: 'bg-teal-50 dark:bg-teal-950/20',
            label: 'Served',
            nextActions: ['complete'],
            canCancel: false
        },
        completed: {
            icon: <FaCheckCircle className="text-purple-500" />,
            color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            borderColor: 'border-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            label: 'Completed',
            nextActions: [],
            canCancel: false
        },
        cancelled: {
            icon: <FaTimesCircle className="text-red-500" />,
            color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            borderColor: 'border-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/20',
            label: 'Cancelled',
            nextActions: [],
            canCancel: false
        }
    };

    // Payment method icons
    const getPaymentIcon = (method) => {
        const icons = {
            card: <FaCreditCard />,
            upi: <FaMobileAlt />,
            cash: <FaWallet />,
            online: <FaCreditCard />
        };
        return icons[method?.toLowerCase()] || <FaWallet />;
    };

    // Update order status
    const updateOrderStatus = async (newStatus) => {
        try {
            // await API.put(`/orders/${id}/status`, { orderStatus: newStatus });
            dispatch(getAllOrders());
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // Handle kitchen notes save
    const handleSaveNotes = async () => {
        try {
            // await API.put(`/orders/${id}/notes`, { kitchenNotes });
            setIsEditingNotes(false);
            dispatch(getAllOrders());
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    // Handle cancel order
    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }
        try {
            // await API.put(`/orders/${id}/cancel`, { reason: cancelReason });
            setShowCancelModal(false);
            setCancelReason('');
            dispatch(getAllOrders());
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    // Get action buttons based on current status
    const getActionButtons = () => {
        const status = order?.orderStatus || 'pending';
        const config = statusConfig[status];

        if (!config || config.nextActions.length === 0) return null;

        const actions = {
            confirm: {
                label: 'Confirm Order',
                icon: <MdCheckCircleOutline />,
                color: 'bg-blue-500 hover:bg-blue-600',
                action: () => updateOrderStatus('confirmed')
            },
            prepare: {
                label: 'Start Preparing',
                // icon: <FaKitchenSet />,
                color: 'bg-indigo-500 hover:bg-indigo-600',
                action: () => updateOrderStatus('preparing')
            },
            ready: {
                label: 'Mark Ready',
                icon: <FaCheckCircle />,
                color: 'bg-green-500 hover:bg-green-600',
                action: () => updateOrderStatus('ready')
            },
            serve: {
                label: 'Mark Served',
                icon: <FaUsers />,
                color: 'bg-teal-500 hover:bg-teal-600',
                action: () => updateOrderStatus('served')
            },
            complete: {
                label: 'Complete Order',
                icon: <MdOutlineCheckCircle />,
                color: 'bg-purple-500 hover:bg-purple-600',
                action: () => updateOrderStatus('completed')
            }
        };

        return config.nextActions.map(actionKey => actions[actionKey]);
    };

    // Get timeline data
    const getTimeline = () => {
        const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'];
        const timeline = [];

        // Add order creation
        timeline.push({
            status: 'Order Placed',
            time: order?.createdAt,
            icon: <FaClock />,
            color: 'text-blue-500'
        });

        // Add tracking statuses
        if (order?.tracking) {
            order.tracking.forEach((track, index) => {
                const status = track.status;
                const config = statusConfig[status];
                if (config) {
                    timeline.push({
                        status: config.label,
                        time: track.time,
                        icon: config.icon,
                        color: config.color.split(' ')[0].replace('bg-', 'text-'),
                        message: track.message
                    });
                }
            });
        }

        return timeline;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4F46E5] border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-[#64748B] dark:text-[#94A3B8]">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTimesCircle className="text-4xl text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">Order Not Found</h3>
                    <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">The order you're looking for doesn't exist</p>
                    <button
                        onClick={() => navigate('/admin/orders/dine-in')}
                        className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const status = order.orderStatus || 'pending';
    const statusInfo = statusConfig[status] || statusConfig.pending;
    const timeline = getTimeline();

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/orders/dine-in')}
                        className="p-2.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-all hover:scale-105"
                    >
                        <FaArrowLeft className="text-[#64748B] dark:text-[#94A3B8]" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
                                Order #{order._id?.slice(-8)}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                            </span>
                        </div>
                        <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">
                            <FaClock className="inline mr-1.5" />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-colors flex items-center gap-2">
                        <FaPrint />
                        Print
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-colors flex items-center gap-2">
                        <FaDownload />
                        Download
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Table</p>
                            <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                                <MdTableRestaurant className="inline mr-1.5 text-[#4F46E5]" />
                                {order.tableNumber || 'N/A'}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Customer</p>
                            <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1 truncate">
                                <FaUser className="inline mr-1.5 text-[#4F46E5]" />
                                {order.user?.name || 'Guest'}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Guests</p>
                            <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                                <FaUsers className="inline mr-1.5 text-[#4F46E5]" />
                                {order.numberOfGuests || '1'}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Type</p>
                            <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                                <GiKnifeFork className="inline mr-1.5 text-[#4F46E5]" />
                                Dine In
                            </p>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
                        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                                    <FaCoffee className="text-[#4F46E5]" />
                                    Ordered Items ({order.products?.length || 0})
                                </h3>
                                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                                    {order.products?.length || 0} items
                                </span>
                            </div>
                        </div>
                        <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                            {order.products?.map((item, index) => (
                                <div key={index} className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F1F5F9] dark:bg-[#0F172A]">
                                            {item.coffee?.image ? (
                                                <img
                                                    src={item.coffee.image}
                                                    alt={item.coffee.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FaCoffee className="text-2xl text-[#94A3B8]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-semibold text-[#0F172A] dark:text-white">
                                                        {item.coffee?.name || 'Product'}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
                                                        <span>Qty: {item.quantity || 1}</span>
                                                        <span className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-[#1E293B]"></span>
                                                        <span>₹{item.price || 0} each</span>
                                                    </div>
                                                    {item.specialInstructions && (
                                                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 italic">
                                                            📝 {item.specialInstructions}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-lg font-bold text-[#4F46E5] flex-shrink-0">
                                                    ₹{item.subtotal || (item.price * (item.quantity || 1))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
                        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                            <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                                <FaReceipt className="text-[#4F46E5]" />
                                Order Summary
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#64748B] dark:text-[#94A3B8]">Subtotal</span>
                                <span className="text-[#0F172A] dark:text-white font-medium">
                                    ₹{order.amount || 0}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#64748B] dark:text-[#94A3B8]">Tax (5%)</span>
                                <span className="text-[#0F172A] dark:text-white font-medium">
                                    ₹{Math.round((order.amount || 0) * 0.05)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#64748B] dark:text-[#94A3B8]">Discount</span>
                                <span className="text-green-500 font-medium">-₹0</span>
                            </div>
                            <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[#0F172A] dark:text-white">Grand Total</span>
                                    <span className="text-xl font-bold text-[#4F46E5]">
                                        ₹{Math.round((order.amount || 0) * 1.05)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
                        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                            <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                                <MdPayment className="text-[#4F46E5]" />
                                Payment Details
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Method</span>
                                <span className="text-sm text-[#0F172A] dark:text-white font-medium flex items-center gap-1.5">
                                    {getPaymentIcon(order.payment?.method)}
                                    {order.payment?.method || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Status</span>
                                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${order.payment?.status === 'paid'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {order.payment?.status || 'Pending'}
                                </span>
                            </div>
                            {order.payment?.transactionId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Transaction ID</span>
                                    <span className="text-sm text-[#0F172A] dark:text-white font-mono">
                                        {order.payment.transactionId}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1E293B] rounded-xl max-w-md w-full p-6 border border-[#E2E8F0] dark:border-[#1E293B]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white">Cancel Order</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="p-1.5 hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] rounded-lg transition-colors"
                            >
                                <FaTimes className="text-[#64748B] dark:text-[#94A3B8]" />
                            </button>
                        </div>
                        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-[#0F172A] dark:text-white block mb-1.5">
                                Reason for cancellation
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Please provide a reason..."
                                className="w-full p-3 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all min-h-[80px]"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DineInDetails;