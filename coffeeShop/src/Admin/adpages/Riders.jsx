import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaTruck,
  FaUserSlash,
  FaSearch,
  FaEye,
  FaTrashAlt,
  FaMotorcycle,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaStar,
  FaTrophy,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../redux/Slicer/userSlice";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "on-delivery": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    offline: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.offline}`}>
      {status === "on-delivery" ? "On Delivery" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Account Status Badge
const AccountStatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    blocked: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Main Riders Component
const Riders = () => {
  const dispatch = useDispatch();
  const { usersList, loading: reduxLoading } = useSelector(
    (state) => state.getUser
  );

  // Extract users array and filter only riders (role === "rider")
  const allUsers = usersList?.users || [];
  const riders = allUsers.filter(user => user.role === "rider");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch users on mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Statistics
  const totalRiders = riders.length;
  const activeRiders = riders.filter(r => r.isAvailable === true).length;
  const onDelivery = riders.filter(r => r.currentStatus === "on-delivery").length;
  const offlineRiders = riders.filter(r => r.currentStatus === "offline" || r.isAvailable === false).length;

  // Search logic
  const filteredRiders = riders.filter((rider) =>
    rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider._id?.includes(searchTerm)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRiders = filteredRiders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handlers
  const handleView = (rider) => {
    setSelectedRider(rider);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    const rider = riders.find(r => r._id === id);
    setSelectedRider(rider);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedRider) {
      try {
        await dispatch(deleteUser(selectedRider._id)).unwrap();
        toast.success(`${selectedRider.name} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedRider(null);
        dispatch(getAllUsers());
      } catch (error) {
        toast.error(error?.message || "Failed to delete rider");
      }
    }
  };

  // Loading state
  if (reduxLoading) {
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
            <FaMotorcycle className="text-[#3B82F6] dark:text-[#60A5FA]" />
            Riders
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
            {totalRiders}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text w-4 h-4" />
            <input
              type="text"
              placeholder="Search riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[220px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-sm outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Add Button */}
          <Link
            to="/admin/riders/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 text-sm font-medium shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4" />
            Create Rider
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="p-3 rounded-lg bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20">
            <FaUsers className="text-[#3B82F6] dark:text-[#60A5FA] text-xl" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] dark:text-dark-text font-medium">Total Riders</p>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{totalRiders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <FaUserCheck className="text-emerald-600 dark:text-emerald-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] dark:text-dark-text font-medium">Active Riders</p>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{activeRiders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <FaTruck className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] dark:text-dark-text font-medium">On Delivery</p>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{onDelivery}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
            <FaUserSlash className="text-red-600 dark:text-red-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] dark:text-dark-text font-medium">Offline</p>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{offlineRiders}</p>
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-xl bg-white dark:bg-dark-card shadow-sm">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
              <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">#</th>
              <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Name</th>
              <th className="hidden md:table-cell p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Email</th>
              <th className="hidden lg:table-cell p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Phone</th>
              <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Status</th>
              <th className="p-4 text-center text-sm font-medium text-[#64748B] dark:text-dark-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-dark-border">
            {currentRiders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-[#64748B] dark:text-dark-text">
                  <div className="flex flex-col items-center gap-2">
                    <FaMotorcycle className="text-4xl text-[#94A3B8] dark:text-dark-text" />
                    <p>{searchTerm ? "No riders match your search" : "No riders found"}</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentRiders.map((rider, index) => (
                <tr key={rider._id} className="hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150">
                  <td className="p-4 text-[#64748B] dark:text-dark-text">{indexOfFirstItem + index + 1}</td>
                  <td className="p-4 font-medium text-[#0F172A] dark:text-dark-heading">{rider.name || "N/A"}</td>
                  <td className="hidden md:table-cell p-4 text-[#64748B] dark:text-dark-text">{rider.email || "N/A"}</td>
                  <td className="hidden lg:table-cell p-4 text-[#64748B] dark:text-dark-text">{rider.phone || "N/A"}</td>
                  <td className="p-4">
                    <StatusBadge status={rider.currentStatus || "offline"} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(rider)}
                        className="p-2 text-[#3B82F6] dark:text-[#60A5FA] hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 rounded-lg transition group"
                        title="View"
                      >
                        <FaEye className="group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDelete(rider._id)}
                        className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition group"
                        title="Delete"
                      >
                        <FaTrashAlt className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 px-4 py-3 bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm">
          <p className="text-sm text-[#64748B] dark:text-dark-text">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRiders.length)} of {filteredRiders.length} riders
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
                    ? "bg-[#3B82F6] text-white border-[#3B82F6] dark:border-[#3B82F6] shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
                    : "text-[#0F172A] dark:text-dark-heading hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50"
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

      {/* View Rider Modal */}
      {showViewModal && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E2E8F0] dark:border-dark-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] dark:text-[#60A5FA] text-xl font-bold">
                  {selectedRider.name?.charAt(0).toUpperCase() || "R"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-dark-heading">{selectedRider.name || "N/A"}</h3>
                  <p className="text-sm text-[#64748B] dark:text-dark-text">Rider Details</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRider(null);
                }}
                className="p-2 hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 rounded-lg transition text-[#64748B] dark:text-dark-text"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                    <FaIdCard className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span>User ID</span>
                  </div>
                  <p className="text-[#0F172A] dark:text-dark-heading font-mono text-sm">{selectedRider._id || "N/A"}</p>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                    <FaEnvelope className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span>Email</span>
                  </div>
                  <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.email || "N/A"}</p>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                    <FaPhone className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span>Phone</span>
                  </div>
                  <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.phone || "N/A"}</p>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                    <FaCalendarAlt className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span>Joined Date</span>
                  </div>
                  <p className="text-[#0F172A] dark:text-dark-heading">
                    {selectedRider.createdAt ? new Date(selectedRider.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Status & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-2">
                    <FaMotorcycle className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span>Current Status</span>
                  </div>
                  <StatusBadge status={selectedRider.currentStatus || "offline"} />
                </div>

                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-2">
                    <FaUserCheck className="text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span>Account Status</span>
                  </div>
                  <AccountStatusBadge status={selectedRider.isAvailable ? "active" : "suspended"} />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRider.vehicle && (
                  <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                      <FaTruck className="text-[#3B82F6] dark:text-[#60A5FA]" />
                      <span>Vehicle</span>
                    </div>
                    <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.vehicle}</p>
                  </div>
                )}

                {selectedRider.rating && (
                  <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                      <FaStar className="text-yellow-500" />
                      <span>Rating</span>
                    </div>
                    <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.rating} / 5.0</p>
                  </div>
                )}

                {selectedRider.completedDeliveries !== undefined && (
                  <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                      <FaTrophy className="text-yellow-500" />
                      <span>Completed Deliveries</span>
                    </div>
                    <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.completedDeliveries || 0}</p>
                  </div>
                )}

                {selectedRider.assignedOrders !== undefined && (
                  <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                      <FaTruck className="text-blue-500" />
                      <span>Assigned Orders</span>
                    </div>
                    <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.assignedOrders || 0}</p>
                  </div>
                )}
              </div>

              {/* Address if available */}
              {selectedRider.address && (
                <div className="bg-[#F8FAFC] dark:bg-dark-bg/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-dark-text mb-1">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>Address</span>
                  </div>
                  <p className="text-[#0F172A] dark:text-dark-heading">{selectedRider.address}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-[#E2E8F0] dark:border-dark-border">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRider(null);
                }}
                className="px-6 py-2 rounded-lg bg-[#F8FAFC] dark:bg-dark-bg/50 hover:bg-[#E2E8F0] dark:hover:bg-dark-border text-[#64748B] dark:text-dark-text font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-dark-border">
            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading">Confirm Delete</h3>
            <p className="text-[#64748B] dark:text-dark-text mt-2">
              Are you sure you want to delete <span className="font-medium text-[#0F172A] dark:text-dark-heading">{selectedRider.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition text-[#64748B] dark:text-dark-text"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-md shadow-red-200 dark:shadow-red-900/30"
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

export default Riders;