import React, { useState } from "react";
import { FaSearch, FaEye } from "react-icons/fa";

const Orders = () => {
    const [search, setSearch] = useState("");

    // Temporary Data
    const orders = [
        {
            id: "#ORD1001",
            customer: "Anil Yadav",
            items: 3,
            amount: "₹899",
            status: "Delivered",
            date: "29 Jun 2026",
        },
        {
            id: "#ORD1002",
            customer: "Rahul Sharma",
            items: 2,
            amount: "₹599",
            status: "Pending",
            date: "28 Jun 2026",
        },
        {
            id: "#ORD1003",
            customer: "Priya Singh",
            items: 1,
            amount: "₹349",
            status: "Cancelled",
            date: "27 Jun 2026",
        },
    ];

    const filteredOrders = orders.filter(
        (order) =>
            order.customer.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl p-3 sm:p-4 md:p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-[#0F172A] dark:text-dark-heading">
                        Orders
                    </h1>

                    <p className="text-sm text-[#64748B] dark:text-dark-text">
                        Total {orders.length} Orders
                    </p>
                </div>

                {/* Right */}
            </div>

            {/* Stats */}
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

                <div className="flex flex-wrap gap-2 md:gap-4 text-base md:text-lg text-[#64748B] dark:text-dark-text">

                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">
                        All ({orders.length})
                    </span>

                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">
                        Delivered ({orders.filter((o) => o.status === "Delivered").length})
                    </span>

                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">
                        Pending ({orders.filter((o) => o.status === "Pending").length})
                    </span>

                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">
                        Cancelled ({orders.filter((o) => o.status === "Cancelled").length})
                    </span>

                </div>

                <div className="w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text" />

                        <input
                            type="text"
                            placeholder="Search Order"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[250px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-md outline-none text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-base bg-white dark:bg-dark-bg"
                        />
                    </div>
                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-lg">

                <table className="w-full min-w-[750px]">

                    <thead>
                        <tr className="bg-[#F8FAFC] dark:bg-dark-bg/50 border-b border-[#E2E8F0] dark:border-dark-border">

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Order ID
                            </th>

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Customer
                            </th>

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Items
                            </th>

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Amount
                            </th>

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Status
                            </th>

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Date
                            </th>

                            <th className="p-4 text-left text-sm text-[#64748B] dark:text-dark-text">
                                Action
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition"
                                >
                                    <td className="p-4 font-medium text-[#0F172A] dark:text-dark-heading">
                                        {order.id}
                                    </td>

                                    <td className="p-4 text-[#0F172A] dark:text-dark-heading">
                                        {order.customer}
                                    </td>

                                    <td className="p-4 text-[#64748B] dark:text-dark-text">
                                        {order.items}
                                    </td>

                                    <td className="p-4 font-semibold text-[#4F46E5] dark:text-dark-primary">
                                        {order.amount}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-[#64748B] dark:text-dark-text">
                                        {order.date}
                                    </td>

                                    <td className="p-4">
                                        <button className="w-9 h-9 rounded-md border border-[#E2E8F0] dark:border-dark-border flex items-center justify-center hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition">
                                            <FaEye className="text-[#4F46E5] dark:text-dark-primary" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-10 text-center text-[#64748B] dark:text-dark-text"
                                >
                                    No Orders Found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>
        </div>
    );
};

export default Orders;