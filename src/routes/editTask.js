const express = require("express");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { body, param, validationResult } = require("express-validator");

// Configure multer
let unique;
const uploadsPath = path.join(__dirname, "../../public/taskFile");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    unique = uuidv4();
    const sanitizedFilename = path.basename(file.originalname);
    cb(null, `${unique}${sanitizedFilename}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
});

// GET route for editing a task
router.get(
  "/editTask/:id",
  [param("id").isInt().withMessage("Invalid task ID")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid request");
    }

    const taskId = req.params.id;
    const sql = `SELECT * FROM tasks WHERE id = ?`;

    db.query(sql, [taskId], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .send("An error occurred while fetching task details.");
      }
      res.render("editTask", { data: rows });
    });
  }
);

// POST route for updating a task
router.post(
  "/editTask/",
  upload.single("attachments"),
  [
    body("task_title").notEmpty().withMessage("Task title is required"),
    body("task_description")
      .notEmpty()
      .withMessage("Task description is required"),
    // Add more validations as necessary
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      taskid,
      task_title,
      task_description,
      priority,
      status,
      start_date,
      due_date,
      department,
      progress,
      filepath,
    } = req.body;

    const fileName = req.file && `${unique}${req.file.originalname}`;
    const attachments = req.file ? fileName : filepath;

    const sql = `
    UPDATE tasks 
    SET 
      task_title = ?,
      task_description = ?,
      priority = ?,
      status = ?,
      start_date = ?,
      due_date = ?,
      attachments = ?,
      department = ?,
      progress = ?
    WHERE 
      id = ?;
  `;

    const values = [
      task_title,
      task_description,
      priority,
      status,
      start_date,
      due_date,
      attachments,
      department,
      progress,
      taskid,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .send("An error occurred while updating the task.");
      }
      console.log("Task updated successfully");
      res.redirect(`/editTask/${taskid}`);
    });
  }
);

module.exports = router;
