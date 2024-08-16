const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadsPath = path.join(__dirname, "../../public/taskFile");
var unique;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    unique = uuidv4();
    cb(null, unique + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/AddTask", upload.single("attachments"), (req, res) => {
  const {
    task_title,
    task_description,
    priority,
    status,
    start_date,
    due_date,
    category,
    progress,
  } = req.body;

  const fileName = req.file && unique + req.file.originalname;
  const attachments = req.file ? fileName : null;

  const query = `INSERT into tasks(task_title,task_description,priority,status,start_date,due_date,attachments,category,progress)
  VALUES(?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    task_title,
    task_description,
    priority,
    status,
    start_date,
    due_date,
    attachments,
    category,
    Number(progress),
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error saving Tasks.");
    } else {
      res.redirect("/addTask");
      console.log("Task Added!!!");
    }
  });
});

module.exports = router;
