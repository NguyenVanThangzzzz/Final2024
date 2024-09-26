import express from "express";

import { signup, login, logout } from "../controllers/adminController.js";

const router = express.Router();

router.post("/signup", signup); // signup page

router.post("/login", login); // login page

router.post("/logout", logout); // logout page


export default router;
