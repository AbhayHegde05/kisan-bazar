const express = require("express");
const { register, login, getMe, googleLogin } = require("../controllers/authController");
const { verifyToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/me", verifyToken, getMe);

module.exports = router;
