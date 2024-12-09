import { Link } from "react-router-dom";
import { useAdminStore } from "../Store/adminStore";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import biểu tượng logout
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const { user, logout } = useAdminStore();
  console.log("Current user:", user); // Kiểm tra giá trị của user

  return (
    <nav className="bg-gray-800 shadow-md fixed md:static top-0 left-0 right-0 h-14 md:h-16 z-40 mt-12 md:mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Add your navbar content here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
