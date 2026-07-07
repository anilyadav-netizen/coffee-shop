import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaTruck,
  FaUserSlash,
  FaSearch,
  FaEye,
  FaEdit,
  FaBan,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaMotorcycle,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaStar
} from "react-icons/fa";
import { toast } from "react-toastify";

// Mock Data
const mockRiders = [
  {
    id: 1,
    name: "Michael Rodriguez",
    email: "michael.r@example.com",
    phone: "+1 234 567 8900",
    avatar: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=6366f1&color=fff&size=40",
    assignedOrders: 12,
    completedDeliveries: 108,
    currentStatus: "on-delivery",
    accountStatus: "active",
    joined: "2023-08-15",
    vehicle: "Motorcycle",
    rating: 4.8
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234 567 8901",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff&size=40",
    assignedOrders: 5,
    completedDeliveries: 76,
    currentStatus: "available",
    accountStatus: "active",
    joined: "2023-10-20",
    vehicle: "Bicycle",
    rating: 4.9
  },
  {
    id: 3,
    name: "David Chen",
    email: "david.c@example.com",
    phone: "+1 234 567 8902",
    avatar: "https://ui-avatars.com/api/?name=David+Chen&background=6366f1&color=fff&size=40",
    assignedOrders: 0,
    completedDeliveries: 45,
    currentStatus: "offline",
    accountStatus: "active",
    joined: "2023-12-05",
    vehicle: "Scooter",
    rating: 4.6
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "+1 234 567 8903",
    avatar: "https://ui-avatars.com/api/?name=Emma+Wilson&background=6366f1&color=fff&size=40",
    assignedOrders: 8,
    completedDeliveries: 152,
    currentStatus: "on-delivery",
    accountStatus: "active",
    joined: "2023-06-10",
    vehicle: "Motorcycle",
    rating: 4.7
  },
  {
    id: 5,
    name: "James Brown",
    email: "james.b@example.com",
    phone: "+1 234 567 8904",
    avatar: "https://ui-avatars.com/api/?name=James+Brown&background=6366f1&color=fff&size=40",
    assignedOrders: 3,
    completedDeliveries: 23,
    currentStatus: "available",
    accountStatus: "blocked",
    joined: "2024-01-20",
    vehicle: "Motorcycle",
    rating: 4.2
  },
  {
    id: 6,
    name: "Lisa Martinez",
    email: "lisa.m@example.com",
    phone: "+1 234 567 8905",
    avatar: "https://ui-avatars.com/api/?name=Lisa+Martinez&background=6366f1&color=fff&size=40",
    assignedOrders: 0,
    completedDeliveries: 0,
    currentStatus: "offline",
    accountStatus: "suspended",
    joined: "2024-02-28",
    vehicle: "Bicycle",
    rating: 0
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.t@example.com",
    phone: "+1 234 567 8906",
    avatar: "https://ui-avatars.com/api/?name=Robert+Taylor&background=6366f1&color=fff&size=40",
    assignedOrders: 15,
    completedDeliveries: 198,
    currentStatus: "on-delivery",
    accountStatus: "active",
    joined: "2023-05-15",
    vehicle: "Motorcycle",
    rating: 4.9
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
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
          : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      {label}
    </button>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    available: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    "on-delivery": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    offline: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    suspended: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
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
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    blocked: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    suspended: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Create Rider Form Component
const CreateRiderModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "Motorcycle",
    currentStatus: "available",
    accountStatus: "active"
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newRider = {
        id: Date.now(),
        ...formData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff&size=40`,
        assignedOrders: 0,
        completedDeliveries: 0,
        joined: new Date().toISOString().split('T')[0],
        rating: 0
      };
      onSave(newRider);
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle: "Motorcycle",
        currentStatus: "available",
        accountStatus: "active"
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-dark-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-dark-heading flex items-center gap-2">
              <FaMotorcycle className="text-indigo-600 dark:text-indigo-400" />
              Create New Rider
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-text mt-1">Add a new delivery rider to the system</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaTimes className="text-gray-500 dark:text-gray-400 text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
              <FaIdCard className="inline mr-2 text-indigo-500" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full px-4 py-2.5 bg-white dark:bg-dark-bg border ${errors.name ? "border-rose-500" : "border-gray-200 dark:border-dark-border"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-gray-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-rose-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
              <FaEnvelope className="inline mr-2 text-indigo-500" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={`w-full px-4 py-2.5 bg-white dark:bg-dark-bg border ${errors.email ? "border-rose-500" : "border-gray-200 dark:border-dark-border"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-gray-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
              <FaPhone className="inline mr-2 text-indigo-500" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`w-full px-4 py-2.5 bg-white dark:bg-dark-bg border ${errors.phone ? "border-rose-500" : "border-gray-200 dark:border-dark-border"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-gray-500`}
            />
            {errors.phone && <p className="mt-1 text-sm text-rose-500">{errors.phone}</p>}
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
              <FaTruck className="inline mr-2 text-indigo-500" />
              Vehicle Type
            </label>
            <select
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading"
            >
              <option value="Motorcycle">Motorcycle</option>
              <option value="Scooter">Scooter</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
            </select>
          </div>

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
              <FaClock className="inline mr-2 text-indigo-500" />
              Current Status
            </label>
            <select
              name="currentStatus"
              value={formData.currentStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading"
            >
              <option value="available">Available</option>
              <option value="on-delivery">On Delivery</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1.5">
              <FaUserCheck className="inline mr-2 text-indigo-500" />
              Account Status
            </label>
            <select
              name="accountStatus"
              value={formData.accountStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition text-gray-700 dark:text-dark-text font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Create Rider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Riders Component
const Riders = () => {
  const [riders, setRiders] = useState(mockRiders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRider, setSelectedRider] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const ridersPerPage = 5;

  // Calculate statistics
  const totalRiders = riders.length;
  const activeRiders = riders.filter(r => r.accountStatus === "active").length;
  const onDelivery = riders.filter(r => r.currentStatus === "on-delivery").length;
  const offlineOrSuspended = riders.filter(r => r.currentStatus === "offline" || r.accountStatus === "suspended").length;

  // Filter and search logic
  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone.includes(searchTerm);

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && rider.accountStatus === "active";
    if (filter === "on-delivery") return matchesSearch && rider.currentStatus === "on-delivery";
    if (filter === "offline") return matchesSearch && rider.currentStatus === "offline";
    if (filter === "suspended") return matchesSearch && rider.accountStatus === "suspended";
    return matchesSearch;
  });

  // Pagination
  const indexOfLastRider = currentPage * ridersPerPage;
  const indexOfFirstRider = indexOfLastRider - ridersPerPage;
  const currentRiders = filteredRiders.slice(indexOfFirstRider, indexOfLastRider);
  const totalPages = Math.ceil(filteredRiders.length / ridersPerPage);

  // Handlers
  const handleCreateRider = (newRider) => {
    setRiders(prev => [newRider, ...prev]);
    toast.success(`${newRider.name} created successfully!`);
  };

  const handleDelete = (rider) => {
    setSelectedRider(rider);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRider) {
      setRiders(riders.filter(r => r.id !== selectedRider.id));
      toast.success(`${selectedRider.name} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedRider(null);
    }
  };

  const handleBlockToggle = (rider) => {
    const newStatus = rider.accountStatus === "active" ? "blocked" : "active";
    setRiders(riders.map(r =>
      r.id === rider.id ? { ...r, accountStatus: newStatus } : r
    ));
    toast.success(`${rider.name} ${newStatus === "active" ? "unblocked" : "blocked"}`);
  };

  // Loading state
  if (loading) {
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
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 whitespace-nowrap"
          >
            <FaPlus className="text-sm" />
            Create Rider
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FaUsers className="text-indigo-600 dark:text-indigo-400 text-xl" />}
          label="Total Riders"
          value={totalRiders}
          color="bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatCard
          icon={<FaUserCheck className="text-emerald-600 dark:text-emerald-400 text-xl" />}
          label="Active Riders"
          value={activeRiders}
          color="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={<FaTruck className="text-blue-600 dark:text-blue-400 text-xl" />}
          label="On Delivery"
          value={onDelivery}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={<FaUserSlash className="text-rose-600 dark:text-rose-400 text-xl" />}
          label="Offline/Suspended"
          value={offlineOrSuspended}
          color="bg-rose-100 dark:bg-rose-900/30"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {["all", "active", "on-delivery", "offline", "suspended"].map((chip) => (
          <FilterChip
            key={chip}
            label={chip === "on-delivery" ? "On Delivery" : chip.charAt(0).toUpperCase() + chip.slice(1)}
            active={filter === chip}
            onClick={() => setFilter(chip)}
          />
        ))}
      </div>

      {/* Riders Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-dark-text uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-base">Profile</th>
                <th className="px-4 py-3 text-base">Full Name</th>
                <th className="px-4 py-3 hidden md:table-cell text-base">Email</th>
                <th className="px-4 py-3 hidden lg:table-cell text-base">Phone</th>
                <th className="px-4 py-3 hidden xl:table-cell text-base">Assigned</th>
                <th className="px-4 py-3 hidden xl:table-cell text-base">Completed</th>
                <th className="px-4 py-3 text-lg">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell text-base">Account</th>
                <th className="px-4 py-3 hidden sm:table-cell text-base">Joined</th>
                <th className="px-4 py-3 text-center text-base">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {currentRiders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center text-gray-500 dark:text-dark-text">
                    <div className="flex flex-col items-center gap-2">
                      <FaMotorcycle className="text-4xl text-gray-300 dark:text-gray-600" />
                      <p>No riders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentRiders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={rider.avatar}
                        alt={rider.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-dark-border"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-dark-heading text-base">{rider.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden md:table-cell text-base">{rider.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden lg:table-cell text-base">{rider.phone}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden xl:table-cell text-base">{rider.assignedOrders}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-text hidden xl:table-cell text-base">{rider.completedDeliveries}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={rider.currentStatus} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <AccountStatusBadge status={rider.accountStatus} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-dark-text hidden sm:table-cell">{rider.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Link to={`/admin/rider/${rider.id}`} className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition" title="View">
                          <FaEye size={18} />
                        </Link>
                        <Link to={`/admin/update-rider/${rider.id}`} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition" title="Edit">
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleBlockToggle(rider)}
                          className={`p-1.5 ${rider.accountStatus === "active"
                              ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            } rounded-lg transition`}
                          title={rider.accountStatus === "active" ? "Block" : "Unblock"} a
                        >
                          <FaBan size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(rider)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
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

        {/* Pagination */}
        {filteredRiders.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-dark-border">
            <p className="text-sm text-gray-500 dark:text-dark-text">
              Showing {indexOfFirstRider + 1} - {Math.min(indexOfLastRider, filteredRiders.length)} of {filteredRiders.length}
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

      {/* Create Rider Modal */}
      <CreateRiderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateRider}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-heading">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-dark-text mt-2">
              Are you sure you want to delete <span className="font-medium">{selectedRider?.name}</span>? This action cannot be undone.
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

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Riders;