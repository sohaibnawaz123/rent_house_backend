const JWT = require("jsonwebtoken");
const { users} = require("../db/models");
const { errorResponse } = require("../utils/responseHandler");
const { errorName } = require("../utils/constants");
const getErrorCode = require("../utils/error");

// REQUIRED SIGNIN
const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, getErrorCode(errorName.TOKENREQUIRED));
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
    }

    const user = await users.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
    }

    req.user = {
      id: user.id,
      email: user.email,
      username:user.username,
      role_id: user.role_id,
      // Add role/permissions here if needed
    };

    next();
  } catch (error) {
    console.error("Token validation failed:", error?.message);

    // Token expired or invalid
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, getErrorCode(errorName.TOKENEXPIRED));
    }

    return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
  }
};


// const isAdmin = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
//     }
//     if (req.user.role?.name !== "Admin") {
//       return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
//   }
// };
// const isPlayer = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
//     }
//     if (req.user.role?.name !== "Player") {
//       return errorResponse(res, getErrorCode(errorName.UNAUTHORIZED));
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
//   }
// };

// middlewares/setUploadFolder.js
const setUploadFolder = (folderName) => (req, res, next) => {
  req.folder = folderName;
  next();
};
module.exports = {
  requireSignIn,
  setUploadFolder,
};