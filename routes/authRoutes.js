// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  getMe,
  authenticate,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

module.exports = router;
