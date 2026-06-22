const express = require("express");
const {signUp, login, verifyEmail, forgotPassword, resetPassword} = require("../controller/auth");
const {requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/signup",signUp);
router.post("/login",login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;