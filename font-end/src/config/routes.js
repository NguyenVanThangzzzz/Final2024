import { Contact } from "lucide-react";

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
  paymentSuccess: "/payment/success",
  paymentCancel: "/payment/cancel",

  // profile: "/@:nickname",
  //Routes xem inforoom
  showtime: "/showtime",
  movies: "/movies",
  promotions: "/promotions",
  cinema: "/cinema",
  contact: "/contact",


  upload: "/upload",
  search: "/search",
  live: "/live",
};

export default routes;
