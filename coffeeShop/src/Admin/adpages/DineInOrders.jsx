// pages/admin/DineInOrders.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../redux/Slicer/adminOrder';
import {
  FaEye,
  FaUtensils,
  FaUser,
  FaRupeeSign,
  FaCheckCircle,
  FaSpinner,
  FaHourglassHalf,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaPrint,
  FaBan,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUsers,
  FaShoppingBag,
  FaWallet,
  FaCreditCard,
  FaMobileAlt
} from 'react-icons/fa';
import {
  MdTableRestaurant,
  MdPayment,
  MdOutlinePending,
  MdOutlineReceipt,
  MdOutlineCancel
} from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineDotsVertical } from 'react-icons/hi';

const DineInOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.adminOrder);

  // State Management
  const [dineInOrders, setDineInOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Filter dine-in orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      const filtered = orders
        .filter(order => order.orderType === 'dine_in')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDineInOrders(filtered);
      setFilteredOrders(filtered);
    }
  }, [orders]);

  // Search and Filter logic
  useEffect(() => {
    let result = [...dineInOrders];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => {
        // Get table number from the table object
        const tableNumber = order.table?.tableNumber || 'N/A';
        return (
          order._id?.toLowerCase().includes(term) ||
          order.user?.name?.toLowerCase().includes(term) ||
          order.user?.email?.toLowerCase().includes(term) ||
          String(tableNumber).includes(term)
        );
      });
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
        } else if (sortConfig.key === 'tableNumber') {
          aVal = a.table?.tableNumber || 0;
          bVal = b.table?.tableNumber || 0;
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
  }, [dineInOrders, searchTerm, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-[#94A3B8]" />;
    return sortConfig.direction === 'asc'
      ? <FaSortUp className="text-[#4F46E5]" />
      : <FaSortDown className="text-[#4F46E5]" />;
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

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-[#1E293B] rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-[#1E293B] rounded-xl"></div>
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
                <FaUtensils className="text-white text-xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
                Dine In Orders
              </h1>
              <span className="px-3 py-1 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] rounded-full text-sm font-medium">
                {dineInOrders.length} Total
              </span>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] ml-12">
              Manage and track all dine-in orders
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B] mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {currentOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] p-12 text-center">
          <div className="w-20 h-20 bg-[#F1F5F9] dark:bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUtensils className="text-3xl text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">No Dine-In Orders</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
            {searchTerm
              ? 'No orders match your search criteria'
              : 'New dine-in orders will appear here'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 text-[#4F46E5] hover:bg-[#4F46E5]/10 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentOrders.map((order) => {
              // Get table details safely
              const tableNumber = order.table?.tableNumber || 'N/A';
              const tableStatus = order.table?.status || 'N/A';
              const tableSeats = order.table?.seats || 'N/A';

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
                          <MdTableRestaurant className="text-[#4F46E5] text-lg flex-shrink-0" />
                          <h3 className="font-bold text-[#0F172A] dark:text-white truncate">
                            Table #{tableNumber}
                          </h3>
                          {/* Table status badge */}
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getTableStatusColor(tableStatus)}`}>
                            {tableStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                            #{order._id?.slice(-8)}
                          </p>
                          {tableSeats !== 'N/A' && (
                            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                              • {tableSeats} seats
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Order status badge */}
                      
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
                      {order.user?.email && (
                        <span className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate max-w-[120px]">
                          {order.user.email}
                        </span>
                      )}
                    </div>

                    {/* Items Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                          Items ({order.products?.length || 0})
                        </p>
                        <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                          <FaClock className="inline mr-1 text-[10px]" />
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {order.products?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            {item.coffee?.image ? (
                              <img src={item.coffee.image} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-6 h-6 bg-[#E2E8F0] dark:bg-[#1E293B] rounded flex items-center justify-center flex-shrink-0">
                                <FaUtensils className="text-[10px] text-[#94A3B8]" />
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
                          <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                            <span className="flex items-center gap-0.5">
                              {getPaymentIcon(order.payment?.method)}
                              {order.payment?.method || 'N/A'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-[#1E293B]"></span>
                            <span className={order.payment?.status === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                              {order.payment?.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/orders/dine-in/${order._id}`)}
                            className="p-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-all hover:scale-105"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            className="p-2 bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] transition-colors"
                            title="Print Bill"
                          >
                            <FaPrint className="text-sm" />
                          </button>
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
        </>
      )}
    </div>
  );
};

export default DineInOrders;