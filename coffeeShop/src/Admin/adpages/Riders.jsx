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
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "on-delivery": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    offline: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    blocked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    suspended: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
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

  // Fetch users on component mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Calculate statistics from riders only
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
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-dark-bg">
        <FaSpinner className="animate-spin text-indigo-600 dark:text-indigo-400 text-5xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-dark-bg min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-heading flex items-center gap-3">
            <FaMotorcycle className="text-indigo-600 dark:text-indigo-400" />
            Riders
          </h1>
          <p className="text-base text-gray-500 dark:text-dark-text mt-1">
            Total {totalRiders} riders registered
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 whitespace-nowrap"
          >
            <FaPlus className="text-sm" />
            Create Rider
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <FaUsers className="text-indigo-600 dark:text-indigo-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-dark-text font-medium">Total Riders</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading">{totalRiders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
            <FaUserCheck className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-dark-text font-medium">Active Riders</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading">{activeRiders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <FaTruck className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-dark-text font-medium">On Delivery</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading">{onDelivery}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
            <FaUserSlash className="text-red-600 dark:text-red-400 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-dark-text font-medium">Offline</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading">{offlineRiders}</p>
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-base">#</th>
                <th className="px-4 py-3 text-base">Name</th>
                <th className="px-4 py-3 hidden md:table-cell text-base">Email</th>
                <th className="px-4 py-3 hidden lg:table-cell text-base">Phone</th>
                <th className="px-4 py-3 text-base">Status</th>
                <th className="px-4 py-3 text-center text-base">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500 dark:text-dark-text">
                    <div className="flex flex-col items-center gap-2">
                      <FaMotorcycle className="text-4xl text-gray-300 dark:text-gray-600" />
                      <p>No riders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider, index) => (
                  <tr key={rider._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-dark-text">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-dark-heading text-base">{rider.name || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden md:table-cell text-base">{rider.email || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden lg:table-cell text-base">{rider.phone || "N/A"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={rider.currentStatus || "offline"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(rider)}
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
                          title="View"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(rider._id)}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Rider Modal */}
      {showViewModal && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-dark-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                  {selectedRider.name?.charAt(0).toUpperCase() || "R"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-dark-heading">{selectedRider.name || "N/A"}</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-text">Rider Details</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRider(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition text-gray-500 dark:text-dark-text"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                    <FaIdCard className="text-indigo-500" />
                    <span>User ID</span>
                  </div>
                  <p className="text-gray-800 dark:text-dark-heading font-mono text-sm">{selectedRider._id || "N/A"}</p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                    <FaEnvelope className="text-indigo-500" />
                    <span>Email</span>
                  </div>
                  <p className="text-gray-800 dark:text-dark-heading">{selectedRider.email || "N/A"}</p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                    <FaPhone className="text-indigo-500" />
                    <span>Phone</span>
                  </div>
                  <p className="text-gray-800 dark:text-dark-heading">{selectedRider.phone || "N/A"}</p>
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>Joined Date</span>
                  </div>
                  <p className="text-gray-800 dark:text-dark-heading">
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
                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-2">
                    <FaMotorcycle className="text-indigo-500" />
                    <span>Current Status</span>
                  </div>
                  <StatusBadge status={selectedRider.currentStatus || "offline"} />
                </div>

                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-2">
                    <FaUserCheck className="text-indigo-500" />
                    <span>Account Status</span>
                  </div>
                  <AccountStatusBadge status={selectedRider.isAvailable ? "active" : "suspended"} />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRider.vehicle && (
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                      <FaTruck className="text-indigo-500" />
                      <span>Vehicle</span>
                    </div>
                    <p className="text-gray-800 dark:text-dark-heading">{selectedRider.vehicle}</p>
                  </div>
                )}

                {selectedRider.rating && (
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                      <FaStar className="text-yellow-500" />
                      <span>Rating</span>
                    </div>
                    <p className="text-gray-800 dark:text-dark-heading">{selectedRider.rating} / 5.0</p>
                  </div>
                )}

                {selectedRider.completedDeliveries !== undefined && (
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                      <FaTrophy className="text-yellow-500" />
                      <span>Completed Deliveries</span>
                    </div>
                    <p className="text-gray-800 dark:text-dark-heading">{selectedRider.completedDeliveries || 0}</p>
                  </div>
                )}

                {selectedRider.assignedOrders !== undefined && (
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                      <FaTruck className="text-blue-500" />
                      <span>Assigned Orders</span>
                    </div>
                    <p className="text-gray-800 dark:text-dark-heading">{selectedRider.assignedOrders || 0}</p>
                  </div>
                )}
              </div>

              {/* Address if available */}
              {selectedRider.address && (
                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text mb-1">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>Address</span>
                  </div>
                  <p className="text-gray-800 dark:text-dark-heading">{selectedRider.address}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-dark-border">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedRider(null);
                }}
                className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-dark-text font-medium transition"
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
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-heading">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-dark-text mt-2">
              Are you sure you want to delete <span className="font-medium">{selectedRider.name}</span>? This action cannot be undone.
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
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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