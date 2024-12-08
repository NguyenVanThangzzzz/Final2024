import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Film,
  Building2,
  SlidersHorizontal,
  DoorOpen,
  Settings,
  BarChart3
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: "/user-management",
      name: "User Management",
      icon: <Users className="w-5 h-5" />
    },
    {
      path: "/cinema-management",
      name: "Cinema Management",
      icon: <Building2 className="w-5 h-5" />
    },
    {
      path: "/movie-management",
      name: "Movie Management",
      icon: <Film className="w-5 h-5" />
    },
    {
      path: "/room-management",
      name: "Room Management",
      icon: <DoorOpen className="w-5 h-5" />
    },
    {
      path: "/screening-management",
      name: "Screening Management",
      icon: <SlidersHorizontal className="w-5 h-5" />
    },
    {
      path: "/movie-dashboard",
      name: "Movie Analytics",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      path: "/settings",
      name: "Settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];

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
