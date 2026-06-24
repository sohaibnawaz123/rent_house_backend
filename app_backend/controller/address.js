const { users, addresses } = require("../db/models");
const { successName, errorName } = require("../utils/constants");
const getErrorCode = require("../utils/error");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const { Op } = require("sequelize");

const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const body = req.body || {};

        const {
            lat,
            lon,
            city,
            state,
            country,
            zipcode,
            addressline,
            countrycode,
            provincecode,
        } = body;

        if (lat == null || lat === "" || lon == null || lon === "") {
            return errorResponse(
                res,
                getErrorCode(errorName.LATLONREQUIRED)
            );
        }

        const latitude = Number(lat);
        const longitude = Number(lon);

        if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90 ||
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                message: "Valid latitude and longitude are required",
            });
        }

        const existingUser = await users.findByPk(userId);

        if (!existingUser) {
            return errorResponse(
                res,
                getErrorCode(errorName.USERNOTFOUND)
            );
        }

        const existingAddress = await addresses.findOne({
            where: { user_id: userId },
        });

        let address;

        if (existingAddress) {
            await existingAddress.update({
                lat: latitude,
                lon: longitude,
                city,
                state,
                country,
                zipcode,
                addressline,
                countrycode,
                provincecode,
            });

            address = existingAddress;
        } else {
            address = await addresses.create({
                user_id: userId,
                lat: latitude,
                lon: longitude,
                city,
                state,
                country,
                zipcode,
                addressline,
                countrycode,
                provincecode,
            });
        }



        return successResponse(
            res,
            "Address created successfully",
            {
                data: address,
            },
            201
        );
    } catch (error) {
        console.error(error);

        return errorResponse(res, {
            message: error.message || "Internal server error",
            statusCode: 500,
        });
    }
};

const getAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        const address = await addresses.findOne({
            where: { user_id: userId },
        });

        if (!address) {
            return errorResponse(
                res,
                getErrorCode(errorName.NODATAFOUND)
            );
        }

        const responseData = {
            lat: address.lat,
            lon: address.lon,
            city: address.city,
            state: address.state,
            country: address.country,
            zipcode: address.zipcode,
            addressline: address.addressline,
            countrycode: address.countrycode,
            provincecode: address.provincecode,
        };

        return successResponse(
            res,
            "Address fetched successfully",
            {
                data: responseData,
            },
            200
        );
    } catch (error) {
        return errorResponse(res, {
            message: error.message || "Internal server error",
            statusCode: 500,
        });
    }
};

module.exports = {
    createAddress, getAddress
};
