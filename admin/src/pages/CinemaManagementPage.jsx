import { motion } from "framer-motion";
import { BarChart, PlusCircle, Building2 } from "lucide-react";
import React, { useState } from "react";
import CreateCinemaForm from "../components/cinema/CreateCinemaForm";
import CinemasList from "../components/cinema/CinemasList";

const tabs = [
  { id: "create", label: "Create cinemas", icon: PlusCircle },
  { id: "cinemas", label: "Cinemas", icon: Building2 }
];

const CinemaManagementPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4">
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Cinema Management Dashboard
        </motion.h1>

        <div className="flex flex-col sm:flex-row justify-center mb-6 md:mb-8 space-y-2 sm:space-y-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 mx-1 sm:mx-2 rounded-md transition-colors duration-200 text-sm sm:text-base ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          {activeTab === "create" && <CreateCinemaForm />}
          {activeTab === "cinemas" && <CinemasList />}
        </div>
      </div>
    </div>
  );
};

export default CinemaManagementPage;
