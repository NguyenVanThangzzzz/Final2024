import { HeaderOnly } from "~/components/Layout";

//Pages
import Home from "~/pages/Home";
import Profile from "~/pages/Profile";
import Search from "~/pages/Search";
import Showtime from "~/pages/Showtime";
import Upload from "~/pages/Upload";

//publicRoutes
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/showtime", component: Showtime },
  { path: "/profile", component: Profile },
  { path: "/upload", component: Upload, layout: HeaderOnly },
  { path: "/search", component: Search, layout: null },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };
