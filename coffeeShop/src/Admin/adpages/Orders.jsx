import React, { useEffect, useState } from "react";
import { FaEye, FaSearch, FaClipboardList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../redux/Slicer/adminOrder";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.adminOrder);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Badge styles – using blue primary and consistent colors
  const paymentBadge = {
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const orderBadge = {
    preparing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    packed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    shipped: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const orderTypeBadge = {
    dine_in: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    takeaway: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    delivery: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  // Map orders safely
  const mappedOrders = orders?.map((order) => ({
    _id: order._id || "",
    customerName: order.deliveryAddress?.fullName || order.user?.name || "Guest",
    orderItems: order.products || [],
    orderType: order.orderType || "dine_in",
    totalPrice: order.amount || 0,
    paymentStatus: order.paymentStatus || order.payment?.status || "pending",
    orderStatus: order.orderStatus || "pending",
    createdAt: order.createdAt || "",
    deliveryAddress: order.deliveryAddress || null,
  })) || [];

  // Filter logic
  const filteredOrders = mappedOrders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Unique statuses for filter tabs
  const statusOptions = [
    "All",
    ...new Set(mappedOrders.map((o) => o.orderStatus).filter(Boolean)),
  ];

  const handleViewOrder = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#3B82F6] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // ❌ No extra background – pure content
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-dark-border mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
            Orders
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
            {mappedOrders.length}
          </span>
        </div>

        <div className="relative w-full md:w-auto">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[220px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-sm outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              filterStatus === status
                ? "bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
                : "bg-white dark:bg-dark-card text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 border border-[#E2E8F0] dark:border-dark-border"
            }`}
          >
            {status === "All" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">
              ({status === "All" ? mappedOrders.length : mappedOrders.filter(o => o.orderStatus === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <FaClipboardList className="text-6xl text-[#94A3B8] dark:text-dark-text" />
            <h3 className="text-xl font-semibold text-[#0F172A] dark:text-dark-heading">No Orders Found</h3>
            <p className="text-[#64748B] dark:text-dark-text">
              {search || filterStatus !== "All"
                ? "No orders match your current filters"
                : "Customer orders will appear here"}
            </p>
            {(search || filterStatus !== "All") && (
              <button
                onClick={() => { setSearch(""); setFilterStatus("All"); }}
                className="px-4 py-2 text-[#3B82F6] dark:text-[#60A5FA] hover:bg-[#3B82F6]/10 rounded-lg text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-xl bg-white dark:bg-dark-card shadow-sm">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Order ID</th>
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Customer</th>
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Items</th>
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Type</th>
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Amount</th>
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Payment</th>
                <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Status</th>
                <th className="p-4 text-center text-sm font-medium text-[#64748B] dark:text-dark-text">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const firstProduct = order.orderItems?.[0]?.coffee || order.orderItems?.[0]?.product;
                const productImage = firstProduct?.image || "";
                const productName = firstProduct?.name || "Product";

                return (
                  <tr
                    key={order._id}
                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                  >
                    <td className="p-4 font-medium text-[#0F172A] dark:text-dark-heading whitespace-nowrap">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="p-4 text-[#0F172A] dark:text-dark-heading whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {productImage && (
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-8 h-8 rounded object-cover border border-[#E2E8F0] dark:border-dark-border"
                          />
                        )}
                        <span className="text-[#64748B] dark:text-dark-text">
                          {order.orderItems?.length || 0} items
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          orderTypeBadge[order.orderType] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {order.orderType === "dine_in" ? "Dine-in" :
                         order.orderType === "takeaway" ? "Takeaway" :
                         order.orderType === "delivery" ? "Delivery" : order.orderType}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#0F172A] dark:text-dark-heading whitespace-nowrap">
                      ₹{order.totalPrice}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          paymentBadge[order.paymentStatus] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          orderBadge[order.orderStatus] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="p-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all hover:scale-105 shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;