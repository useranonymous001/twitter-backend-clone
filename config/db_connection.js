const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://127.0.0.1:27017/twitter`)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = mongoose.connection;
