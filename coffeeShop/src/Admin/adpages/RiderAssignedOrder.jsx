// pages/Rider/RiderAssignedOrder.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaSearch,
  FaMotorcycle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCoffee,
  FaEye,
  FaTimes,
  FaRupeeSign,
  FaTruck,
  FaBell,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import {
  getRiderOrders,
  updateDeliveryStatus,
  clearMessage,
  clearError,
} from '../../redux/Slicer/riderAssignmentSlice';
import io from 'socket.io-client';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Sound ────────────────────────────────────────────────
  const playNotificationSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => console.log('Sound play blocked'));
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  // ─── Socket ───────────────────────────────────────────────
  useEffect(() => {
    const socket = io('http://food.go-drop.in', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    const user = JSON.parse(localStorage.getItem('user'));
    const riderId = user?._id;

    if (riderId) {
      socket.emit('rider-join', riderId);
      console.log('🔌 Rider joined socket:', riderId);
    }

    // Listen for order status updates
    socket.on('order-status-updated', (data) => {
      console.log('📡 Order status updated (rider view):', data);

      // Refresh orders
      setRefreshKey(prev => prev + 1);
      dispatch(getRiderOrders());

      // Update selected order if modal is open
      if (selectedOrder && selectedOrder._id === data.orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          orderStatus: data.newStatus || data.status,
          tracking: data.tracking || prev.tracking
        }));
      }

      setNotification({
        type: 'status-update',
        orderId: data.orderId,
        message: `🔄 Order #${data.orderId.slice(-8)} status updated to ${(data.newStatus || data.status).replace(/_/g, ' ')}`,
      });
      setTimeout(() => setNotification(null), 4000);
    });

    // Listen for delivery status confirmation
    socket.on('delivery_status_confirmed', (data) => {
      console.log('📡 Delivery status confirmed:', data);

      // Refresh orders
      setRefreshKey(prev => prev + 1);
      dispatch(getRiderOrders());

      if (selectedOrder && selectedOrder._id === data.orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          orderStatus: data.status,
          tracking: data.tracking || prev.tracking
        }));
      }
    });

    // Listen for new order assignment
    socket.on('new_order_assigned', (data) => {
      console.log('📢 New order assigned:', data);
      playNotificationSound();
      setNotification({
        type: 'new-order',
        orderId: data.order?._id || data.orderId,
        message: `📦 New order #${(data.order?._id || data.orderId).slice(-8)} assigned to you`,
      });
      setRefreshKey(prev => prev + 1);
      dispatch(getRiderOrders());
      setTimeout(() => setNotification(null), 5000);
    });

    // Listen for order cancellations
    socket.on('order-cancelled', (data) => {
      console.log('❌ Order cancelled (rider view):', data);
      setRefreshKey(prev => prev + 1);
      dispatch(getRiderOrders());

      if (selectedOrder && selectedOrder._id === data.orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          orderStatus: 'cancelled'
        }));
      }

      setNotification({
        type: 'cancelled',
        orderId: data.orderId,
        message: `❌ Order #${data.orderId.slice(-8)} has been cancelled`,
      });
      setTimeout(() => setNotification(null), 4000);
    });

    // Listen for rider unassignment
    socket.on('order_unassigned', (data) => {
      console.log('📢 Order unassigned from rider:', data);
      setRefreshKey(prev => prev + 1);
      dispatch(getRiderOrders());

      if (selectedOrder && selectedOrder._id === data.orderId) {
        setSelectedOrder(null);
        setShowDetailModal(false);
      }

      setNotification({
        type: 'unassigned',
        orderId: data.orderId,
        message: `📢 Order #${data.orderId.slice(-8)} has been unassigned from you`,
      });
      setTimeout(() => setNotification(null), 4000);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch, isSoundEnabled, selectedOrder]);

  // ─── Data fetching ────────────────────────────────────────
  useEffect(() => {
    console.log('🔄 Fetching rider orders...');
    setIsRefreshing(true);
    dispatch(getRiderOrders())
      .unwrap()
      .then(() => {
        setIsRefreshing(false);
      })
      .catch(() => {
        setIsRefreshing(false);
      });
  }, [dispatch, refreshKey]);

  // ─── Manual refresh ───────────────────────────────────────
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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
  const handleUpdateStatus = async (orderId, newStatus) => {
    console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);

    setUpdatingOrderId(orderId);

    try {
      const result = await dispatch(
        updateDeliveryStatus({
          orderId,
          status: newStatus,
          message: `Order ${newStatus.replace(/_/g, ' ')}`,
        })
      ).unwrap();

      console.log('✅ Status updated successfully:', result);

      // Update the selected order immediately in the modal
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          orderStatus: newStatus
        }));
      }

      // Force refresh after successful update
      setRefreshKey(prev => prev + 1);

      // Fetch fresh data
      await dispatch(getRiderOrders());

      // Show success notification
      setNotification({
        type: 'status-update',
        orderId: orderId,
        message: `✅ Order #${orderId.slice(-8)} ${newStatus.replace(/_/g, ' ')} successfully!`,
      });

      setTimeout(() => setNotification(null), 4000);

    } catch (error) {
      console.error('❌ Error updating status:', error);
      setNotification({
        type: 'error',
        orderId: orderId,
        message: `❌ Failed to update order: ${error.message || 'Unknown error'}`,
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setUpdatingOrderId(null);
    }
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
    },
    out_for_delivery: {
      label: 'Out for Delivery',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      dotColor: 'bg-orange-500',
      icon: <FaMotorcycle className="text-orange-500 animate-pulse" />,
    },
    delivered: {
      label: 'Delivered ✅',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dotColor: 'bg-green-500',
      icon: <FaCheckCircle className="text-green-500" />,
    },
    cancelled: {
      label: 'Cancelled ❌',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      dotColor: 'bg-red-500',
      icon: <FaTimes className="text-red-500" />,
    },
    preparing: {
      label: 'Preparing',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      dotColor: 'bg-yellow-500',
      icon: <FaClock className="text-yellow-500" />,
    },
  };

  // ─── Stats ────────────────────────────────────────────────
  const counts = {
    active: activeOrders.length,
    out_for_delivery: activeOrders.filter((o) => o.orderStatus === 'out_for_delivery').length,
    assigned: activeOrders.filter((o) => o.orderStatus === 'assigned_to_rider').length,
    delivered: completedOrders.filter((o) => o.orderStatus === 'delivered').length,
    total: activeOrders.length + completedOrders.length,
  };

  // ─── Loading ──────────────────────────────────────────────
  if (loading && !activeOrders.length && !completedOrders.length) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-[#1E293B] rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)]?.map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)]?.map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-8 text-center max-w-md border border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">Failed to Load Orders</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
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
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-[#1E293B] dark:to-[#0F172A] border-red-500'
              : notification.type === 'cancelled' || notification.type === 'unassigned'
              ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-[#1E293B] dark:to-[#0F172A] border-red-500'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1E293B] dark:to-[#0F172A] border-blue-500'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === 'new-order'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : notification.type === 'error'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : notification.type === 'cancelled' || notification.type === 'unassigned'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {notification.type === 'new-order' ? (
                  <FaBell className="text-green-500 text-lg" />
                ) : notification.type === 'error' ? (
                  <FaExclamationTriangle className="text-red-500 text-lg" />
                ) : notification.type === 'cancelled' || notification.type === 'unassigned' ? (
                  <FaTimes className="text-red-500 text-lg" />
                ) : (
                  <FaCheckCircle className="text-blue-500 text-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  {notification.type === 'new-order' ? '📦 New Order Assigned' :
                   notification.type === 'error' ? '❌ Error' :
                   notification.type === 'cancelled' ? '❌ Order Cancelled' :
                   notification.type === 'unassigned' ? '📢 Order Unassigned' :
                   '🔄 Status Updated'}
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
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20 transition-colors disabled:opacity-50"
                title="Refresh orders"
              >
                {isRefreshing ? <FaSpinner className="animate-spin" /> : '🔄'}
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
          { key: 'assigned', label: 'Assigned', count: counts.assigned, color: 'text-indigo-500' },
          { key: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery, color: 'text-orange-500' },
          { key: 'delivered', label: 'Delivered', count: counts.delivered, color: 'text-emerald-500' },
        ]?.map((stat) => (
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

      {/* Info Banner - No Active Orders */}
      {activeOrders.length === 0 && completedOrders.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                No Active Orders Right Now
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                You have {completedOrders.length} completed order{completedOrders.length > 1 ? 's' : ''}. Switch to "Completed" tab to view them.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('completed')}
              className="ml-auto px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              View Completed
            </button>
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'active'
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B]'
              }`}
            >
              🟢 Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B]'
              }`}
            >
              ✅ Completed ({completedOrders.length})
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
          {activeTab === 'active' && completedOrders.length > 0 && (
            <button
              onClick={() => setActiveTab('completed')}
              className="mt-4 px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
            >
              View {completedOrders.length} Completed Order{completedOrders.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedOrders?.map((order) => {
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

                  {/* Items Preview */}
                  <div>
                    <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
                      Items ({order.products?.length || 0})
                    </p>
                    <div className="space-y-1.5">
                      {order.products?.slice(0, 3)?.map((item, idx) => (
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

                  {/* Footer */}
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL WITH ACTION BUTTONS */}
      {/* ============================================================ */}
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
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
                className="w-10 h-10 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-[#64748B] dark:text-[#94A3B8] text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
              {/* Order Status Badge */}
              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl">
                <span className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  statusConfig[selectedOrder.orderStatus]?.color || 'bg-gray-100'
                }`}>
                  {statusConfig[selectedOrder.orderStatus]?.label || selectedOrder.orderStatus}
                </span>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold text-[#0F172A] dark:text-white mb-3 flex items-center gap-2">
                  <FaCoffee className="text-orange-500" />
                  Ordered Products
                </h3>
                <div className="space-y-2">
                  {selectedOrder.products?.length > 0 ? (
                    selectedOrder.products?.map((item, index) => (
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

              {/* Payment & Total */}
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
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Payment</p>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                      {selectedOrder.paymentStatus === 'paid' ? '✅ Paid' : '❌ Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] p-4 bg-[#F8FAFC] dark:bg-[#0F172A]">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Check if order is already delivered or cancelled */}
                {selectedOrder.orderStatus === 'delivered' || selectedOrder.orderStatus === 'cancelled' ? (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 py-3 bg-[#4F46E5] text-white rounded-xl font-semibold hover:bg-[#4338CA] transition-colors"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    {/* Show appropriate button based on current status */}
                    {selectedOrder.orderStatus === 'assigned_to_rider' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'out_for_delivery')}
                        disabled={updatingOrderId === selectedOrder._id}
                        className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingOrderId === selectedOrder._id ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaMotorcycle className="text-lg" />
                            Out for Delivery
                          </>
                        )}
                      </button>
                    )}
                    
                    {selectedOrder.orderStatus === 'out_for_delivery' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                        disabled={updatingOrderId === selectedOrder._id}
                        className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingOrderId === selectedOrder._id ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="text-lg" />
                            Mark as Delivered
                          </>
                        )}
                      </button>
                    )}

                    {/* Fallback: Show both buttons if status is something unexpected */}
                    {selectedOrder.orderStatus !== 'assigned_to_rider' && 
                     selectedOrder.orderStatus !== 'out_for_delivery' &&
                     selectedOrder.orderStatus !== 'delivered' &&
                     selectedOrder.orderStatus !== 'cancelled' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder._id, 'out_for_delivery')}
                          disabled={updatingOrderId === selectedOrder._id}
                          className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingOrderId === selectedOrder._id ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <FaMotorcycle className="text-lg" />
                              Out for Delivery
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                          disabled={updatingOrderId === selectedOrder._id}
                          className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingOrderId === selectedOrder._id ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="text-lg" />
                              Mark as Delivered
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {/* Close button */}
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setSelectedOrder(null);
                      }}
                      className="py-3 px-6 bg-gray-200 dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-[#2D3748] transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderAssignedOrder;