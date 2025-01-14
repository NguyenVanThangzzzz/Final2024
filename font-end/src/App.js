import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "~/routes";
import { DefaultLayout, FooterOnly } from "~/layouts";
import AuthProvider from "~/components/AuthProvider";
import CheckAuth from "~/components/CheckAuth";
import VerifyEmailModal from '~/components/VerifyEmailModal';
import ForgotPasswordModal from '~/components/ForgotPasswordModal';
import { useAuthStore } from '~/store/authStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { 
    showVerifyEmailModal, 
    setShowVerifyEmailModal,
    pendingVerificationEmail,
    verifyEmail,
    showForgotPasswordModal,
    setShowForgotPasswordModal,
    isInitialized
  } = useAuthStore();

  return (
    <Router>
      <AuthProvider>
        <div className="App">
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
                  key={`private-${index}`}
                  path={route.path}
                  element={
                    <Layout>
                      <CheckAuth>
                        <Page />
                      </CheckAuth>
                    </Layout>
                  }
                />
              );
            })}
          </Routes>

          {/* Modals */}
          {showVerifyEmailModal && (
            <VerifyEmailModal
              onClose={() => setShowVerifyEmailModal(false)}
              onVerify={verifyEmail}
              email={pendingVerificationEmail}
            />
          )}

          {showForgotPasswordModal && (
            <ForgotPasswordModal
              onClose={() => setShowForgotPasswordModal(false)}
            />
          )}
          
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
