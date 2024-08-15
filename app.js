const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const db = require("./config/db_connection");
const helmet = require("helmet");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

// using middlwares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.disable("x-powered-by");

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

// Configure the session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, // Replace with your secret key
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// requiring routers
const tweetRoute = require("./routes/tweet_route");
const userRoute = require("./routes/user_route");

// requiring middlewares
const { validationErrorHandler } = require("./controllers/error_handler");
const { isAuthenticated } = require("./controllers/auth_controller");

app.get("/home", (req, res) => {
  return res.json({ message: "welcome to home page of the twitter" });
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  console.log("okey okey");
});

app.use("/user", userRoute);
app.use("/tweet", tweetRoute);

// using middlewares
app.use(validationErrorHandler);

// express default error handler
app.use((err, req, res, next) => {
  console.log(err.message);
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
