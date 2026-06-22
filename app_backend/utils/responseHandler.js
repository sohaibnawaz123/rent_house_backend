const errorResponse = (res, errorObj) => {
  return res.status(errorObj.statusCode).json({
    message: errorObj.message,
  });
};

const successResponse = (res, message, payload = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    message,
    ...payload,
  });
};

module.exports = { errorResponse, successResponse };