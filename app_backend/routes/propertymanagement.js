const express = require("express");
const {
    createProperty,
    getProperties,
    getPropertyDetail,
    getHomeExplore,
    getHomeData,
} = require("../controller/propertymanagement");
const { requireSignIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();
const propertyImageUpload = upload.fields([
    { name: "images", maxCount: 10 },
    { name: "image", maxCount: 10 },
    { name: "property_images", maxCount: 10 },
    { name: "propertyImages", maxCount: 10 },
]);

router.post(
    "/create-property",
    requireSignIn,
    propertyImageUpload,
    createProperty
);

router.post(
    "/properties",
    requireSignIn,
    propertyImageUpload,
    createProperty
);

router.get("/propertylist", getProperties);
router.get("/property-detail", getPropertyDetail);
router.get("/home", getHomeData);
router.get("/home/explore", getHomeExplore);

module.exports = router;
