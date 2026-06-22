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

        const address = await addresses.create({
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

module.exports = {
    createAddress,
};