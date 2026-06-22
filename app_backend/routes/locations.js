const express = require("express");
const {getLocations, createLocations, updateLocations} = require("../controller/locations");
const {requireSignIn } = require("../middleware/authMiddleware");
const {requiredRoles} = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/get",  requireSignIn, requiredRoles([1]), getLocations);
router.post("/create", requireSignIn, requiredRoles([1]),createLocations);
router.patch("/update/:id", requireSignIn, requiredRoles([1]), updateLocations);
// router.delete("/delete", requireSignIn, requiredRoles([1]),deleteUser);

module.exports = router;