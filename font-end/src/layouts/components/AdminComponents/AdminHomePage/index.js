import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../../../store/adminStore";
import styles from "./AdminHomePage.module.scss";

function AdminHomePage() {
  const {
    admin,
    users,
    loading,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    assignRole,
    logout,
  } = useAdminStore();
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setNewUser({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Create user error:", error);
    }
  };

  const handleUpdateUser = async (userId) => {
    const newName = prompt("Enter new name:");
    const newPassword = prompt(
      "Enter new password (leave blank to keep current):"
    );

    const updatedData = {};
    if (newName) updatedData.name = newName;
    if (newPassword) updatedData.password = newPassword;

    try {
      await updateUser(userId, updatedData);
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers({ name: searchQuery, email: searchQuery });
  };

  const handleAssignRole = async (userId) => {
    const newRole = prompt("Enter new role (user, manager, admin):");
    if (newRole && ["user", "manager", "admin"].includes(newRole)) {
      try {
        await assignRole(userId, newRole);
      } catch (error) {
        console.error("Assign role error:", error);
      }
    } else {
      alert("Invalid role. Please enter 'user', 'manager', or 'admin'.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login"); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!admin) {
    return <div>Please log in as an admin.</div>;
  }

  return (
    <div className={styles.adminHomePage}>
      <div className={styles.header}>
        <h2>Welcome, {admin.name}</h2>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit">Search</button>
      </form>

      <form onSubmit={handleCreateUser} className={styles.createUserForm}>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <button type="submit">Create User</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user._id} className={styles.userItem}>
              <span>
                {user.name} ({user.email}) - Role: {user.role}
              </span>
              <button onClick={() => handleUpdateUser(user._id)}>Update</button>
              <button onClick={() => handleAssignRole(user._id)}>
                Assign Role
              </button>
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminHomePage;
