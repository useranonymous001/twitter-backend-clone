const jwt = require("jsonwebtoken");

function generateToken(username, email, id) {
  try {
    const token = jwt.sign(
      { email, username, id },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return token;
  } catch (error) {
    next(error);
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

module.exports = { generateToken, validateToken };
