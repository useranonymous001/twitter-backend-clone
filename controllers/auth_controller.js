function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    return res.status(400).json({ message: "unauthorized " });
  }
}

module.exports = { isAuthenticated };
