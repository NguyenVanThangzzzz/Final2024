import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useAdminStore } from "../Store/adminStore";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Toast, { TOAST_TYPES } from "../components/Toast";

function UserManagementPage() {
  const {
    users,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
  } = useAdminStore();
  
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: TOAST_TYPES.SUCCESS
  });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const showToast = (message, type = TOAST_TYPES.SUCCESS) => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleSearch = () => {
    const searchParams = {};
    if (searchName.trim()) searchParams.name = searchName.trim();
    if (searchEmail.trim()) searchParams.email = searchEmail.trim();
    searchUsers(searchParams);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({
      name: "",
      email: "",
    });
    setIsEditModalOpen(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser._id, editForm);
      closeEditModal();
      showToast("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Failed to update user. Please try again.", TOAST_TYPES.ERROR);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModalData({
      isOpen: true,
      userId: user._id,
      userName: user.name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalData({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  const handleDeleteSuccess = () => {
    closeDeleteModal();
    showToast("Successfully deleted!");
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deleteModalData.userId);
      handleDeleteSuccess();
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Failed to delete user. Please try again.", TOAST_TYPES.ERROR);
      return false;
    }
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchEmail("");
    getUsers();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">User Management</h1>
        <p className="text-gray-400">Manage and monitor user accounts</p>
      </div>
      
      {/* Search Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Email Verified</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {user.isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FaCheck className="mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <FaTimes className="mr-1" /> Not Verified
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-400 hover:text-blue-500 transition-colors duration-200"
                      title="Edit user"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="text-red-400 hover:text-red-500 transition-colors duration-200"
                      title="Delete user"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ease-in-out"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalData.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        itemName={deleteModalData.userName}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
}

export default UserManagementPage;
