const { users, addresses, properties: Property, propertyimages, propertydetails, reviews } = require("../db/models");
const { roles } = require("../db/models");
const {
    createToken,
    verifyAccessToken,
    createAccessToken,
} = require("../helper/helper");
const path = require("path");
const { Op, literal, where } = require("sequelize");
const {
    errorResponse,
    successResponse,
} = require("../utils/responseHandler.js");
const { errorName, successName } = require("../utils/constants.js");
const getErrorCode = require("../utils/error.js");
const { sequelize } = require("../db/models/index.js");

const createProperty = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, description, price_per_month, status } = req.body;

        const property = await Property.create({
            name,
            description,
            price_per_month,
            status,
            user_id: id,
        });

        // 🔥 Save images
        const uploadedFiles = Array.isArray(req.files)
            ? req.files
            : Object.values(req.files || {}).flat();

        if (uploadedFiles.length > 0) {
            const images = uploadedFiles.map((file) => ({
                property_id: property.id,
                image_url: `/property-images/${file.filename}`,
            }));

            await propertyimages.bulkCreate(images);
        }

        res.status(201).json({
            message: "Property created",
            data: property,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProperties = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await Property.findAndCountAll({
            limit,
            offset,
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: propertyimages,
                    as: "images",
                    attributes: ["image_url"],
                },
                {
                    model: users,
                    as: "agent",
                    attributes: ["id", "username", "email"],
                },
            ],
        });

        // 🔥 FIX: map over all properties
        const formattedData = data.rows.map((property) => {
            const p = property.toJSON();

            p.images = p.images.map((img) => img.image_url);

            return p;
        });

        res.status(200).json({
            message: "Properties fetched successfully",
            total: data.count,
            currentPage: page,
            totalPages: Math.ceil(data.count / limit),
            data: formattedData, // ✅ use formatted data
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
const getPropertyDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findOne({
            where: { id },
            include: [
                {
                    model: propertyimages,
                    as: "images",
                    attributes: ["image_url"], // only needed field
                },
                {
                    model: users,
                    as: "agent",
                    attributes: ["id", "username", "email"],
                },
                {
                    model: propertydetails,
                    as: "details",
                },
                {
                    model: reviews,
                    as: "reviews",
                },
            ],
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        // 🔥 convert images to array of strings
        const formattedProperty = property.toJSON();

        formattedProperty.images = formattedProperty.images.map(
            (img) => img.image_url
        );

        res.status(200).json({
            message: "Property detail fetched",
            data: formattedProperty,
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    createProperty, getPropertyDetail, getProperties
};
