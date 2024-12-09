import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Building2,
  Users,
  Settings,
  DoorClosed,
  Calendar,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAdminStore } from "../Store/adminStore";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAdminStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Movie Dashboard", href: "/movie-dashboard", icon: Film },
    ...(user?.role === "admin"
      ? [
          { name: "Cinema Management", href: "/cinema-management", icon: Building2 },
          { name: "Room Management", href: "/room-management", icon: DoorClosed },
          { name: "Movie Management", href: "/movie-management", icon: Film },
          {
            name: "Screening Management",
            href: "/screening-management",
            icon: Calendar,
          },
          { name: "User Management", href: "/user-management", icon: Users },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      : []),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 z-50 px-4 py-2">
        <button
          onClick={toggleMobileMenu}
          className="text-white p-2 hover:bg-gray-700 rounded-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 bg-gray-800 z-40 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  } flex items-center px-3 py-2 rounded-md text-sm font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-gray-800">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <button
              onClick={logout}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
