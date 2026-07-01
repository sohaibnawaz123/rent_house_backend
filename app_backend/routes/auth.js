const express = require("express");
const { signUp, login, verifyEmail, forgotPassword, resetPassword, userLogout, refreshToken } = require("../controller/auth");
const {requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/signup",signUp);
router.post("/login",login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", requireSignIn, userLogout);
router.post("/refresh-token", refreshToken);

module.exports = router;