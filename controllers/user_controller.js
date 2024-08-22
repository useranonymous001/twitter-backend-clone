const USER = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendErrorResponse,
  tryCatchErrorHandler,
} = require("../controllers/error_handler");
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

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      sendErrorResponse(res, "invalid user credentials");
      return;
    } else {
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
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          message: "successfully logged in",
          accessToken,
          refreshToken,
        });
    }
    // need changes later on
    // req.session.userId = user._id;
  } catch (error) {
    res.status(500).json({ message: `Internal server erorr ${error.stack}` });
  }
}

async function handleUserLogout(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.redirect("/home");
}

// function handle refresh Token regeneration
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
      return res.status(400).json({
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
    return tryCatchErrorHandler(error);
  }
}

/*
  function for handling follow and followers of users.
 */
async function handleFollowUser(req, res) {
  const followedUser = req.params.userId;
  const requester = req.user.id;

  if (requester == followedUser) {
    return res.json({ message: "cannot folow more than once" });
  }
  try {
    const UserFollowed = await USER.findById(followedUser); // user that is being followed
    const follower = await USER.findById(requester); // user that is following the user

    if (!UserFollowed || !requester) {
      return res.status(404).json({ message: `user not found` });
    }

    // can use if...else directly to unfollow the use if tried to follow twice..
    await USER.findByIdAndUpdate(
      { _id: UserFollowed._id },
      {
        $addToSet: {
          followers: follower._id,
        },
      }
    );
    await USER.findByIdAndUpdate(
      { _id: follower._id },
      {
        $addToSet: {
          following: UserFollowed._id,
        },
      }
    );
    return res.status(200).json({
      message: "successfully followed...",
      UserFollowed,
      follower,
    });
  } catch (error) {
    return tryCatchErrorHandler(error);
  }
}

async function handleUnfollowUser(req, res) {
  const followedUser = req.params.userId;
  console.log(followedUser);
  const requester = req.user.id;
  console.log(requester);

  if (requester == followedUser) {
    return res.json({ message: "cannot folow more than once" });
  }

  try {
    const UserFollowed = await USER.findById(followedUser); // user that is being followed
    const follower = await USER.findById(requester); // user that is following the user

    if (!UserFollowed || !requester) {
      return res.status(404).json({ message: `user not found` });
    }

    // can use if...else directly to unfollow the use if tried to follow twice..
    await USER.findByIdAndUpdate(
      { _id: UserFollowed._id },
      {
        $pull: {
          followers: follower._id,
        },
      }
    );
    await USER.findByIdAndUpdate(
      { _id: follower._id },
      {
        $pull: {
          following: UserFollowed._id,
        },
      }
    );
    return res.status(200).json({
      message: "successfully unfollowed...",
      UserFollowed,
      follower,
    });
  } catch (error) {
    return tryCatchErrorHandler(error);
  }
}

/*
  Functions for hanlding user profile section
*/

async function handleGetUserBio(req, res) {
  const { bio } = req.body;
  if (!bio) {
    res.json({ message: "bio cannot be empty" });
  }

  try {
    const user = await USER.findById(req.user.id);
    if (!user) {
      res.status(400).json({ status: "user not found" });
    }

    await USER.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: {
          bio,
        },
      }
    );
    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    return tryCatchErrorHandler(error);
  }
}

async function handleChangePassword(req, res) {
  if (!req.body) {
    return res.json({ message: "some fields are empty" });
  }
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.json({ message: " password not matched" });
    }
    const user = await USER.findById(req.user.id).select("+password");
    const match = bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return sendErrorResponse(res, "invalid user credentials");
    }

    bcrypt.hash(newPassword, 12, async (err, hash) => {
      await USER.findByIdAndUpdate(
        { _id: req.user.id },
        {
          password: hash,
        }
      );
    });
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({
        success: "successfully changed the password",
        message: "you need to logged in with a new password",
      });
  } catch (error) {
    return tryCatchErrorHandler(error);
  }
}

async function handleUserProfile(req, res) {
  const userID = req.params.userId;
  if (!userID) {
    return res.json({ error: "user id must be provided" });
  }

  try {
    const user = await USER.findById(userID).select("-password -refreshToken");
    if (!user) {
      return res.json({ error: "user not found" });
    }

    return res.status(200).json({
      message: "got the user thanks",
      userDetails: user,
    });
  } catch (error) {
    return res.json({
      error: `some error occured, ${error.message}`,
    });
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  handleRefreshToken,
  handleFollowUser,
  handleUnfollowUser,
  handleUserProfile,
  handleGetUserBio,
  handleChangePassword,
};
