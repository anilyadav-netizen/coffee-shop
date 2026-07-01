import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  FaSpinner,
} from 'react-icons/fa';

// Assume these actions exist in your redux slice
import { getUsers, deleteUser, blockUser } from '../features/users/userSlice';

const User = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filter users based on search term
  const filteredUsers = users?.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.phone?.includes(searchTerm)
  ) || [];

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((user) => user?.status === 'active')?.length || 0;
  const blockedUsers = users?.filter((user) => user?.status === 'blocked')?.length || 0;
  
  // Get current month's users (assuming joinedDate is a Date object or string)
  const currentDate = new Date();
  const newUsersThisMonth = users?.filter((user) => {
    const joinedDate = new Date(user?.joinedDate);
    return joinedDate.getMonth() === currentDate.getMonth() &&
           joinedDate.getFullYear() === currentDate.getFullYear();
  })?.length || 0;

  // Handlers
  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          toast.success('User deleted successfully');
        })
        .catch((error) => {
          toast.error(error?.message || 'Failed to delete user');
        });
    }
  };

  const handleBlockToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const action = currentStatus === 'active' ? 'block' : 'unblock';
    
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      dispatch(blockUser({ userId, status: newStatus }))
        .unwrap()
        .then(() => {
          toast.success(`User ${action}ed successfully`);
        })
        .catch((error) => {
          toast.error(error?.message || `Failed to ${action} user`);
        });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  // Empty State
  if (!filteredUsers?.length && !isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-dark-card rounded-2xl shadow-sm">
          <FaUsers className="text-6xl text-gray-300 dark:text-dark-border mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-heading mb-2">
            No Users Found
          </h3>
          <p className="text-gray-500 dark:text-dark-text">
            {searchTerm ? 'Try adjusting your search' : 'No users have been registered yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-heading">
            Users
          </h1>
          <p className="text-sm text-gray-600 dark:text-dark-text">
            Total {totalUsers} Users
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text" />
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-800 dark:text-dark-heading placeholder-gray-400 dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-text">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-text">Active Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading mt-1">{activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FaUserCheck className="text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-text">Blocked Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading mt-1">{blockedUsers}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FaUserSlash className="text-red-600 dark:text-red-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-text">New This Month</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-dark-heading mt-1">{newUsersThisMonth}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FaUserPlus className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-dark-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider hidden xl:table-cell">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider hidden xl:table-cell">Spending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {filteredUsers.map((user) => (
                <tr key={user?._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user?.profileImage || 'https://via.placeholder.com/40'}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-dark-border"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-heading">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-text md:hidden">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <p className="text-sm text-gray-600 dark:text-dark-text">{user?.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <p className="text-sm text-gray-600 dark:text-dark-text">{user?.phone}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                    <p className="text-sm text-gray-600 dark:text-dark-text">{user?.totalOrders || 0}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-heading">
                      ${user?.totalSpending?.toFixed(2) || '0.00'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user?.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user?.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <p className="text-sm text-gray-600 dark:text-dark-text">
                      {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/user/${user?._id}`}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                        title="View User"
                      >
                        <FaEye className="text-sm" />
                      </Link>
                      <Link
                        to={`/admin/update-user/${user?._id}`}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
                        title="Edit User"
                      >
                        <FaEdit className="text-sm" />
                      </Link>
                      <button
                        onClick={() => handleBlockToggle(user?._id, user?.status)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          user?.status === 'active'
                            ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                            : 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                        }`}
                        title={user?.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        <FaBan className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(user?._id, user?.name)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                        title="Delete User"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;