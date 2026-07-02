import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaBan,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/Slicer/userSlice";

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md border border-gray-100 dark:border-dark-border">
      <div className={`p-3 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-dark-text font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading">{value}</p>
      </div>
    </div>
  );
};

const FilterChip = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${active
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
        : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      {label}
    </button>
  );
};

const Users = () => {
  const dispatch = useDispatch();
  const { usersList, loading: reduxLoading } = useSelector(
    (state) => state.getUser
  );

  // Extract users array from the response
  const users = usersList?.users || [];

  // Local state for UI filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const usersPerPage = 5;

  // Fetch users on component mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Calculate statistics from users
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isAvailable === true).length;
  const blockedUsers = users.filter(u => u.isAvailable === false).length;
  const newUsers = users.filter(u => {
    if (!u.createdAt) return false;
    const createdDate = new Date(u.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Users created in last 7 days
  }).length;

  // Filter and search logic using users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.includes(searchTerm);

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && user.isAvailable === true;
    if (filter === "blocked") return matchesSearch && user.isAvailable === false;
    if (filter === "new") {
      if (!user.createdAt) return false;
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return matchesSearch && diffDays <= 7;
    }
    return matchesSearch;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handlers
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        // Dispatch delete action - you'll need to implement this in your slice
        // await dispatch(deleteUser(selectedUser._id)).unwrap();
        toast.success(`${selectedUser.name} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedUser(null);
        // Refresh users list after deletion
        dispatch(getAllUsers());
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleBlockToggle = async (user) => {
    const newStatus = user.isAvailable ? false : true;
    try {
      // Dispatch update action - you'll need to implement this in your slice
      // await dispatch(updateUserStatus({ userId: user._id, isAvailable: newStatus })).unwrap();
      toast.success(`${user.name} ${newStatus ? "unblocked" : "blocked"}`);
      // Refresh users list after status change
      dispatch(getAllUsers());
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  // Loading state
  if (reduxLoading) {
    return (
      <div className="flex items-center justify-center h-96">
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
            <FaUsers className="text-indigo-600 dark:text-indigo-400" />
            Users
          </h1>
          <p className="text-base text-gray-500 dark:text-dark-text mt-1">
            Total {totalUsers} users registered
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FaUsers className="text-indigo-600 dark:text-indigo-400 text-xl" />}
          label="Total Users"
          value={totalUsers}
          color="bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatCard
          icon={<FaUserCheck className="text-emerald-600 dark:text-emerald-400 text-xl" />}
          label="Active Users"
          value={activeUsers}
          color="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={<FaUserSlash className="text-rose-600 dark:text-rose-400 text-xl" />}
          label="Blocked Users"
          value={blockedUsers}
          color="bg-rose-100 dark:bg-rose-900/30"
        />
        <StatCard
          icon={<FaUserPlus className="text-amber-600 dark:text-amber-400 text-xl" />}
          label="New Users (7 days)"
          value={newUsers}
          color="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {["all", "active", "blocked", "new"].map((chip) => (
          <FilterChip
            key={chip}
            label={chip.charAt(0).toUpperCase() + chip.slice(1)}
            active={filter === chip}
            onClick={() => {
              setFilter(chip);
              setCurrentPage(1);
            }}
          />
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-lg">#</th>
                <th className="px-4 py-3 text-lg">Full Name</th>
                <th className="px-4 py-3 hidden md:table-cell text-lg">Email</th>
                <th className="px-4 py-3 hidden lg:table-cell text-lg">User ID</th>
                <th className="px-4 py-3 text-lg">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell text-lg">Joined</th>
                <th className="px-4 py-3 text-center text-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500 dark:text-dark-text">
                    <div className="flex flex-col items-center gap-2">
                      <FaUsers className="text-4xl text-gray-300 dark:text-gray-600" />
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-dark-text">
                      {indexOfFirstUser + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-dark-heading text-base">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden md:table-cell text-base">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden lg:table-cell text-base font-mono">
                      {user._id?.slice(-8) || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-base font-medium ${
                        user.isAvailable
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {user.isAvailable ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-dark-text hidden sm:table-cell text-base">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Link 
                          to={`/admin/user/${user._id}`} 
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition" 
                          title="View"
                        >
                          <FaEye size="18" />
                        </Link>
                        <Link 
                          to={`/admin/update-user/${user._id}`} 
                          className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition" 
                          title="Edit"
                        >
                          <FaEdit size="18" />
                        </Link>
                        <button 
                          onClick={() => handleBlockToggle(user)} 
                          className={`p-1.5 ${
                            user.isAvailable
                              ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" 
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          } rounded-lg transition`} 
                          title={user.isAvailable ? "Block" : "Unblock"}
                        >
                          <FaBan size="18" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user)} 
                          className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" 
                          title="Delete"
                        >
                          <FaTrashAlt size="17" />
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
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-dark-border">
            <p className="text-sm text-gray-500 dark:text-dark-text">
              Showing {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="text-gray-600 dark:text-dark-text" />
              </button>
              <span className="px-4 py-2 text-sm text-gray-700 dark:text-dark-heading">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight className="text-gray-600 dark:text-dark-text" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-heading">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-dark-text mt-2">
              Are you sure you want to delete <span className="font-medium">{selectedUser?.name}</span>? This action cannot be undone.
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

export default Users;