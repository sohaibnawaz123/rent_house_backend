const express = require("express");
const {getUsers, createUser, updateUser, deleteUser} = require("../controller/users");
const {requireSignIn } = require("../middleware/authMiddleware");
const {requiredRoles} = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/get",  requireSignIn, requiredRoles([1]), getUsers);
router.post("/create", requireSignIn, requiredRoles([1]),createUser);
router.patch("/update", requireSignIn, requiredRoles([1]), updateUser);
router.delete("/delete", requireSignIn, requiredRoles([1]),deleteUser);

module.exports = router;