import { motion } from "framer-motion";
import { BarChart, PlusCircle, Clapperboard } from "lucide-react";
import React, { useState } from "react";
import CreateMovieForm from "../components/movie/CreateMovieForm";
import MovieList from "../components/movie/MovieList";

const tabs = [
  { id: "create", label: "Create movies", icon: PlusCircle },
  { id: "movies", label: "Movies", icon: Clapperboard }
];

const MovieManagementPage = () => {
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
          Movie Management Dashboard
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
        {activeTab === "create" && <CreateMovieForm />}
        {activeTab === "movies" && <MovieList />}
        {/* {activeTab === "analytics" && <AnalyticsTab />} */}
      </div>
    </div>
  );
};

export default MovieManagementPage;
