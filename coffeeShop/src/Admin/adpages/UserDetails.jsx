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
  FaShoppingBag,
  FaHourglassHalf,
  FaUtensils,
  FaTruck,
  FaExclamationCircle,
  FaDollarSign,
  FaMapMarkerAlt,
  FaEye,
  FaEdit,
  FaBan,
  FaTrashAlt,
  FaSpinner
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllUsers } from "../../redux/Slicer/userSlice";

// Mock user data (in real app, fetch from API)


// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-gray-800 dark:text-dark-heading">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Order Status Badge
const OrderStatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment Status Badge
const PaymentStatusBadge = ({ status }) => {
  const styles = {
    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    failed: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Main UserDetails Component
const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch user data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const userData = mockUserData[id];
      if (userData) {
        setUser(userData);
      } else {
        toast.error("User not found");
        navigate("/admin/users");
      }
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleBlockToggle = () => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    setUser({ ...user, status: newStatus });
    toast.success(`${user.name} ${newStatus === "active" ? "unblocked" : "blocked"}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    toast.success(`${user.name} deleted successfully`);
    setShowDeleteModal(false);
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-dark-bg">
        <FaSpinner className="animate-spin text-indigo-600 dark:text-indigo-400 text-5xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-dark-bg">
        <div className="text-center">
          <p className="text-gray-500 dark:text-dark-text">User not found</p>
          <Link to="/admin/users" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to Users
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
            to="/admin/users" 
            className="p-2 bg-white dark:bg-dark-card rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition border border-gray-200 dark:border-dark-border"
          >
            <FaArrowLeft className="text-gray-600 dark:text-dark-text" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-heading flex items-center gap-3">
              <FaUser className="text-indigo-600 dark:text-indigo-400" />
              User Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-dark-text mt-1">
              View and manage user information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            user.status === "active" 
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
              : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
          }`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            user.emailVerified 
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          }`}>
            {user.emailVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-dark-border"
          />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Full Name</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-dark-heading">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Email</p>
              <p className="text-lg text-gray-800 dark:text-dark-heading flex items-center gap-2">
                {user.email}
                {user.emailVerified ? 
                  <FaCheckCircle className="text-emerald-500 text-sm" /> : 
                  <FaTimesCircle className="text-amber-500 text-sm" />
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Phone</p>
              <p className="text-lg text-gray-800 dark:text-dark-heading">{user.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Joined</p>
              <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                {user.joined}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Last Login</p>
              <p className="text-sm text-gray-800 dark:text-dark-heading flex items-center gap-2">
                <FaClock className="text-gray-400" />
                {user.lastLogin}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4 flex items-center gap-2">
          <FaShoppingBag className="text-indigo-600 dark:text-indigo-400" />
          Order Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard 
            icon={<FaShoppingBag className="text-indigo-600 dark:text-indigo-400" />}
            label="Total Orders"
            value={user.orderStats.total}
            color="bg-indigo-100 dark:bg-indigo-900/30"
          />
          <StatCard 
            icon={<FaHourglassHalf className="text-amber-600 dark:text-amber-400" />}
            label="Pending"
            value={user.orderStats.pending}
            color="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatCard 
            icon={<FaUtensils className="text-blue-600 dark:text-blue-400" />}
            label="Preparing"
            value={user.orderStats.preparing}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard 
            icon={<FaTruck className="text-emerald-600 dark:text-emerald-400" />}
            label="Delivered"
            value={user.orderStats.delivered}
            color="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatCard 
            icon={<FaExclamationCircle className="text-rose-600 dark:text-rose-400" />}
            label="Cancelled"
            value={user.orderStats.cancelled}
            color="bg-rose-100 dark:bg-rose-900/30"
          />
          <StatCard 
            icon={<FaDollarSign className="text-emerald-600 dark:text-emerald-400" />}
            label="Total Spending"
            value={`$${user.orderStats.totalSpending.toFixed(2)}`}
            color="bg-emerald-100 dark:bg-emerald-900/30"
          />
        </div>
      </div>

      {/* Address Card */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400" />
          Default Address
        </h2>
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Address</p>
              <p className="text-gray-800 dark:text-dark-heading">{user.address.line1}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">City</p>
              <p className="text-gray-800 dark:text-dark-heading">{user.address.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">State</p>
              <p className="text-gray-800 dark:text-dark-heading">{user.address.state}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-dark-text font-medium uppercase tracking-wider">Pincode</p>
              <p className="text-gray-800 dark:text-dark-heading">{user.address.pincode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-heading mb-4">Recent Orders</h2>
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {user.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-dark-heading">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text">{order.date}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-dark-heading font-medium">${order.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link 
                        to={`/admin/orders/${order.id}`} 
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
            to={`/admin/update-user/${user.id}`}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
          >
            <FaEdit />
            Edit User
          </Link>
          <button 
            onClick={handleBlockToggle}
            className={`px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-sm ${
              user.status === "active" 
                ? "bg-rose-600 hover:bg-rose-700 text-white" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <FaBan />
            {user.status === "active" ? "Block User" : "Unblock User"}
          </button>
          <button 
            onClick={handleDelete}
            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
          >
            <FaTrashAlt />
            Delete User
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-heading">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-dark-text mt-2">
              Are you sure you want to delete <span className="font-medium">{user?.name}</span>? This action cannot be undone.
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

export default UserDetails;