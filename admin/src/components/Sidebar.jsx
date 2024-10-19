import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-full fixed top-0 left-0 z-10">
      <div className="p-4 mt-16">
        {" "}
        {/* Thêm margin-top để tránh bị Navbar che */}
        <h2 className="text-xl font-bold">Admin Menu</h2>
        <nav className="mt-4">
          <Link to="/" className="block py-2 hover:bg-gray-700">
            Home
          </Link>
          <Link to="/user-management" className="block py-2 hover:bg-gray-700">
            User management
          </Link>
          <Link to="/movie-management" className="block py-2 hover:bg-gray-700">
            Movie Management
          </Link>
          <Link to="/secret-dashboard" className="block py-2 hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/settings" className="block py-2 hover:bg-gray-700">
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
