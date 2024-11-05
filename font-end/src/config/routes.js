const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  emailVerication: "/verify-email",
  forgotpassword: "/forgot-password",
  resetpassword: "/reset-password/:token",
  film: "/film/:slug",
  room: "/room/:slug",
  order: "/order",
  payment: "/payment",
  paymentSuccess: "/payment/success",
  paymentCancel: "/payment/cancel",

  // profile: "/@:nickname",

  upload: "/upload",
  search: "/search",
  live: "/live",
};

export default routes;
