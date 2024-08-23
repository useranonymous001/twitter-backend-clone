// i haven't used this in my application but can use when needed

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/userProfileImages/"));
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
