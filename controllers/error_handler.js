// error handler controller
const sendErrorResponse = (res, message) => {
  return res.status(400).json({ error: message });
};

const tryCatchErrorHandler = (error) => {
  return res.status(400).json({ error: error.message });
};

const validationErrorHandler = (err, req, res, next) => {
  if (err.name == "ValidationError") {
    const errors = Object.value(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation Error", details: errors });
  }
};

module.exports = {
  sendErrorResponse,
  validationErrorHandler,
  tryCatchErrorHandler,
};
