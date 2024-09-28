import express from "express";

import {
  deleteAllUser,
  deleteUser,
  getAllUser,
  getProfile,
  login,
  logout,
  refreshToken,
  searchUser,
  signup,
  updateUser,
  createUser,
} from "../controllers/adminController.js";

const router = express.Router();

// CRUD User
router.get("/profile", getProfile); // get profile page

router.get("/search", searchUser);  // search user page

router.get("/getAll", getAllUser); // get allUser page

router.post("/createUser", createUser); // create user page

router.put("/update/:id", updateUser); // update user page

router.delete("/delete/:id", deleteUser); // delete user page

router.delete("/deleteAll", deleteAllUser); // delete all user page

//////////////////////////////////////////////////////
router.post("/signup", signup); // signup page

router.post("/login", login); // login page

router.post("/logout", logout); // logout page

router.post("/refresh-token", refreshToken); // refresh token page

export default router;
