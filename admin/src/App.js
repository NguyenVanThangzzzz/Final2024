import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CinemaManagementPage from "./pages/CinemaManagementPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MovieManagementPage from "./pages/MovieManagementPage";
import RoomManagementPage from "./pages/RoomManagementPage";
import ScreeningManagementPage from "./pages/ScreeningManagementPage";
import SettingPage from "./pages/SettingPage";
import UserManagementPage from "./pages/UserManagementPage";
import { useAdminStore } from "./Store/adminStore";
import MovieDashBard from "./pages/MovieDashBard";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, checkingAuth, checkAuth } = useAdminStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  // Helper function to check if route is allowed for user role
  const isRouteAllowed = (path) => {
    if (user?.role === 'admin') return true;
    
    // Routes allowed for manager
    const managerRoutes = ['/', '/movie-dashboard'];
    return managerRoutes.includes(path);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          duration: 3000,
        }}
      />
      <div className="min-h-screen bg-gray-900 text-white relative">
        {user ? (
          <div className="flex flex-col md:flex-row w-full">
            <Sidebar />
            
            {/* Main content area */}
            <div className="w-full md:ml-64 flex-1">
              {/* Add top padding for mobile menu */}
              <div className="pt-14 md:pt-0">
                <Navbar />
                <div className="p-4 md:p-6 lg:p-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    
                    {/* Protected routes */}
                    {isRouteAllowed('/movie-dashboard') && (
                      <Route path="/movie-dashboard" element={<MovieDashBard />} />
                    )}
                    
                    {/* Admin only routes */}
                    {user.role === 'admin' && (
                      <>
                        <Route path="/settings" element={<SettingPage />} />
                        <Route path="/user-management" element={<UserManagementPage />} />
                        <Route path="/cinema-management" element={<CinemaManagementPage />} />
                        <Route path="/room-management" element={<RoomManagementPage />} />
                        <Route path="/movie-management" element={<MovieManagementPage />} />
                        <Route path="/screening-management" element={<ScreeningManagementPage />} />
                      </>
                    )}

                    {/* Redirect unauthorized access */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen w-full p-4">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
