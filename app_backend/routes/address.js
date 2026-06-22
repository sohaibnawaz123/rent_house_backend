const express = require("express");
const { createAddress } = require("../controller/address");
const { requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/create", requireSignIn, createAddress);

module.exports = router;