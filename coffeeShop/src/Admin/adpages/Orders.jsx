import React, { useEffect, useState } from "react";
import { FaEye, FaSearch, FaClipboardList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
// import { getOrders } from "../../redux/Slicer/adminOrderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  // const { orders, loading, totalOrders } = useSelector(
  //   (state) => state.adminOrders
  // );
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Mock data - backend se aayega
  const mockOrders = [
    {
      _id: "ORD1001",
      user: { name: "Anil Yadav" },
      orderItems: [
        { 
          product: { 
            name: "Margherita Pizza", 
            image: "https://via.placeholder.com/50" 
          },
          quantity: 2
        }
      ],
      totalPrice: 850,
      paymentStatus: "Paid",
      orderStatus: "Preparing",
      orderType: "Delivery",
      createdAt: "29 Jun 2026"
    },
    {
      _id: "ORD1002",
      user: { name: "Rahul Sharma" },
      orderItems: [
        { 
          product: { 
            name: "Burger", 
            image: "https://via.placeholder.com/50" 
          },
          quantity: 1
        }
      ],
      totalPrice: 560,
      paymentStatus: "Pending",
      orderStatus: "Packed",
      orderType: "Takeaway",
      createdAt: "29 Jun 2026"
    },
    {
      _id: "ORD1003",
      user: { name: "Amit Singh" },
      orderItems: [
        { 
          product: { 
            name: "Pasta", 
            image: "https://via.placeholder.com/50" 
          },
          quantity: 3
        }
      ],
      totalPrice: 1450,
      paymentStatus: "Paid",
      orderStatus: "Shipped",
      orderType: "Dine-in",
      createdAt: "28 Jun 2026"
    }
  ];

  // Real data ke liye
  // useEffect(() => {
  //   dispatch(getOrders());
  // }, [dispatch]);

  const orders = mockOrders; // Real: orders from redux
  const loading = false; // Real: loading from redux
  const totalOrders = orders.length;

  // Badge styles
  const paymentBadge = {
    Paid: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    Pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400",
    Failed: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  };

  const orderBadge = {
    Preparing: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    Packed: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    Shipped: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    Delivered: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    Cancelled: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  };

  const orderTypeBadge = {
    "Dine-in": "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    "Takeaway": "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    "Delivery": "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["All", ...new Set(orders.map(o => o.orderStatus))];

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
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] dark:text-dark-heading">
            Orders
          </h1>
          <p className="text-base text-[#64748B] dark:text-dark-text">
            Total {totalOrders} orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 md:gap-4 text-base md:text-lg text-[#64748B] dark:text-dark-text">
          {statusOptions.map((status) => (
            <span 
              key={status}
              className={`px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                filterStatus === status 
                  ? "bg-[#4F46E5] dark:bg-dark-primary text-white border-[#4F46E5] dark:border-dark-primary" 
                  : "bg-[#F8FAFC] dark:bg-dark-bg/50 border-[#E2E8F0] dark:border-dark-border hover:bg-[#E2E8F0] dark:hover:bg-dark-bg"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({status === "All" ? orders.length : orders.filter(o => o.orderStatus === status).length})
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

      {/* Desktop Table */}
      {filteredOrders.length > 0 && (
        <div className="hidden lg:block overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-lg">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Order ID</th>
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Customer</th>
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Items</th>
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Type</th>
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Amount</th>
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Payment</th>
                <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Status</th>
                <th className="p-3 md:p-4 text-center text-sm md:text-lg text-[#64748B] dark:text-dark-text">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                >
                  <td className="p-2 md:p-4 font-medium text-[#0F172A] dark:text-dark-heading text-sm">
                    {order._id}
                  </td>

                  <td className="p-2 md:p-4 text-[#0F172A] dark:text-dark-heading">
                    {order.user.name}
                  </td>

                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={order.orderItems[0]?.product?.image} 
                        alt={order.orderItems[0]?.product?.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <span className="text-sm text-[#64748B] dark:text-dark-text">
                        {order.orderItems.length} items
                      </span>
                    </div>
                  </td>

                  <td className="p-2 md:p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${orderTypeBadge[order.orderType]}`}>
                      {order.orderType}
                    </span>
                  </td>

                  <td className="p-2 md:p-4 font-semibold text-[#0F172A] dark:text-dark-heading">
                    ₹{order.totalPrice}
                  </td>

                  <td className="p-2 md:p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-2 md:p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${orderBadge[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="p-2 md:p-4 text-center">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4F46E5] dark:bg-dark-primary hover:bg-[#4338CA] dark:hover:bg-[#6366F1] text-white transition-colors duration-200 text-sm">
                      <FaEye />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {filteredOrders.length > 0 && (
        <div className="grid gap-4 lg:hidden">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-[#0F172A] dark:text-dark-heading text-sm">
                    {order._id}
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-dark-text">
                    {order.user.name}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge[order.paymentStatus]}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={order.orderItems[0]?.product?.image} 
                  alt={order.orderItems[0]?.product?.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${orderTypeBadge[order.orderType]}`}>
                    {order.orderType}
                  </span>
                  <p className="text-sm text-[#64748B] dark:text-dark-text mt-1">
                    {order.orderItems.length} items • ₹{order.totalPrice}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0] dark:border-dark-border">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${orderBadge[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
                <button className="flex items-center gap-2 bg-[#4F46E5] dark:bg-dark-primary hover:bg-[#4338CA] dark:hover:bg-[#6366F1] text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                  <FaEye />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;