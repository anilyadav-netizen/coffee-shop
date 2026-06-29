import React from "react";
import {
  FaEye,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const mockOrders = [
  {
    id: "#ORD1001",
    customer: "Anil Yadav",
    date: "29 Jun 2026",
    items: 3,
    amount: 850,
    paymentStatus: "Paid",
    orderStatus: "Preparing",
  },
  {
    id: "#ORD1002",
    customer: "Rahul Sharma",
    date: "29 Jun 2026",
    items: 2,
    amount: 560,
    paymentStatus: "Pending",
    orderStatus: "Packed",
  },
  {
    id: "#ORD1003",
    customer: "Amit Singh",
    date: "28 Jun 2026",
    items: 5,
    amount: 1450,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
  },
  {
    id: "#ORD1004",
    customer: "Priya Verma",
    date: "27 Jun 2026",
    items: 1,
    amount: 220,
    paymentStatus: "Failed",
    orderStatus: "Cancelled",
  },
];

const paymentBadge = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const orderBadge = {
  Preparing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Packed:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Shipped:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Delivered:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const Orders = () => {
  const loading = false;
  const orders = mockOrders;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Orders
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage customer orders
        </p>
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-16 text-center shadow-sm">
          <FaClipboardList className="mx-auto text-6xl text-gray-400 mb-5" />

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Customer orders will appear here.
          </p>
        </div>
      )}

      {/* Desktop Table */}
      {!loading && orders.length > 0 && (
        <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto max-h-[650px]">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                <tr className="text-left">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-semibold">{order.id}</td>

                    <td className="px-6 py-4">{order.customer}</td>

                    <td className="px-6 py-4">{order.date}</td>

                    <td className="px-6 py-4">{order.items}</td>

                    <td className="px-6 py-4 font-semibold">
                      ₹{order.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge[order.paymentStatus]}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${orderBadge[order.orderStatus]}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition">
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && (
        <div className="grid gap-5 lg:hidden">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{order.id}</h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge[order.paymentStatus]}`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Customer:</strong> {order.customer}
                </p>

                <p>
                  <strong>Date:</strong> {order.date}
                </p>

                <p>
                  <strong>Items:</strong> {order.items}
                </p>

                <p>
                  <strong>Total:</strong> ₹{order.amount}
                </p>
              </div>

              <div className="flex justify-between items-center mt-5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${orderBadge[order.orderStatus]}`}
                >
                  {order.orderStatus}
                </span>

                <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg">
                  <FaEye />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;