const express = require("express");
const { createAddress, getAddress } = require("../controller/address");
const { requireSignIn } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/create", requireSignIn, createAddress);
router.get("/get", requireSignIn, getAddress);

module.exports = router;