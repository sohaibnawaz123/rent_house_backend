const { users, addresses } = require("../db/models");
const { successName, errorName } = require("../utils/constants");
const getErrorCode = require("../utils/error");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const { Op } = require("sequelize");

const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;

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
        } = req.body;

        if (!lat || !lon) {
            return errorResponse(
                res,
                getErrorCode(errorName.LATLONREQUIRED)
            );
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
                lat,
                lon,
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
                lat,
                lon,
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