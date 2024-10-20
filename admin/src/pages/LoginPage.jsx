import { motion } from "framer-motion";
import { Loader, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../Store/adminStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi
  const { login, loading } = useAdminStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password."); // Cập nhật thông báo lỗi
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        className="bg-gray-800 py-8 px-6 shadow sm:rounded-lg sm:px-10 w-[500px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="mt-6 text-center text-3xl font-extrabold"
          style={{ color: "#7981ff" }} // Đổi màu chữ Admin Login thành tím đậm
        >
          Admin Login
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-center mt-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600
                rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                focus:ring-[#7A63E5] focus:border-[#7A63E5] sm:text-sm" // Thay đổi màu focus thành tím đậm
                placeholder="admin@gmail.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600
                rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#7A63E5] focus:border-[#7A63E5] sm:text-sm" // Thay đổi màu focus thành tím đậm
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent
            rounded-md shadow-sm text-sm font-medium"
            style={{ backgroundColor: "#7A63E5", color: "#F3F9FF" }} // Nền nút đậm hơn và chữ trắng
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader
                  className="mr-2 h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                Login
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
