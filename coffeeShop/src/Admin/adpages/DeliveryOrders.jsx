// pages/admin/DeliveryOrders.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../redux/Slicer/adminOrder';
import {
  getAvailableRiders, assignRiderToOrder, unassignRiderFromOrder,
} from "../../redux/Slicer/riderAssignmentSlice";
import io from 'socket.io-client';
import {
  FaTruck,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEye,
  FaRupeeSign,
  FaClock,
  FaSearch,
  FaSpinner,
  FaHourglassHalf,
  FaTimesCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMotorcycle,
  FaCheckCircle,
  FaBell,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';

const DeliveryOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const { orders, error, loading } = useSelector((state) => state.adminOrder);
  const { availableRiders, loading: riderLoading } = useSelector((state) => state.riderAssignment);

  // State Management
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [notification, setNotification] = useState(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Play notification sound
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

  // Socket Connection Setup
  useEffect(() => {
    const socket = io('http://food.go-drop.in', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    // Join admin room
    const adminId = localStorage.getItem('userId');
    if (adminId) {
      socket.emit('admin-join', adminId);
    }
    socket.emit('admin-join');

    // Listen for new orders
    socket.on('new-order-placed', (data) => {
      console.log('🔔 New delivery order received:', data);

      if (data.order?.orderType === 'delivery') {
        playNotificationSound();
        setNotification({
          type: 'new-order',
          orderId: data.order._id,
          customerName: data.order.user?.name || 'Unknown',
          amount: data.order.amount,
          message: `New delivery order from ${data.order.user?.name || 'Customer'}`
        });

        setDeliveryOrders(prev => [data.order, ...prev]);

        setTimeout(() => {
          setNotification(null);
        }, 6000);
      }
    });

    // Listen for order status updates
    socket.on('order-status-updated', (data) => {
      console.log('📡 Order status updated via socket:', data);

      setDeliveryOrders(prev => {
        const existingOrder = prev.find(o => o._id === data.orderId);
        if (!existingOrder) {
          dispatch(getAllOrders());
          return prev;
        }

        return prev?.map(order =>
          order._id === data.orderId
            ? {
                ...order,
                orderStatus: data.newStatus || data.status,
                tracking: data.tracking || order.tracking,
                updatedAt: data.timestamp || new Date().toISOString(),
                _justUpdated: true
              }
            : order
        );
      });

      if (data.order) {
        setNotification({
          type: 'status-update',
          orderId: data.orderId,
          message: `🔄 Order #${data.orderId.slice(-8)} status updated to ${(data.newStatus || data.status).replace(/_/g, ' ')}`
        });
        setTimeout(() => setNotification(null), 4000);
      }

      // Refresh if order not in list
      const exists = deliveryOrders.some(o => o._id === data.orderId);
      if (!exists) {
        dispatch(getAllOrders());
      }
    });

    // Listen for delivery status updates (from rider)
    socket.on('delivery_status_updated', (data) => {
      console.log('📡 Delivery status updated by rider:', data);

      setDeliveryOrders(prev => {
        const existingOrder = prev.find(o => o._id === data.orderId);
        if (!existingOrder) {
          dispatch(getAllOrders());
          return prev;
        }

        return prev?.map(order =>
          order._id === data.orderId
            ? {
                ...order,
                orderStatus: data.status || data.newStatus,
                tracking: data.tracking || order.tracking,
                updatedAt: data.timestamp || new Date().toISOString(),
                _justUpdated: true
              }
            : order
        );
      });

      setNotification({
        type: 'status-update',
        orderId: data.orderId,
        message: `🚚 Order #${data.orderId.slice(-8)} ${(data.status || data.newStatus).replace(/_/g, ' ')}`
      });
      setTimeout(() => setNotification(null), 4000);
    });

    // Listen for rider assignments
    socket.on('rider-assigned', (data) => {
      console.log('🚚 Rider assigned:', data);

      setDeliveryOrders(prev => prev?.map(order =>
        order._id === data.orderId
          ? {
              ...order,
              assignedRider: data.rider,
              orderStatus: 'out_for_delivery'
            }
          : order
      ));

      setNotification({
        type: 'rider-assigned',
        orderId: data.orderId,
        riderName: data.rider?.name || 'Rider',
        message: `Rider assigned to order ${data.orderId.slice(-8)}`
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    });

    // Listen for order cancellations
    socket.on('order-cancelled', (data) => {
      console.log('❌ Order cancelled:', data);

      setDeliveryOrders(prev => prev?.map(order =>
        order._id === data.orderId
          ? { ...order, orderStatus: 'cancelled' }
          : order
      ));

      setNotification({
        type: 'cancelled',
        orderId: data.orderId,
        message: `Order ${data.orderId.slice(-8)} has been cancelled`
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    });

    // Broadcast events
    socket.on('order-update-broadcast', (data) => {
      console.log('📡 Order update broadcast:', data);
      dispatch(getAllOrders());
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch, deliveryOrders]);

  // Fetch orders
  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAvailableRiders());
  }, [dispatch, refreshKey]);

  // Filter delivery orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      const filtered = orders
        .filter(order => order.orderType === 'delivery')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDeliveryOrders(filtered);
    }
  }, [orders]);

  // Search, Filter, Sort logic
  useEffect(() => {
    let result = [...deliveryOrders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order._id?.toLowerCase().includes(term) ||
        order.user?.name?.toLowerCase().includes(term) ||
        order.user?.email?.toLowerCase().includes(term) ||
        order.deliveryAddress?.addressLine1?.toLowerCase().includes(term) ||
        order.deliveryAddress?.phone?.includes(term)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(order => order.orderStatus === filterStatus);
    }

    if (filterPayment !== 'all') {
      result = result.filter(order => order.payment?.status === filterPayment);
    }

    if (dateRange.start) {
      result = result.filter(order =>
        new Date(order.createdAt) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      result = result.filter(order =>
        new Date(order.createdAt) <= new Date(dateRange.end)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal, bVal;

        if (sortConfig.key === 'user') {
          aVal = a.user?.name || '';
          bVal = b.user?.name || '';
        } else if (sortConfig.key === 'amount') {
          aVal = a.amount || 0;
          bVal = b.amount || 0;
        } else if (sortConfig.key === 'createdAt') {
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
        } else {
          aVal = a[sortConfig.key] || '';
          bVal = b[sortConfig.key] || '';
        }

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [deliveryOrders, searchTerm, filterStatus, filterPayment, sortConfig, dateRange]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);

      const response = await fetch(`http://localhost:5003/api/rider/admin/update-order-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          notes: `Order status updated to ${newStatus} by admin`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const data = await response.json();
      console.log('✅ Order status updated:', data);

      // Update local state immediately
      setDeliveryOrders(prev => prev?.map(order =>
        order._id === orderId
          ? { ...order, orderStatus: newStatus }
          : order
      ));

      setNotification({
        type: 'status-update',
        orderId: orderId,
        message: `✅ Order #${orderId.slice(-8)} status updated to ${newStatus.replace(/_/g, ' ')}`
      });

      setTimeout(() => setNotification(null), 4000);
      setShowActionMenu(null);
      setIsUpdating(false);

      // Refresh orders to get latest data
      setRefreshKey(prev => prev + 1);
      await dispatch(getAllOrders());

    } catch (error) {
      console.error('❌ Error updating order:', error);
      setNotification({
        type: 'error',
        orderId: orderId,
        message: `❌ Failed to update order: ${error.message}`
      });
      setTimeout(() => setNotification(null), 4000);
      setIsUpdating(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  // Handle assign rider
  const handleAssign = async () => {
    if (!selectedRider) return;

    try {
      await dispatch(
        assignRiderToOrder({
          orderId: selectedOrder._id,
          riderId: selectedRider,
        })
      );

      setRefreshKey(prev => prev + 1);
      dispatch(getAllOrders());
      dispatch(getAvailableRiders());

      setShowAssignModal(false);
      setSelectedOrder(null);
      setSelectedRider("");
    } catch (error) {
      console.error('Error assigning rider:', error);
    }
  };

  // Handle unassign rider
  const handleUnassign = async (orderId) => {
    try {
      await dispatch(unassignRiderFromOrder(orderId));
      setRefreshKey(prev => prev + 1);
      dispatch(getAllOrders());
      dispatch(getAvailableRiders());
    } catch (error) {
      console.error('Error unassigning rider:', error);
    }
  };

  // Handle change rider
  const handleChangeRider = (order) => {
    setSelectedOrder(order);
    setSelectedRider(order.assignedRider?._id || "");
    setShowAssignModal(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Status Counts
  const statusCounts = useMemo(() => ({
    all: deliveryOrders.length,
    pending: deliveryOrders.filter(o => o.orderStatus === 'pending').length,
    confirmed: deliveryOrders.filter(o => o.orderStatus === 'confirmed').length,
    preparing: deliveryOrders.filter(o => o.orderStatus === 'preparing').length,
    ready: deliveryOrders.filter(o => o.orderStatus === 'ready').length,
    out_for_delivery: deliveryOrders.filter(o => o.orderStatus === 'out_for_delivery').length,
    delivered: deliveryOrders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: deliveryOrders.filter(o => o.orderStatus === 'cancelled').length,
  }), [deliveryOrders]);

  // Status Config
  const statusConfig = {
    pending: {
      icon: <FaHourglassHalf className="text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      dotColor: 'bg-yellow-500',
      label: 'Pending'
    },
    confirmed: {
      icon: <FaCheckCircle className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      dotColor: 'bg-blue-500',
      label: 'Confirmed'
    },
    preparing: {
      icon: <FaSpinner className="text-indigo-500 animate-spin" />,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      dotColor: 'bg-indigo-500',
      label: 'Preparing'
    },
    ready: {
      icon: <FaCheckCircle className="text-green-500" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dotColor: 'bg-green-500',
      label: 'Ready'
    },
    out_for_delivery: {
      icon: <FaMotorcycle className="text-orange-500 animate-pulse" />,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      dotColor: 'bg-orange-500',
      label: 'Out for Delivery'
    },
    delivered: {
      icon: <FaCheckCircle className="text-green-500" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dotColor: 'bg-green-500',
      label: 'Delivered'
    },
    cancelled: {
      icon: <FaTimesCircle className="text-red-500" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      dotColor: 'bg-red-500',
      label: 'Cancelled'
    }
  };

  // Payment Config
  const paymentConfig = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-[#94A3B8]" />;
    return sortConfig.direction === 'asc'
      ? <FaSortUp className="text-[#4F46E5]" />
      : <FaSortDown className="text-[#4F46E5]" />;
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-[#1E293B] rounded-lg mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            {[...Array(8)]?.map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)]?.map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl p-8 text-center max-w-md border border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">Failed to Load Orders</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(getAllOrders())}
            className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-slideIn">
          <div className={`rounded-xl shadow-2xl p-4 border-l-4 ${notification.type === 'new-order' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[#1E293B] dark:to-[#0F172A] border-green-500' :
            notification.type === 'status-update' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1E293B] dark:to-[#0F172A] border-blue-500' :
            notification.type === 'error' ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-[#1E293B] dark:to-[#0F172A] border-red-500' :
            notification.type === 'cancelled' ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-[#1E293B] dark:to-[#0F172A] border-red-500' :
              notification.type === 'rider-assigned' ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-[#1E293B] dark:to-[#0F172A] border-orange-500' :
                'bg-white dark:bg-[#1E293B] border-[#4F46E5]'
            }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'new-order' ? 'bg-green-100 dark:bg-green-900/30' :
                notification.type === 'status-update' ? 'bg-blue-100 dark:bg-blue-900/30' :
                notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                  notification.type === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30' :
                    notification.type === 'rider-assigned' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-[#4F46E5]/10'
                }`}>
                {notification.type === 'new-order' && <FaBell className="text-green-500 text-lg" />}
                {notification.type === 'status-update' && <FaCheckCircle className="text-blue-500 text-lg" />}
                {notification.type === 'error' && <FaExclamationTriangle className="text-red-500 text-lg" />}
                {notification.type === 'cancelled' && <FaTimesCircle className="text-red-500 text-lg" />}
                {notification.type === 'rider-assigned' && <FaMotorcycle className="text-orange-500 text-lg" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
                  {notification.type === 'new-order' && '🛒 New Delivery Order!'}
                  {notification.type === 'status-update' && '🔄 Order Updated'}
                  {notification.type === 'error' && '❌ Error'}
                  {notification.type === 'cancelled' && '❌ Order Cancelled'}
                  {notification.type === 'rider-assigned' && '🚚 Rider Assigned'}
                </p>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] truncate">
                  {notification.message}
                </p>
                {notification.type === 'new-order' && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <span>₹{notification.amount}</span>
                    <span>•</span>
                    <span>Order #{notification.orderId?.slice(-8)}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
              >
                <FaTimesCircle className="text-lg" />
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
                Delivery Orders
              </h1>
              <span className="px-3 py-1 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] rounded-full text-sm font-medium">
                {deliveryOrders.length} Total
              </span>
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`ml-2 p-2 rounded-lg transition-colors ${isSoundEnabled
                  ? 'bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20'
                  : 'bg-gray-100 dark:bg-[#1E293B] text-[#94A3B8] hover:bg-gray-200 dark:hover:bg-[#2D3748]'
                }`}
                title={isSoundEnabled ? 'Mute notifications' : 'Unmute notifications'}
              >
                {isSoundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] ml-12">
              Manage and track all delivery orders
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {[
          { key: 'all', label: 'All', count: statusCounts.all, color: 'text-[#4F46E5]' },
          { key: 'pending', label: 'Pending', count: statusCounts.pending, color: 'text-yellow-500' },
          { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'text-blue-500' },
          { key: 'preparing', label: 'Preparing', count: statusCounts.preparing, color: 'text-indigo-500' },
          { key: 'ready', label: 'Ready', count: statusCounts.ready, color: 'text-green-500' },
          { key: 'out_for_delivery', label: 'Out for Delivery', count: statusCounts.out_for_delivery, color: 'text-orange-500' },
          { key: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'text-emerald-500' },
          { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'text-red-500' },
        ]?.map((stat) => (
          <div
            key={stat.key}
            onClick={() => setFilterStatus(stat.key)}
            className={`bg-white dark:bg-[#1E293B] rounded-xl p-3 border transition-all cursor-pointer hover:shadow-md ${filterStatus === stat.key
              ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20 dark:ring-[#4F46E5]/10'
              : 'border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#4F46E5]/30'
            }`}
          >
            <p className="text-[10px] font-medium text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B] mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Phone, or Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none"
            >
              <option value="all">All Payment</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none"
            />

            {(searchTerm || filterStatus !== 'all' || filterPayment !== 'all' || dateRange.start || dateRange.end) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterPayment('all');
                  setDateRange({ start: '', end: '' });
                }}
                className="px-4 py-2.5 text-[#4F46E5] hover:bg-[#4F46E5]/10 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {currentOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] p-12 text-center">
          <div className="w-20 h-20 bg-[#F1F5F9] dark:bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTruck className="text-3xl text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">No Delivery Orders</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
            {searchTerm || filterStatus !== 'all' || filterPayment !== 'all' || dateRange.start || dateRange.end
              ? 'No orders match your search criteria'
              : 'New delivery orders will appear here'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentOrders?.map((order) => {
              const status = order.orderStatus || 'pending';
              const statusInfo = statusConfig[status] || statusConfig.pending;
              const paymentStatus = order.payment?.status || 'pending';

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
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === order._id ? null : order._id)}
                            className="p-1.5 hover:bg-[#E2E8F0] dark:hover:bg-[#0F172A] rounded-lg transition-colors"
                            disabled={isUpdating}
                          >
                            {isUpdating ? <FaSpinner className="animate-spin text-[#4F46E5]" /> : <BsThreeDotsVertical className="text-[#64748B] dark:text-[#94A3B8]" />}
                          </button>
                          {showActionMenu === order._id && !isUpdating && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg shadow-xl z-10 py-1">
                              {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered']?.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => updateOrderStatus(order._id, s)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors capitalize"
                                >
                                  {s.replace('_', ' ')}
                                </button>
                              ))}
                              <div className="border-t border-[#E2E8F0] dark:border-[#1E293B]"></div>
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors capitalize"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
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
                      {order.deliveryAddress?.phone && (
                        <span className="ml-auto flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#1E293B] px-2 py-0.5 rounded-full">
                          <FaPhone className="text-[10px]" />
                          {order.deliveryAddress.phone}
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
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                          Items ({order.products?.length || 0})
                        </p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentConfig[paymentStatus] || 'bg-gray-100'}`}>
                          {paymentStatus}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {order.products?.slice(0, 3)?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            {item.coffee?.image ? (
                              <img src={item.coffee.image} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-6 h-6 bg-[#E2E8F0] dark:bg-[#1E293B] rounded flex items-center justify-center flex-shrink-0">
                                <FaTruck className="text-[10px] text-[#94A3B8]" />
                              </div>
                            )}
                            <span className="text-[#0F172A] dark:text-white truncate flex-1">
                              {item.coffee?.name || 'Product'}
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

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/orders/delivery/${order._id}`)}
                            className="p-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-all hover:scale-105 shadow-lg shadow-[#4F46E5]/20"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>

                          {order.assignedRider ? (
                            <>
                              <button
                                onClick={() => handleChangeRider(order)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Change
                              </button>
                              <button
                                onClick={() => handleUnassign(order._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Unassign
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAssignModal(true);
                              }}
                              className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {[...Array(totalPages)]?.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Assign Rider Modal */}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#1E293B] rounded-xl p-6 w-[400px] max-w-[95vw]">
                <h2 className="text-xl font-bold mb-4 text-[#0F172A] dark:text-white">
                  Assign Rider
                </h2>

                <select
                  className="w-full border p-3 rounded-lg bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white border-[#E2E8F0] dark:border-[#1E293B]"
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                  disabled={riderLoading}
                >
                  <option value="">Select Rider</option>
                  {availableRiders?.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name} {rider.isAvailable ? '✅' : '❌'}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-gray-300 dark:hover:bg-[#2D3748] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedRider || riderLoading}
                    className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {riderLoading ? <FaSpinner className="animate-spin" /> : null}
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryOrders;