import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "~/routes";
import { DefaultLayout } from "~/layouts";
import AuthProvider from "~/components/AuthProvider";
import CheckAuth from "~/components/CheckAuth";

function App() {
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
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
