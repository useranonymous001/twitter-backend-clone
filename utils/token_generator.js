const jwt = require("jsonwebtoken");
const USER = require("../models/user_model");

async function generateAccessTokenAndRefreshToken(username, email, id) {
  try {
    const accessToken = jwt.sign(
      { email, username, id },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "5h",
      }
    );
    const refreshToken = jwt.sign({ id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });

    const user = await USER.findById(id);
    if (!user) {
      throw new Error("user not found ");
    }
    await USER.findByIdAndUpdate(user._id, { refreshToken, accessToken });
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`error: ${error.stack}`);
  }
}

function validateToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("error validating token", error);
    throw error;
  }
}

module.exports = { generateAccessTokenAndRefreshToken, validateToken };
