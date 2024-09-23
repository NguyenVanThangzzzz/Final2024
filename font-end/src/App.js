import { Fragment, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoadingSpinner from "~/components/LoadingSpinner"; // Có thể tạo spinner loading
import PrivateRoute from "~/components/PrivateRoute"; // Đảm bảo bạn đã tạo PrivateRoute
import { DefaultLayout } from "~/layouts";
import { privateRoutes, publicRoutes } from "~/routes";
import { useAuthStore } from "~/store/authStore"; // Sử dụng auth store của bạn

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // Kiểm tra trạng thái xác thực khi ứng dụng khởi động
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />; // Hiển thị spinner khi đang kiểm tra

  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* Private Routes */}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <PrivateRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </PrivateRoute>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
