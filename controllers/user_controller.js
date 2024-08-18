const USER = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../controllers/error_handler");
const {
  generateAccessTokenAndRefreshToken,
} = require("../utils/token_generator");

async function handleUserSignUp(req, res, next) {
  try {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) next(err);
      const user = await USER.create({
        username,
        email,
        password: hash,
      });
      return res.json({ success: `user account created successfully` });
    });
  } catch (error) {
    next(error);
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await USER.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, "invalid user credentials");
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return sendErrorResponse(res, "invalid user credentials");
    }
    // need changes later on
    // req.session.userId = user._id;

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(
        user.username,
        user.email,
        user._id
      );

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "successfully logged in",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    res.status(500).json({ message: `Internal server erorr ${error.stack}` });
  }
}

async function handleUserLogout(req, res) {
  res.clearCookie("accessToken", "refreshToken");
  return res.redirect("/home");
}

async function handleRefreshToken(req, res) {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new Error("unauthorized");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.TOKEN_SECRET_KEY
    );
    const user = await USER.findById(decodedToken.id);
    if (!user) {
      throw new Error("user not found");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(400)
        .json({
          message: "refreshToken is expired, you need to logged in once again",
        });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(
        user.username,
        user.email,
        user._id
      );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("accessToken", refreshToken, options)
      .json({ message: "token refreshed", accessToken, refreshToken });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  handleRefreshToken,
};
