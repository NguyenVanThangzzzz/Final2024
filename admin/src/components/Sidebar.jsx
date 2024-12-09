import { 
  BarChart3,
  Building2, 
  Clapperboard, 
  DoorOpen, 
  CalendarDays,
  LayoutDashboard,
  Settings,
  Users,
  SlidersHorizontal
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../Store/adminStore";

const Sidebar = () => {
  const { user } = useAdminStore();
  
  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        path: "/",
        name: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        path: "/movie-dashboard",
        name: "Movie Analytics",
        icon: <BarChart3 className="w-5 h-5" />,
      },
    ];

    // Additional items only for admin role
    const adminItems = [
      {
        path: "/user-management",
        name: "User Management",
        icon: <Users className="w-5 h-5" />,
      },
      {
        path: "/cinema-management",
        name: "Cinema Management",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        path: "/movie-management",
        name: "Movie Management",
        icon: <Clapperboard className="w-5 h-5" />,
      },
      {
        path: "/room-management",
        name: "Room Management",
        icon: <DoorOpen className="w-5 h-5" />,
      },
      {
        path: "/screening-management",
        name: "Screening Management",
        icon: <CalendarDays className="w-5 h-5" />,
      },
      {
        path: "/settings",
        name: "Settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ];

    return user?.role === 'admin' ? [...baseItems, ...adminItems] : baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-center mb-8">
          <img src="/Linux.png" alt="Logo" className="h-12" />
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
