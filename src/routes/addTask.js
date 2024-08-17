const express = require("express");
const multer = require("multer");
const db = require("../models/db");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const mime = require("mime-types");

const uploadsPath = path.join(__dirname, "../../public/taskFile");
var unique;

// Ensure the upload directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

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

// Enhanced file filter for extra security
const fileFilterConfig = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ];

  // Check if file MIME type is allowed
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Set stricter file upload limits and validation
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
    files: 1, // Limit to 1 file per request
  },
  fileFilter: fileFilterConfig,
});

// Validation middleware for task data with stricter validation rules
const validateTaskData = [
  body("task_title").trim().isLength({ min: 1, max: 255 }).escape(),
  body("task_description").trim().optional({ nullable: true }).escape(),
  body("priority").trim().optional({ nullable: true }).escape(),
  body("status").trim().optional({ nullable: true }).escape(),
  body("start_date").isISO8601().toDate().withMessage("Invalid start date"),
  body("due_date").isISO8601().toDate().withMessage("Invalid due date"),
  body("department").trim().isLength({ max: 100 }).escape(),
  body("progress")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),
];

router.post(
  "/AddTask",
  upload.single("attachments"),
  validateTaskData,
  (req, res) => {
    /* const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("addTask", { errors: errors.array() });
    } */

    // Handle file validation after multer processes it
    const fileName = req.file && `${unique}${req.file.originalname}`;
    const attachments = req.file ? fileName : null;

    // Validate the file extension as an extra layer of security
    if (fileName) {
      const ext = mime.extension(req.file.mimetype);
      if (!["pdf", "doc", "docx", "jpeg", "jpg", "png"].includes(ext)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid file extension" }] });
      }
    }

    const {
      task_title,
      task_description,
      priority,
      status,
      start_date,
      due_date,
      department,
      progress,
    } = req.body;

    const query = `
      INSERT INTO tasks (
        task_title, task_description, priority, status, start_date,
        due_date, attachments, department, progress
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      Number(progress),
    ];

    // Use a transaction for database safety in case of multiple queries
    db.beginTransaction((transactionErr) => {
      if (transactionErr) {
        return res.status(500).json({ error: "Transaction initiation failed" });
      }

      db.query(query, values, (err, results) => {
        if (err) {
          db.rollback(() => {
            console.error("Database error:", err);
            res.status(500).send("Error saving task.");
          });
        } else {
          db.commit((commitErr) => {
            if (commitErr) {
              db.rollback(() => {
                console.error("Commit error:", commitErr);
                res.status(500).send("Error committing task data.");
              });
            } else {
              res.status(201).json({ message: "Task added successfully!" });
            }
          });
        }
      });
    });
    res.send(values);
  }
);

module.exports = router;
