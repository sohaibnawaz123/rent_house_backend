
const errorName = {
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALIDCREDENTIALS: "INVALIDCREDENTIALS",
  PASSWORDTOOSHORT: "PASSWORDTOOSHORT",
  BADREQUEST: "BADREQUEST",
  INTERNALSERVER: "INTERNALSERVER",
  FILEMISSING: "FILEMISSING",
  INVALIDEMAIL: "INVALIDEMAIL",
  INVALIDPASSWORD: "INVALIDPASSWORD",
  INVALIDPHONE: "INVALIDPHONE",
  USERNOTFOUND: "USERNOTFOUND",
  INVALIDDETAILS: "INVALIDDETAILS",
  INVALIDROLE: "INVALIDROLE",
  USERINACTIVE: "USERINACTIVE",
  INVALIDOTP: "INVALIDOTP",
  OTPEXPIREDINVALID: "OTPEXPIREDINVALID",
  ALLFIELDSREQUIRED: "ALLFIELDSREQUIRED",
  PASSWORDDONTMATCH: "PASSWORDDONTMATCH",
  OTPNOTVERIFIED: "OTPNOTVERIFIED",
  INVALIDCURRENTPASSWORD: "INVALIDCURRENTPASSWORD",
  TOKENREQUIRED: "TOKENREQUIRED",
  INVALIDTOKEN: "INVALIDTOKEN",
  PASSWORDNOTSAME: "PASSWORDNOTSAME",
  ALREADYREGISTERED: "ALREADYREGISTERED",
  OTPALREADYVERIFIED: "OTPALREADYVERIFIED",
  ALREADYUSEDPASSWORD: "ALREADYUSEDPASSWORD",
  INVALIDPRICE: "INVALIDPRICE",
  SINGLEIMAGEONLY: "SINGLEIMAGEONLY",
  SAMENAME: "SAMENAME",
  REWARDEXIST:"REWARDEXIST",
  NOTFOUND: "NOTFOUND",
  INVALIDINPUT: "INVALIDINPUT",
  NOMETHODFOUND: "NOMETHODFOUND",
  INVALIDCONFIGURATION: "INVALIDCONFIGURATION",
  INVALIDREFERRALCODE: "INVALIDREFERRALCODE",
  ALREADYEXIST: "ALREADYEXIST",
  IDNOTFOUND: "IDNOTFOUND",
  ACCESSKEYREQUIRED: "ACCESSKEYREQUIRED",
  INVALIDACESSTOKEN: "INVALIDACESSTOKEN",
  ALREADYREGISTERED: "ALREADYREGISTERED",
  ACCOUNTINACTIVE: "ACCOUNTINACTIVE",
  KEYISREQUIRED: "KEYISREQUIRED",
};
const errorType = {
  FILEMISSING: {
    message: "File is missing",
    statusCode: 400,
  },
  BADREQUEST: {
    message: "Some required fields are missing",
    statusCode: 400,
  },
  INVALIDEMAIL: {
    message: "Invalid Email Address",
    statusCode: 400,
  },
  SAMENAME: {
    message: "Name already exist",
    statusCode: 400,
  },
  INVALIDPASSWORD: {
    message: "Invalid Password.",
    statusCode: 400,
  },
  INVALIDPHONE: {
    message: "Invalid Phone number",
    statusCode: 400,
  },
  INVALIDROLE: {
    message: "Invalid Role",
    statusCode: 403,
  },
  INTERNALSERVER: {
    message: "Internal server error",
    statusCode: 500,
  },
  USERINACTIVE: {
    message: "Account inactive. Contact support.",
    statusCode: 403,
  },
  OTPEXPIREDINVALID: {
    message: "OTP expired or invalid",
    statusCode: 400,
  },
  INVALIDOTP: {
    message: "Invalid OTP",
    statusCode: 400,
  },
  ALLFIELDSREQUIRED: {
    message: "All fields are required",
    statusCode: 400,
  },
  PASSWORDDONTMATCH: {
    message: "Passwords do not match",
    statusCode: 400,
  },
  PASSWORDTOOSHORT: {
    message:
      "Password must be at least 8 characters with letters, numbers, and a special character",
    statusCode: 400,
  },
  OTPNOTVERIFIED: {
    message: "OTP not verified. Please verify OTP before resetting password.",
    statusCode: 403,
  },
  INVALIDCURRENTPASSWORD: {
    message: "Invalid current password",
    statusCode: 400,
  },
  PASSWORDNOTSAME: {
    message: "New password must be different from the current password",
    statusCode: 400,
  },
  INVALIDCREDENTIALS: {
    message: "Invalid credentials",
    statusCode: 400,
  },
  TOKENREQUIRED: {
    message: "Token is required",
    statusCode: 401,
  },
  INVALIDTOKEN: {
    message: "Invalid or Expired Token",
    statusCode: 400,
  },
  UNAUTHORIZED: {
    message: "Authentication is needed to get requested response",
    statusCode: 401,
  },
  ALREADYREGISTERED: {
    message: "Already registered with this phone number or email",
    statusCode: 409,
  },
  USERNOTFOUND: {
    message: "User not found",
    statusCode: 404,
  },
  INVALIDDETAILS: {
    message: "Invalid Details",
    statusCode: 400,
  },
  OTPALREADYVERIFIED: {
    message: "Please generate OTP again",
    statusCode: 400,
  },
  ALREADYUSEDPASSWORD: {
    message: "This password has already been used.",
    statusCode: 409,
  },
  SINGLEIMAGEONLY: {
    message: "Only one image is allowed",
    statusCode: 400,
  },
  INVALIDPRICE: {
    message: "Invalid price",
    statusCode: 400,
  },
  NOTFOUND: {
    message: "Record not found",
    statusCode: 404,
  },
  INVALIDINPUT: {
    message: "Inavlid Input",
    statusCode: 400,
  },
  INVALIDCONFIGURATION: {
    message: "Inavlid Configuration",
    statusCode: 400,
  },
  ALREADYEXIST: {
    message: "Profile already exists",
    statusCode: 400,
  },
  IDNOTFOUND: {
    message: "ID not found",
    statusCode: 404,
  },
  ACCESSKEYREQUIRED: {
    message: "Access key required",
    statusCode: 400
  },
  INVALIDACESSTOKEN: {
    message: "Invalid access token",
    statusCode: 400
  },
  ALREADYREGISTERED: {
    message: "Email already registered with a different role",
    statusCode: 400
  },

};

const successName = {
  CREATED: "Created successfully",
  UPDATED: "Updated Successfully",
  DELETED: "Deleted successfully",
  SUCCESS: "Success",
  SUBMITTED: "Submitted successfully",
  REGISTER: "User registered successfully",
  LOGIN: "Logged in successfully",
  UPDATEUSER: "User updated successfully",
  PASSWORDCHNAGED: "Password changed successfully",
  OTPSEND: "OTP sent to your Email",
  OTPVERIFIED: "OTP verified successfully",
  RESETPASSWORD: "Password reset successfully",
  TOKENREFRESH: "Tokens refreshed successfully",
  USERFETCHED: "User fetched successfully",
  GUESTLOGIN: "Guest login successfully",
  LOGOUT: "Logout Successfully",
  CONFIGURATIONSUPDATED: "Configuration updated successfully",
  CONFIGURATIONSADDED: "Configuration addedd successfully",
  USERDELETED: "User deleted successfully",
  GETCONFIGURATIONS: "Configuration get successfully"
};

module.exports = { errorName, successName, errorType };