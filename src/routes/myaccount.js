const express = require("express");
const db = require("../db");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Configure multer

const uploadsPath = path.join(__dirname, "../../public/uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterConfig = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/bmp" ||
    file.mimetype === "image/svg+xml" ||
    file.mimetype === "image/tiff"
  ) {
    // calling callback with true as mimetype of file is an accepted image type
    cb(null, true);
  } else {
    // false to indicate not to store the file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterConfig,
});

router.get("/myaccount/:id", (req, res) => {
  res.render("myaccount");
});

module.exports = router;
