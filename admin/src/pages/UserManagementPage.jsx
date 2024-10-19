import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useAdminStore } from "../Store/adminStore";

function UserManagementPage() {
  const {
    users,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    assignRole,
  } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    searchUsers({ query });
  };
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // Kiểm tra nếu searchQuery không rỗng
      searchUsers({ name: searchQuery }); // Gọi hàm searchUsers với tham số name
    }
  };

  const handleAssignRole = async (userId, role) => {
    await assignRole(userId, role);
  };

  const handleUpdateUser = async (userId) => {
    const userData = {
      /* gather user data from a form or state */
    };
    await updateUser(userId, userData);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // Kiểm tra nếu phím nhấn là Enter
              handleSearchSubmit(); // Gọi hàm tìm kiếm
            }
          }}
          className="border p-2 w-full text-black pr-10" // Thêm padding bên phải để tạo không gian cho biểu tượng
        />
        <button
          onClick={handleSearchSubmit}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-black"
        >
          <FaSearch size={20} /> {/* Thay đổi kích thước biểu tượng */}
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">Name</th>
            <th className="border border-gray-200 p-2">Email</th>
            <th className="border border-gray-200 p-2">Role</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-200 p-2">{user.name}</td>
              <td className="border border-gray-200 p-2">{user.email}</td>
              <td className="border border-gray-200 p-2">
                <select
                  value={user.role}
                  onChange={(e) => handleAssignRole(user._id, e.target.value)}
                  className="border p-1 rounded bg-gray-800 text-white"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border border-gray-200 p-2">
                <button
                  onClick={() => handleUpdateUser(user._id)}
                  className="bg-blue-500 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white p-1 rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add user form can be added here */}
    </div>
  );
}

export default UserManagementPage;
