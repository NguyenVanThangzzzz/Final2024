import config from "~/config";
import { HeaderOnly } from "~/layouts";
//Pages

// User Pages
import EmailVerication from "~/pages/EmailVerication";
import Film from "~/pages/Film";
import ForgotPassword from "~/pages/ForgotPassword";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Profile from "~/pages/Profile";
import ResetPassword from "~/pages/ResetPassword";
import Room from "~/pages/Room";
import Signup from "~/pages/Signup";
import Search from "~/pages/Search";
import Showtime from "~/pages/Showtime";
import Upload from "~/pages/Upload";

// Public routes không yêu cầu đăng nhập
const publicRoutes = [
  { path: config.routes.home, component: Home, layout: null },
  { path: config.routes.login, component: Login, layout: HeaderOnly },
  { path: config.routes.signup, component: Signup, layout: HeaderOnly },
  {
    path: config.routes.emailVerication,
    component: EmailVerication,
    layout: HeaderOnly,
  },
  {
    path: config.routes.forgotpassword,
    component: ForgotPassword,
    layout: HeaderOnly,
  },
  {
    path: config.routes.resetpassword,
    component: ResetPassword,
    layout: HeaderOnly,
  },
  {
    path: config.routes.film,
    component: Film,
    layout: HeaderOnly,
  },
  {
    path: config.routes.room,
    component: Room,
    layout: HeaderOnly,
  },
  { path: "/showtime", component: Showtime },
];

// Private routes yêu cầu đăng nhập
const privateRoutes = [
  { path: "/upload", component: Upload, layout: HeaderOnly },
  { path: "/search", component: Search },
  {
    path: config.routes.profile,
    component: Profile,
  },
];

export { privateRoutes, publicRoutes };
