import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTable,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCouch,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaSave,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  resetOperationStatus,
  clearError,
} from '../../redux/Slicer/tableSlice';

// Stat Card Component (with Dashboard style)
const StatCard = ({ icon, label, value, bgColor, iconColor }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-[#64748B] dark:text-dark-text font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#0F172A] dark:text-dark-heading">{value}</p>
      </div>
    </div>
  );
};

// Status Badge Component (same as before but with consistent colors)
const StatusBadge = ({ status }) => {
  const styles = {
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    occupied: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    reserved: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  const labels = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.available}`}
    >
      {labels[status] || status}
    </span>
  );
};

// Skeleton Card
const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-6 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-[#F1F5F9] dark:bg-dark-bg/50 rounded-full mb-4"></div>
        <div className="h-5 w-20 bg-[#F1F5F9] dark:bg-dark-bg/50 rounded mb-2"></div>
        <div className="h-4 w-16 bg-[#F1F5F9] dark:bg-dark-bg/50 rounded mb-3"></div>
        <div className="h-6 w-24 bg-[#F1F5F9] dark:bg-dark-bg/50 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-[#F1F5F9] dark:bg-dark-bg/50 rounded"></div>
          <div className="h-8 w-8 bg-[#F1F5F9] dark:bg-dark-bg/50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const TablePage = () => {
  const dispatch = useDispatch();

  // Redux state
  const { tables, loading, operationLoading, error, operationError } = useSelector(
    (state) => state.table
  );
  const tableList = tables?.tables || [];

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    seats: 4,
    status: 'available',
  });

  const tablesPerPage = 6;

  // Fetch tables on mount
  useEffect(() => {
    dispatch(getTables());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (operationError) {
      toast.error(operationError);
      dispatch(clearError());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [operationError, error, dispatch]);

  // Reset operation status when modal closes
  useEffect(() => {
    if (!showAddEditModal && !showDeleteModal) {
      dispatch(resetOperationStatus());
    }
  }, [showAddEditModal, showDeleteModal, dispatch]);

  // Statistics
  const totalTables = tableList.length;
  const availableTables = tableList.filter((t) => t.status === 'available').length;
  const occupiedTables = tableList.filter((t) => t.status === 'occupied').length;
  const reservedTables = tableList.filter((t) => t.status === 'reserved').length;

  // Filter & Search
  const filteredTables = tableList.filter((table) => {
    const matchesSearch = table.tableNumber?.toString().includes(searchTerm);
    if (filter === 'all') return matchesSearch;
    return matchesSearch && table.status === filter;
  });

  // Pagination
  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = filteredTables.slice(indexOfFirstTable, indexOfLastTable);
  const totalPages = Math.ceil(filteredTables.length / tablesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // Helper
  const getTableId = (table) => table?._id || table?.id || null;

  // Handlers
  const handleDelete = (table) => {
    const tableId = getTableId(table);
    if (!tableId) {
      toast.error('Table ID not found');
      return;
    }
    setSelectedTable(table);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTable) return;
    const tableId = getTableId(selectedTable);
    if (!tableId) {
      toast.error('Table ID not found');
      return;
    }
    try {
      const result = await dispatch(deleteTable(tableId));
      if (deleteTable.fulfilled.match(result)) {
        toast.success(`Table ${selectedTable.tableNumber} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedTable(null);
      } else {
        toast.error(result.payload || 'Failed to delete table');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    }
  };

  const handleAddEdit = (table = null) => {
    if (table) {
      setIsEditing(true);
      setSelectedTable(table);
      setFormData({
        tableNumber: table.tableNumber,
        seats: table.seats,
        status: table.status,
      });
    } else {
      setIsEditing(false);
      setSelectedTable(null);
      setFormData({
        tableNumber: '',
        seats: 4,
        status: 'available',
      });
    }
    setShowAddEditModal(true);
  };

  const saveTable = async () => {
    if (!formData.tableNumber) {
      toast.error('Table number is required');
      return;
    }
    const tableData = {
      tableNumber: parseInt(formData.tableNumber),
      seats: parseInt(formData.seats),
      status: formData.status,
    };
    try {
      let result;
      if (isEditing && selectedTable) {
        const tableId = getTableId(selectedTable);
        if (!tableId) {
          toast.error('Table ID not found');
          return;
        }
        result = await dispatch(updateTable({ id: tableId, tableData }));
        if (updateTable.fulfilled.match(result)) {
          toast.success(`Table ${formData.tableNumber} updated successfully`);
          setShowAddEditModal(false);
        } else {
          toast.error(result.payload || 'Failed to update table');
        }
      } else {
        result = await dispatch(createTable(tableData));
        if (createTable.fulfilled.match(result)) {
          toast.success(`Table ${formData.tableNumber} added successfully`);
          setShowAddEditModal(false);
        } else {
          toast.error(result.payload || 'Failed to create table');
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#3B82F6] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // ❌ No extra background — just content
    <div>
      {/* ✨ New Header Design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-dark-border mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
            <FaTable className="text-[#3B82F6] dark:text-[#60A5FA]" />
            Table Management
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
            {totalTables}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text w-4 h-4" />
            <input
              type="text"
              placeholder="Search table number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[220px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-sm outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => handleAddEdit()}
            disabled={operationLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 text-sm font-medium shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {operationLoading ? (
              <FaSpinner className="animate-spin w-4 h-4" />
            ) : (
              <FaPlus className="w-4 h-4" />
            )}
            Add Table
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FaTable className="text-xl" />}
          label="Total Tables"
          value={totalTables}
          bgColor="bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20"
          iconColor="text-[#3B82F6] dark:text-[#60A5FA]"
        />
        <StatCard
          icon={<FaCheckCircle className="text-xl" />}
          label="Available"
          value={availableTables}
          bgColor="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={<FaUsers className="text-xl" />}
          label="Occupied"
          value={occupiedTables}
          bgColor="bg-rose-100 dark:bg-rose-900/30"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          icon={<FaClock className="text-xl" />}
          label="Reserved"
          value={reservedTables}
          bgColor="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'available', 'occupied', 'reserved']?.map((chip) => (
          <button
            key={chip}
            onClick={() => setFilter(chip)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              filter === chip
                ? 'bg-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10'
                : 'bg-white dark:bg-dark-card text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 border border-[#E2E8F0] dark:border-dark-border'
            }`}
          >
            {chip === 'all' ? 'All' : chip.charAt(0).toUpperCase() + chip.slice(1)}
          </button>
        ))}
      </div>

      {/* Table Cards Grid */}
      {filteredTables.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <FaTable className="text-6xl text-[#94A3B8] dark:text-dark-text" />
            <h3 className="text-xl font-semibold text-[#0F172A] dark:text-dark-heading">No Tables Found</h3>
            <p className="text-[#64748B] dark:text-dark-text">Start by creating your first table</p>
            <button
              onClick={() => handleAddEdit()}
              disabled={operationLoading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition text-sm font-medium shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10 disabled:opacity-50"
            >
              <FaPlus className="w-4 h-4" />
              Create First Table
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 })?.map((_, idx) => <SkeletonCard key={idx} />)
              : currentTables?.map((table) => {
                  const tableId = getTableId(table);
                  return (
                    <div
                      key={tableId || table.tableNumber}
                      className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#3B82F6]/20 dark:group-hover:bg-[#3B82F6]/30 transition-colors">
                          <FaTable className="text-3xl text-[#3B82F6] dark:text-[#60A5FA]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A] dark:text-dark-heading mb-1">
                          Table {table.tableNumber}
                        </h3>
                        <p className="text-sm text-[#64748B] dark:text-dark-text mb-2">
                          <FaCouch className="inline mr-1" /> {table.seats} Seats
                        </p>
                        <div className="mb-3">
                          <StatusBadge status={table.status} />
                        </div>
                        <p className="text-xs text-[#94A3B8] dark:text-dark-text mb-4">
                          Created: {formatDate(table.createdAt)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddEdit(table)}
                            disabled={operationLoading}
                            className="p-2 text-[#3B82F6] dark:text-[#60A5FA] hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 rounded-lg transition disabled:opacity-50"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(table)}
                            disabled={operationLoading}
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Pagination */}
          {filteredTables.length > tablesPerPage && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm mt-6">
              <p className="text-sm text-[#64748B] dark:text-dark-text">
                Showing {indexOfFirstTable + 1} - {Math.min(indexOfLastTable, filteredTables.length)} of{' '}
                {filteredTables.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft className="text-[#64748B] dark:text-dark-text" />
                </button>
                <span className="px-4 py-2 text-sm text-[#0F172A] dark:text-dark-heading">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronRight className="text-[#64748B] dark:text-dark-text" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-dark-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#0F172A] dark:text-dark-heading">
                {isEditing ? 'Edit Table' : 'Add New Table'}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                disabled={operationLoading}
                className="p-2 hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 rounded-lg transition disabled:opacity-50"
              >
                <FaTimes className="text-[#64748B] dark:text-dark-text" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#64748B] dark:text-dark-text mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, tableNumber: e.target.value })
                  }
                  disabled={operationLoading}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] text-[#0F172A] dark:text-dark-heading disabled:opacity-50"
                  placeholder="Enter table number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#64748B] dark:text-dark-text mb-1">
                  Number of Seats
                </label>
                <select
                  value={formData.seats}
                  onChange={(e) =>
                    setFormData({ ...formData, seats: parseInt(e.target.value) })
                  }
                  disabled={operationLoading}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] text-[#0F172A] dark:text-dark-heading disabled:opacity-50"
                >
                  <option value={2}>2 Seats</option>
                  <option value={4}>4 Seats</option>
                  <option value={6}>6 Seats</option>
                  <option value={8}>8 Seats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#64748B] dark:text-dark-text mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  disabled={operationLoading}
                  className="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] text-[#0F172A] dark:text-dark-heading disabled:opacity-50"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddEditModal(false)}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition disabled:opacity-50 text-[#64748B] dark:text-dark-text"
              >
                Cancel
              </button>
              <button
                onClick={saveTable}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
              >
                {operationLoading ? (
                  <FaSpinner className="animate-spin w-4 h-4" />
                ) : (
                  <FaSave className="w-4 h-4" />
                )}
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] dark:border-dark-border">
            <h3 className="text-lg font-semibold text-[#0F172A] dark:text-dark-heading">
              Confirm Delete
            </h3>
            <p className="text-[#64748B] dark:text-dark-text mt-2">
              Are you sure you want to delete{' '}
              <span className="font-medium text-[#0F172A] dark:text-dark-heading">
                Table {selectedTable?.tableNumber}
              </span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition disabled:opacity-50 text-[#64748B] dark:text-dark-text"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-200 dark:shadow-red-900/30"
              >
                {operationLoading ? (
                  <FaSpinner className="animate-spin w-4 h-4" />
                ) : (
                  <FaTrashAlt className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;