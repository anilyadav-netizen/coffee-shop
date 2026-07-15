import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaSearch,
  FaMotorcycle,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCoffee,
  FaEye,
  FaTimes,
  FaRupeeSign,
  FaTruck,
  FaHeadset,
  FaBell,
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import {
  getRiderOrders,
  updateDeliveryStatus,
  clearMessage,
  clearError,
} from '../../redux/Slicer/riderAssignmentSlice';
import io from 'socket.io-client';
import Beep from '../../assets/Sounds/beep.wav';

const RiderAssignedOrder = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  const {
    activeOrders = [],
    completedOrders = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.riderAssignment);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // ─── Sound ────────────────────────────────────────────────
  const playNotificationSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audio = new Audio(Beep);
      audio.volume = 0.5;
      audio.play().catch(() => console.log('Sound play blocked'));
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  // ─── Socket ───────────────────────────────────────────────
  useEffect(() => {
    socketRef.current = io('http://localhost:5003', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;
    const riderId = JSON.parse(localStorage.getItem('user'))?._id;
    if (riderId) {
      socket.emit('rider-join', riderId);
    }

    socket.on('new_order_assigned', (data) => {
      playNotificationSound();
      setNotification({
        type: 'new-order',
        orderId: data.order?._id,
        message: `New order #${data.order?._id?.slice(-8)} assigned to you`,
      });
      dispatch(getRiderOrders());
      setTimeout(() => setNotification(null), 5000);
    });

    socket.on('delivery_status_updated', (data) => {
      if (data.orderId) {
        dispatch(getRiderOrders());
        setNotification({
          type: 'status-update',
          orderId: data.orderId,
          message: `Order #${data.orderId.slice(-8)} status updated to ${data.status}`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch, isSoundEnabled]);

  // ─── Data fetching ────────────────────────────────────────
  useEffect(() => {
    dispatch(getRiderOrders());
  }, [dispatch]);

  // ─── Clear messages ───────────────────────────────────────
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // ─── Status update handler ───────────────────────────────
  const handleUpdateStatus = (orderId, newStatus) => {
    dispatch(
      updateDeliveryStatus({
        orderId,
        status: newStatus,
        message: `Order ${newStatus.replace(/_/g, ' ')}`,
      })
    ).then(() => {
      dispatch(getRiderOrders());
    });
  };

  // ─── Search / filter ──────────────────────────────────────
  const displayedOrders = useMemo(() => {
    const orders = activeTab === 'active' ? activeOrders : completedOrders;
    if (!searchTerm.trim()) return orders;

    const term = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order._id?.toLowerCase().includes(term) ||
        order.user?.name?.toLowerCase().includes(term) ||
        order.user?.mobile?.includes(term)
    );
  }, [activeTab, activeOrders, completedOrders, searchTerm]);

  // ─── Status config ────────────────────────────────────────
  const statusConfig = {
    assigned_to_rider: {
      label: 'Assigned',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      dotColor: 'bg-blue-500',
      icon: <FaClock className="text-blue-500" />,
      nextStatus: 'out_for_delivery',
      nextLabel: 'Out for Delivery',
    },
    out_for_delivery: {
      label: 'Out for Delivery',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      dotColor: 'bg-orange-500',
      icon: <FaMotorcycle className="text-orange-500 animate-pulse" />,
      nextStatus: 'delivered',
      nextLabel: 'Mark Delivered',
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dotColor: 'bg-green-500',
      icon: <FaCheckCircle className="text-green-500" />,
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      dotColor: 'bg-red-500',
      icon: <FaTimes className="text-red-500" />,
    },
  };

  // ─── Stats ────────────────────────────────────────────────
  const counts = {
    active: activeOrders.length,
    out_for_delivery: activeOrders.filter((o) => o.orderStatus === 'out_for_delivery').length,
    delivered: completedOrders.filter((o) => o.orderStatus === 'delivered').length,
    total: activeOrders.length + completedOrders.length,
  };

  // ─── Action button ────────────────────────────────────────
  const renderActionButton = (order) => {
    const status = order.orderStatus;
    if (status === 'delivered' || status === 'cancelled') return null;

    const config = statusConfig[status];
    if (!config || !config.nextStatus) return null;

    return (
      <button
        onClick={() => handleUpdateStatus(order._id, config.nextStatus)}
        className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2"
      >
        {config.nextLabel}
      </button>
    );
  };

  // ─── Loading / Error ──────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-[#1E293B] rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-8 text-center max-w-md border border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">Failed to Load Orders</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(getRiderOrders())}
            className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-slideIn">
          <div className={`rounded-xl shadow-2xl p-4 border-l-4 ${
            notification.type === 'new-order'
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[#1E293B] dark:to-[#0F172A] border-green-500'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1E293B] dark:to-[#0F172A] border-blue-500'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === 'new-order'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {notification.type === 'new-order' ? (
                  <FaBell className="text-green-500 text-lg" />
                ) : (
                  <FaCheckCircle className="text-blue-500 text-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  {notification.type === 'new-order' ? '📦 New Order Assigned' : '🔄 Status Updated'}
                </p>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] truncate">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl shadow-lg shadow-[#4F46E5]/20">
                <MdDeliveryDining className="text-white text-xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
                My Deliveries
              </h1>
              <span className="px-3 py-1 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] rounded-full text-sm font-medium">
                {activeOrders.length + completedOrders.length} Total
              </span>
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`ml-2 p-2 rounded-lg transition-colors ${
                  isSoundEnabled
                    ? 'bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20'
                    : 'bg-gray-100 dark:bg-[#1E293B] text-[#94A3B8] hover:bg-gray-200 dark:hover:bg-[#2D3748]'
                }`}
                title={isSoundEnabled ? 'Mute notifications' : 'Unmute notifications'}
              >
                {isSoundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] ml-12">
              Track and update your assigned delivery orders
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'active', label: 'Active', count: counts.active, color: 'text-blue-500' },
          { key: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery, color: 'text-orange-500' },
          { key: 'delivered', label: 'Delivered', count: counts.delivered, color: 'text-emerald-500' },
          { key: 'total', label: 'Total Orders', count: counts.total, color: 'text-[#4F46E5]' },
        ].map((stat) => (
          <div
            key={stat.key}
            className="bg-white dark:bg-[#1E293B] rounded-xl p-3 border border-[#E2E8F0] dark:border-[#1E293B] transition-all hover:shadow-md"
          >
            <p className="text-[10px] font-medium text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B] mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'active'
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B]'
              }`}
            >
              Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B]'
              }`}
            >
              Completed ({completedOrders.length})
            </button>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 text-[#4F46E5] hover:bg-[#4F46E5]/10 rounded-lg text-sm font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] p-12 text-center">
          <div className="w-20 h-20 bg-[#F1F5F9] dark:bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTruck className="text-3xl text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">
            {activeTab === 'active' ? 'No Active Deliveries' : 'No Completed Deliveries'}
          </h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
            {searchTerm
              ? 'No orders match your search'
              : activeTab === 'active'
              ? 'You have no active orders at the moment'
              : "You haven't completed any deliveries yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedOrders.map((order) => {
            const status = order.orderStatus || 'assigned_to_rider';
            const statusInfo = statusConfig[status] || statusConfig.assigned_to_rider;

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-[#4F46E5] text-lg flex-shrink-0" />
                        <h3 className="font-bold text-[#0F172A] dark:text-white truncate">
                          Order #{order._id?.slice(-8)}
                        </h3>
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 flex items-center gap-2">
                        <FaClock className="text-[10px]" />
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 ${statusInfo.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`}></span>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Customer Info */}
                  <div className="flex items-center gap-2 text-sm bg-[#F8FAFC] dark:bg-[#0F172A] p-2.5 rounded-lg">
                    <FaUser className="text-[#4F46E5] text-sm flex-shrink-0" />
                    <span className="font-medium text-[#0F172A] dark:text-white truncate">
                      {order.user?.name || 'Guest'}
                    </span>
                    {order.user?.mobile && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#1E293B] px-2 py-0.5 rounded-full">
                        <FaPhone className="text-[10px]" />
                        {order.user.mobile}
                      </span>
                    )}
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="bg-[#F8FAFC] dark:bg-[#0F172A] p-2.5 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-[#4F46E5] text-sm mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0F172A] dark:text-white">
                            {order.deliveryAddress.fullName || 'Customer'}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                            {order.deliveryAddress.addressLine1}
                            {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                            {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                            {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
                            {order.deliveryAddress.pincode && ` - ${order.deliveryAddress.pincode}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items Preview - CORRECT FIELD: products */}
                  <div>
                    <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
                      Items ({order.products?.length || 0})
                    </p>
                    <div className="space-y-1.5">
                      {order.products?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-6 bg-[#E2E8F0] dark:bg-[#1E293B] rounded flex items-center justify-center flex-shrink-0">
                            <FaCoffee className="text-[10px] text-[#94A3B8]" />
                          </div>
                          <span className="text-[#0F172A] dark:text-white truncate flex-1">
                            {item.coffee?.name || item.name || 'Product'}
                          </span>
                          <span className="text-[#64748B] dark:text-[#94A3B8] flex-shrink-0">
                            x{item.quantity || 1}
                          </span>
                        </div>
                      ))}
                      {order.products?.length > 3 && (
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] text-center">
                          +{order.products.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer - CORRECT FIELD: amount */}
                  <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-[#4F46E5] flex items-center gap-0.5">
                          <FaRupeeSign className="text-sm" />
                          {order.amount || 0}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                          {order.payment?.method || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {renderActionButton(order)}

                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="p-2 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </button>
                        <button
                          className="p-2 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors"
                          title="Contact Customer"
                        >
                          <FaHeadset className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal - CORRECT FIELDS */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
                  Order #{selectedOrder._id?.slice(-8)}
                </h2>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Customer: {selectedOrder.user?.name || 'Guest'}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-[#64748B] dark:text-[#94A3B8] text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Products */}
              <div>
                <h3 className="font-semibold text-[#0F172A] dark:text-white mb-3 flex items-center gap-2">
                  <FaCoffee className="text-orange-500" />
                  Ordered Products
                </h3>
                <div className="space-y-2">
                  {selectedOrder.products?.length > 0 ? (
                    selectedOrder.products.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl"
                      >
                        <div>
                          <p className="font-semibold text-[#0F172A] dark:text-white">
                            {item.coffee?.name || item.name || 'Product'}
                          </p>
                          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-[#0F172A] dark:text-white">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#64748B] dark:text-[#94A3B8]">No items</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-4">
                <h3 className="font-semibold text-[#0F172A] dark:text-white mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Delivery Address
                </h3>
                {selectedOrder.deliveryAddress ? (
                  <div className="space-y-1 text-[#64748B] dark:text-[#94A3B8]">
                    <p className="font-semibold text-[#0F172A] dark:text-white">
                      {selectedOrder.deliveryAddress.fullName || 'N/A'}
                    </p>
                    <p>{selectedOrder.deliveryAddress.phone || 'N/A'}</p>
                    <p>{selectedOrder.deliveryAddress.addressLine1 || ''}</p>
                    <p>
                      {selectedOrder.deliveryAddress.city || ''},{' '}
                      {selectedOrder.deliveryAddress.state || ''}
                    </p>
                    <p>{selectedOrder.deliveryAddress.pincode || ''}</p>
                  </div>
                ) : (
                  <p className="text-[#64748B] dark:text-[#94A3B8]">No address provided</p>
                )}
              </div>

              {/* Payment & Total - CORRECT: amount */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[#1E293B] dark:to-[#0F172A] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Total Amount</p>
                    <p className="text-2xl font-bold text-[#4F46E5] flex items-center gap-0.5">
                      <FaRupeeSign className="text-sm" />
                      {selectedOrder.amount || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      statusConfig[selectedOrder.orderStatus]?.color || 'bg-gray-100'
                    }`}>
                      {statusConfig[selectedOrder.orderStatus]?.label || selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] p-4 bg-[#F8FAFC] dark:bg-[#0F172A]">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-3 bg-[#4F46E5] text-white rounded-xl font-semibold hover:bg-[#4338CA] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderAssignedOrder;