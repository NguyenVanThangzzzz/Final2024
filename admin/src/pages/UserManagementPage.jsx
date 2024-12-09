import React, { useEffect, useState } from "react";
import { useAdminStore } from "../Store/adminStore";
import { Trash, CheckCircle, XCircle, Search, AlertCircle } from "lucide-react";
import Toast from '../components/Toast/Toast';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import useToast from '../hooks/useToast';

const UserManagementPage = () => {
  const { users, fetchAllUsers, deleteUser, searchUsers } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
  });
  const { toast, showToast, hideToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, userId: null });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await fetchAllUsers();
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [fetchAllUsers]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);

    try {
      // Kiểm tra nếu cả hai trường đều trống
      if (!searchParams.name.trim() && !searchParams.email.trim()) {
        await fetchAllUsers(); // Load lại tất cả users
        return;
      }

      await searchUsers(searchParams);
    } catch (error) {
      setSearchError(error.response?.data?.message || "Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset error khi user bắt đầu nhập
    setSearchError(null);
  };

  const handleResetSearch = async () => {
    setSearchParams({ name: "", email: "" });
    setSearchError(null);
    await fetchAllUsers();
  };

  const handleDeleteClick = (userId) => {
    setConfirmDialog({ isOpen: true, userId });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(confirmDialog.userId);
      showToast({
        type: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete user'
      });
    } finally {
      setConfirmDialog({ isOpen: false, userId: null });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Search by Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={searchParams.name}
                onChange={handleInputChange}
                className="block w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter name..."
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Search by Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={searchParams.email}
                onChange={handleInputChange}
                className="block w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter email..."
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{searchError}</span>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleResetSearch}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {searching ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Searching...
              </>
            ) : (
              'Search Users'
            )}
          </button>
        </div>
      </form>

      {/* No Results Message */}
      {!loading && users.length === 0 && (
        <div className="text-center py-8 bg-gray-800 rounded-lg mb-6">
          <div className="text-gray-400 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 mb-3" />
            <h3 className="text-lg font-medium mb-2">No Users Found</h3>
            <p className="text-sm">
              No users match your search criteria. Try different keywords or{' '}
              <button
                onClick={handleResetSearch}
                className="text-emerald-500 hover:text-emerald-400 underline"
              >
                reset your search
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Users Table */}
      {users.length > 0 && (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isVerified ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <XCircle className="w-5 h-5 mr-1" />
                        Not Verified
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="text-red-500 hover:text-red-600 focus:outline-none"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Toast and ConfirmDialog */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={toast.duration}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, userId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserManagementPage;
