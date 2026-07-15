import React, { useMemo, useState } from "react";
import {
    FaSearch,
    FaMotorcycle,
    FaCheckCircle,
    FaClock,
    FaBoxOpen,
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaCoffee,
    FaEye,
    FaTimes,
    FaRupeeSign,
    FaCalendarAlt,
    FaChevronRight,
    FaTruck,
} from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
    assignRiderToOrder, getRiderOrders
} from "../../redux/Slicer/riderAssignmentSlice";

const RiderAssignedOrder = () => {


    const dispatch = useDispatch();

    const {
        assignedOrders,
        loading
    } = useSelector((state) => state.riderAssignment);

    const orders = assignedOrders || [];
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(assignRiderToOrder());
        dispatch(getRiderOrders())
    }, [dispatch]);



    // ===============================
    // Status Badge Configuration
    // ===============================
    const statusConfig = {
        assigned: {
            label: "Assigned",
            color: "bg-blue-100 text-blue-700",
            dotColor: "bg-blue-500",
            icon: <FaClock className="text-blue-500" />,
        },
        accepted: {
            label: "Accepted",
            color: "bg-yellow-100 text-yellow-700",
            dotColor: "bg-yellow-500",
            icon: <FaClock className="text-yellow-500" />,
        },
        picked_up: {
            label: "Picked Up",
            color: "bg-purple-100 text-purple-700",
            dotColor: "bg-purple-500",
            icon: <FaBoxOpen className="text-purple-500" />,
        },
        out_for_delivery: {
            label: "Out for Delivery",
            color: "bg-orange-100 text-orange-700",
            dotColor: "bg-orange-500",
            icon: <FaMotorcycle className="text-orange-500" />,
        },
        delivered: {
            label: "Delivered",
            color: "bg-green-100 text-green-700",
            dotColor: "bg-green-500",
            icon: <FaCheckCircle className="text-green-500" />,
        },
    };

    // ===============================
    // Filter Orders
    // ===============================
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const searchLower = search.toLowerCase();
            return (
                order.customerName.toLowerCase().includes(searchLower) ||
                order._id.toLowerCase().includes(searchLower) ||
                order.phone.includes(search)
            );
        });
    }, [orders, search]);

    // ===============================
    // Dashboard Counts
    // ===============================
    const counts = {
        assigned: orders.filter((o) => o.status === "assigned").length,
        accepted: orders.filter((o) => o.status === "accepted").length,
        out_for_delivery: orders.filter((o) => o.status === "out_for_delivery").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
    };

    // ===============================
    // Update Order Status
    // ===============================
    // const updateOrderStatus = (orderId, newStatus) => {
    //     setOrders((prev) =>
    //         prev.map((order) =>
    //             order._id === orderId
    //                 ? { ...order, status: newStatus }
    //                 : order
    //         )
    //     );
    // };

    // ===============================
    // Get Next Action Button
    // ===============================
    const getActionButton = (order) => {
        const actions = {
            assigned: {
                text: "Accept Order",
                status: "accepted",
                color: "bg-blue-600 hover:bg-blue-700",
            },
            accepted: {
                text: "Picked Up",
                status: "picked_up",
                color: "bg-purple-600 hover:bg-purple-700",
            },
            picked_up: {
                text: "Start Delivery",
                status: "out_for_delivery",
                color: "bg-orange-500 hover:bg-orange-600",
            },
            out_for_delivery: {
                text: "Mark Delivered",
                status: "delivered",
                color: "bg-green-600 hover:bg-green-700",
            },
        };

        const action = actions[order.status];
        if (!action) return null;

        return (
            <button
                onClick={() => updateOrderStatus(order._id, action.status)}
                className={`${action.color} text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105`}
            >
                {action.text}
            </button>
        );
    };

    // ===============================
    // Render
    // ===============================
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">

            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20">
                                <MdDeliveryDining className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Assigned Orders</h1>
                                <p className="text-gray-500 text-sm mt-1">Manage your delivery assignments</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white rounded-xl border-0 pl-12 pr-4 py-3 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* ================================= */}
                {/* Stats Cards */}
                {/* ================================= */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { key: "assigned", label: "Assigned", count: counts.assigned, color: "blue", icon: <FaBoxOpen /> },
                        { key: "accepted", label: "Accepted", count: counts.accepted, color: "yellow", icon: <FaClock /> },
                        { key: "out_for_delivery", label: "Delivering", count: counts.out_for_delivery, color: "orange", icon: <FaMotorcycle /> },
                        { key: "delivered", label: "Completed", count: counts.delivered, color: "green", icon: <FaCheckCircle /> },
                    ].map((stat) => (
                        <div
                            key={stat.key}
                            className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{stat.count}</p>
                                </div>
                                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center text-${stat.color}-600`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ================================= */}
                {/* Order Cards */}
                {/* ================================= */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaBoxOpen className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700">No Orders Found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const statusInfo = statusConfig[order.status] || statusConfig.assigned;

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-lg font-bold text-gray-800">
                                                    Order #{order._id}
                                                </h2>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                                                <FaClock className="text-xs" />
                                                Assigned {order.assignedTime}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-green-600">
                                                ₹{order.total}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="grid md:grid-cols-2 gap-6 p-6">
                                        {/* Customer Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <FaUser className="text-blue-500" />
                                                Customer Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <FaUser className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                                                        <p className="text-xs text-gray-500">Customer</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                        <FaPhone className="text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{order.phone}</p>
                                                        <p className="text-xs text-gray-500">Phone Number</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                        <FaMapMarkerAlt className="text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Delivery Address</p>
                                                        <p className="text-sm text-gray-600">{order.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <FaCoffee className="text-orange-500" />
                                                Order Items
                                            </h3>
                                            <div className="space-y-2">
                                                {order.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                                <FaCoffee className="text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold text-gray-700">
                                                            ₹{item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                                                <FaRupeeSign className="text-lg" />
                                                {order.total}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {getActionButton(order)}

                                            {order.status === "delivered" && (
                                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold">
                                                    <FaCheckCircle />
                                                    Delivered
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="bg-white border-2 border-blue-600 text-blue-600 px-5 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all hover:shadow-lg flex items-center gap-2"
                                            >
                                                <FaEye />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ================================= */}
            {/* Order Details Modal */}
            {/* ================================= */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-gray-100 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Order #{selectedOrder._id.slice(-6)}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Customer: {selectedOrder.user?.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <FaTimes className="text-gray-500 text-xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
                            {/* Products */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaCoffee className="text-orange-500" />
                                    Ordered Products
                                </h3>
                                <div className="space-y-2">
                                    {selectedOrder.products?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {item.coffee?.name}
                                                </p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-gray-700">₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    Delivery Address
                                </h3>
                                <div className="space-y-1 text-gray-600">
                                    <p className="font-semibold text-gray-800">
                                        {selectedOrder.deliveryAddress?.fullName}
                                    </p>
                                    <p>{selectedOrder.deliveryAddress?.phone}</p>
                                    <p>{selectedOrder.deliveryAddress?.addressLine1}</p>
                                    <p>
                                        {selectedOrder.deliveryAddress?.city},{" "}
                                        {selectedOrder.deliveryAddress?.state}
                                    </p>
                                    <p>{selectedOrder.deliveryAddress?.pincode}</p>
                                </div>
                            </div>

                            {/* Payment & Total */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                                            <FaRupeeSign />
                                            {selectedOrder.total}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig[selectedOrder.status]?.color}`}>
                                            {statusConfig[selectedOrder.status]?.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderAssignedOrder;