const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Configure multer
var unique;
const uploadsPath = path.join(__dirname, "../../public/taskFile");

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

router.get("/editTask/:id", (req, res) => {
  const taskId = req.params.id;
  const sql = `SELECT * from tasks where id = ${taskId}`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("editTask", { data: rows });
  });
});

router.post("/editTask/:id", upload.single("attachments"), (req, res) => {
  const taskId = req.params.id;
  const {
    id,
    task_title,
    task_description,
    priority,
    status,
    start_date,
    due_date,
    category,
    progress,
    filepath,
  } = req.body;

  const fileName = req.file && unique + req.file.originalname;
  const attachments = req.file ? fileName : filepath;

  const sql = `UPDATE tasks SET task_title = ?, task_description = ?, priority = ?, status = ?, start_date = ?, due_date = ?, attachments = ?, category = ?, progress = ? WHERE id = ?`;

  const values = [
    task_title,
    task_description,
    priority,
    status,
    start_date,
    due_date,
    attachments,
    category,
    progress,
    taskId,
  ];

  db.query(sql, values, (err, row) => {
    if (err) throw err;
    console.log(`Task Updated successfully`);
    res.redirect(`/editTask/${id}`);
  });
});

module.exports = router;
