// pages/admin/DeliveryOrders.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../redux/Slicer/adminOrder';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhone, 
  FaEye,
  FaRupeeSign,
  FaClock,
  FaSearch,
  FaFilter,
  FaPrint,
  FaDownload,
  FaUserCircle,
  FaCheckCircle,
  FaSpinner,
  FaHourglassHalf,
  FaTimesCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaShoppingBag,
  FaWallet,
  FaCreditCard,
  FaMobileAlt,
  FaCalendarAlt,
  FaRoute,
  FaMotorcycle,
  FaHeadset,
  FaBan
} from 'react-icons/fa';
import { 
  MdDeliveryDining, 
  MdPayment, 
  MdOutlinePending,
  MdOutlineReceipt,
  MdOutlineCancel,
  MdPersonAdd,
  MdSwapHoriz
} from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GiKnifeFork } from 'react-icons/gi';

const DeliveryOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { orders, error, loading } = useSelector((state) => state.adminOrder);
  
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

  // Fetch orders
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

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

    // Search
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

    // Status Filter
    if (filterStatus !== 'all') {
      result = result.filter(order => order.orderStatus === filterStatus);
    }

    // Payment Filter
    if (filterPayment !== 'all') {
      result = result.filter(order => order.payment?.status === filterPayment);
    }

    // Date Range Filter
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

    // Sorting
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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      dispatch(getAllOrders());
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
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
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] ml-12">
              Manage and track all delivery orders
            </p>
          </div>
          
          <div className="flex items-center gap-3 ml-12 md:ml-0">
            <button className="px-4 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-sm text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#2D3748] transition-colors flex items-center gap-2">
              <FaPrint />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#4F46E5]/25 transition-all hover:scale-105">
              + New Delivery
            </button>
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
        ].map((stat) => (
          <div
            key={stat.key}
            onClick={() => setFilterStatus(stat.key)}
            className={`bg-white dark:bg-[#1E293B] rounded-xl p-3 border transition-all cursor-pointer hover:shadow-md ${
              filterStatus === stat.key
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
          {/* Search */}
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
          
          {/* Filters */}
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
            {currentOrders.map((order) => {
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
                          >
                            <BsThreeDotsVertical className="text-[#64748B] dark:text-[#94A3B8]" />
                          </button>
                          {showActionMenu === order._id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg shadow-xl z-10 py-1">
                              {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => updateOrderStatus(order._id, s)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A] text-[#0F172A] dark:text-white transition-colors capitalize"
                                >
                                  {s.replace('_', ' ')}
                                </button>
                              ))}
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
                        {order.products?.slice(0, 3).map((item, idx) => (
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
                          <button
                            className="p-2 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors"
                            title="Contact Customer"
                          >
                            <FaHeadset className="text-sm" />
                          </button>
                          {status !== 'cancelled' && status !== 'delivered' && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              title="Cancel Order"
                            >
                              <FaBan className="text-sm" />
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
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
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
        </>
      )}
    </div>
  );
};

export default DeliveryOrders;