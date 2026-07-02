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
  FaTools,
  FaChair,
  FaTable
} from 'react-icons/fa';

import {
  MdTableRestaurant,
  MdPayment,
  MdNotes,
  MdCheckCircleOutline,
  MdOutlineCheckCircle,
  MdOutlineReceipt,
  MdRestaurant
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
        delivered: {
            icon: <FaCheckCircle className="text-emerald-500" />,
            color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            borderColor: 'border-emerald-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
            label: 'Delivered',
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

    // Get table status color
    const getTableStatusColor = (status) => {
        const colors = {
            occupied: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            available: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            reserved: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            cleaning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
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
                icon: <FaTools />,
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
        const timeline = [];

        // Add order creation
        timeline.push({
            status: 'Order Placed',
            time: order?.createdAt,
            icon: <FaClock className="text-blue-500" />,
            color: 'text-blue-500',
            message: 'Order placed successfully'
        });

        // Add tracking statuses
        if (order?.tracking) {
            order.tracking.forEach((track) => {
                const status = track.status;
                const config = statusConfig[status];
                if (config) {
                    timeline.push({
                        status: config.label || status,
                        time: track.time,
                        icon: config.icon || <FaClock />,
                        color: config.color?.split(' ')[0]?.replace('bg-', 'text-') || 'text-gray-500',
                        message: track.message
                    });
                } else {
                    // Handle unknown statuses
                    timeline.push({
                        status: status,
                        time: track.time,
                        icon: <FaClock className="text-gray-500" />,
                        color: 'text-gray-500',
                        message: track.message
                    });
                }
            });
        }

        // Sort by time
        return timeline.sort((a, b) => new Date(a.time) - new Date(b.time));
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
    
    // ✅ FIX: Get table details safely from nested object
    const tableNumber = order.table?.tableNumber || 'N/A';
    const tableStatus = order.table?.status || 'N/A';
    const tableSeats = order.table?.seats || 'N/A';

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
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
                                Order #{order._id?.slice(-8)}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                            </span>
                            {/* ✅ Table badge with status */}
                            {order.orderType === 'dine_in' && tableNumber !== 'N/A' && (
                                <span className="px-3 py-1 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] rounded-full text-xs font-semibold flex items-center gap-1.5">
                                    <MdTableRestaurant />
                                    Table #{tableNumber}
                                </span>
                            )}
                        </div>
                        <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">
                            <FaClock className="inline mr-1.5" />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
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
                    {/* Order Info Cards - Updated with table details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* ✅ Table Card with full details */}
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B] col-span-2 md:col-span-1">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
                                <MdTableRestaurant className="text-[#4F46E5]" />
                                Table
                            </p>
                            <div className="mt-1">
                                <p className="text-lg font-bold text-[#0F172A] dark:text-white">
                                    #{tableNumber}
                                </p>
                                {tableStatus !== 'N/A' && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getTableStatusColor(tableStatus)}`}>
                                        {tableStatus}
                                    </span>
                                )}
                                {tableSeats !== 'N/A' && (
                                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] ml-2">
                                        <FaChair className="inline mr-0.5" />
                                        {tableSeats} seats
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Customer</p>
                            <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1 truncate">
                                <FaUser className="inline mr-1.5 text-[#4F46E5]" />
                                {order.user?.name || 'Guest'}
                            </p>
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                                {order.user?.email || ''}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Order Type</p>
                            <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">
                                {order.orderType === 'dine_in' ? (
                                    <>
                                        <MdRestaurant className="inline mr-1.5 text-[#4F46E5]" />
                                        Dine In
                                    </>
                                ) : (
                                    <>
                                        <FaUtensils className="inline mr-1.5 text-[#4F46E5]" />
                                        Delivery
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B]">
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Total Amount</p>
                            <p className="text-lg font-bold text-[#4F46E5] mt-1 flex items-center gap-0.5">
                                <FaRupeeSign className="text-sm" />
                                {order.amount || 0}
                            </p>
                        </div>
                    </div>

                    {/* ✅ Table Section - Detailed Table Info */}
                    {order.orderType === 'dine_in' && tableNumber !== 'N/A' && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
                            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                                        <FaTable className="text-[#4F46E5]" />
                                        Table Details
                                    </h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTableStatusColor(tableStatus)}`}>
                                        {tableStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Table Number</p>
                                    <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-0.5">#{tableNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Seats</p>
                                    <p className="text-lg font-bold text-[#0F172A] dark:text-white mt-0.5 flex items-center gap-1">
                                        <FaChair className="text-[#4F46E5] text-sm" />
                                        {tableSeats}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Status</p>
                                    <p className={`text-sm font-semibold mt-0.5 capitalize ${tableStatus === 'occupied' ? 'text-green-600 dark:text-green-400' : 
                                        tableStatus === 'available' ? 'text-blue-600 dark:text-blue-400' :
                                        tableStatus === 'reserved' ? 'text-yellow-600 dark:text-yellow-400' :
                                        'text-gray-600 dark:text-gray-400'}`}>
                                        {tableStatus}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">Table ID</p>
                                    <p className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mt-0.5 truncate">
                                        {order.table?._id?.slice(-8) || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-[#64748B] dark:text-[#94A3B8] flex-wrap">
                                                        <span>Qty: {item.quantity || 1}</span>
                                                        <span className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-[#1E293B]"></span>
                                                        <span>₹{item.price || 0} each</span>
                                                        {item.coffee?.category && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-[#1E293B]"></span>
                                                                <span className="text-xs">{item.coffee.category}</span>
                                                            </>
                                                        )}
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

                    {/* Order Timeline */}
                    {timeline.length > 0 && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
                            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                                    <FaHistory className="text-[#4F46E5]" />
                                    Order Timeline
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E2E8F0] dark:bg-[#1E293B]"></div>
                                    {timeline.map((event, index) => (
                                        <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
                                            <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center">
                                                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] dark:bg-[#0F172A] flex items-center justify-center">
                                                    {event.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <p className="font-medium text-[#0F172A] dark:text-white">
                                                        {event.status}
                                                    </p>
                                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                                                        {event.time ? new Date(event.time).toLocaleString() : 'N/A'}
                                                    </p>
                                                </div>
                                                {event.message && (
                                                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                                                        {event.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Action Buttons */}
                    {getActionButtons() && getActionButtons().length > 0 && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden">
                            <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                                <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                                    <FaTools className="text-[#4F46E5]" />
                                    Actions
                                </h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {getActionButtons().map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.action}
                                        className={`w-full px-4 py-2.5 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${action.color} hover:shadow-lg hover:scale-[1.02]`}
                                    >
                                        {action.icon}
                                        {action.label}
                                    </button>
                                ))}
                                {statusInfo.canCancel && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="w-full px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all hover:scale-[1.02]"
                                    >
                                        <FaBan />
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

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
                            {order.payment?.razorpayOrderId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Razorpay Order ID</span>
                                    <span className="text-xs text-[#0F172A] dark:text-white font-mono truncate max-w-[150px]">
                                        {order.payment.razorpayOrderId}
                                    </span>
                                </div>
                            )}
                            {order.payment?.razorpayPaymentId && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Razorpay Payment ID</span>
                                    <span className="text-xs text-[#0F172A] dark:text-white font-mono truncate max-w-[150px]">
                                        {order.payment.razorpayPaymentId}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Paid Amount</span>
                                <span className="text-sm text-[#0F172A] dark:text-white font-bold flex items-center gap-0.5">
                                    <FaRupeeSign className="text-xs" />
                                    {order.payment?.amount || order.amount || 0}
                                </span>
                            </div>
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