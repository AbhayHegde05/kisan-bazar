const express = require("express");
const { register, login, getMe, googleLogin, forgotPassword, resetPassword } = require("../controllers/authController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", verifyToken, getMe);


module.exports = router;
