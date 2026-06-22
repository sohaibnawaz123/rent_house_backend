const express = require("express");

const userRoutes = require("./users");
const authRoutes = require("./auth");
const locationRoutes = require("./locations");
const addressRoutes = require("./address");
const  router = express.Router();

router.use("/v1/user", userRoutes);
router.use("/v1/auth", authRoutes);
router.use("/v1/auth/location", locationRoutes);
router.use("/v1/address", addressRoutes);

module.exports = router;