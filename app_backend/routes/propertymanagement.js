const express = require("express");
const { createProperty, getProperties, getPropertyDetail } = require("../controller/propertymanagement");
const { requireSignIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/create-property",
    requireSignIn,
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "image", maxCount: 10 },
        { name: "property_images", maxCount: 10 },
        { name: "propertyImages", maxCount: 10 },
    ]),
    createProperty
);

router.get("/propertylist", getProperties);
router.get("/property-detail/:id", getPropertyDetail);

module.exports = router;
