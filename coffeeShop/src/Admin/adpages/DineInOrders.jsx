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
  FaSpinner,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaPrint,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUsers,
  FaShoppingBag,
  FaWallet,
  FaCreditCard,
  FaMobileAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import {
  MdTableRestaurant,
  MdPayment,
  MdOutlinePending,
  MdOutlineReceipt,
  MdOutlineCancel,
} from 'react-icons/md';

const DineInOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.adminOrder);

  // State
  const [dineInOrders, setDineInOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Fetch orders
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

  // Search, filter, sort
  useEffect(() => {
    let result = [...dineInOrders];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => {
        const tableNumber = order.table?.tableNumber || 'N/A';
        return (
          order._id?.toLowerCase().includes(term) ||
          order.user?.name?.toLowerCase().includes(term) ||
          order.user?.email?.toLowerCase().includes(term) ||
          String(tableNumber).includes(term)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.orderStatus === statusFilter);
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
          return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [dineInOrders, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Payment icon
  const getPaymentIcon = (method) => {
    const icons = {
      card: <FaCreditCard className="text-[#64748B] dark:text-dark-text" />,
      upi: <FaMobileAlt className="text-[#64748B] dark:text-dark-text" />,
      cash: <FaWallet className="text-[#64748B] dark:text-dark-text" />,
      online: <FaCreditCard className="text-[#64748B] dark:text-dark-text" />,
    };
    return icons[method?.toLowerCase()] || <FaWallet className="text-[#64748B] dark:text-dark-text" />;
  };

  // Table status color
  const getTableStatusColor = (status) => {
    const colors = {
      occupied: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      available: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      reserved: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      cleaning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  };

  // Order status badge
  const getOrderStatusBadge = (status) => {
    const styles = {
      preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      packed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      shipped: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-[#94A3B8] dark:text-dark-text" />;
    return sortConfig.direction === 'asc'
      ? <FaSortUp className="text-[#3B82F6] dark:text-[#60A5FA]" />
      : <FaSortDown className="text-[#3B82F6] dark:text-[#60A5FA]" />;
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#3B82F6] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading mb-2">Failed to Load Orders</h3>
          <p className="text-[#64748B] dark:text-dark-text text-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(getAllOrders())}
            className="px-5 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // ❌ No extra background — pure content
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-dark-border mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
            <FaUtensils className="text-[#3B82F6] dark:text-[#60A5FA]" />
            Dine In Orders
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
            {dineInOrders.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, Customer, Table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[240px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-sm outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#64748B] dark:text-dark-text text-sm font-medium hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors shadow-sm"
            >
              <FaFilter className="w-4 h-4" />
              {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <FaChevronDown className="w-3 h-3" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-card border border-[#E2E8F0] dark:border-dark-border rounded-lg shadow-lg z-10 py-1">
                {['all', 'pending', 'preparing', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors ${
                      statusFilter === status
                        ? 'text-[#3B82F6] dark:text-[#60A5FA] font-medium'
                        : 'text-[#0F172A] dark:text-dark-heading'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No orders */}
      {currentOrders.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <FaUtensils className="text-6xl text-[#94A3B8] dark:text-dark-text" />
            <h3 className="text-xl font-semibold text-[#0F172A] dark:text-dark-heading">No Dine-In Orders</h3>
            <p className="text-[#64748B] dark:text-dark-text">
              {searchTerm || statusFilter !== 'all'
                ? 'No orders match your current filters'
                : 'New dine-in orders will appear here'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="px-4 py-2 text-[#3B82F6] dark:text-[#60A5FA] hover:bg-[#3B82F6]/10 rounded-lg text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Orders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOrders.map((order) => {
              const tableNumber = order.table?.tableNumber || 'N/A';
              const tableStatus = order.table?.status || 'N/A';
              const tableSeats = order.table?.seats || 'N/A';

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MdTableRestaurant className="text-[#3B82F6] dark:text-[#60A5FA] text-lg flex-shrink-0" />
                          <h3 className="font-bold text-[#0F172A] dark:text-dark-heading truncate">
                            Table #{tableNumber}
                          </h3>
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getTableStatusColor(tableStatus)}`}>
                            {tableStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-[#64748B] dark:text-dark-text">
                            #{order._id?.slice(-8)}
                          </p>
                          {tableSeats !== 'N/A' && (
                            <span className="text-xs text-[#64748B] dark:text-dark-text">
                              • {tableSeats} seats
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Customer */}
                    <div className="flex items-center gap-2 text-sm bg-[#F8FAFC] dark:bg-dark-bg/50 p-2.5 rounded-lg">
                      <FaUser className="text-[#3B82F6] dark:text-[#60A5FA] text-sm flex-shrink-0" />
                      <span className="font-medium text-[#0F172A] dark:text-dark-heading truncate">
                        {order.user?.name || 'Guest'}
                      </span>
                      {order.user?.email && (
                        <span className="text-xs text-[#64748B] dark:text-dark-text truncate max-w-[120px]">
                          {order.user.email}
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-[#64748B] dark:text-dark-text uppercase tracking-wider">
                          Items ({order.products?.length || 0})
                        </p>
                        <span className="text-xs text-[#64748B] dark:text-dark-text flex items-center gap-1">
                          <FaClock className="text-[10px]" />
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {order.products?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            {item.coffee?.image ? (
                              <img src={item.coffee.image} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-6 h-6 bg-[#E2E8F0] dark:bg-dark-border rounded flex items-center justify-center flex-shrink-0">
                                <FaUtensils className="text-[10px] text-[#64748B] dark:text-dark-text" />
                              </div>
                            )}
                            <span className="text-[#0F172A] dark:text-dark-heading truncate flex-1">
                              {item.coffee?.name || 'Product'}
                            </span>
                            <span className="text-[#64748B] dark:text-dark-text flex-shrink-0">
                              x{item.quantity || 1}
                            </span>
                          </div>
                        ))}
                        {order.products?.length > 3 && (
                          <p className="text-xs text-[#64748B] dark:text-dark-text text-center">
                            +{order.products.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[#E2E8F0] dark:border-dark-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-[#3B82F6] dark:text-[#60A5FA] flex items-center gap-0.5">
                            <FaRupeeSign className="text-sm" />
                            {order.amount || 0}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-dark-text">
                            <span className="flex items-center gap-0.5">
                              {getPaymentIcon(order.payment?.method)}
                              {order.payment?.method || 'N/A'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#E2E8F0] dark:border-dark-border"></span>
                            <span className={order.payment?.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                              {order.payment?.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/orders/dine-in/${order._id}`)}
                            className="p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all hover:scale-105 shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
                            title="View Details"
                          >
                            <FaEye className="text-sm" />
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
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 px-4 py-3 bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm">
              <p className="text-sm text-[#64748B] dark:text-dark-text">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border text-sm font-medium hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#64748B] dark:text-dark-text"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg border border-[#E2E8F0] dark:border-dark-border text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#3B82F6] text-white border-[#3B82F6] dark:border-[#3B82F6] shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10'
                        : 'text-[#0F172A] dark:text-dark-heading hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border text-sm font-medium hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#64748B] dark:text-dark-text"
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