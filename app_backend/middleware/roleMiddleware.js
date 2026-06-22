const { errorResponse, successResponse } = require("../utils/responseHandler.js");
const { errorName, successName } = require("../utils/constants.js");
const getErrorCode = require("../utils/error.js");

const requiredRoles = (roles = []) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user || !user.role_id) {
                return errorResponse(res, getErrorCode(errorName.INVALIDROLE));
            }

            if (!roles.includes(user.role_id)) {
                return errorResponse(res, getErrorCode(errorName.INVALIDROLE));
            }

            next();
        } catch (err) {
            console.error("Role middleware error:", err);
            return res.status(500).json({ message: "Server error" });
        }
    };
};

module.exports = {
    requiredRoles,
};
