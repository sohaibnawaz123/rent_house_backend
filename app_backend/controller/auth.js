const { users, passwordResetTokens } = require("../db/models");
const { roles } = require("../db/models");
const bcrypt = require("bcrypt");
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
const { generateVerificationToken, hashedVerificationToken } = require("../utils/verificationToken.js");
const { mailTransporter } = require("../config/mail.js");
// const {crypto} = require("crypto");

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    var { accessToken, refreshToken } = await createAccessToken(refresh_token);
    return successResponse(
      res,
      successName.TOKENREFRESH,
      { access_token: accessToken, refresh_token: refreshToken },
      200
    );
  } catch (error) {
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const signUp = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    // console.log(req.body)

    if (!username) {
      return errorResponse(res, getErrorCode(errorName.INVALIDDETAILS));
    }

    if (!name) {
      console.error("role not found")
      return errorResponse(res, getErrorCode(errorName.INVALIDDETAILS));
    }
    if (!password) {
      // console.error("role not found")
      return errorResponse(res, getErrorCode(errorName.INVALIDDETAILS));
    }

    const existing = await users.findOne({ where: { email } });
    if (existing)
      return errorResponse(res, getErrorCode(errorName.ALREADYEXIST));

    //check role
    const role = await roles.findOne({
      where: { name }
    });
    console.log(role)

    const role_id = role ? role.id : null;


    // Create user
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await users.create({
      username,
      password,
      role_id,
      email,
      email_verification_token: verificationToken,
      email_verification_expires: expiresAt,
    });

    // Send verification email
    const isEmailSend = await sendVerificationEmail(user.email, verificationToken);
    if (!isEmailSend.success) {
      return res.status(500).json({
        success: false,
        message: "Account Created but verification email could not be sent."
      })
    }

    const payload = { id: user.id, email: user.email };
    const tokens = await createToken(payload);

    return successResponse(
      res,
      successName.REGISTER,
      {
        data: {
          user,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,

        }
      },
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationLink = `${process.env.AUTH_BASE_URL}/verify-email?token=${token}`;

    await mailTransporter.sendMail({
      from: `"Hously Rental" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking the link below:</p>
                 <a href="${verificationLink}">Verify Email</a>
                 <p>This link will expire in 24 hours.</p>`,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error("Email Send Erroe", error);

    return {
      success: false,
      message: error.message || "Failed to send verification email",
    }
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await users.findOne({
      where: {
        email_verification_token: token,
        email_verification_expires: {
          [Op.gt]: new Date(), // token not expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    // Update user status
    user.email_verified = true;
    // user.status = 'active';
    user.email_verification_token = null;
    user.email_verification_expires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('===================================');
    console.log(req.body);
    console.log('===================================');
    const user = await users.unscoped().findOne({
      where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("password email error");
      return errorResponse(res, getErrorCode(errorName.INVALIDCREDENTIALS));
    }

    if (!user.email_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first." });
    }

    const payload = { id: user.id, email: user.email };
    const tokens = await createToken(payload);

    return successResponse(
      res,
      successName.LOGIN,
      {
        data: {
          user,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        }
      },
      200
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const forgotPassword = async (req, res) => {
  // User->forgot password request
  //get user email
  //generates reset token
  //send reset email
  //user clicks link
  //set password
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: fail, message: "Email is required" });
    }
    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.json({
        success: true,
        message: "If the email exists, you will receive a password reset link",
      });
    }

    const rawToken = generateVerificationToken();
    const hashedToken = hashedVerificationToken(rawToken);

    await passwordResetTokens.create({
      user_id: user.id,
      token: hashedToken,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendResetPasswordEmail(user.email, rawToken);

    return res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });

  } catch (error) {
    console.log(error);
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.AUTH_BASE_URL}/reset-password?token=${token}`;

  await mailTransporter.sendMail({
    from: `"Wealth Platform" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: 'Reset your password',
    html: `
            <p>You requested a password reset.</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 15 minutes.</p>
        `
  });
}


const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log(password);
    const hashedToken = hashedVerificationToken(token);

    const record = await passwordResetTokens.findOne({
      where: {
        token: hashedToken,
        expires_at: { [Op.gt]: new Date() },
        used_at: null,
      },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    const user = await users.findByPk(record.user_id);
    user.password = password;
    await user.save();

    record.used_at = new Date();
    await record.save();

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const userLogout = async (req, res) => {

  try {
    const id = req.user.id;
    const getUser = await users.findOne({
      where: { id }
    });

    if (!getUser) {
      return errorResponse(res, getErrorCode(errorName.INVALIDTOKEN))
    }

    await users.update({ refresh_token: null },
      { where: { id } }
    )

    return res.status(200).json({
      // success: true,
      message: 'Logout'
    });

  } catch (error) {
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }

}

module.exports = {
  refreshToken,
  signUp,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  userLogout
};
