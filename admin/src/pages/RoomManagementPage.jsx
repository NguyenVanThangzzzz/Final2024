import { motion } from "framer-motion";
import { BarChart, PlusCircle, DoorOpen } from "lucide-react";
import React, { useState } from "react";
import CreateRoomForm from "../components/room/CreateRoomForm";
import RoomList from "../components/room/RoomList";

const tabs = [
  { id: "create", label: "Create rooms", icon: PlusCircle },
  { id: "rooms", label: "Rooms", icon: DoorOpen }
];

const RoomManagementPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Room Management Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "create" && <CreateRoomForm />}
        {activeTab === "rooms" && <RoomList />}
        {/* {activeTab === "analytics" && <AnalyticsTab />} */}
      </div>
    </div>
  );
};

export default RoomManagementPage;
