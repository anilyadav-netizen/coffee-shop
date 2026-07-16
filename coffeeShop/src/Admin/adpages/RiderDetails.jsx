import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaMotorcycle,
    FaCar,
    FaIdCard,
    FaTruck,
    FaDollarSign,
    FaShoppingBag,
    FaMapMarkerAlt,
    FaEye,
    FaEdit,
    FaBan,
    FaTrashAlt,
    FaSpinner,
    FaPercentage,
    FaPlus,
    FaToggleOn,
    FaToggleOff,
    FaStar,
    FaStarHalfAlt,
    FaRegStar
} from "react-icons/fa";
import { toast } from "react-toastify";

// Mock rider data (in real app, fetch from API)
const mockRiderData = {
    1: {
        id: 1,
        name: "Michael Rodriguez",
        email: "michael.r@example.com",
        phone: "+1 234 567 8900",
        avatar: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=6366f1&color=fff&size=120",
        vehicleType: "Motorcycle",
        vehicleNumber: "MH-12-AB-3456",
        drivingLicense: "DL-2023-0045678",
        accountStatus: "active",
        availabilityStatus: "on-delivery",
        joined: "2023-08-15",
        lastActive: "2024-03-15 14:30",
        rating: 4.8,
        deliveryStats: {
            totalAssigned: 120,
            completed: 108,
            pending: 8,
            cancelled: 4,
            successRate: 90,
            totalEarnings: 4560.50
        },
        currentAssignment: {
            orderId: "ORD-2024-0032",
            customerName: "John Smith",
            pickupLocation: "123 Main St, Downtown",
            deliveryAddress: "456 Park Ave, Uptown",
            estimatedTime: "15 min",
            liveStatus: "on-the-way"
        },
        recentDeliveries: [
            {
                id: "ORD-2024-0030",
                customer: "Emma Wilson",
                date: "2024-03-15",
                deliveryTime: "12:30 PM",
                earnings: 12.50,
                deliveryStatus: "completed"
            },
            {
                id: "ORD-2024-0029",
                customer: "David Chen",
                date: "2024-03-15",
                deliveryTime: "11:15 AM",
                earnings: 10.75,
                deliveryStatus: "completed"
            },
            {
                id: "ORD-2024-0028",
                customer: "Sarah Johnson",
                date: "2024-03-14",
                deliveryTime: "6:45 PM",
                earnings: 14.20,
                deliveryStatus: "completed"
            },
            {
                id: "ORD-2024-0027",
                customer: "James Brown",
                date: "2024-03-14",
                deliveryTime: "5:30 PM",
                earnings: 11.80,
                deliveryStatus: "pending"
            },
            {
                id: "ORD-2024-0026",
                customer: "Lisa Martinez",
                date: "2024-03-14",
                deliveryTime: "4:15 PM",
                earnings: 9.50,
                deliveryStatus: "cancelled"
            }
        ]
    },
    2: {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 234 567 8901",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff&size=120",
        vehicleType: "Bicycle",
        vehicleNumber: "N/A",
        drivingLicense: "DL-2023-0089012",
        accountStatus: "active",
        availabilityStatus: "available",
        joined: "2023-10-20",
        lastActive: "2024-03-15 09:00",
        rating: 4.9,
        deliveryStats: {
            totalAssigned: 76,
            completed: 68,
            pending: 6,
            cancelled: 2,
            successRate: 89,
            totalEarnings: 2890.25
        },
        currentAssignment: null,
        recentDeliveries: [
            {
                id: "ORD-2024-0025",
                customer: "Robert Taylor",
                date: "2024-03-15",
                deliveryTime: "8:30 AM",
                earnings: 8.50,
                deliveryStatus: "completed"
            },
            {
                id: "ORD-2024-0024",
                customer: "Emily Davis",
                date: "2024-03-14",
                deliveryTime: "7:15 PM",
                earnings: 10.20,
                deliveryStatus: "completed"
            }
        ]
    }
};

// Stat Card Component
const StatCard = ({ icon, label, value, color, subtitle }) => {
    return (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-dark-heading">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status, type }) => {
    const styles = {
        active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        blocked: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
        suspended: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        available: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        "on-delivery": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        offline: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
        "on-the-way": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    };

    let displayText = status;
    if (status === "on-delivery") displayText = "On Delivery";
    else if (status === "on-the-way") displayText = "On The Way";
    else displayText = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
            {displayText}
        </span>
    );
};

// Rating Stars Component
const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
            ))}
            {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
            {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
            ))}
            <span className="text-sm font-medium text-gray-700 dark:text-dark-text ml-1">
                {rating.toFixed(1)}
            </span>
        </div>
    );
};

// Main RiderDetails Component
const RiderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rider, setRider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [availability, setAvailability] = useState(true);

    // Fetch rider data
    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            const riderData = mockRiderData[id];
            if (riderData) {
                setRider(riderData);
                setAvailability(riderData.availabilityStatus !== "offline");
            } else {
                toast.error("Rider not found");
                navigate("/admin/riders");
            }
            setLoading(false);
        }, 500);
    }, [id, navigate]);

    const handleBlockToggle = () => {
        const newStatus = rider.accountStatus === "active" ? "blocked" : "active";
        setRider({ ...rider, accountStatus: newStatus });
        toast.success(`${rider.name} ${newStatus === "active" ? "unblocked" : "blocked"}`);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        toast.success(`${rider.name} deleted successfully`);
        setShowDeleteModal(false);
        navigate("/admin/riders");
    };

    const handleAvailabilityToggle = () => {
        const newStatus = availability ? "offline" : "available";
        setAvailability(!availability);
        setRider({ ...rider, availabilityStatus: newStatus });
        toast.success(`${rider.name} is now ${newStatus === "available" ? "available" : "offline"}`);
    };

    const handleAssignOrder = () => {
        toast.info("Assign order functionality coming soon!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-dark-bg">
                <FaSpinner className="animate-spin text-indigo-600 dark:text-indigo-400 text-5xl" />
            </div>
        );
    }

    if (!rider) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-dark-bg">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-dark-text">Rider not found</p>
                    <Link to="/admin/riders" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
                        Back to Riders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-dark-bg min-h-screen">
            {/* Header with Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/riders"
                        className="p-2 bg-white dark:bg-dark-card rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition border border-gray-200 dark:border-dark-border"
                    >
                        <FaArrowLeft className="text-gray-600 dark:text-dark-text" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-heading flex items-center gap-3">
                            <FaMotorcycle className="text-indigo-600 dark:text-indigo-400" />
                            Rider Details
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-dark-text mt-1">
                            View and manage rider information
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={rider.accountStatus} type="account" />
                    <StatusBadge status={rider.availabilityStatus} type="availability" />
                    <RatingStars rating={rider.rating} />
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <img
                        src={rider.avatar}
                        alt={rider.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-dark-border"
                    />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Full Name</p>
                            <p className="text-lg font-semibold text-gray-800 dark:text-dark-heading">{rider.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Email</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                <FaEnvelope className="text-gray-400 text-xs" />
                                {rider.email}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Phone</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                <FaPhone className="text-gray-400 text-xs" />
                                {rider.phone}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Vehicle Type</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                {rider.vehicleType === "Motorcycle" ? <FaMotorcycle className="text-gray-400" /> : <FaCar className="text-gray-400" />}
                                {rider.vehicleType}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Vehicle Number</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading">{rider.vehicleNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Driving License</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                <FaIdCard className="text-gray-400 text-xs" />
                                {rider.drivingLicense}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Joined</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-400 text-xs" />
                                {rider.joined}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Last Active</p>
                            <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                <FaClock className="text-gray-400 text-xs" />
                                {rider.lastActive}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Summary */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4 flex items-center gap-2">
                    <FaTruck className="text-indigo-600 dark:text-indigo-400" />
                    Delivery Summary
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard
                        icon={<FaShoppingBag className="text-indigo-600 dark:text-indigo-400" />}
                        label="Total Assigned"
                        value={rider.deliveryStats.totalAssigned}
                        color="bg-indigo-100 dark:bg-indigo-900/30"
                    />
                    <StatCard
                        icon={<FaCheckCircle className="text-emerald-600 dark:text-emerald-400" />}
                        label="Completed"
                        value={rider.deliveryStats.completed}
                        color="bg-emerald-100 dark:bg-emerald-900/30"
                    />
                    <StatCard
                        icon={<FaClock className="text-amber-600 dark:text-amber-400" />}
                        label="Pending"
                        value={rider.deliveryStats.pending}
                        color="bg-amber-100 dark:bg-amber-900/30"
                    />
                    <StatCard
                        icon={<FaTimesCircle className="text-rose-600 dark:text-rose-400" />}
                        label="Cancelled"
                        value={rider.deliveryStats.cancelled}
                        color="bg-rose-100 dark:bg-rose-900/30"
                    />
                    <StatCard
                        icon={<FaPercentage className="text-blue-600 dark:text-blue-400" />}
                        label="Success Rate"
                        value={`${rider.deliveryStats.successRate}%`}
                        color="bg-blue-100 dark:bg-blue-900/30"
                    />
                    <StatCard
                        icon={<FaDollarSign className="text-emerald-600 dark:text-emerald-400" />}
                        label="Total Earnings"
                        value={`$${rider.deliveryStats.totalEarnings.toFixed(2)}`}
                        color="bg-emerald-100 dark:bg-emerald-900/30"
                    />
                </div>
            </div>

            {/* Current Assignment */}
            {rider.currentAssignment && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4 flex items-center gap-2">
                        <FaTruck className="text-indigo-600 dark:text-indigo-400" />
                        Current Assignment
                    </h2>
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Order ID</p>
                                <p className="text-gray-800 dark:text-dark-heading font-medium">{rider.currentAssignment.orderId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Customer</p>
                                <p className="text-gray-800 dark:text-dark-heading">{rider.currentAssignment.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Estimated Delivery</p>
                                <p className="text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                    <FaClock className="text-amber-500 text-xs" />
                                    {rider.currentAssignment.estimatedTime}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Pickup Location</p>
                                <p className="text-gray-800 dark:text-dark-heading flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-500 text-xs" />
                                    {rider.currentAssignment.pickupLocation}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Delivery Status</p>
                                <StatusBadge status={rider.currentAssignment.liveStatus} />
                            </div>
                            <div className="sm:col-span-2 lg:col-span-1">
                                <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Delivery Address</p>
                                <p className="text-gray-800 dark:text-dark-heading text-sm">
                                    {rider.currentAssignment.deliveryAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Deliveries Table */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4">Recent Deliveries</h2>
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Order ID</th>
                                    <th className="px-4 py-3 text-left">Customer</th>
                                    <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">Delivery Time</th>
                                    <th className="px-4 py-3 text-left">Earnings</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                {rider.recentDeliveries.map((delivery) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-dark-heading">{delivery.id}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text">{delivery.customer}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden sm:table-cell">{delivery.date}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden md:table-cell">{delivery.deliveryTime}</td>
                                        <td className="px-4 py-3 text-gray-800 dark:text-dark-heading font-medium">${delivery.earnings.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={delivery.deliveryStatus} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link
                                                to={`/admin/orders/${delivery.id}`}
                                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                                            >
                                                <FaEye className="text-sm" />
                                                <span className="hidden sm:inline">View</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Account Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4">Account Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to={`/admin/update-rider/${rider.id}`}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
                    >
                        <FaEdit />
                        Edit Rider
                    </Link>
                    <button
                        onClick={handleBlockToggle}
                        className={`px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-sm ${rider.accountStatus === "active"
                                ? "bg-rose-600 hover:bg-rose-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                    >
                        <FaBan />
                        {rider.accountStatus === "active" ? "Block Rider" : "Unblock Rider"}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
                    >
                        <FaTrashAlt />
                        Delete Rider
                    </button>
                    <button
                        onClick={handleAssignOrder}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
                    >
                        <FaPlus />
                        Assign Order
                    </button>
                    <button
                        onClick={handleAvailabilityToggle}
                        className={`px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-sm ${availability
                                ? "bg-gray-600 hover:bg-gray-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                    >
                        {availability ? <FaToggleOff /> : <FaToggleOn />}
                        {availability ? "Mark Offline" : "Mark Available"}
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-heading">Confirm Delete</h3>
                        <p className="text-gray-600 dark:text-dark-text mt-2">
                            Are you sure you want to delete <span className="font-medium">{rider?.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
7
export default RiderDetails;