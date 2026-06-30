const crypto = require("crypto");

// 🔢 Generate OTP
const generateOTP = (length = 6) => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// 🔐 Hash OTP (for secure storage)
const hashOTP = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};

// ⏳ OTP Expiry (default: 5 minutes)
const getExpiryTime = (minutes = 5) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

// ✅ Verify OTP
const verifyOTP = (plainOTP, hashedOTP, expiryTime) => {
    if (!plainOTP || !hashedOTP || !expiryTime) {
        return { valid: false, message: "Invalid OTP data" };
    }

    // Check expiry
    if (new Date() > new Date(expiryTime)) {
        return { valid: false, message: "OTP expired" };
    }

    const hashedInput = hashOTP(plainOTP);

    if (hashedInput !== hashedOTP) {
        return { valid: false, message: "Incorrect OTP" };
    }

    return { valid: true, message: "OTP verified successfully" };
};

module.exports = {
    generateOTP,
    hashOTP,
    getExpiryTime,
    verifyOTP
};