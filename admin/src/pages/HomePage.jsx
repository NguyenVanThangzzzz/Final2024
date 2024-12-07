import React from "react";
import DashboardStats from '../components/DashboardStats';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardStats />
    </div>
  );
};

export default HomePage;
