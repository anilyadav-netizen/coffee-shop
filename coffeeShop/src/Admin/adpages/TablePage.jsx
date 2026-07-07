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

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white dark:bg-dark-card backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 rounded-xl shadow-lg p-5 flex items-center gap-4 transition-all hover:shadow-xl hover:scale-[1.02] border border-gray-100 dark:border-dark-border">
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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    occupied: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
    reserved: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  };
  const labels = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.available}`}
    >
      {labels[status] || status}
    </span>
  );
};

// Skeleton Card Component
const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-100 dark:border-dark-border animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// Main TablePage Component
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

  // Fetch tables on component mount
  useEffect(() => {
    dispatch(getTables());
  }, [dispatch]);

  // Handle operation errors
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

  // Calculate statistics
  const totalTables = tableList.length;
  const availableTables = tableList.filter((t) => t.status === 'available').length;
  const occupiedTables = tableList.filter((t) => t.status === 'occupied').length;
  const reservedTables = tableList.filter((t) => t.status === 'reserved').length;

  // Filter and search logic
  const filteredTables = tableList.filter((table) => {
    const matchesSearch = table.tableNumber?.toString().includes(searchTerm) || 
                          table.tableNumber?.toString().includes(searchTerm);
    if (filter === 'all') return matchesSearch;
    return matchesSearch && table.status === filter;
  });

  // Pagination
  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = filteredTables.slice(indexOfFirstTable, indexOfLastTable);
  const totalPages = Math.ceil(filteredTables.length / tablesPerPage);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  // Get table ID - handles both _id and id
  const getTableId = (table) => {
    if (!table) return null;
    return table._id || table.id || null;
  };

  // Handlers
  const handleDelete = (table) => {
    console.log('Table to delete:', table);
    const tableId = getTableId(table);
    console.log('Table ID for delete:', tableId);
    if (!tableId) {
      toast.error('Table ID not found');
      return;
    }
    setSelectedTable(table);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTable) {
      toast.error('No table selected');
      return;
    }

    const tableId = getTableId(selectedTable);
    console.log('Confirm delete - Table ID:', tableId);
    
    if (!tableId) {
      toast.error('Table ID not found');
      return;
    }
    
    try {
      const result = await dispatch(deleteTable(tableId));
      console.log('Delete result:', result);
      
      if (deleteTable.fulfilled.match(result)) {
        toast.success(`Table ${selectedTable.tableNumber} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedTable(null);
      } else if (deleteTable.rejected.match(result)) {
        toast.error(result.payload || 'Failed to delete table');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    }
  };

  const handleAddEdit = (table = null) => {
    if (table) {
      console.log('Editing table:', table);
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
        // Update existing table
        const tableId = getTableId(selectedTable);
        console.log('Update table - ID:', tableId);
        console.log('Update table - Data:', tableData);
        
        if (!tableId) {
          toast.error('Table ID not found');
          return;
        }
        
        result = await dispatch(updateTable({
          id: tableId,
          tableData,
        }));
        console.log('Update result:', result);
        
        if (updateTable.fulfilled.match(result)) {
          toast.success(`Table ${formData.tableNumber} updated successfully`);
          setShowAddEditModal(false);
        } else if (updateTable.rejected.match(result)) {
          toast.error(result.payload || 'Failed to update table');
        }
      } else {
        // Add new table
        console.log('Create table - Data:', tableData);
        result = await dispatch(createTable(tableData));
        console.log('Create result:', result);
        
        if (createTable.fulfilled.match(result)) {
          toast.success(`Table ${formData.tableNumber} added successfully`);
          setShowAddEditModal(false);
        } else if (createTable.rejected.match(result)) {
          toast.error(result.payload || 'Failed to create table');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('An error occurred while saving');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <FaTable className="text-indigo-600 dark:text-indigo-400" />
            Table Management
          </h1>
          <p className="text-base text-gray-500 dark:text-dark-text mt-1">
            Manage all cafe tables
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search table number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => handleAddEdit()}
            disabled={operationLoading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {operationLoading ? (
              <FaSpinner className="animate-spin" size={16} />
            ) : (
              <FaPlus size={16} />
            )}
            Add Table
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FaTable className="text-indigo-600 dark:text-indigo-400 text-xl" />}
          label="Total Tables"
          value={totalTables}
          color="bg-indigo-100 dark:bg-indigo-900/30"
        />
        <StatCard
          icon={<FaCheckCircle className="text-emerald-600 dark:text-emerald-400 text-xl" />}
          label="Available Tables"
          value={availableTables}
          color="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={<FaUsers className="text-rose-600 dark:text-rose-400 text-xl" />}
          label="Occupied Tables"
          value={occupiedTables}
          color="bg-rose-100 dark:bg-rose-900/30"
        />
        <StatCard
          icon={<FaClock className="text-amber-600 dark:text-amber-400 text-xl" />}
          label="Reserved Tables"
          value={reservedTables}
          color="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {['all', 'available', 'occupied', 'reserved'].map((chip) => (
          <button
            key={chip}
            onClick={() => setFilter(chip)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
              filter === chip
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-dark-border'
            }`}
          >
            {chip === 'all' ? 'All' : chip.charAt(0).toUpperCase() + chip.slice(1)}
          </button>
        ))}
      </div>

      {/* Table Cards Grid */}
      {filteredTables.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-dark-border">
          <div className="flex flex-col items-center gap-4">
            <FaTable className="text-6xl text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-heading">No Tables Found</h3>
            <p className="text-gray-500 dark:text-dark-text">
              Start by creating your first table
            </p>
            <button
              onClick={() => handleAddEdit()}
              disabled={operationLoading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {operationLoading ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaPlus size={16} />
              )}
              Create First Table
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
              : currentTables.map((table) => {
                  const tableId = getTableId(table);
                  return (
                    <div
                      key={tableId || table.tableNumber}
                      className="bg-white dark:bg-dark-card backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-dark-border hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors">
                          <FaTable className="text-3xl text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-dark-heading mb-1">
                          Table {table.tableNumber}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-dark-text mb-2">
                          <FaCouch className="inline mr-1" /> {table.seats} Seats
                        </p>
                        <div className="mb-3">
                          <StatusBadge status={table.status} />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                          Created: {formatDate(table.createdAt)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddEdit(table)}
                            disabled={operationLoading}
                            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(table)}
                            disabled={operationLoading}
                            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-dark-border">
              <p className="text-sm text-gray-500 dark:text-dark-text">
                Showing {indexOfFirstTable + 1} - {Math.min(indexOfLastTable, filteredTables.length)} of{' '}
                {filteredTables.length}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft className="text-gray-600 dark:text-dark-text" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-700 dark:text-dark-heading">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronRight className="text-gray-600 dark:text-dark-text" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Table Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-heading">
                {isEditing ? 'Edit Table' : 'Add New Table'}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                disabled={operationLoading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, tableNumber: e.target.value })
                  }
                  disabled={operationLoading}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading disabled:opacity-50"
                  placeholder="Enter table number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                  Number of Seats
                </label>
                <select
                  value={formData.seats}
                  onChange={(e) =>
                    setFormData({ ...formData, seats: parseInt(e.target.value) })
                  }
                  disabled={operationLoading}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading disabled:opacity-50"
                >
                  <option value={2}>2 Seats</option>
                  <option value={4}>4 Seats</option>
                  <option value={6}>6 Seats</option>
                  <option value={8}>8 Seats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  disabled={operationLoading}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-dark-heading disabled:opacity-50"
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
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveTable}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {operationLoading ? (
                  <FaSpinner className="animate-spin" size={16} />
                ) : (
                  <FaSave size={16} />
                )}
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-heading">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-dark-text mt-2">
              Are you sure you want to delete{' '}
              <span className="font-medium">Table {selectedTable?.tableNumber}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={operationLoading}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {operationLoading ? (
                  <FaSpinner className="animate-spin" size={16} />
                ) : (
                  <FaTrashAlt size={16} />
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