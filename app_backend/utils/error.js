const { errorType } = require('../utils/constants');

const getErrorCode = errorName => {
  return errorType[errorName]
}
module.exports = getErrorCode