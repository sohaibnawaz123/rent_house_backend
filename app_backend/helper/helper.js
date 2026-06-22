const { generateToken,  decodeAccessToken, decodeRefreshToken,} = require('./jwt/jwtHelper')

const createToken = async (payload) => {
  if (payload) {
    const data = await generateToken(payload);
    return data
  }
}
const verifyAccessToken = async (accesToken) => {
  if (accesToken) {
    const data = await decodeAccessToken(accesToken);
    return data;
  }
}
const createAccessToken = async (refreshToken) => {
  if (refreshToken) {
    const decoded = await decodeRefreshToken(refreshToken);
    if (!decoded.id) {
      return { error: "Invalid token" };
    }
    const checkUser = await users.findByPk(decoded.id, {
      attributes: ['id', 'email', 'phone'],
      raw: true
    });
    if (!checkUser) {
      return { error: "User not found" };
    }
    const data = await generateToken({
      id: checkUser.id,
      email: checkUser.email,
      phone_number: checkUser.phone_number
    });
    return data
  }
}


module.exports = {
    createToken,
    verifyAccessToken,
    createAccessToken

};

