import { Link } from "react-router-dom";
import { useAdminStore } from "../Store/adminStore";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import biểu tượng logout
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const { user, logout } = useAdminStore();
  console.log("Current user:", user); // Kiểm tra giá trị của user

  return (
    <header className="fixed top-0 left-0 w-full bg-[#7981ff] bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-[#E0CEF4] h-16">
      <div className="w-full px-4 py-3 h-full">
        <div className="flex flex-wrap justify-between items-center h-full">
          {/* Link bọc cả chữ và ảnh để quay về home */}
          <Link to="/" className="flex items-center space-x-3 h-full">
            <img
              src="/Linux.png"
              alt="Logo"
              className="h-full max-h-full object-contain border-none w-12"
            />
            <h1 className="text-2xl font-bold" style={{ color: "#F3F9FF" }}>
              Admin DashBoard Page
            </h1>
          </Link>

          {user && (
            <nav className="flex flex-wrap items-center gap-4 ml-auto">
              <button
                className="bg-[#E0CEF4] hover:bg-[#F3F9FF] text-black py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                {/* Biểu tượng logout từ FontAwesome */}
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
