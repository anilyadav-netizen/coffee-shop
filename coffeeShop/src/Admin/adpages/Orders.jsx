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

  // Badge styles
  const paymentBadge = {
    paid: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400",
    failed: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  };

  const orderBadge = {
    preparing: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    packed: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    shipped: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    delivered: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400",
    cancelled: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  };

  const orderTypeBadge = {
    dine_in: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    takeaway: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    delivery: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
  };

  // Safely map backend data to frontend expected structure
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

  // Filter orders
  const filteredOrders = mappedOrders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    "All",
    ...new Set(mappedOrders.map((o) => o.orderStatus).filter(Boolean)),
  ];

  // Navigate to order details
  const handleViewOrder = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#4F46E5] dark:border-dark-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-4 md:p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-3xl font-semibold text-[#0F172A] dark:text-dark-heading">
            Orders
          </h1>
          <p className="text-base text-[#64748B] dark:text-dark-text">
            Total {mappedOrders.length} orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 md:gap-4 text-base md:text-lg text-[#64748B] dark:text-dark-text">
          {statusOptions.map((status) => (
            <span
              key={status}
              className={`px-3 py-1 rounded-full border cursor-pointer transition-colors whitespace-nowrap ${filterStatus === status
                ? "bg-[#4F46E5] dark:bg-dark-primary text-white border-[#4F46E5] dark:border-dark-primary"
                : "bg-[#F8FAFC] dark:bg-dark-bg/50 border-[#E2E8F0] dark:border-dark-border hover:bg-[#E2E8F0] dark:hover:bg-dark-bg"
                }`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {status === "All"
                ? mappedOrders.length
                : mappedOrders.filter((o) => o.orderStatus === status).length}
              )
            </span>
          ))}
        </div>

        <div className="w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text" />
            <input
              type="text"
              placeholder="Search by ID or Customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-[200px] md:w-[280px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-md outline-none text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-base bg-white dark:bg-dark-bg"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="rounded-xl border border-[#E2E8F0] dark:border-dark-border p-16 text-center">
          <FaClipboardList className="mx-auto text-6xl text-[#64748B] dark:text-dark-text mb-5" />
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">
            No Orders Found
          </h2>
          <p className="mt-2 text-[#64748B] dark:text-dark-text">
            {search || filterStatus !== "All"
              ? "No orders match your search criteria"
              : "Customer orders will appear here"}
          </p>
        </div>
      )}

      {/* Table View - Both Desktop & Mobile with Horizontal Scroll */}
      {filteredOrders.length > 0 && (
        <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-lg">
          <table className="w-full min-w-[800px] md:min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Order ID
                </th>
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Customer
                </th>
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Items
                </th>
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Type
                </th>
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Amount
                </th>
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Payment
                </th>
                <th className="p-3 md:p-4 text-left text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Status
                </th>
                <th className="p-3 md:p-4 text-center text-base md:text-xl text-[#64748B] dark:text-dark-text whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                // Get first product image
                const firstProduct = order.orderItems?.[0]?.coffee || order.orderItems?.[0]?.product;
                const productImage = firstProduct?.image || "";
                const productName = firstProduct?.name || "Product";

                return (
                  <tr
                    key={order._id}
                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                  >
                    <td className="p-2 md:p-4 font-medium text-[#0F172A] dark:text-dark-heading text-base md:text-lg whitespace-nowrap">
                      {order._id.slice(-6)}
                    </td>

                    <td className="p-2 md:p-4 text-[#0F172A] dark:text-dark-heading text-base md:text-lg whitespace-nowrap">
                      {order.customerName}
                    </td>

                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2">
                        {productImage && (
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-md object-cover"
                          />
                        )}
                        <span className="text-base md:text-lg text-[#64748B] dark:text-dark-text whitespace-nowrap">
                          {order.orderItems?.length || 0} items
                        </span>
                      </div>
                    </td>

                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-base font-semibold whitespace-nowrap ${orderTypeBadge[order.orderType] ||
                          "bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400"
                          }`}
                      >
                        {order.orderType === "dine_in" ? "Dine-in" :
                          order.orderType === "takeaway" ? "Takeaway" :
                            order.orderType === "delivery" ? "Delivery" : order.orderType}
                      </span>
                    </td>

                    <td className="p-2 md:p-4 font-semibold text-[#0F172A] dark:text-dark-heading text-base md:text-lg whitespace-nowrap">
                      ₹{order.totalPrice}
                    </td>

                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-base font-semibold whitespace-nowrap ${paymentBadge[order.paymentStatus] ||
                          "bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400"
                          }`}
                      >
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || "N/A"}
                      </span>
                    </td>

                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-base font-semibold whitespace-nowrap ${orderBadge[order.orderStatus] ||
                          "bg-gray-50 dark:bg-gray-950/30 text-gray-600 dark:text-gray-400"
                          }`}
                      >
                        {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || "N/A"}
                      </span>
                    </td>

                    <td className="p-2 md:p-4 text-center">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-lg bg-[#4F46E5] dark:bg-dark-primary hover:bg-[#4338CA] dark:hover:bg-[#6366F1] text-white transition-colors duration-200 text-sm md:text-basec"
                      >
                        <FaEye className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">View</span>
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