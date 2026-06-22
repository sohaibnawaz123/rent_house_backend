// utils/token.js
const crypto = require('crypto');

const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex'); // 64-character hex string
};

const hashedVerificationToken = (token) => {
    return crypto.createHash("sha256")
      .update(token)
      .digest("hex");
}

module.exports = { generateVerificationToken, hashedVerificationToken };
