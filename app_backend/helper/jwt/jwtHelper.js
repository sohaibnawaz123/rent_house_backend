const jwt = require("jsonwebtoken");


const generateToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "1d",  });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",  });
    return {accessToken , refreshToken};
};

const decodeAccessToken = async (token) => {
    const accessToken = jwt.verify(token, process.env.JWT_SECRET);
};

const decodeRefreshToken = async (token) => {
    const accessToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};


module.exports = {
    generateToken,
    decodeAccessToken,
    decodeRefreshToken,
};