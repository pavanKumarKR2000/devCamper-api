const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/auth");

router
  .post("/register", register)
  .post("/login", login)
  .get("/me", protect, getMe)
  .post("/forgotpassword", forgotPassword)
  .put("/resetpassword/:resettoken", resetPassword)
  .put("/updatedetails", protect, updateDetails)
  .put("/updatepassword",protect,updatePassword)
  .get("/logout",logout);

module.exports = router;
