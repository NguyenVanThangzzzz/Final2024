const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  emailVerication: "/verify-email",
  forgotpassword: "/forgot-password",
  resetpassword: "/reset-password/:token",

  ///Admin routes
  adminPage: "/admin",
  adminLogin: "/admin/login",
  adminProducts: "/admin/products",
  // profile: "/@:nickname",

  upload: "/upload",
  search: "/search",
  live: "/live",
};

export default routes;
