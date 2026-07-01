import React, { useState } from "react";
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

// Mock Data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&size=40",
    orders: 24,
    spending: 1247.50,
    status: "active",
    joined: "2024-01-15",
    isNew: false
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8901",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=6366f1&color=fff&size=40",
    orders: 18,
    spending: 876.25,
    status: "active",
    joined: "2024-02-20",
    isNew: true
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 234 567 8902",
    avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=6366f1&color=fff&size=40",
    orders: 5,
    spending: 234.80,
    status: "blocked",
    joined: "2024-03-10",
    isNew: false
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 234 567 8903",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&background=6366f1&color=fff&size=40",
    orders: 32,
    spending: 2156.90,
    status: "active",
    joined: "2023-11-05",
    isNew: false
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert@example.com",
    phone: "+1 234 567 8904",
    avatar: "https://ui-avatars.com/api/?name=Robert+Brown&background=6366f1&color=fff&size=40",
    orders: 0,
    spending: 0,
    status: "blocked",
    joined: "2024-04-01",
    isNew: true
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 8905",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=6366f1&color=fff&size=40",
    orders: 15,
    spending: 654.30,
    status: "active",
    joined: "2024-02-28",
    isNew: false
  },
  {
    id: 7,
    name: "David Miller",
    email: "david@example.com",
    phone: "+1 234 567 8906",
    avatar: "https://ui-avatars.com/api/?name=David+Miller&background=6366f1&color=fff&size=40",
    orders: 9,
    spending: 423.75,
    status: "active",
    joined: "2024-03-15",
    isNew: true
  }
];

// Stat Card Component
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

// Filter Chip Component
const FilterChip = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
        active 
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30" 
          : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

// Main Users Component
const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const usersPerPage = 5;

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const blockedUsers = users.filter(u => u.status === "blocked").length;
  const newUsers = users.filter(u => u.isNew).length;

  // Filter and search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && user.status === "active";
    if (filter === "blocked") return matchesSearch && user.status === "blocked";
    if (filter === "new") return matchesSearch && user.isNew;
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

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success(`${selectedUser.name} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleBlockToggle = (user) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    toast.success(`${user.name} ${newStatus === "active" ? "unblocked" : "blocked"}`);
  };

  // Loading state (simulated)
  if (loading) {
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
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          label="New Users"
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
            onClick={() => setFilter(chip)}
          />
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-base ">Profile</th>
                <th className="px-4 py-3 text-base">Full Name</th>
                <th className="px-4 py-3 hidden md:table-cell text-base">Email</th>
                <th className="px-4 py-3 hidden lg:table-cell text-base">Phone</th>
                <th className="px-4 py-3 hidden xl:table-cell text-base">Orders</th>
                <th className="px-4 py-3 hidden xl:table-cell text-base">Spending</th>
                <th className="px-4 py-3 text-base">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell text-base">Joined</th>
                <th className="px-4 py-3 text-center text-base">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center text-gray-500 dark:text-dark-text">
                    <div className="flex flex-col items-center gap-2">
                      <FaUsers className="text-4xl text-gray-300 dark:text-gray-600" />
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-4 py-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-dark-border"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-dark-heading text-base">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden md:table-cell text-base">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden lg:table-cell text-base">{user.phone}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden xl:table-cell text-base">{user.orders}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden xl:table-cell text-base">${user.spending.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === "active" 
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-dark-text hidden sm:table-cell">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Link to={`/admin/user/${user.id}`} className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition" title="View">
                          <FaEye size="18"/>
                        </Link>
                        <Link to={`/admin/update-user/${user.id}`} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition" title="Edit">
                          <FaEdit size="18" />
                        </Link>
                        <button onClick={() => handleBlockToggle(user)} className={`p-1.5 ${user.status === "active" ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20" : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"} rounded-lg transition`} title={user.status === "active" ? "Block" : "Unblock"}>
                          <FaBan size="18" />
                        </button>
                        <button onClick={() => handleDelete(user)} className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" title="Delete">
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