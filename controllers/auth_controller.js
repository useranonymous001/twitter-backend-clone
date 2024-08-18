const { validateToken } = require("../utils/token_generator");

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    return res.status(400).json({ message: "unauthorized " });
  }
}

function isLoggedIn(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: " you need to logged in first " });
  }

  try {
    const valid = validateToken(token);
    if (valid) {
      req.user = valid;
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "unauthorized",
      error: error.message,
    });
  }
}

module.exports = { isAuthenticated, isLoggedIn };
